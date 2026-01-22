"use client";

import { useState, useMemo } from "react";
import { JobMatchCard } from "@/components/JobMatchCard";

const ML_BASE_URL =
  process.env.NEXT_PUBLIC_ML_SERVICE_URL || "http://localhost:8001";

interface JobMatchResult {
  match_percentage?: number;
  matched_skills?: string[];
  missing_skills?: string[];
  recommendations?: string[];
}

interface AnalysisResult {
  ats_score?: number;
  skills?: string[];
  sections?: Record<string, boolean>;
  education?: unknown;
  experience?: unknown;
  projects?: unknown;
  readability?: number;
  keyword_score?: number;
  structure_score?: number;
  missing_keywords?: string[];
  feedback?: string[];
  job_match?: JobMatchResult;
}

interface ExtractResponse {
  filename: string;
  text: string;
}

export default function ResumeAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [rawTextPreview, setRawTextPreview] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");

  const skillCount = useMemo(() => analysis?.skills?.length || 0, [analysis]);
  const atsScore = useMemo(
    () => (analysis?.ats_score !== undefined ? analysis.ats_score : null),
    [analysis]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setStatus("");
    setAnalysis(null);
    setRawTextPreview("");
    const selected = event.target.files?.[0];
    if (!selected) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(selected.type)) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }

    setFile(selected);
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Please choose a resume first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setStatus("Extracting text...");
    setAnalysis(null);
    setRawTextPreview("");

    try {
      // Step 1: Extract text
      const formData = new FormData();
      formData.append("file", file);

      const extractRes = await fetch(`${ML_BASE_URL}/resume/extract-text`, {
        method: "POST",
        body: formData,
      });

      if (!extractRes.ok) {
        const body = await extractRes.json().catch(() => ({}));
        throw new Error(body.detail || "Failed to extract text from resume.");
      }

      const extractData: ExtractResponse = await extractRes.json();
      setRawTextPreview(extractData.text.slice(0, 800));

      setStatus("Analyzing resume...");

      // Step 2: Analyze content
      const analyzeRes = await fetch(`${ML_BASE_URL}/resume/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: extractData.text }),
      });

      if (!analyzeRes.ok) {
        const body = await analyzeRes.json().catch(() => ({}));
        throw new Error(body.detail || "Failed to analyze resume.");
      }

      const analyzeData: AnalysisResult = await analyzeRes.json();

      setAnalysis(analyzeData);
      setStatus("Analysis complete");

      if (jobDescription.trim().length > 0) {
        setStatus("Matching resume with job description...");

        const jobMatchRes = await fetch(
          `${ML_BASE_URL}/resume/job-match`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resume_analysis: analyzeData,
              job_description: jobDescription,
            }),
          }
        );

        if (jobMatchRes.ok) {
          const jobMatchData = await jobMatchRes.json();

          analyzeData.job_match = {
            match_percentage: jobMatchData.job_fit_score,
            matched_skills: jobMatchData.matched_skills,
            missing_skills: jobMatchData.missing_skills,
            recommendations: jobMatchData.job_feedback,
          };
        }
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      setStatus("");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSkills = () => {
    if (analysis?.skills && analysis.skills.length > 0) {
      return (
        <div className="flex flex-wrap gap-2">
          {analysis.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
            >
              {skill}
            </span>
          ))}
        </div>
      );
    }
    return <p className="text-sm text-zinc-500">No skills returned by the service.</p>;
  };

  const renderSections = () => {
    if (!analysis?.sections) return null;
    const entries = Object.entries(analysis.sections);
    if (!entries.length) return null;
    return (
      <div className="grid grid-cols-2 gap-3">
        {entries.map(([key, present]) => (
          <div
            key={key}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${present ? "bg-emerald-500" : "bg-zinc-400"}`}
            />
            <span className="capitalize text-zinc-800 dark:text-zinc-100">{key}</span>
            <span className="ml-auto text-xs text-zinc-500">
              {present ? "Present" : "Missing"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderFeedback = () => {
    const feedbackList = analysis?.feedback || analysis?.missing_keywords || [];
    if (!feedbackList.length) {
      return <p className="text-sm text-zinc-500">No feedback provided by the service.</p>;
    }
    return (
      <ul className="space-y-2 text-sm text-zinc-800 dark:text-zinc-100">
        {feedbackList.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderScoreBar = () => {
    if (atsScore === null) return <p className="text-sm text-zinc-500">ATS score not returned.</p>;
    const clamped = Math.max(0, Math.min(100, atsScore ?? 0));
    return (
      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
          <span>ATS Score</span>
          <span className="font-semibold text-zinc-900 dark:text-white">{clamped}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${clamped}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Higher ATS scores mean your resume is structured and keyword-aligned for typical screening systems.
        </p>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-32 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 py-10 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Resume Analysis
          </p>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Analyze your resume and view ATS insights
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Upload a PDF or DOCX file. We will extract the content, run ATS-style checks, and highlight skills.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-2">
                    Upload resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="block w-full cursor-pointer rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 shadow-sm transition hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                  {file && (
                    <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                      <div className="flex items-center justify-between gap-3">
                        <div className="truncate">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                          Ready
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={analyzeResume}
                  disabled={isLoading || !file}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500 transition-colors"
                >
                  {isLoading ? "Analyzing..." : "Analyze Resume"}
                </button>

                {status && (
                  <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                    {status}
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
                    {error}
                  </div>
                )}

                {rawTextPreview && (
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Extracted preview</p>
                    </div>
                    <div
                      className="max-h-48 overflow-y-auto rounded-lg border border-zinc-700 bg-black p-3 font-mono text-xs leading-relaxed text-zinc-200"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#52525b #27272a'
                      }}
                    >
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          width: 8px;
                        }
                        div::-webkit-scrollbar-track {
                          background: #27272a;
                          border-radius: 4px;
                        }
                        div::-webkit-scrollbar-thumb {
                          background: #52525b;
                          border-radius: 4px;
                        }
                        div::-webkit-scrollbar-thumb:hover {
                          background: #71717a;
                        }
                      `}</style>
                      <p className="whitespace-pre-wrap">
                        {rawTextPreview} {rawTextPreview.length >= 800 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-3">
                    Job Description (optional but recommended)
                  </label>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={6}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                  />

                  <p className="mt-1 text-xs text-zinc-500">
                    Used to compute resume ↔ job match insights.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">ATS Score</p>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Application Tracking Insights</h2>
                  </div>
                  <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                    {skillCount} skills detected
                  </div>
                </div>
                {isLoading ? renderLoading() : renderScoreBar()}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Skills</p>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Matched Skills</h3>
                    </div>
                  </div>
                  {isLoading ? renderLoading() : renderSkills()}
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Structure</p>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Section Coverage</h3>
                    </div>
                  </div>
                  {isLoading ? renderLoading() : renderSections() || (
                    <p className="text-sm text-zinc-500">Section details were not returned by the service.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Feedback</p>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Improvement Suggestions</h3>
                  </div>
                </div>
                {isLoading ? renderLoading() : renderFeedback()}
              </div>

              {!isLoading && !analysis && !error && (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                  <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                    No analysis yet
                  </p>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Upload a resume and run analysis to see ATS score, skills, and feedback here.
                  </p>
                </div>
              )}

              {!isLoading && analysis?.job_match && (
                <JobMatchCard data={analysis.job_match} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
