import { getToken } from "./auth";
import { SavedCoverLetter } from "./coverLetterApi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface UserProfile {
    _id: string;
    username: string;
    email: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    github?: string;
    leetcode?: string;
    codeforces?: string;
    codechef?: string;
    otherPlatforms?: Array<{ name: string; url: string }>;
    createdAt: string;
}

export interface Resume {
    _id: string;
    filename: string;
    url: string;
    size?: number;
    mimetype?: string;
    uploadedAt: string;
}

export interface ProfileData {
    profile: UserProfile;
    resumes: Resume[];
    coverLetters: SavedCoverLetter[];
}

export interface UpdateProfileRequest {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    github?: string;
    leetcode?: string;
    codeforces?: string;
    codechef?: string;
    otherPlatforms?: Array<{ name: string; url: string }>;
}

/**
 * Get profile by username (owner only)
 */
export async function getProfile(username: string): Promise<ProfileData> {
    const token = getToken();

    if (!token) {
        throw new Error("You must be logged in to view profiles");
    }

    const response = await fetch(`${API_BASE_URL}/profile/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        if (response.status === 403) {
            throw new Error("FORBIDDEN");
        }
        throw new Error(result.message || "Failed to fetch profile");
    }

    return result.data;
}

/**
 * Update current user's profile
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const token = getToken();

    if (!token) {
        throw new Error("You must be logged in to update your profile");
    }

    const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
    }

    return result.data.profile;
}

/**
 * Get current user's resumes
 */
export async function getMyResumes(): Promise<Resume[]> {
    const token = getToken();

    if (!token) {
        throw new Error("You must be logged in to view your resumes");
    }

    const response = await fetch(`${API_BASE_URL}/profile/my/resumes`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch resumes");
    }

    return result.data.resumes;
}
