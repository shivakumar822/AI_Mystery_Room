import { ZodError } from 'zod';

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]', err);

  if (err instanceof ZodError) {
    const errorMessages = err.errors.map((e) => e.message).join(', ');
    return res.status(400).json({
      success: false,
      message: errorMessages,
      errors: err.errors,
    });
  }

  // Handle Mongoose cast errors (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: ${err.value}`,
    });
  }

  // Handle specific status errors
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected error occurred';

  // Do not expose stack traces or raw secrets in production
  return res.status(status).json({
    success: false,
    message,
  });
};
