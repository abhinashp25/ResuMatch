import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  done: { type: Boolean, required: true, default: false }
});

const interviewChecklistSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  items: [checklistItemSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('InterviewChecklist', interviewChecklistSchema);
