import mongoose from 'mongoose';
import { Case } from '../models/Case.js';
import { generateMystery } from '../services/geminiService.js';
import { calculateScore } from '../services/scoringService.js';
import { sanitizeActiveCase, sanitizeCompletedResult } from '../utils/sanitize.js';
import { generateCaseSchema, accusationSchema } from '../validators/caseValidator.js';

export const createCase = async (req, res, next) => {
  try {
    const validatedBody = generateCaseSchema.parse(req.body);
    const { premise, difficulty } = validatedBody;

    // Check DB connection state
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Please ensure MongoDB is running and MONGODB_URI is properly configured.',
      });
    }

    const generatedData = await generateMystery(premise, difficulty);

    const newCase = new Case({
      title: generatedData.title,
      story: generatedData.story,
      victim: generatedData.victim,
      difficulty,
      suspects: generatedData.suspects,
      clues: generatedData.clues,
      hints: generatedData.hints,
      solution: generatedData.solution,
      discoveredClueIds: [],
      hintsUsed: 0,
      score: 0,
      status: 'active',
    });

    await newCase.save();

    // Sanitize case output (Strictly hides solution, culpritId, and unrevealed hints)
    const sanitized = sanitizeActiveCase(newCase);

    return res.status(201).json({
      success: true,
      case: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

export const getCaseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid case ID format',
      });
    }

    const foundCase = await Case.findById(id);
    if (!foundCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    const sanitized = sanitizeActiveCase(foundCase);
    return res.status(200).json({
      success: true,
      case: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

export const discoverClue = async (req, res, next) => {
  try {
    const { id, clueId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid case ID format' });
    }

    const foundCase = await Case.findById(id);
    if (!foundCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (foundCase.status !== 'active') {
      return res.status(409).json({
        success: false,
        message: 'Cannot discover clues on a completed case',
      });
    }

    const targetClue = foundCase.clues.find((c) => c.id === clueId);
    if (!targetClue) {
      return res.status(404).json({
        success: false,
        message: `Clue "${clueId}" not found in this case`,
      });
    }

    // Add clue to discoveredClueIds if not present (idempotent)
    if (!foundCase.discoveredClueIds.includes(clueId)) {
      foundCase.discoveredClueIds.push(clueId);
      await foundCase.save();
    }

    return res.status(200).json({
      success: true,
      clue: {
        id: targetClue.id,
        title: targetClue.title,
        description: targetClue.description,
        evidence: targetClue.evidence,
        discovered: true,
      },
      discoveredClueIds: foundCase.discoveredClueIds,
      totalDiscovered: foundCase.discoveredClueIds.length,
    });
  } catch (error) {
    next(error);
  }
};

export const requestHint = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid case ID format' });
    }

    const foundCase = await Case.findById(id);
    if (!foundCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (foundCase.status !== 'active') {
      return res.status(409).json({
        success: false,
        message: 'Cannot request hints on a completed case',
      });
    }

    const totalHints = (foundCase.hints || []).length;
    const currentUsed = foundCase.hintsUsed || 0;

    if (currentUsed >= totalHints) {
      return res.status(400).json({
        success: false,
        message: 'All available hints have already been revealed for this case',
      });
    }

    const nextHintText = foundCase.hints[currentUsed];
    foundCase.hintsUsed = currentUsed + 1;
    await foundCase.save();

    return res.status(200).json({
      success: true,
      hint: nextHintText,
      hintsUsed: foundCase.hintsUsed,
      hintsRemaining: Math.max(0, totalHints - foundCase.hintsUsed),
    });
  } catch (error) {
    next(error);
  }
};

export const submitAccusation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid case ID format' });
    }

    const validated = accusationSchema.parse(req.body);
    const { suspectId } = validated;

    const foundCase = await Case.findById(id);
    if (!foundCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (foundCase.status !== 'active') {
      return res.status(409).json({
        success: false,
        message: 'Accusation already submitted. This case is permanently closed.',
      });
    }

    const suspectExists = (foundCase.suspects || []).some((s) => s.id === suspectId);
    if (!suspectExists) {
      return res.status(400).json({
        success: false,
        message: `Suspect with ID "${suspectId}" does not exist in this case`,
      });
    }

    const isCorrect = foundCase.solution.culpritId === suspectId;
    const finalScore = calculateScore({
      difficulty: foundCase.difficulty,
      isCorrect,
      discoveredCluesCount: foundCase.discoveredClueIds.length,
      hintsUsed: foundCase.hintsUsed,
    });

    foundCase.accusation = {
      suspectId,
      accusedAt: new Date(),
    };
    foundCase.score = finalScore;
    foundCase.status = 'completed';
    await foundCase.save();

    const actualCulprit = foundCase.suspects.find((s) => s.id === foundCase.solution.culpritId);

    return res.status(200).json({
      success: true,
      result: {
        correct: isCorrect,
        culprit: actualCulprit ? actualCulprit.name : 'Unknown',
        explanation: foundCase.solution.explanation,
        score: finalScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCaseResult = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid case ID format' });
    }

    const foundCase = await Case.findById(id);
    if (!foundCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (foundCase.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This case is still active. Submit an accusation to view the verdict and results.',
      });
    }

    const result = sanitizeCompletedResult(foundCase);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};
