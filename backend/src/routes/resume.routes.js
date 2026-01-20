import express from 'express';
const router = express.Router();
import upload from '../middleware/upload.middleware.js';
import { uploadResume, getResumes, deleteResume } from '../controllers/resume.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

// POST /api/resumes/upload - Protected route (requires auth to associate user)
router.post('/upload', verifyJWT, upload.single('resume'), (req, res) => {
  console.log('🚀 ROUTE HIT - Backend received upload request');
  console.log('🚀 Request headers:', req.headers);
  console.log('🚀 Request body:', req.body);
  console.log('👤 Authenticated user:', req.user?._id);

  console.log('📋 Upload middleware completed');

  if (!req.file) {
    console.error('❌ No file received after upload');
    return res.status(400).json({
      success: false,
      message: 'No file received'
    });
  }

  console.log('✅ File received - calling controller');
  uploadResume(req, res);
});

// DELETE /api/resumes/:id - Protected route
router.delete('/:id', verifyJWT, deleteResume);

// GET /api/resumes/ - Get all resumes (optionally filtered by user)
router.get('/', getResumes);

export default router;
