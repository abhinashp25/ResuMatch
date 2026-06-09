import rateLimit from 'express-rate-limit';

export const analyzeRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit to 5 requests per minute
  validate: { keyGeneratorIpFallback: false },
  keyGenerator: (req) => {
    // Limit by Firebase User ID if available, otherwise fall back to IP address
    return req.user?.uid || req.ip;
  },
  handler: (req, res, next, options) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a minute before analyzing another resume.'
    });
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
