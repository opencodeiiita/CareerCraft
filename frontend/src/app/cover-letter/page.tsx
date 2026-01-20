'use client';

import { useState, useRef, useEffect } from 'react';
import { analyzeResume, generateCoverLetter, uploadResume, ResumeAnalysisResponse, CoverLetterResponse } from '@/lib/coverLetter';
import { isAuthenticated } from '@/lib/auth';
import { saveCoverLetter } from '@/lib/coverLetterApi';

interface JobDetails {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  tone: 'formal' | 'confident' | 'friendly';
}

export default function CoverLetterPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResponse | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    tone: 'formal'
  });
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<CoverLetterResponse | null>(null);
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string>('');

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleSaveCoverLetter = async () => {
    if (!generatedCoverLetter || isSaved) return;

    setSaveLoading(true);
    setError('');
    setSaveSuccess('');

    try {
      await saveCoverLetter({
        companyName: generatedCoverLetter.company_name,
        jobTitle: generatedCoverLetter.job_title,
        jobDescription: jobDetails.jobDescription,
        tone: jobDetails.tone,
        coverLetter: {
          greeting: generatedCoverLetter.cover_letter.greeting,
          body: generatedCoverLetter.cover_letter.body,
          closing: generatedCoverLetter.cover_letter.closing,
          signOff: generatedCoverLetter.cover_letter.sign_off,
          candidateName: generatedCoverLetter.cover_letter.candidate_name,
        },
      });
      setIsSaved(true);
      setSaveSuccess('Cover letter saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save cover letter');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.includes('document')) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    setResumeFile(file);
    setError('');
    setLoading('Extracting text from resume...');

    try {
      const result = await uploadResume(file);
      setResumeText(result.text);
      setLoading('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract text from resume');
      setLoading('');
    }
  };

  const handleResumeAnalysis = async () => {
    if (!resumeText.trim()) {
      setError('Please upload a resume first');
      return;
    }

    setLoading('Analyzing resume...');
    setError('');

    try {
      const analysis = await analyzeResume(resumeText);
      setResumeAnalysis(analysis);
      setLoading('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
      setLoading('');
    }
  };

  const handleCoverLetterGeneration = async () => {
    if (!resumeAnalysis) {
      setError('Please analyze your resume first');
      return;
    }

    if (!jobDetails.companyName || !jobDetails.jobTitle || !jobDetails.jobDescription) {
      setError('Please fill in all job details');
      return;
    }

    setLoading('Generating cover letter...');
    setError('');

    try {
      const coverLetter = await generateCoverLetter({
        resume_analysis: resumeAnalysis,
        job_info: {
          company_name: jobDetails.companyName,
          job_title: jobDetails.jobTitle,
          job_description: jobDetails.jobDescription,
        },
        tone: jobDetails.tone
      });
      setGeneratedCoverLetter(coverLetter);
      setLoading('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter');
      setLoading('');
    }
  };

  const formatCoverLetter = (coverLetter) => {
    return `${coverLetter.greeting}

${coverLetter.body.join('\n\n')}

${coverLetter.closing}

${coverLetter.sign_off}`;
  };

  const handleDownloadPDF = async () => {
    if (!generatedCoverLetter) return;

    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      const formattedLetter = formatCoverLetter(generatedCoverLetter.cover_letter);
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Cover Letter - ${jobDetails.companyName}</title>
          <style>
            @page {
              margin: 1in;
              size: letter;
            }
            body {
              font-family: 'Georgia', serif;
              line-height: 1.6;
              color: #333;
              max-width: 100%;
              margin: 0;
              padding: 20px;
            }
            .letter-content {
              white-space: pre-wrap;
              font-size: 12pt;
              text-align: left;
            }
            .header {
              text-align: center;
              margin-bottom: 2rem;
              border-bottom: 1px solid #ccc;
              padding-bottom: 1rem;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Cover Letter</h2>
            <p>${jobDetails.companyName} - ${jobDetails.jobTitle}</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="letter-content">${formattedLetter}</div>
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (err) {
      setError('Failed to generate PDF for download');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Cover Letter Generator
          </p>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Create personalized cover letters that match your experience
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Upload your resume, provide job details, and generate a tailored cover letter in seconds
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-6 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
            {loading}
          </div>
        )}

        {saveSuccess && (
          <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-200">
            {saveSuccess}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Resume Upload Only */}
          <div className="space-y-6">
            {/* Resume Upload */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-white">
                Upload Resume
              </h2>

              <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors dark:border-zinc-700">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <p className="text-zinc-600 dark:text-zinc-300 mb-2">
                  Drop your resume here or click to browse
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  PDF, DOC, DOCX (Max 5MB)
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Select File
                </button>
              </div>

              {resumeFile && (
                <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  <p className="font-medium">✅ {resumeFile.name} uploaded successfully</p>
                </div>
              )}

              <button
                onClick={handleResumeAnalysis}
                disabled={!resumeText || loading !== ''}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
              >
                {loading === 'Analyzing resume...' ? (
                  <>Analyzing...</>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Job Details Only */}
          <div className="space-y-6">
            {/* Job Details */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-white">
                Job Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={jobDetails.companyName}
                    onChange={(e) => setJobDetails({ ...jobDetails, companyName: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    placeholder="e.g., Microsoft"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={jobDetails.jobTitle}
                    onChange={(e) => setJobDetails({ ...jobDetails, jobTitle: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-1">Job Description</label>
                  <textarea
                    value={jobDetails.jobDescription}
                    onChange={(e) => setJobDetails({ ...jobDetails, jobDescription: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    rows={4}
                    placeholder="Paste job description here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-1">Tone</label>
                  <select
                    value={jobDetails.tone}
                    onChange={(e) => setJobDetails({ ...jobDetails, tone: e.target.value as 'formal' | 'confident' | 'friendly' })}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    <option value="formal">Formal</option>
                    <option value="confident">Confident</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCoverLetterGeneration}
                disabled={!resumeAnalysis || !jobDetails.companyName || !jobDetails.jobTitle || loading !== ''}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
              >
                {loading === 'Generating cover letter...' ? (
                  <>Generating...</>
                ) : (
                  'Generate Cover Letter'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Full Width Results Section */}
        <div className="mt-8 space-y-8">
          {/* Resume Analysis Results - Full Width */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-white">
              Resume Analysis
            </h2>

            {resumeAnalysis ? (
              <div className="space-y-4">
                {resumeAnalysis.personal_info && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Personal Information</h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{resumeAnalysis.personal_info.name || 'N/A'} • {resumeAnalysis.personal_info.email || 'N/A'}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Skills ({resumeAnalysis.skills?.length || 0})</h3>
                  <div className="flex flex-wrap gap-2">
                    {(resumeAnalysis.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Experience ({resumeAnalysis.experience?.length || 0})</h3>
                  <div className="space-y-2">
                    {(resumeAnalysis.experience || []).map((exp, index) => (
                      <div key={index} className="text-sm text-zinc-700 dark:text-zinc-300">
                        <p className="font-medium">{exp.position || 'Position'} at {exp.company || 'Company'}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{exp.duration || ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400">Upload and analyze your resume to see results here</p>
              </div>
            )}
          </div>

          {/* Generated Cover Letter - Full Width */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                Generated Cover Letter
              </h2>
              {generatedCoverLetter && (
                <div className="flex items-center gap-3">
                  {isLoggedIn && (
                    <button
                      onClick={handleSaveCoverLetter}
                      disabled={isSaved || saveLoading}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isSaved
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60'
                        }`}
                    >
                      {saveLoading ? 'Saving...' : isSaved ? '✓ Saved' : 'Save Cover Letter'}
                    </button>
                  )}
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
              )}
            </div>

            {generatedCoverLetter ? (
              <>
                <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="max-w-4xl mx-auto">
                    {/* Letter Header */}
                    <div className="mb-8 text-right">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Recipient Info */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Hiring Manager</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{generatedCoverLetter.company_name}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{generatedCoverLetter.company_name} Headquarters</p>
                    </div>

                    {/* Greeting */}
                    <div className="mb-6">
                      <p className="text-zinc-800 dark:text-zinc-200 font-medium">
                        {generatedCoverLetter.cover_letter.greeting}
                      </p>
                    </div>

                    {/* Letter Body */}
                    <div className="mb-6 space-y-4">
                      {generatedCoverLetter.cover_letter.body.map((paragraph, index) => (
                        <p key={index} className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Closing */}
                    <div className="mb-6">
                      <p className="text-zinc-800 dark:text-zinc-200 font-medium">
                        {generatedCoverLetter.cover_letter.closing}
                      </p>
                    </div>

                    {/* Signature */}
                    <div className="mt-12">
                      <p className="text-zinc-800 dark:text-zinc-200 font-medium">
                        {generatedCoverLetter.cover_letter.sign_off}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <p>Company: {generatedCoverLetter.company_name}</p>
                  <p>Job Title: {generatedCoverLetter.job_title}</p>
                  <p>Tone: {generatedCoverLetter.tone}</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400">Generate a cover letter to see results here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
