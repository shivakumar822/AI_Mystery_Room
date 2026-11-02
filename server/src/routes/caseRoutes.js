import { Router } from 'express';
import {
  createCase,
  getCaseById,
  discoverClue,
  requestHint,
  submitAccusation,
  getCaseResult,
} from '../controllers/caseController.js';
import { createMysteryLimiter, hintLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// 9.1 Generate Mystery
router.post('/cases', createMysteryLimiter, createCase);

// 9.2 Retrieve Mystery
router.get('/cases/:id', getCaseById);

// 9.3 Discover Clue
router.post('/cases/:id/clues/:clueId/discover', discoverClue);

// 9.4 Request Hint
router.post('/cases/:id/hints', hintLimiter, requestHint);

// 9.5 Submit Accusation
router.post('/cases/:id/accuse', submitAccusation);

// 9.6 Retrieve Result
router.get('/cases/:id/result', getCaseResult);

export default router;
