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

const router = Router();

console.log("🚀 AUTH ROUTES FILE LOADED");

router.post(
  "/signup",
  (req, res, next) => {
    console.log("🎯 SIGNUP ROUTE HIT");
    console.log("📝 Request method:", req.method);
    console.log("📝 Request URL:", req.url);
    console.log("📝 Request body:", req.body);
    next();
  },
  signup,
);

router.post("/signin", signin);
router.get("/me", verifyJWT, getCurrentUser);
router.get("/oauth/status", oauthStatus);
router.get("/oauth/:provider", startOAuth);
router.get("/oauth/:provider/callback", handleOAuthCallback);

export default router;
