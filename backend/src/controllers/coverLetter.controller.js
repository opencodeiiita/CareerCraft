import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import CoverLetter from "../models/coverLetter.model.js";
import redis from "../utils/redisClient.js";
import crypto from "crypto";

/**
 * Save a new cover letter for the authenticated user
 * POST /api/cover-letters
 */
const saveCoverLetter = asyncHandler(async (req, res) => {
  const { companyName, jobTitle, jobDescription, tone, coverLetter } = req.body;
  // Generate hash for draft content
  const draftHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(coverLetter))
    .digest("hex");
  const draftCacheKey = `coverletter:draft:${req.user._id}:${draftHash}`;
  // Check Redis cache for draft (optional, for retrieval endpoint)

  // Validation
  if (!companyName || !jobTitle) {
    throw new ApiError(400, "Company name and job title are required");
  }

  if (
    !coverLetter ||
    !coverLetter.greeting ||
    !coverLetter.body ||
    !coverLetter.closing ||
    !coverLetter.signOff
  ) {
    throw new ApiError(
      400,
      "Cover letter content is required (greeting, body, closing, signOff)",
    );
  }

  const newCoverLetter = await CoverLetter.create({
    userId: req.user._id,
    companyName,
    jobTitle,
    jobDescription,
    tone: tone || "formal",
    coverLetter: {
      greeting: coverLetter.greeting,
      body: coverLetter.body,
      closing: coverLetter.closing,
      signOff: coverLetter.signOff || coverLetter.sign_off,
      candidateName: coverLetter.candidateName || coverLetter.candidate_name,
    },
  });

  // Invalidate draft cache on save
  try {
    await redis.del(draftCacheKey);
  } catch (e) { }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { coverLetter: newCoverLetter },
        "Cover letter saved successfully",
      ),
    );
});

/**
 * Get all cover letters for the authenticated user
 * GET /api/cover-letters
 */
const getMyCoverLetters = asyncHandler(async (req, res) => {
  const coverLetters = await CoverLetter.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { coverLetters },
        "Cover letters retrieved successfully",
      ),
    );
});

/**
 * Get a single cover letter by ID (owner only)
 * GET /api/cover-letters/:id
 */
const getCoverLetterById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coverLetter = await CoverLetter.findById(id);

  if (!coverLetter) {
    throw new ApiError(404, "Cover letter not found");
  }

  // Ensure user owns this cover letter
  if (coverLetter.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to access this cover letter",
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { coverLetter },
        "Cover letter retrieved successfully",
      ),
    );
});

/**
 * Delete a cover letter by ID (owner only)
 * DELETE /api/cover-letters/:id
 */
const deleteCoverLetter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coverLetter = await CoverLetter.findById(id);

  if (!coverLetter) {
    throw new ApiError(404, "Cover letter not found");
  }

  // Ensure user owns this cover letter
  if (coverLetter.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to delete this cover letter",
    );
  }

  await CoverLetter.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Cover letter deleted successfully"));
});

export {
  saveCoverLetter,
  getMyCoverLetters,
  getCoverLetterById,
  deleteCoverLetter,
};
