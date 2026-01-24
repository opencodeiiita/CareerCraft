"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const token = useMemo(() => searchParams.get("token"), [searchParams]);
  const provider = useMemo(() => searchParams.get("provider"), [searchParams]);
  const errorParam = useMemo(() => searchParams.get("error"), [searchParams]);

  useEffect(() => {
    if (errorParam) {
      setError(errorParam);
      setIsProcessing(false);
      return;
    }

    if (token) {
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("auth-change"));
      router.replace("/");
      return;
    }

    setError("Missing authentication token");
    setIsProcessing(false);
  }, [token, errorParam, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-gray-900 dark:via-black dark:to-gray-900 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 text-center">
        {isProcessing ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-gray-700 text-sm">
              Completing {provider ? `${provider} ` : ""}sign in...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Sign in failed
            </h1>
            <p className="text-sm text-red-600">
              {error || "OAuth flow failed. Please try again."}
            </p>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Back to Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
