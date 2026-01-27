import express from "express";
const router = express.Router();
import upload from "../middleware/upload.middleware.js";
import {
  uploadResume,
  getResumes,
  deleteResume,
} from "../controllers/resume.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { mlServiceLimiter } from "../middleware/rateLimiter.js";

// POST /api/resumes/upload - Protected route (requires auth to associate user)
router.post("/upload", mlServiceLimiter, verifyJWT, upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file received",
    });
  }

  uploadResume(req, res);
});

// DELETE /api/resumes/:id - Protected route
router.delete("/:id", verifyJWT, deleteResume);

// GET /api/resumes/ - Get all resumes for current user
router.get("/", verifyJWT, getResumes);

// GET /api/resumes/history - Resume history with analysis
router.get("/history", verifyJWT, getResumes);

export default router;
