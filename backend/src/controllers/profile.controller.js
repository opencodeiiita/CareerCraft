import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Resume from "../models/resume.model.js";
import CoverLetter from "../models/coverLetter.model.js";

/**
 * Get profile by username
 * GET /api/profile/:username
 * Only the owner can view their profile
 */
const getProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const requestingUser = req.user;

    // Find the profile user
    const profileUser = await User.findOne({ username: username.toLowerCase() }).select("-password");

    if (!profileUser) {
        throw new ApiError(404, "User not found");
    }

    // Security check: Only allow users to view their own profile
    if (profileUser._id.toString() !== requestingUser._id.toString()) {
        throw new ApiError(403, "You can only view your own profile");
    }

    // Get user's resumes
    const resumes = await Resume.find({ userId: profileUser._id })
        .sort({ createdAt: -1 })
        .lean();

    // Get user's cover letters
    const coverLetters = await CoverLetter.find({ userId: profileUser._id })
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(200, {
            profile: profileUser,
            resumes,
            coverLetters,
        }, "Profile fetched successfully")
    );
});

/**
 * Update current user's profile
 * PUT /api/profile/update
 */
const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const {
        address,
        city,
        state,
        country,
        phone,
        github,
        leetcode,
        codeforces,
        codechef,
        otherPlatforms,
    } = req.body;

    // Build update object with only provided fields
    const updateFields = {};

    if (address !== undefined) updateFields.address = address.trim();
    if (city !== undefined) updateFields.city = city.trim();
    if (state !== undefined) updateFields.state = state.trim();
    if (country !== undefined) updateFields.country = country.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (github !== undefined) updateFields.github = github.trim();
    if (leetcode !== undefined) updateFields.leetcode = leetcode.trim();
    if (codeforces !== undefined) updateFields.codeforces = codeforces.trim();
    if (codechef !== undefined) updateFields.codechef = codechef.trim();
    if (otherPlatforms !== undefined) updateFields.otherPlatforms = otherPlatforms;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { profile: updatedUser }, "Profile updated successfully")
    );
});

/**
 * Get current user's resumes
 * GET /api/profile/resumes
 */
const getMyResumes = asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(200, { resumes }, "Resumes fetched successfully")
    );
});

export { getProfile, updateProfile, getMyResumes };
