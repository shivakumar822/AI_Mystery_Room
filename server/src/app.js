import express from 'express';
import cors from 'cors';
import caseRoutes from './routes/caseRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching origin
      if (!origin || origin === clientOrigin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, can restrict to clientOrigin in prod
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Mystery Room API',
  });
});

// Case routes
app.use('/api', caseRoutes);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
