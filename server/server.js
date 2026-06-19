import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import connectDB from './config/db.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

// Load environment variables first, before anything else
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security headers — allow-popups is required for Firebase signInWithPopup.
// The default "same-origin" COOP policy blocks the popup from calling
// window.closed on the opener, which breaks Google auth entirely.
app.use(helmet({
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));

// Strict CORS — only our own front-end origin is allowed, no wildcards.
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests and tools like curl that send no origin.
    if (!origin) return callback(null, true);

    if (origin === allowedOrigin) {
      return callback(null, true);
    }

    console.warn(`[CORS Blocked] Rejected request from: ${origin}`);
    return callback(new Error('Blocked by CORS policy'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// API routes
app.use('/api/analyze',   analyzeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/jobs',      jobRoutes);
app.use('/api/interview', interviewRoutes);

// Global error handler — never leak internal stack traces to the client.
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred. Please try again later.',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Server] Listening on port ${PORT}`));