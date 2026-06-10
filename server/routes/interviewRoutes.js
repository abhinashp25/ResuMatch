import express from 'express';
import InterviewChecklist from '../models/InterviewChecklist.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const DEFAULT_CHECKLIST = [
  { id: 1, text: 'Research the company — mission, product, recent news.',             done: false },
  { id: 2, text: 'Align your resume keywords with the job description.',               done: false },
  { id: 3, text: 'Prepare 3 STAR stories covering leadership, conflict, and delivery.', done: false },
  { id: 4, text: 'Test camera, mic, lighting, and internet connection.',               done: false },
  { id: 5, text: 'Prepare 3 thoughtful questions to ask the interviewer.',             done: false },
  { id: 6, text: 'Have a copy of your resume open during the interview.',              done: false }
];

// GET the user's checklist
router.get('/checklist', verifyToken, async (req, res) => {
  try {
    let checklist = await InterviewChecklist.findOne({ userId: req.user.uid });
    if (!checklist) {
      // Seed the default checklist if first-time user
      checklist = await InterviewChecklist.create({
        userId: req.user.uid,
        items: DEFAULT_CHECKLIST
      });
    }
    res.json({ success: true, data: checklist.items });
  } catch (error) {
    console.error('Error fetching checklist:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch checklist' });
  }
});

// PUT to update the checklist items (strictly scoped to user)
router.put('/checklist', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items must be an array' });
    }

    let checklist = await InterviewChecklist.findOne({ userId: req.user.uid });
    if (!checklist) {
      checklist = new InterviewChecklist({
        userId: req.user.uid,
        items
      });
    } else {
      checklist.items = items;
    }

    await checklist.save();
    res.json({ success: true, data: checklist.items });
  } catch (error) {
    console.error('Error updating checklist:', error);
    res.status(500).json({ success: false, message: 'Failed to update checklist' });
  }
});

export default router;
