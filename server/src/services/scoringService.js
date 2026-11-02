export const BASE_POINTS = {
  easy: 100,
  medium: 150,
  hard: 200,
};

export const calculateScore = ({ difficulty, isCorrect, discoveredCluesCount, hintsUsed }) => {
  const base = isCorrect ? (BASE_POINTS[difficulty.toLowerCase()] || 100) : 0;
  const cluePoints = Math.max(0, discoveredCluesCount) * 5;
  const hintDeductions = Math.max(0, hintsUsed) * 10;

  const rawScore = base + cluePoints - hintDeductions;
  return Math.max(0, rawScore);
};
