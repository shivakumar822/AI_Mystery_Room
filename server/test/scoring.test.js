import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, BASE_POINTS } from '../src/services/scoringService.js';
import { sanitizeActiveCase, sanitizeCompletedResult } from '../src/utils/sanitize.js';

test('Scoring Service - Easy difficulty with correct accusation', () => {
  // Easy: 100 base + 5*5 clues - 2*10 hints = 100 + 25 - 20 = 105
  const score = calculateScore({
    difficulty: 'easy',
    isCorrect: true,
    discoveredCluesCount: 5,
    hintsUsed: 2,
  });
  assert.equal(score, 105);
});

test('Scoring Service - Medium difficulty with correct accusation and no hints', () => {
  // Medium: 150 base + 7*5 clues - 0 hints = 150 + 35 = 185
  const score = calculateScore({
    difficulty: 'medium',
    isCorrect: true,
    discoveredCluesCount: 7,
    hintsUsed: 0,
  });
  assert.equal(score, 185);
});

test('Scoring Service - Hard difficulty with correct accusation', () => {
  // Hard: 200 base + 9*5 clues - 3*10 hints = 200 + 45 - 30 = 215
  const score = calculateScore({
    difficulty: 'hard',
    isCorrect: true,
    discoveredCluesCount: 9,
    hintsUsed: 3,
  });
  assert.equal(score, 215);
});

test('Scoring Service - Incorrect accusation with deductions', () => {
  // Incorrect: 0 base + 2*5 clues - 2*10 hints = 10 - 20 = -10 -> capped at 0
  const score = calculateScore({
    difficulty: 'hard',
    isCorrect: false,
    discoveredCluesCount: 2,
    hintsUsed: 2,
  });
  assert.equal(score, 0);
});

test('Sanitization - Active case strictly hides solution and masks undiscovered clues', () => {
  const mockCase = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Mystery at the Manor',
    story: 'Introduction...',
    victim: { name: 'Lord Blackwood', description: 'Wealthy aristocrat' },
    difficulty: 'easy',
    suspects: [
      { id: 'suspect_1', name: 'Butler', description: 'Loyal', motive: 'Fired', alibi: 'Pantry' },
      { id: 'suspect_2', name: 'Heir', description: 'Greedy', motive: 'Inheritance', alibi: 'Library' },
    ],
    clues: [
      { id: 'clue_1', title: 'Torn Letter', description: 'Secret deed', evidence: 'Fingerprints' },
      { id: 'clue_2', title: 'Poison Vial', description: 'Arsenic residue', evidence: 'Purchased by butler' },
    ],
    hints: ['Check the pantry', 'Look at the will'],
    solution: {
      culpritId: 'suspect_1',
      explanation: 'The butler did it because...',
      reasoning: ['Fingerprints on letter', 'Vial purchased'],
    },
    discoveredClueIds: ['clue_1'],
    hintsUsed: 1,
    status: 'active',
  };

  const sanitized = sanitizeActiveCase(mockCase);

  // Verification: solution, culpritId, and unrevealed hints must NEVER be exposed
  assert.equal(sanitized.solution, undefined);
  assert.equal(sanitized.culpritId, undefined);
  assert.equal(sanitized.revealedHints.length, 1);
  assert.equal(sanitized.revealedHints[0], 'Check the pantry');
  assert.equal(sanitized.hintsRemaining, 1);

  // Discovered clue shows real description and evidence
  const clue1 = sanitized.clues.find((c) => c.id === 'clue_1');
  assert.equal(clue1.discovered, true);
  assert.equal(clue1.description, 'Secret deed');
  assert.equal(clue1.evidence, 'Fingerprints');

  // Undiscovered clue masks description and hides evidence
  const clue2 = sanitized.clues.find((c) => c.id === 'clue_2');
  assert.equal(clue2.discovered, false);
  assert.notEqual(clue2.description, 'Arsenic residue');
  assert.equal(clue2.evidence, null);
});
