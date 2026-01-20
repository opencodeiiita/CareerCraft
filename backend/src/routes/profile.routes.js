import { Router } from "express";
import {
    getProfile,
    updateProfile,
    getMyResumes,
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// GET /api/profile/:username - Get profile by username (owner only)
router.get("/:username", getProfile);

// PUT /api/profile/update - Update current user's profile
router.put("/update", updateProfile);

// GET /api/profile/resumes - Get current user's resumes
router.get("/my/resumes", getMyResumes);

export default router;
