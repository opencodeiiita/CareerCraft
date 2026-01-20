'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';
import { getProfile, updateProfile, ProfileData, UpdateProfileRequest } from '@/lib/profileApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDownload, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ResumeCard from '@/components/ResumeCard';
import CoverLetterCard from '@/components/CoverLetterCard';
import { SavedCoverLetter, deleteCoverLetter } from '@/lib/coverLetterApi';
import Toast from '@/components/Toast';
import { MapPin, Phone, Mail, Calendar, Edit2, Globe, User, Terminal } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const username = params.username as string;

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [currentUsername, setCurrentUsername] = useState<string | null>(null);

    // Edit form state
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        address: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        github: '',
        leetcode: '',
        codeforces: '',
        codechef: '',
        otherPlatforms: [],
    });

    // Delete confirmation dialog state
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        itemId: string | null;
        itemName: string;
        itemType: 'resume' | 'cover-letter';
        isDeleting: boolean;
    }>({ isOpen: false, itemId: null, itemName: '', itemType: 'resume', isDeleting: false });

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            if (!isAuthenticated()) {
                router.push('/signin');
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

                // Fetch profile data
                const data = await getProfile(username);
                setProfileData(data);

                // Initialize form with profile data
                setFormData({
                    address: data.profile.address || '',
                    city: data.profile.city || '',
                    state: data.profile.state || '',
                    country: data.profile.country || '',
                    phone: data.profile.phone || '',
                    github: data.profile.github || '',
                    leetcode: data.profile.leetcode || '',
                    codeforces: data.profile.codeforces || '',
                    codechef: data.profile.codechef || '',
                    otherPlatforms: data.profile.otherPlatforms || [],
                });
            } catch (err) {
                if (err instanceof Error && err.message === 'FORBIDDEN') {
                    // Redirect to own profile
                    if (currentUsername) {
                        router.push(`/${currentUsername}`);
                    } else {
                        router.push('/');
                    }
                    return;
                }
                setError(err instanceof Error ? err.message : 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, [username, router, currentUsername]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOtherPlatformChange = (index: number, field: 'name' | 'url', value: string) => {
        const updatedPlatforms = [...(formData.otherPlatforms || [])];
        updatedPlatforms[index] = { ...updatedPlatforms[index], [field]: value };
        setFormData(prev => ({ ...prev, otherPlatforms: updatedPlatforms }));
    };

    const addOtherPlatform = () => {
        setFormData(prev => ({
            ...prev,
            otherPlatforms: [...(prev.otherPlatforms || []), { name: '', url: '' }]
        }));
    };

    const removeOtherPlatform = (index: number) => {
        const updatedPlatforms = [...(formData.otherPlatforms || [])];
        updatedPlatforms.splice(index, 1);
        setFormData(prev => ({ ...prev, otherPlatforms: updatedPlatforms }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updatedProfile = await updateProfile(formData);
            setProfileData(prev => prev ? { ...prev, profile: updatedProfile } : null);
            setIsEditing(false);
            showToast('Profile updated successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const openDeleteDialog = (itemId: string, itemName: string, itemType: 'resume' | 'cover-letter') => {
        setDeleteDialog({ isOpen: true, itemId, itemName, itemType, isDeleting: false });
    };

    const closeDeleteDialog = () => {
        setDeleteDialog(prev => ({ ...prev, isOpen: false }));
    };

    const confirmDelete = async () => {
        if (!deleteDialog.itemId) return;

        setDeleteDialog(prev => ({ ...prev, isDeleting: true }));
        const token = localStorage.getItem('token');
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        try {
            if (deleteDialog.itemType === 'resume') {
                const response = await fetch(`${apiBase}/resumes/${deleteDialog.itemId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Failed to delete resume');

                setProfileData(prev => prev ? {
                    ...prev,
                    resumes: prev.resumes.filter(r => r._id !== deleteDialog.itemId)
                } : null);
            } else {
                await deleteCoverLetter(deleteDialog.itemId);

                setProfileData(prev => prev ? {
                    ...prev,
                    coverLetters: prev.coverLetters.filter(cl => cl._id !== deleteDialog.itemId)
                } : null);
            }

            // Close dialog first
            closeDeleteDialog();
            // Then show toast (delay slightly for smoother UX if needed, but immediate is fine)
            showToast(`${deleteDialog.itemType === 'resume' ? 'Resume' : 'Cover letter'} deleted successfully`, 'success');
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to delete ${deleteDialog.itemType === 'resume' ? 'resume' : 'cover letter'}`);
            setDeleteDialog(prev => ({ ...prev, isDeleting: false })); // Stop loading but keep dialog open on error
        }
    };

    const formatCoverLetter = (coverLetter: SavedCoverLetter['coverLetter']) => {
        return `${coverLetter.greeting}\n\n${coverLetter.body.join('\n\n')}\n\n${coverLetter.closing}\n\n${coverLetter.signOff}`;
    };

    const handleDownloadCoverLetter = (letter: SavedCoverLetter) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            setError('Failed to open print window');
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
        const letter = profileData?.coverLetters.find(cl => cl._id === id);
        if (letter) {
            openDeleteDialog(id, `${letter.companyName} - ${letter.jobTitle}`, 'cover-letter');
        }
    };


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 py-10 dark:bg-black">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading profile...</div>
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
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Profile not found</h1>
                    </div>
                </div>
            </div>
        );
    }

    const { profile, resumes, coverLetters } = profileData;

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
                                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
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
                            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Edit Profile</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">State</label>
                                    <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Country</label>
                                    <input type="text" name="country" value={formData.country} onChange={handleInputChange}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phone</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold mt-6 mb-4 text-zinc-900 dark:text-white">Coding Platforms</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">GitHub</label>
                                    <input type="text" name="github" value={formData.github} onChange={handleInputChange} placeholder="https://github.com/username"
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">LeetCode</label>
                                    <input type="text" name="leetcode" value={formData.leetcode} onChange={handleInputChange} placeholder="https://leetcode.com/username"
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Codeforces</label>
                                    <input type="text" name="codeforces" value={formData.codeforces} onChange={handleInputChange} placeholder="https://codeforces.com/profile/username"
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">CodeChef</label>
                                    <input type="text" name="codechef" value={formData.codechef} onChange={handleInputChange} placeholder="https://codechef.com/users/username"
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Other Platforms</label>
                                <div className="space-y-3">
                                    {formData.otherPlatforms?.map((platform, index) => (
                                        <div key={index} className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="Platform Name"
                                                value={platform.name}
                                                onChange={(e) => handleOtherPlatformChange(index, 'name', e.target.value)}
                                                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                placeholder="URL"
                                                value={platform.url}
                                                onChange={(e) => handleOtherPlatformChange(index, 'url', e.target.value)}
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
                                <button onClick={handleSave} disabled={saving}
                                    className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Changes'}
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
                                            {[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'Not specified'}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5" />
                                            Phone
                                        </p>
                                        <p className="text-base font-medium text-zinc-900 dark:text-white pl-5">
                                            {profile.phone || 'Not specified'}
                                        </p>
                                    </div>

                                    <div className="space-y-1 md:col-span-2 lg:col-span-1">
                                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5" />
                                            Address
                                        </p>
                                        <p className="text-base font-medium text-zinc-900 dark:text-white pl-5">
                                            {profile.address || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white mb-6">
                                        <Terminal className="w-5 h-5 text-purple-500" />
                                        Coding Platforms
                                    </h3>

                                    <div className="flex flex-wrap gap-3">
                                        {profile.github && (
                                            <a href={profile.github} target="_blank" rel="noopener noreferrer"
                                                className="group inline-flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all hover:scale-105">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                GitHub
                                            </a>
                                        )}
                                        {profile.leetcode && (
                                            <a href={profile.leetcode} target="_blank" rel="noopener noreferrer"
                                                className="group inline-flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 transition-all hover:scale-105">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                                                </svg>
                                                LeetCode
                                            </a>
                                        )}
                                        {profile.codeforces && (
                                            <a href={profile.codeforces} target="_blank" rel="noopener noreferrer"
                                                className="group inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-all hover:scale-105">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5V19.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
                                                </svg>
                                                Codeforces
                                            </a>
                                        )}
                                        {profile.codechef && (
                                            <a href={profile.codechef} target="_blank" rel="noopener noreferrer"
                                                className="group inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 transition-all hover:scale-105">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 .5.1 1 .2 1.5H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-6h1c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-2.7c.1-.5.2-1 .2-1.5C16.5 4 14.5 2 12 2zm0 2c1.4 0 2.5 1.1 2.5 2.5S13.4 9 12 9s-2.5-1.1-2.5-2.5S10.6 4 12 4zm-4 8h2v2H8v-2zm6 0h2v2h-2v-2z" />
                                                </svg>
                                                CodeChef
                                            </a>
                                        )}
                                        {profile.otherPlatforms && profile.otherPlatforms.map((platform, index) => (
                                            <a key={index} href={platform.url} target="_blank" rel="noopener noreferrer"
                                                className="group inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all hover:scale-105">
                                                <Globe className="w-5 h-5 text-zinc-500" />
                                                {platform.name}
                                            </a>
                                        ))}

                                        {!profile.github && !profile.leetcode && !profile.codeforces && !profile.codechef && (!profile.otherPlatforms || profile.otherPlatforms.length === 0) && (
                                            <div className="flex flex-col items-center justify-center w-full py-6 text-center rounded-xl bg-zinc-50 border border-dashed border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
                                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">No functional coding profiles linked yet.</p>
                                                <button onClick={() => setIsEditing(true)} className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline">
                                                    Add platforms
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resumes Section */}
                    <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">My Resumes ({resumes.length})</h2>
                        {resumes.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-zinc-500 dark:text-zinc-400 mb-4">No resumes uploaded yet.</p>
                                <Link href="/resume-upload" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                    Upload your first resume →
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                {resumes.map((resume) => (
                                    <ResumeCard
                                        key={resume._id}
                                        resume={resume}
                                        onDeleteClick={(id, name) => openDeleteDialog(id, name, 'resume')}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cover Letters Section */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">My Cover Letters ({coverLetters.length})</h2>
                        {coverLetters.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-zinc-500 dark:text-zinc-400 mb-4">No cover letters saved yet.</p>
                                <Link href="/cover-letter" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                    Generate your first cover letter →
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                {coverLetters.slice(0, 4).map((cl) => (
                                    <CoverLetterCard
                                        key={cl._id}
                                        letter={cl}
                                        onDelete={handleDeleteCoverLetter}
                                        onDownload={handleDownloadCoverLetter}
                                    />
                                ))}
                            </div>
                        )}
                        {coverLetters.length > 0 && (
                            <div className="mt-4 text-center">
                                <Link href="/my-cover-letters" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                    View all cover letters →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {
                deleteDialog.isOpen && (
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
                                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Delete {deleteDialog.itemType === 'resume' ? 'Resume' : 'Cover Letter'}</h3>
                                            <p className="text-sm text-zinc-400">This action cannot be undone</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-6 pb-4">
                                    <p className="text-zinc-300">
                                        Are you sure you want to delete{' '}
                                        <span className="font-semibold text-white">&ldquo;{deleteDialog.itemName}&rdquo;</span>?
                                    </p>
                                    <p className="text-sm text-zinc-500 mt-2">
                                        This will permanently remove the {deleteDialog.itemType === 'resume' ? 'resume' : 'cover letter'} from your profile and cannot be recovered.
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
                                            <FontAwesomeIcon icon={faSpinner} className="text-sm animate-spin" />
                                        ) : (
                                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                        )}
                                        {deleteDialog.isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Toast Notification */}
            {toast.isVisible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
                />
            )}
        </>
    );
}
