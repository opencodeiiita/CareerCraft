'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import { getMyCoverLetters, deleteCoverLetter, SavedCoverLetter } from '@/lib/coverLetterApi';
import CoverLetterCard from '@/components/CoverLetterCard';

export default function MyCoverLettersPage() {
    const router = useRouter();
    const [coverLetters, setCoverLetters] = useState<SavedCoverLetter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push('/signin');
            return;
        }

        fetchCoverLetters();
    }, [router]);

    const fetchCoverLetters = async () => {
        try {
            setLoading(true);
            const letters = await getMyCoverLetters();
            setCoverLetters(letters);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch cover letters');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this cover letter?')) return;

        setDeletingId(id);
        try {
            await deleteCoverLetter(id);
            setCoverLetters((prev) => prev.filter((cl) => cl._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete cover letter');
        } finally {
            setDeletingId(null);
        }
    };

    const formatCoverLetter = (coverLetter: SavedCoverLetter['coverLetter']) => {
        return `${coverLetter.greeting}\n\n${coverLetter.body.join('\n\n')}\n\n${coverLetter.closing}\n\n${coverLetter.signOff}`;
    };

    const handleDownloadPDF = (letter: SavedCoverLetter) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            setError('Failed to open print window');
            return;
        }

        const formattedLetter = formatCoverLetter(letter.coverLetter);
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cover Letter - ${letter.companyName}</title>
        <style>
          @page { margin: 1in; size: letter; }
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
          <p>${letter.companyName} - ${letter.jobTitle}</p>
          <p>Generated on ${new Date(letter.createdAt).toLocaleDateString()}</p>
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
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 py-10 dark:bg-black">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading your cover letters...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-10 dark:bg-black">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-2">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        My Cover Letters
                    </p>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        Your Saved Cover Letters
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        View, download, or manage your previously generated cover letters
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
                        {error}
                    </div>
                )}

                {coverLetters.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                            No cover letters yet
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            Generate and save your first cover letter to see it here.
                        </p>
                        <Link
                            href="/cover-letter"
                            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
                        >
                            Generate Cover Letter
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {coverLetters.map((letter) => (
                            <CoverLetterCard
                                key={letter._id}
                                letter={letter}
                                onDelete={handleDelete}
                                onDownload={handleDownloadPDF}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link
                        href="/cover-letter"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Generate a new cover letter
                    </Link>
                </div>
            </div>
        </div>
    );
}
