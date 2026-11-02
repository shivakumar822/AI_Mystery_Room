import rateLimit from 'express-rate-limit';

export const createMysteryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many mystery generation requests. Please wait a moment before trying again.',
  },
});

export const hintLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many hint requests in a short period. Please slow down.',
  },
});
