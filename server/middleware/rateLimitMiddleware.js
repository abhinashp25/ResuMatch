import rateLimit from 'express-rate-limit';

// Rate limiter for the resume analyzer endpoint (AI-heavy, expensive call).
export const analyzeRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  validate: { keyGeneratorIpFallback: false },
  keyGenerator: (req) => req.user?.uid || req.ip,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a minute before analyzing another resume.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for the company interview prep AI endpoint.
export const companyPrepLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5-minute window
  max: 15,                  // up to 15 company prep requests per 5 minutes
  validate: { keyGeneratorIpFallback: false },
  keyGenerator: (req) => req.user?.uid || req.ip,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a few minutes before generating another prep guide.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

