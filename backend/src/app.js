import express from "express";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import resumeRoutes from "./routes/resume.routes.js";
import coverLetterRoutes from "./routes/coverLetter.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import multer from "multer";
const app = express();



app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use('/uploads', express.static("uploads"));
app.use(cookieParser());

// Global request logger
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url}`);
  console.log(`📝 Headers:`, req.headers);
  console.log(`📝 Body:`, req.body);
  next();
});

//-----resume routes
app.use("/api/resumes", resumeRoutes);

//-----cover letter routes
app.use("/api/cover-letters", coverLetterRoutes);

//-----profile routes
app.use("/api/profile", profileRoutes);

//-----health and auth routes   
app.use("/api/health", healthRoutes);
console.log(' MOUNTING AUTH ROUTES...');
app.use("/api/auth", authRoutes);
console.log(' AUTH ROUTES MOUNTED at /api/auth');

// Test endpoint to verify server is working
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Server is working!",
    timestamp: new Date().toISOString()
  });
});

// Simple auth test route
app.get("/api/auth-test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes are working!",
    timestamp: new Date().toISOString()
  });
});

// Test auth controller directly
app.post("/api/auth-test", (req, res) => {
  console.log(' AUTH TEST CONTROLLER HIT');
  console.log(' Request body:', req.body);
  res.json({
    success: true,
    message: "Auth controller test working!",
    timestamp: new Date().toISOString()
  });
});

// CRITICAL: Multer error handler - prevents hanging requests
app.use((err, req, res, next) => {
  if (!err) {
    return next(); // Pass through if no error
  }

  console.error(' Express error handler:', err);

  if (err instanceof multer.MulterError) {
    console.error(' Multer error:', err);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err.message?.includes('Only PDF') || err.message?.includes('file type')) {
    console.error(' File type error:', err.message);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Handle other errors
  console.error(' General error:', err);
  return res.status(500).json({
    success: false,
    message: 'Server error'
  });
});

export default app;