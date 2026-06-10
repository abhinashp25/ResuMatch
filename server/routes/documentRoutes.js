import express from 'express';
import Document from '../models/Document.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all documents for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json({ success: true, data: docs });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
});

// POST new document (manually added or uploaded)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, type, size } = req.body;
    if (!title || !type) {
      return res.status(400).json({ success: false, message: 'Title and type are required' });
    }

    const newDoc = await Document.create({
      userId: req.user.uid,
      title,
      type,
      date: new Date().toISOString().split('T')[0],
      size: size || '—'
    });

    res.json({ success: true, data: newDoc });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ success: false, message: 'Failed to create document' });
  }
});

// DELETE document (strictly verifying user ownership)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Security check: Verify that this document belongs to the authenticated user
    if (doc.userId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to delete this document' });
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
});

export default router;
