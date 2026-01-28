// Save resume and analysis directly (no re-analysis)
export const saveResumeWithAnalysis = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    if (!req.body.analysis) {
      return res
        .status(400)
        .json({ success: false, message: "No analysis provided" });
    }
    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file);
    const url = cloudinaryResult.secure_url;
    const publicId = cloudinaryResult.public_id;
    if (!url) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to get file URL from Cloudinary",
        });
    }
    // Parse analysis
    let analysisResult;
    try {
      analysisResult = JSON.parse(req.body.analysis);
    } catch (e) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid analysis JSON" });
    }
    // Save resume
    const resume = new Resume({
      userId: req.user?._id,
      filename: req.file.originalname,
      resumeName: req.body?.resume_name || req.file.originalname,
      url,
      publicId,
      size: req.file.size,
      mimetype: req.file.mimetype,
      resumeText: undefined, // Not extracted here
      analysisResult,
      uploadedAt: new Date(),
    });
    const savedResume = await resume.save();
    const response = {
      success: true,
      resume: {
        id: savedResume._id,
        filename: savedResume.filename,
        resume_name: savedResume.resumeName || savedResume.filename,
        url: savedResume.url,
        uploadedAt: savedResume.uploadedAt,
        created_at: savedResume.createdAt,
        ats_score: savedResume.analysisResult?.ats_score ?? null,
        analysis: savedResume.analysisResult || null,
      },
    };
    return res.json(response);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
import Resume from "../models/resume.model.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import FormData from "form-data";
import redis from "../utils/redisClient.js";
import crypto from "crypto";

// Helper to get job hash
function getJobHash(jobDescription) {
  return crypto.createHash("sha256").update(jobDescription).digest("hex");
}

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Upload to Cloudinary using direct API
    const cloudinaryResult = await uploadToCloudinary(req.file);

    // Extract URL and public_id from Cloudinary response
    const url = cloudinaryResult.secure_url;
    const publicId = cloudinaryResult.public_id;

    if (!url) {
      return res.status(500).json({
        success: false,
        message: "Failed to get file URL from Cloudinary",
      });
    }

    const mlBaseUrl = process.env.ML_SERVICE_URL;

    let resumeText = "";
    let analysisResult = null;
    let jobMatchResult = null;
    // Generate hash for resume content
    const resumeHash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");
    const cacheKey = `resume:analysis:${resumeHash}`;
    // Check Redis cache first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        analysisResult = JSON.parse(cached);
      }
    } catch (e) {
      // Redis unavailable, fallback gracefully
    }

    // Job match caching (if job description provided)
    let jobDescription = req.body?.jobDescription;
    let jobHash = jobDescription ? getJobHash(jobDescription) : null;
    let jobMatchCacheKey = null;
    if (jobDescription) {
      jobMatchCacheKey = `jobmatch:${resumeHash}:${jobHash}`;
      try {
        const cachedMatch = await redis.get(jobMatchCacheKey);
        if (cachedMatch) {
          jobMatchResult = JSON.parse(cachedMatch);
        }
      } catch (e) {}
    }

    try {
      if (!analysisResult) {
        const formData = new FormData();
        formData.append("file", req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });

        const extractRes = await axios.post(
          `${mlBaseUrl}/resume/extract-text`,
          formData,
          {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          },
        );

        resumeText = extractRes.data?.text || "";

        const analyzeRes = await axios.post(`${mlBaseUrl}/resume/analyze`, {
          content: resumeText,
        });

        analysisResult = analyzeRes.data;
        // Store in Redis cache (TTL: 48h)
        try {
          await redis.set(
            cacheKey,
            JSON.stringify(analysisResult),
            "EX",
            172800,
          );
        } catch (e) {
          // Redis unavailable, fallback gracefully
        }
      }

      // Job match ML call and cache
      if (jobDescription && !jobMatchResult) {
        try {
          const matchRes = await axios.post(`${mlBaseUrl}/job/match`, {
            resume: resumeText,
            job: jobDescription,
          });
          jobMatchResult = matchRes.data;
          // Store in Redis cache (TTL: 24h)
          await redis.set(
            jobMatchCacheKey,
            JSON.stringify(jobMatchResult),
            "EX",
            86400,
          );
        } catch (e) {
          // Fallback gracefully
        }
      }
    } catch (analysisError) {
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: req.file.mimetype?.startsWith("image/")
              ? "image"
              : "raw",
          });
        } catch (cleanupError) {
          // Continue with error response even if cleanup fails
        }
      }
      return res.status(502).json({
        success: false,
        message: "Resume analysis service failed. Please try again later.",
      });
    }

    const resume = new Resume({
      userId: req.user?._id, // Associate resume with authenticated user
      filename: req.file.originalname,
      resumeName: req.body?.resumeName || req.file.originalname,
      url,
      publicId,
      size: req.file.size,
      mimetype: req.file.mimetype,
      resumeText,
      analysisResult: {
        ...analysisResult,
        job_match: jobMatchResult || analysisResult?.job_match || null,
      },
      uploadedAt: new Date(),
    });

    const savedResume = await resume.save();

    // Invalidate old cache if resume is re-uploaded/edited (new hash)
    // Optionally, you can delete previous cache keys if you store them per user/resumeId

    const response = {
      success: true,
      resume: {
        id: savedResume._id,
        filename: savedResume.filename,
        resume_name: savedResume.resumeName || savedResume.filename,
        url: savedResume.url,
        uploadedAt: savedResume.uploadedAt,
        created_at: savedResume.createdAt,
        ats_score: savedResume.analysisResult?.ats_score ?? null,
        analysis: savedResume.analysisResult || null,
      },
    };

    return res.json(response);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    // Find resume in database
    const resume = await Resume.findById(id);
    // Invalidate Redis cache for resume analysis and job match
    if (resume) {
      try {
        const resumeHash = resume.resumeText
          ? require("crypto")
              .createHash("sha256")
              .update(resume.resumeText)
              .digest("hex")
          : null;
        if (resumeHash) {
          await redis.del(`resume:analysis:${resumeHash}`);
          // Optionally, delete job match keys if you have job hashes stored or can enumerate them
          // Example: await redis.del(`jobmatch:${resumeHash}:*`); // Requires Redis scan/del for pattern
        }
      } catch (e) {}
    }
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    if (
      req.user?._id &&
      resume.userId?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Delete from Cloudinary
    if (resume.publicId) {
      try {
        await cloudinary.uploader.destroy(resume.publicId, {
          resource_type: resume.mimetype?.startsWith("image/")
            ? "image"
            : "raw",
        });
      } catch (cloudinaryError) {
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await Resume.findByIdAndDelete(id);

    return res.json({ success: true, message: "Resume deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const getResumes = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const resumes = await Resume.find({ userId: req.user._id }).sort({
      createdAt: 1,
    });

    const mapped = resumes.map((r) => ({
      id: r._id,
      resume_name: r.resumeName || r.filename,
      filename: r.filename,
      url: r.url,
      uploadedAt: r.uploadedAt,
      created_at: r.createdAt,
      size: r.size,
      mimetype: r.mimetype,
      ats_score: r.analysisResult?.ats_score ?? null,
      analysis: r.analysisResult || null,
    }));

    return res.json({ success: true, resumes: mapped });
  } catch (err) {
    console.error("List resumes error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
