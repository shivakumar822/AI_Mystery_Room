import { getGeminiClient } from '../config/gemini.js';
import { geminiMysteryOutputSchema } from '../validators/caseValidator.js';

export const DIFFICULTY_CONFIG = {
  easy: { suspects: 3, clues: 5, hints: 2 },
  medium: { suspects: 4, clues: 7, hints: 3 },
  hard: { suspects: 5, clues: 9, hints: 3 },
};

const cleanJsonString = (raw) => {
  if (!raw) return '';
  let str = raw.trim();
  if (str.startsWith('```json')) {
    str = str.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (str.startsWith('```')) {
    str = str.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return str.trim();
};

export const generateMystery = async (premise, difficulty) => {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error(
      'Gemini API key is not configured. Please set GEMINI_API_KEY in server/.env with your Google AI Studio key.'
    );
  }

  const config = DIFFICULTY_CONFIG[difficulty.toLowerCase()];
  if (!config) {
    throw new Error(`Invalid difficulty level: ${difficulty}`);
  }

  const systemPrompt = `You are a master detective fiction author and mystery designer.
Design an intricate, logically consistent murder/heist mystery puzzle based on the user's premise.

CRITICAL REQUIREMENTS:
1. Difficulty Level: ${difficulty.toUpperCase()}
2. You MUST generate EXACTLY:
   - ${config.suspects} suspects (with IDs: suspect_1 to suspect_${config.suspects})
   - ${config.clues} clues (with IDs: clue_1 to clue_${config.clues})
   - ${config.hints} progressive hints
3. The mystery MUST have a uniquely deducible solution:
   - Only ONE suspect is the true culprit.
   - The culprit MUST have motive, opportunity, and means.
   - The innocent suspects must have credible alibis or be cleared by subtle contradictions in evidence.
   - The clues must logically connect to the culprit's deception or physical trace.
   - Hints must provide subtle guidance without directly giving away the culprit.
4. Output MUST be strictly valid JSON matching this schema:
{
  "title": "Evocative Mystery Title",
  "story": "Atmospheric introduction detailing the crime scene and situation...",
  "victim": {
    "name": "Full Name",
    "description": "Background, status, or role"
  },
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Suspect Name",
      "description": "Role and background",
      "motive": "Why they might be suspected",
      "alibi": "Their claimed whereabouts/defense"
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "Descriptive Clue Name",
      "description": "What the detective sees upon close examination",
      "evidence": "Forensic or factual deduction pointing towards the truth"
    }
  ],
  "hints": [
    "First subtle hint...",
    "Second progressive hint..."
  ],
  "solution": {
    "culpritId": "suspect_X",
    "explanation": "A complete, satisfying explanation of how the crime was executed and why only the culprit could have done it.",
    "reasoning": [
      "Key evidence point 1 proving guilt",
      "Contradiction in culprit alibi",
      "Reason other suspects are excluded"
    ]
  }
}`;

  const userPrompt = `User Premise: "${premise}"
Difficulty: ${difficulty.toUpperCase()} (Ensure exactly ${config.suspects} suspects, ${config.clues} clues, and ${config.hints} hints).`;

  const MAX_RETRIES = 2;
  let lastError = null;

  const modelsToTry = ['gemini-2.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    for (const modelName of modelsToTry) {
      try {
        console.log(`[Gemini] Generating mystery (Attempt ${attempt + 1}, Model: ${modelName})...`);

        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const rawText = response.text;
        const cleaned = cleanJsonString(rawText);
        const parsed = JSON.parse(cleaned);

        // Validate structure with Zod
        const validated = geminiMysteryOutputSchema.parse(parsed);

        // Verify exact counts
        if (validated.suspects.length !== config.suspects) {
          throw new Error(`Expected exactly ${config.suspects} suspects, got ${validated.suspects.length}`);
        }
        if (validated.clues.length !== config.clues) {
          throw new Error(`Expected exactly ${config.clues} clues, got ${validated.clues.length}`);
        }
        if (validated.hints.length !== config.hints) {
          throw new Error(`Expected exactly ${config.hints} hints, got ${validated.hints.length}`);
        }

        console.log(`[Gemini] Mystery "${validated.title}" generated and validated successfully.`);
        return validated;
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini Warning] Model ${modelName} attempt ${attempt + 1} failed: ${err.message}`);
        // If it's a model not found error, try the next model immediately
        if (err.message && err.message.includes('not found')) {
          continue;
        }
        // If JSON parse or validation error, try next attempt
        break;
      }
    }
  }

  throw new Error(`Failed to generate a valid mystery after multiple attempts: ${lastError?.message}`);
};
