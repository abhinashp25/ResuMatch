import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['bookmarked', 'applied', 'interviewing', 'offer'],
    default: 'bookmarked'
  },
  date: { type: String, required: true },
  score: { type: Number, required: true, default: 70 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', jobSchema);
