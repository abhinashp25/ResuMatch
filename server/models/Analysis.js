import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  resumeText: String,
  jobDescription: String,
  matchScore: Number,
  missingKeywords: [String],
  suggestions: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Analysis', analysisSchema);