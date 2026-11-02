export const sanitizeActiveCase = (caseData) => {
  const doc = caseData.toObject ? caseData.toObject() : { ...caseData };
  const discoveredSet = new Set(doc.discoveredClueIds || []);

  const sanitizedClues = (doc.clues || []).map((clue) => {
    const isDiscovered = discoveredSet.has(clue.id);
    return {
      id: clue.id,
      title: clue.title,
      discovered: isDiscovered,
      // Section 5.3: Undiscovered clues must not reveal their actual content
      description: isDiscovered ? clue.description : 'Examine this clue to uncover critical details.',
      evidence: isDiscovered ? clue.evidence : null,
    };
  });

  const totalHints = (doc.hints || []).length;
  const hintsUsed = doc.hintsUsed || 0;
  const hintsRemaining = Math.max(0, totalHints - hintsUsed);
  const revealedHints = (doc.hints || []).slice(0, hintsUsed);

  // Return sanitized object without solution, culpritId, or unrevealed hints
  return {
    id: doc._id ? doc._id.toString() : doc.id,
    title: doc.title,
    story: doc.story,
    victim: doc.victim,
    difficulty: doc.difficulty,
    suspects: doc.suspects || [],
    clues: sanitizedClues,
    discoveredClueIds: doc.discoveredClueIds || [],
    hintsUsed,
    hintsRemaining,
    revealedHints,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

export const sanitizeCompletedResult = (caseData) => {
  const doc = caseData.toObject ? caseData.toObject() : { ...caseData };
  const actualCulprit = (doc.suspects || []).find((s) => s.id === doc.solution?.culpritId);
  const playerAccused = (doc.suspects || []).find((s) => s.id === doc.accusation?.suspectId);
  const isCorrect = doc.solution?.culpritId === doc.accusation?.suspectId;

  return {
    correct: isCorrect,
    culprit: actualCulprit ? actualCulprit.name : 'Unknown',
    culpritDetails: actualCulprit || null,
    playerAccusation: playerAccused ? playerAccused.name : doc.accusation?.suspectId || 'None',
    playerAccusedDetails: playerAccused || null,
    explanation: doc.solution?.explanation || '',
    reasoning: doc.solution?.reasoning || [],
    score: doc.score || 0,
    discoveredCluesCount: (doc.discoveredClueIds || []).length,
    totalCluesCount: (doc.clues || []).length,
    hintsUsed: doc.hintsUsed || 0,
    totalHintsCount: (doc.hints || []).length,
    difficulty: doc.difficulty,
    caseTitle: doc.title,
    caseId: doc._id ? doc._id.toString() : doc.id,
  };
};
