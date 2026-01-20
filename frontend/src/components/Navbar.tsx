"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { isAuthenticated, logout, getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setIsLoggedIn(true);
        try {
          const response = await getCurrentUser();
          setUsername(response.data.user.username);
        } catch {
          // Token might be invalid
          setIsLoggedIn(false);
        }
      }
    };
    checkAuth();

    const handleAuthChange = () => {
      // We check localStorage directly here to be sure, as state update might be pending
      const token = localStorage.getItem('token');
      // If token exists, we are logged in. If not, we are logged out.
      if (token) {
        setIsLoggedIn(true);
        // We can fetch user details here if needed, but checkAuth does it too.
        // checkAuth(); // Let checkAuth handle state sync
      } else {
        setIsLoggedIn(false);
        setUsername(null);
      }
      checkAuth(); // Sync full state
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUsername(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              CareerCraft
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
              Home
            </Link>
            <Link href="/resume-analysis" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
              Resume Analysis
            </Link>
            <Link href="/resume-upload" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
              Upload Resume
            </Link>
            <Link href="/cover-letter" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
              Get Cover Letter
            </Link>
            {isLoggedIn && (
              <Link href="/my-cover-letters" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                My Cover Letters
              </Link>
            )}
            <Link href="/about" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
              About
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isLoggedIn ? (
              <>
                {username && (
                  <Link
                    href={`/${username}`}
                    className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  >
                    My Profile
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
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
              <Link href="/" className="block px-1 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                Home
              </Link>
              <Link href="/resume-analysis" className="block px-1 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                Resume Analysis
              </Link>
              <Link href="/resume-upload" className="block px-1 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                Upload Resume
              </Link>
              <Link href="/cover-letter" className="block px-1 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                Get Cover Letter
              </Link>
              {isLoggedIn && (
                <Link href="/my-cover-letters" className="block px-1 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                  My Cover Letters
                </Link>
              )}
              <Link href="/about" className="block px-1 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                About
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                {isLoggedIn ? (
                  <>
                    {username && (
                      <Link
                        href={`/${username}`}
                        className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                      >
                        My Profile
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
