import { Router } from "express";
import {
  signup,
  signin,
  getCurrentUser,
} from "../controllers/auth.controllers.js";
import {
  startOAuth,
  handleOAuthCallback,
  oauthStatus,
} from "../controllers/oauth.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/signup", authLimiter, signup);

router.post("/signin", authLimiter, signin);
router.get("/me", verifyJWT, getCurrentUser);
router.get("/oauth/status", oauthStatus);
router.get("/oauth/:provider", startOAuth);
router.get("/oauth/:provider/callback", handleOAuthCallback);

export default router;
