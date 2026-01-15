"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (path: string) =>
    `text-sm font-medium ${
      pathname === path
        ? "text-blue-600 dark:text-blue-400"
        : "text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
    }`;

  const mobileLinkClass =
    "block px-1 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              CareerCraft
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className={linkClass("/")}>Home</Link>
            <Link href="/resume-analysis" className={linkClass("/resume-analysis")}>Resume Analysis</Link>
            <Link href="/resume-upload" className={linkClass("/resume-upload")}>Upload Resume</Link>
            <Link href="/cover-letter" className={linkClass("/cover-letter")}>Get Cover Letter</Link>
            <Link href="/about" className={linkClass("/about")}>About</Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/signin"
              className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Sign up
            </Link>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              {open ? (
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3.75 6.75A.75.75 0 014.5 6h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden">
            <div className="space-y-2 border-t border-zinc-200 py-4 dark:border-zinc-800">
              <Link href="/" onClick={() => setOpen(false)} className={mobileLinkClass}>Home</Link>
              <Link href="/resume-analysis" onClick={() => setOpen(false)} className={mobileLinkClass}>Resume Analysis</Link>
              <Link href="/resume-upload" onClick={() => setOpen(false)} className={mobileLinkClass}>Upload Resume</Link>
              <Link href="/cover-letter" onClick={() => setOpen(false)} className={mobileLinkClass}>Get Cover Letter</Link>
              <Link href="/about" onClick={() => setOpen(false)} className={mobileLinkClass}>About</Link>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
