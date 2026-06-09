import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/analyzeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { analyzeRateLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateAnalyzeRequest } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Configure multer with strict file size limits (5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Secure endpoint chain: Authentication -> Rate Limiting -> File Parsing -> Validation & Sanitization -> Controller
router.post(
  '/',
  verifyToken,
  analyzeRateLimiter,
  upload.single('resume'),
  validateAnalyzeRequest,
  analyzeResume
);

export default router;