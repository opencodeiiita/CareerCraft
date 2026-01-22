import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 via-white to-sky-50 py-20 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/logo-white.svg"
                alt="CareerCraft Logo"
                className="h-24 w-24 sm:h-32 sm:w-32 block dark:hidden"
              />
              <img
                src="/logo-black.svg"
                alt="CareerCraft Logo"
                className="h-24 w-24 sm:h-32 sm:w-32 hidden dark:block"
              />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              AI-powered resume insights and job matching
            </h1>
            <p className="mt-4 text-lg leading-7 text-gray-600 dark:text-gray-300">
              CareerCraft helps you refine your resume for ATS, discover the right roles,
              and craft tailored cover letters — all in one place.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                href="/resume-upload"
                className="cc-btn-primary inline-flex items-center"
              >
                Upload Resume
              </Link>
              <Link
                href="/about"
                className="cc-btn-secondary inline-flex items-center"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              What you can do with CareerCraft
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-300">
              Four tools designed to speed up your job search and sharpen your profile.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M6 2.75A2.75 2.75 0 003.25 5.5v13A2.75 2.75 0 006 21.25h12A2.75 2.75 0 0020.75 18.5v-9a.75.75 0 00-1.5 0v9c0 .69-.56 1.25-1.25 1.25H6A1.25 1.25 0 014.75 18.5v-13C4.75 4.81 5.31 4.25 6 4.25h7a.75.75 0 000-1.5H6z" />
                    <path d="M8.25 8.5a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25zM8.25 12a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z" />
                    <path d="M15.5 2a.75.75 0 00-.53.22l-3.44 3.44a.75.75 0 00.53 1.28H15a.5.5 0 01.5.5v2.94a.75.75 0 001.28.53l3.44-3.44A.75.75 0 0019.5 6h-2.94A.5.5 0 0116 5.5V2.75a.75.75 0 00-.5-.72z" />
                  </svg>
                </span>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Resume Analyzer</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                Get ATS-focused checks and suggestions to improve clarity, keywords, and structure.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v3a.75.75 0 11-1.5 0v-3A.75.75 0 0112 2.25zm6.364 2.136a.75.75 0 011.06 1.06l-2.121 2.122a.75.75 0 11-1.06-1.06l2.121-2.122zM2.25 12a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3A.75.75 0 012.25 12zm15.682 5.682a.75.75 0 011.06 0l2.121 2.121a.75.75 0 11-1.06 1.061l-2.121-2.12a.75.75 0 010-1.062zM6.364 4.386a.75.75 0 010 1.06L4.243 7.568a.75.75 0 11-1.06-1.06L5.303 4.386a.75.75 0 011.06 0z" clipRule="evenodd" />
                    <path d="M7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
                  </svg>
                </span>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Job Match & Skill Fit</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                Compare your profile with roles to see match scores and the skills to build next.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/10 text-violet-700 dark:text-violet-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M6.75 5A2.75 2.75 0 019.5 2.25h5A2.75 2.75 0 0117.25 5v14A2.75 2.75 0 0114.5 21.75h-5A2.75 2.75 0 016.75 19V5z" />
                    <path d="M8.75 7.5h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 010-1.5zm0 3h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 010-1.5zm0 3h3a.75.75 0 010 1.5h-3a.75.75 0 010-1.5z" />
                  </svg>
                </span>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">AI Cover Letter</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                Generate tailored cover letters that reflect your experience and the job.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/10 text-amber-700 dark:text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12 2.25c-4.28 0-7.75 3.47-7.75 7.75 0 2.6 1.28 4.9 3.25 6.27v2.48c0 .69.56 1.25 1.25 1.25H13a1.25 1.25 0 001.25-1.25v-2.48c1.97-1.37 3.25-3.67 3.25-6.27 0-4.28-3.47-7.75-7.75-7.75zm-1.25 18a1.25 1.25 0 001.25 1.25h1.5A1.25 1.25 0 0014.75 20h-4z" />
                  </svg>
                </span>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Career Guidance & Insights</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                Get tips and actionable insights to position your profile for opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
