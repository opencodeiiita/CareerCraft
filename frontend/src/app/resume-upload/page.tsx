"use client";

import ResumeHistory from "@/components/ResumeHistory";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-50 py-10 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
          My Resumes
        </h1>
        <ResumeHistory />
      </div>
    </div>
  );
}
