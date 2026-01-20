'use client';

import { useState } from 'react';
import { SavedCoverLetter } from '@/lib/coverLetterApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

interface CoverLetterCardProps {
    letter: SavedCoverLetter;
    onDelete?: (id: string) => void;
    onDownload?: (letter: SavedCoverLetter) => void;
}

export default function CoverLetterCard({ letter, onDelete, onDownload }: CoverLetterCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleDelete = async () => {
        if (onDelete) {
            setIsDeleting(true);
            await onDelete(letter._id);
            setIsDeleting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            {/* Card Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                    {letter.companyName}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                    {letter.jobTitle}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    {formatDate(letter.createdAt)}
                </p>
            </div>

            {/* Preview Area */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 flex-1 overflow-hidden min-h-[120px]">
                <div className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-6 whitespace-pre-line">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                        {letter.coverLetter.greeting}
                    </span>
                    {letter.coverLetter.body[0]?.substring(0, 200)}...
                </div>
            </div>

            {/* Card Actions */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                {onDownload && (
                    <button
                        onClick={() => onDownload(letter)}
                        className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <FontAwesomeIcon icon={faDownload} className="text-sm" />
                        Download
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50 flex items-center justify-center gap-2"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        {isDeleting ? '...' : 'Delete'}
                    </button>
                )}
            </div>
        </div>
    );
}
