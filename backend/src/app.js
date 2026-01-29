import express from "express";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import platformRoutes from "./routes/platform.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import resumeRoutes from "./routes/resume.routes.js";
import coverLetterRoutes from "./routes/coverLetter.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import multer from "multer";
import { globalLimiter } from "./middleware/rateLimiter.js";
const app = express();

app.use(globalLimiter);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

//-----resume routes
app.use("/api/resumes", resumeRoutes);

//-----cover letter routes
app.use("/api/cover-letters", coverLetterRoutes);

//-----profile routes
app.use("/api/profile", profileRoutes);

//-----platform developer activity routes
app.use("/api/platform", platformRoutes);

//-----health and auth routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

// CRITICAL: Multer error handler - prevents hanging requests
app.use((err, req, res, next) => {
  if (!err) {
    return next(); // Pass through if no error
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.message?.includes("Only PDF") || err.message?.includes("file type")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Handle other errors
  return res.status(500).json({
    success: false,
    message: "Server error",
  });
});

export default app;
