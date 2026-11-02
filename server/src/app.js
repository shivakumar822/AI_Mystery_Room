import express from 'express';
import cors from 'cors';
import caseRoutes from './routes/caseRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  'https://ai-mystery-room-five-alpha.vercel.app',
  // Allow any vercel.app preview deployments
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps)
      if (!origin) return callback(null, true);
      // Allow localhost in dev
      if (origin.startsWith('http://localhost:')) return callback(null, true);
      // Allow any vercel.app deployment (previews + production)
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      // Allow explicitly listed origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
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
