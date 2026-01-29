"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import {
  getProfile,
  updateProfile,
  ProfileData,
  UpdateProfileRequest,
} from "@/lib/profileApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import ResumeCard from "@/components/ResumeCard";
import CoverLetterCard from "@/components/CoverLetterCard";
import { SavedCoverLetter, deleteCoverLetter } from "@/lib/coverLetterApi";
import Toast from "@/components/Toast";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit2,
  Globe,
  User,
  Terminal,
} from "lucide-react";
import PlatformCards from "@/components/PlatformCards";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  // Edit form state
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    github: "",
    leetcode: "",
    codeforces: "",
    codechef: "",
    otherPlatforms: [],
  });

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemName: string;
    itemType: "resume" | "cover-letter";
    isDeleting: boolean;
  }>({
    isOpen: false,
    itemId: null,
    itemName: "",
    itemType: "resume",
    isDeleting: false,
  });

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      if (!isAuthenticated()) {
        router.push("/signin");
        return;
      }

      try {
        // Get current user to check ownership
        const userResponse = await getCurrentUser();
        const loggedInUsername = userResponse.data.user.username;
        setCurrentUsername(loggedInUsername);

        // If trying to access another user's profile, redirect to own profile
        if (username.toLowerCase() !== loggedInUsername.toLowerCase()) {
          router.push(`/${loggedInUsername}`);
          return;
        }

        // Fetch profile data with limit 3 (for recent items)
        const data = await getProfile(username, 3);
        setProfileData(data);

        // Initialize form with profile data
        setFormData({
          address: data.profile.address || "",
          city: data.profile.city || "",
          state: data.profile.state || "",
          country: data.profile.country || "",
          phone: data.profile.phone || "",
          github: data.profile.github || "",
          leetcode: data.profile.leetcode || "",
          codeforces: data.profile.codeforces || "",
          codechef: data.profile.codechef || "",
          otherPlatforms: data.profile.otherPlatforms || [],
        });
      } catch (err) {
        if (err instanceof Error && err.message === "FORBIDDEN") {
          // Redirect to own profile
          if (currentUsername) {
            router.push(`/${currentUsername}`);
          } else {
            router.push("/");
          }
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [username, router, currentUsername]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtherPlatformChange = (
    index: number,
    field: "name" | "url",
    value: string,
  ) => {
    const updatedPlatforms = [...(formData.otherPlatforms || [])];
    updatedPlatforms[index] = { ...updatedPlatforms[index], [field]: value };
    setFormData((prev) => ({ ...prev, otherPlatforms: updatedPlatforms }));
  };

  const addOtherPlatform = () => {
    setFormData((prev) => ({
      ...prev,
      otherPlatforms: [...(prev.otherPlatforms || []), { name: "", url: "" }],
    }));
  };

  const removeOtherPlatform = (index: number) => {
    const updatedPlatforms = [...(formData.otherPlatforms || [])];
    updatedPlatforms.splice(index, 1);
    setFormData((prev) => ({ ...prev, otherPlatforms: updatedPlatforms }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedProfile = await updateProfile(formData);
      setProfileData((prev) =>
        prev ? { ...prev, profile: updatedProfile } : null,
      );
      setIsEditing(false);
      showToast("Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (
    itemId: string,
    itemName: string,
    itemType: "resume" | "cover-letter",
  ) => {
    setDeleteDialog({
      isOpen: true,
      itemId,
      itemName,
      itemType,
      isDeleting: false,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const confirmDelete = async () => {
    if (!deleteDialog.itemId) return;

    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
    const token = localStorage.getItem("token");
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      if (deleteDialog.itemType === "resume") {
        const response = await fetch(
          `${apiBase}/resumes/${deleteDialog.itemId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) throw new Error("Failed to delete resume");

        setProfileData((prev) =>
          prev
            ? {
                ...prev,
                resumes: prev.resumes.filter(
                  (r) => r._id !== deleteDialog.itemId,
                ),
              }
            : null,
        );
      } else {
        await deleteCoverLetter(deleteDialog.itemId);

        setProfileData((prev) =>
          prev
            ? {
                ...prev,
                coverLetters: prev.coverLetters.filter(
                  (cl) => cl._id !== deleteDialog.itemId,
                ),
              }
            : null,
        );
      }

      // Close dialog first
      closeDeleteDialog();
      // Then show toast (delay slightly for smoother UX if needed, but immediate is fine)
      showToast(
        `${deleteDialog.itemType === "resume" ? "Resume" : "Cover letter"} deleted successfully`,
        "success",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to delete ${deleteDialog.itemType === "resume" ? "resume" : "cover letter"}`,
      );
      setDeleteDialog((prev) => ({ ...prev, isDeleting: false })); // Stop loading but keep dialog open on error
    }
  };

  const formatCoverLetter = (coverLetter: SavedCoverLetter["coverLetter"]) => {
    return `${coverLetter.greeting}\n\n${coverLetter.body.join("\n\n")}\n\n${coverLetter.closing}\n\n${coverLetter.signOff}`;
  };

  const handleDownloadCoverLetter = (letter: SavedCoverLetter) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setError("Failed to open print window");
      return;
    }

    const formattedLetter = formatCoverLetter(letter.coverLetter);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cover Letter - ${letter.companyName}</title>
        <style>
          @page { margin: 1in; size: letter; }
          body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; max-width: 100%; margin: 0; padding: 20px; }
          .letter-content { white-space: pre-wrap; font-size: 12pt; text-align: left; }
          .header { text-align: center; margin-bottom: 2rem; border-bottom: 1px solid #ccc; padding-bottom: 1rem; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Cover Letter</h2>
          <p>${letter.companyName} - ${letter.jobTitle}</p>
          <p>Generated on ${new Date(letter.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="letter-content">${formattedLetter}</div>
        <script>
          window.onload = function() { setTimeout(() => { window.print(); window.close(); }, 500); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleDeleteCoverLetter = async (id: string) => {
    const letter = profileData?.coverLetters.find((cl) => cl._id === id);
    if (letter) {
      openDeleteDialog(
        id,
        `${letter.companyName} - ${letter.jobTitle}`,
        "cover-letter",
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 py-10 dark:bg-black">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-lg text-zinc-600 dark:text-zinc-400">
              Loading profile...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-zinc-50 py-10 dark:bg-black">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Profile not found
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const { profile, resumes, coverLetters, resumeCount, coverLetterCount } =
    profileData;

  return (
    <>
      <div className="min-h-screen bg-zinc-50 py-10 dark:bg-black">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="relative mb-8">
            {/* Banner / Background Decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/10" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/10" />
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-2">
              <div className="flex items-center gap-6">
                {/* Auto-generated Avatar */}
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl flex items-center justify-center text-3xl font-bold text-white border-4 border-white dark:border-zinc-950">
                  {profile.username.slice(0, 2).toUpperCase()}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                      {profile.username}
                    </h1>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                      Member
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(profile.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="group flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                <Edit2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Edit Form */}
          {isEditing && (
            <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
                Edit Profile
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-4 text-zinc-900 dark:text-white">
                Coding Platforms
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    GitHub
                  </label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    LeetCode
                  </label>
                  <input
                    type="text"
                    name="leetcode"
                    value={formData.leetcode}
                    onChange={handleInputChange}
                    placeholder="https://leetcode.com/username"
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Codeforces
                  </label>
                  <input
                    type="text"
                    name="codeforces"
                    value={formData.codeforces}
                    onChange={handleInputChange}
                    placeholder="https://codeforces.com/profile/username"
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    CodeChef
                  </label>
                  <input
                    type="text"
                    name="codechef"
                    value={formData.codechef}
                    onChange={handleInputChange}
                    placeholder="https://codechef.com/users/username"
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Other Platforms
                </label>
                <div className="space-y-3">
                  {formData.otherPlatforms?.map((platform, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Platform Name"
                        value={platform.name}
                        onChange={(e) =>
                          handleOtherPlatformChange(
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="URL"
                        value={platform.url}
                        onChange={(e) =>
                          handleOtherPlatformChange(
                            index,
                            "url",
                            e.target.value,
                          )
                        }
                        className="flex-[2] rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                      />
                      <button
                        onClick={() => removeOtherPlatform(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addOtherPlatform}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                  >
                    + Add Platform
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* Profile Details */}
          {!isEditing && (
            <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800">
              <div className="p-6 md:p-8">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-white mb-6">
                  <User className="w-5 h-5 text-blue-500" />
                  Personal Information
                </h2>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Location
                    </p>
                    <p className="text-base font-medium text-zinc-900 dark:text-white pl-5">
                      {[profile.city, profile.state, profile.country]
                        .filter(Boolean)
                        .join(", ") || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      Phone
                    </p>
                    <p className="text-base font-medium text-zinc-900 dark:text-white pl-5">
                      {profile.phone || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-1 md:col-span-2 lg:col-span-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      Address
                    </p>
                    <p className="text-base font-medium text-zinc-900 dark:text-white pl-5">
                      {profile.address || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white mb-6">
                    <Terminal className="w-5 h-5 text-purple-500" />
                    Coding Platforms
                  </h3>
                  {/* Platform activity cards (GitHub, Codeforces, CodeChef) */}
                  <PlatformCards
                    github={
                      profile.github
                        ? profile.github.replace(
                            /^(https?:\/\/)?(www\.)?github\.com\//,
                            "",
                          )
                        : undefined
                    }
                    codeforces={
                      profile.codeforces
                        ? profile.codeforces.replace(
                            /^(https?:\/\/)?(www\.)?codeforces\.com\/profile\//,
                            "",
                          )
                        : undefined
                    }
                    codechef={
                      profile.codechef
                        ? profile.codechef.replace(
                            /^(https?:\/\/)?(www\.)?codechef\.com\/users\//,
                            "",
                          )
                        : undefined
                    }
                  />
                  {/* Fallback UI for no platforms */}
                  {!profile.github &&
                    !profile.leetcode &&
                    !profile.codeforces &&
                    !profile.codechef &&
                    (!profile.otherPlatforms ||
                      profile.otherPlatforms.length === 0) && (
                      <div className="flex flex-col items-center justify-center w-full py-6 text-center rounded-xl bg-zinc-50 border border-dashed border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                          No functional coding profiles linked yet.
                        </p>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline"
                        >
                          Add platforms
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Resumes Section */}
          <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Recent Resumes
              </h2>
              {resumeCount > 3 && (
                <Link
                  href="/resume-upload"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  View All ({resumeCount}) →
                </Link>
              )}
            </div>
            {resumes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                  No resumes uploaded yet.
                </p>
                <Link
                  href="/resume-upload"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Upload your first resume →
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {resumes.map((resume) => (
                  <ResumeCard
                    key={resume._id}
                    resume={resume}
                    onDeleteClick={(id, name) =>
                      openDeleteDialog(id, name, "resume")
                    }
                  />
                ))}
              </div>
            )}
            {resumes.length > 0 && resumeCount <= 3 && (
              <div className="mt-4 text-center">
                <Link
                  href="/resume-upload"
                  className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                >
                  Manage Resumes →
                </Link>
              </div>
            )}
          </div>

          {/* Cover Letters Section */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Recent Cover Letters
              </h2>
              {coverLetterCount > 3 && (
                <Link
                  href="/my-cover-letters"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  View All ({coverLetterCount}) →
                </Link>
              )}
            </div>
            {coverLetters.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                  No cover letters saved yet.
                </p>
                <Link
                  href="/cover-letter"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Generate your first cover letter →
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {coverLetters.map((cl) => (
                  <CoverLetterCard
                    key={cl._id}
                    letter={cl}
                    onDelete={handleDeleteCoverLetter}
                    onDownload={handleDownloadCoverLetter}
                  />
                ))}
              </div>
            )}
            {coverLetters.length > 0 && coverLetterCount <= 3 && (
              <div className="mt-4 text-center">
                <Link
                  href="/my-cover-letters"
                  className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                >
                  Manage Cover Letters →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDeleteDialog}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Delete{" "}
                      {deleteDialog.itemType === "resume"
                        ? "Resume"
                        : "Cover Letter"}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-4">
                <p className="text-zinc-300">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    &ldquo;{deleteDialog.itemName}&rdquo;
                  </span>
                  ?
                </p>
                <p className="text-sm text-zinc-500 mt-2">
                  This will permanently remove the{" "}
                  {deleteDialog.itemType === "resume"
                    ? "resume"
                    : "cover letter"}{" "}
                  from your profile and cannot be recovered.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 pt-2 border-t border-zinc-800">
                <button
                  onClick={closeDeleteDialog}
                  disabled={deleteDialog.isDeleting}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 font-medium hover:bg-zinc-800 hover:border-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteDialog.isDeleting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteDialog.isDeleting ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="text-sm animate-spin"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  )}
                  {deleteDialog.isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        />
      )}
    </>
  );
}
