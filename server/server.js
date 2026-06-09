import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import connectDB from './config/db.js';
import analyzeRoutes from './routes/analyzeRoutes.js';

// Load environment variables at the very beginning
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Set up security headers
app.use(helmet());

// Configure strict CORS policy (No wildcards in production)
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (origin === allowedOrigin) {
      return callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Request from origin: ${origin}`);
      return callback(new Error('Blocked by CORS policy'), false);
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/analyze', analyzeRoutes);

// Global Error Handler (Prevents stack traces leaking to client)
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Unhandled Server Error:`, err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred. Please try again later.'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));