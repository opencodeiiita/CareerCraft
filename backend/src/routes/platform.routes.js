import express from "express";
import {
  getGithubStats,
  getCodeforcesStats,
  getCodechefStats,
} from "../controllers/platform.controller.js";

const router = express.Router();

// GET /api/platform/github/:username
router.get("/github/:username", getGithubStats);

// GET /api/platform/codeforces/:username
router.get("/codeforces/:username", getCodeforcesStats);

// GET /api/platform/codechef/:username
router.get("/codechef/:username", getCodechefStats);

export default router;
