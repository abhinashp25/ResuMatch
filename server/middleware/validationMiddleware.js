import { z } from 'zod';

// Zod schema for jobDescription validation
const analyzeSchema = z.object({
  jobDescription: z.string({
    required_error: 'Job description is required',
    invalid_type_error: 'Job description must be a string'
  })
  .min(10, 'Job description is too short (minimum 10 characters)')
  .max(12000, 'Job description is too long (maximum 12000 characters)')
});

// Helper function to strip HTML tags to prevent XSS
export const sanitizeText = (str) => {
  if (typeof str !== 'string') return '';
  // Strip HTML tags entirely to prevent any XSS script injection
  return str.replace(/<[^>]*>/g, '').trim();
};

export const validateAnalyzeRequest = (req, res, next) => {
  // 1. File validation
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a resume file' });
  }

  // Check file type (MIME type and extension)
  const allowedMimeTypes = ['application/pdf'];
  const allowedExtensions = /\.pdf$/i;

  if (!allowedMimeTypes.includes(req.file.mimetype) || !allowedExtensions.test(req.file.originalname)) {
    return res.status(400).json({ success: false, message: 'Invalid file type. Only PDF documents are allowed.' });
  }

  // Check file size (5MB limit)
  const maxSizeBytes = 5 * 1024 * 1024;
  if (req.file.size > maxSizeBytes) {
    return res.status(400).json({ success: false, message: 'File is too large. Maximum allowed size is 5MB.' });
  }

  // 2. Body schema validation
  const validationResult = analyzeSchema.safeParse(req.body);
  if (!validationResult.success) {
    const errorMsg = validationResult.error.errors[0]?.message || 'Invalid input data';
    return res.status(400).json({ success: false, message: errorMsg });
  }

  // 3. Sanitization
  req.body.jobDescription = sanitizeText(req.body.jobDescription);

  next();
};
