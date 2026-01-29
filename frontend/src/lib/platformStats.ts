import { useEffect, useState } from "react";

export type PlatformType = "github" | "codeforces" | "codechef";

export interface GithubStats {
  public_repos: number;
  followers: number;
  recent_activity: Array<{ repo: string; type: string; date: string }>;
}

export interface CodeforcesStats {
  problems_solved: number;
  current_rating: number | null;
  max_rating: number | null;
  rank: string | null;
}

export interface CodechefStats {
  problems_solved: number;
  current_rating: number | null;
  stars: number | null;
}

export interface PlatformStats {
  github?: GithubStats;
  codeforces?: CodeforcesStats;
  codechef?: CodechefStats;
}

export interface PlatformError {
  github?: string;
  codeforces?: string;
  codechef?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function usePlatformStats(usernames: {
  github?: string;
  codeforces?: string;
  codechef?: string;
}) {
  const [stats, setStats] = useState<PlatformStats>({});
  const [errors, setErrors] = useState<PlatformError>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      setLoading(true);
      const newStats: PlatformStats = {};
      const newErrors: PlatformError = {};
      try {
        if (usernames.github) {
          const res = await fetch(
            `${API_BASE}/platform/github/${encodeURIComponent(usernames.github)}`,
          );
          const data = await res.json();
          if (res.ok && data.data) newStats.github = data.data;
          else
            newErrors.github = data.message || "Failed to fetch GitHub stats";
        }
        if (usernames.codeforces) {
          const res = await fetch(
            `${API_BASE}/platform/codeforces/${encodeURIComponent(usernames.codeforces)}`,
          );
          const data = await res.json();
          if (res.ok && data.data) newStats.codeforces = data.data;
          else
            newErrors.codeforces =
              data.message || "Failed to fetch Codeforces stats";
        }
        if (usernames.codechef) {
          const res = await fetch(
            `${API_BASE}/platform/codechef/${encodeURIComponent(usernames.codechef)}`,
          );
          const data = await res.json();
          if (res.ok && data.data) newStats.codechef = data.data;
          else
            newErrors.codechef =
              data.message || "Failed to fetch CodeChef stats";
        }
      } catch (err) {
        // General error fallback
      }
      if (!cancelled) {
        setStats(newStats);
        setErrors(newErrors);
        setLoading(false);
      }
    }
    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [usernames.github, usernames.codeforces, usernames.codechef]);

  return { stats, errors, loading };
}
