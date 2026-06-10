import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Resume', 'Cover Letter'] },
  date: { type: String, required: true },
  size: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', documentSchema);
