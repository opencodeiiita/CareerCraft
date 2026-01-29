import React from "react";
import {
  Trophy,
  Star,
  BarChart2,
  UserCheck,
  Users,
  FolderGit2,
  ActivitySquare,
} from "lucide-react";
import { usePlatformStats } from "@/lib/platformStats";

interface Props {
  github?: string;
  codeforces?: string;
  codechef?: string;
}

import { useState } from "react";

const TABS = [
  {
    key: "github",
    label: "GitHub",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    key: "codeforces",
    label: "Codeforces",
    icon: (
      <img
        src="https://media2.dev.to/dynamic/image/width=1080,height=1080,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fcer3l19eex0wy900b101.jpg"
        alt="Codeforces"
        className="w-5 h-5 rounded-full object-cover"
      />
    ),
  },
  {
    key: "codechef",
    label: "CodeChef",
    icon: (
      <img
        src="https://img.icons8.com/color/1200/codechef.jpg"
        alt="CodeChef"
        className="w-5 h-5 rounded-full object-cover"
      />
    ),
  },
];

const PlatformCards: React.FC<Props> = ({ github, codeforces, codechef }) => {
  const { stats, errors, loading } = usePlatformStats({
    github,
    codeforces,
    codechef,
  });
  const [activeTab, setActiveTab] = useState(() => {
    if (github) return "github";
    if (codeforces) return "codeforces";
    if (codechef) return "codechef";
    return "github";
  });

  const availableTabs = TABS.filter((tab) => {
    if (tab.key === "github" && github) return true;
    if (tab.key === "codeforces" && codeforces) return true;
    if (tab.key === "codechef" && codechef) return true;
    return false;
  });

  if (availableTabs.length === 0) return null;

  return (
    <div className="mt-6">
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4 border-b border-zinc-200 dark:border-zinc-700">
        {availableTabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none transition-colors
              ${activeTab === tab.key ? "bg-white dark:bg-zinc-950 border-x border-t border-zinc-200 dark:border-zinc-700 text-blue-600 dark:text-blue-400 -mb-px" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400"}`}
            onClick={() => setActiveTab(tab.key)}
            style={{
              borderBottom:
                activeTab === tab.key ? "2px solid #3b82f6" : "none",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "github" && github && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-6 h-6 text-black dark:text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="font-semibold text-lg">GitHub</span>
          </div>
          {loading ? (
            <p className="text-zinc-500">Loading...</p>
          ) : errors.github ? (
            <p className="text-red-500 text-sm">{errors.github}</p>
          ) : (
            stats.github && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 items-center text-zinc-700 dark:text-zinc-200">
                  <span className="flex items-center gap-1">
                    <FolderGit2 className="w-4 h-4 text-blue-600" />{" "}
                    <span className="font-medium">Repos:</span>{" "}
                    {stats.github.public_repos}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-green-600" />{" "}
                    <span className="font-medium">Followers:</span>{" "}
                    {stats.github.followers}
                  </span>
                </div>
                <div>
                  <span className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-200">
                    <ActivitySquare className="w-4 h-4 text-purple-500" />{" "}
                    Recent Activity:
                  </span>
                  <ul className="ml-4 mt-1 list-disc text-sm text-zinc-600 dark:text-zinc-400">
                    {stats.github.recent_activity.length === 0 && (
                      <li>No recent activity</li>
                    )}
                    {stats.github.recent_activity.map((ev, i) => (
                      <li key={i}>
                        <span className="font-medium">{ev.type}</span> in{" "}
                        <span className="font-mono">{ev.repo}</span>{" "}
                        <span className="text-xs">
                          ({new Date(ev.date).toLocaleDateString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          )}
        </div>
      )}
      {activeTab === "codeforces" && codeforces && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="https://media2.dev.to/dynamic/image/width=1080,height=1080,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fcer3l19eex0wy900b101.jpg"
              alt="Codeforces logo"
              className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <span className="font-semibold text-lg">Codeforces</span>
          </div>
          {loading ? (
            <p className="text-zinc-500">Loading...</p>
          ) : errors.codeforces ? (
            <p className="text-red-500 text-sm">{errors.codeforces}</p>
          ) : (
            stats.codeforces && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 items-start text-zinc-700 dark:text-zinc-200">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Solved:</span>{" "}
                    {stats.codeforces.problems_solved}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart2 className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Rating:</span>{" "}
                    {stats.codeforces.current_rating ?? "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart2 className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Max:</span>{" "}
                    {stats.codeforces.max_rating ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                  <UserCheck className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Rank:</span>{" "}
                  {stats.codeforces.rank ?? "N/A"}
                </div>
              </div>
            )
          )}
        </div>
      )}
      {activeTab === "codechef" && codechef && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="https://img.icons8.com/color/1200/codechef.jpg"
              alt="CodeChef logo"
              className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <span className="font-semibold text-lg">CodeChef</span>
          </div>
          {loading ? (
            <p className="text-zinc-500">Loading...</p>
          ) : errors.codechef ? (
            <p className="text-red-500 text-sm">{errors.codechef}</p>
          ) : (
            stats.codechef && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 items-start text-zinc-700 dark:text-zinc-200">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Solved:</span>{" "}
                    {stats.codechef.problems_solved}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart2 className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">Rating:</span>{" "}
                    {stats.codechef.current_rating ?? "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="font-medium">Stars:</span>{" "}
                    {stats.codechef.stars ?? "N/A"}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default PlatformCards;
