"use client";

import { useSearchParams } from "next/navigation";

import { Suspense } from "react";
import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";
import Link from "next/link";

function ResourcesContent() {
    const searchParams = useSearchParams();

    // Get skills from URL or default to empty array
    const skillsParam = searchParams.get("skills");
    const skills = skillsParam ? skillsParam.split(",").filter((s) => s.trim()) : [];

    const platforms = [
        {
            name: "GeeksforGeeks",
            icon: (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm-1.5 18h-3v-3h3v3zm0-4.5h-3v-3h3v3zm0-4.5h-3v-3h3v3zm4.5 9h-3v-3h3v3zm0-4.5h-3v-3h3v3zm0-4.5h-3v-3h3v3z" />
                </svg>
            ),
            color: "bg-green-600 hover:bg-green-700",
            darkColor: "dark:bg-green-700 dark:hover:bg-green-600",
            getUrl: (skill: string) => `https://www.geeksforgeeks.org/search?q=${encodeURIComponent(skill)}`,
            description: "Comprehensive tutorials and articles",
        },
        {
            name: "W3Schools",
            icon: (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm-1.5 18h-3v-3h3v3zm0-4.5h-3v-3h3v3zm0-4.5h-3v-3h3v3zm4.5 9h-3v-3h3v3zm0-4.5h-3v-3h3v3zm0-4.5h-3v-3h3v3z" />
                </svg>
            ),
            color: "bg-emerald-600 hover:bg-emerald-700",
            darkColor: "dark:bg-emerald-700 dark:hover:bg-emerald-600",
            getUrl: (skill: string) => `https://www.google.com/search?q=site:w3schools.com+${encodeURIComponent(skill)}`,
            description: "Web development documentation",
        },
        {
            name: "YouTube",
            icon: (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
            color: "bg-red-600 hover:bg-red-700",
            darkColor: "dark:bg-red-700 dark:hover:bg-red-600",
            getUrl: (skill: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}+tutorial`,
            description: "Video tutorials and courses",
        },
    ];

    if (skills.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-full mb-6">
                    <BookOpen className="w-12 h-12 text-zinc-400" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    No skills specified
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
                    It looks like no skills were passed to this page. Go back to the cover letter generator to identify missing skills.
                </p>
                <Link
                    href="/cover-letter"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Generator
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link
                    href="/cover-letter"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Generator
                </Link>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">
                    Learning Resources
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    We found <span className="font-semibold text-blue-600 dark:text-blue-400">{skills.length} skills</span> that could strengthen your profile.
                    Select a platform below to start learning.
                </p>
            </div>

            <div className="grid gap-8">
                {skills.map((skill) => (
                    <div
                        key={skill}
                        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-1 bg-blue-500 rounded-full" />
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                {skill}
                            </h2>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {platforms.map((platform) => (
                                <a
                                    key={platform.name}
                                    href={platform.getUrl(skill)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group relative flex flex-col p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-zinc-50 dark:bg-zinc-900/50`}
                                >
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${platform.color.split(" ")[0]}`} />

                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-lg text-white ${platform.color} ${platform.darkColor}`}>
                                            {platform.icon}
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                                    </div>

                                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                                        {platform.name}
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {platform.description}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            }>
                <ResourcesContent />
            </Suspense>
        </div>
    );
}
