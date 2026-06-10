import express from 'express';
import Job from '../models/Job.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all tracked jobs
router.get('/', verifyToken, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
});

// POST a new tracked job
router.post('/', verifyToken, async (req, res) => {
  try {
    const { role, company, score, status } = req.body;
    if (!role || !company) {
      return res.status(400).json({ success: false, message: 'Role and company are required' });
    }

    const newJob = await Job.create({
      userId: req.user.uid,
      role,
      company,
      status: status || 'bookmarked',
      date: new Date().toISOString().split('T')[0],
      score: score || 70
    });

    res.json({ success: true, data: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, message: 'Failed to track new job' });
  }
});

// PUT to update job status/stage (strictly verifying ownership)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Security check: Verify ownership
    if (job.userId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to modify this job' });
    }

    const { status, role, company, score } = req.body;
    if (status) job.status = status;
    if (role) job.role = role;
    if (company) job.company = company;
    if (score !== undefined) job.score = score;

    await job.save();
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, message: 'Failed to update job' });
  }
});

// DELETE tracked job (strictly verifying ownership)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Security check: Verify ownership
    if (job.userId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job tracking card removed successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Failed to delete job' });
  }
});

export default router;
