'use client';

import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Resume {
  filename: string;
  uploadedAt: string;
  url: string;
  size?: number;
  mimetype?: string;
  _id?: string;
}

interface ResumeCardProps {
  resume: Resume;
  onDelete?: (id: string) => void;
  onDeleteClick?: (id: string, filename: string) => void;
}

export default function ResumeCard({ resume, onDelete, onDeleteClick }: ResumeCardProps) {
  const { filename, uploadedAt, url, mimetype } = resume;
  const [isDeleting, setIsDeleting] = useState(false);

  const uploadedDate = uploadedAt ? new Date(uploadedAt) : null;
  const niceDate = uploadedDate ? uploadedDate.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  const getFileType = () => {
    if (mimetype?.includes('pdf')) return 'PDF';
    if (mimetype?.includes('word') || mimetype?.includes('doc')) return 'DOC';
    if (mimetype?.includes('image')) return 'IMG';
    return 'FILE';
  };

  const isImage = mimetype?.startsWith('image/');
  const isPDF = mimetype?.includes('pdf');

  const handleDelete = async () => {
    if (onDeleteClick && resume._id) {
      onDeleteClick(resume._id, filename);
      return;
    }

    if (!confirm('Are you sure you want to delete this resume?')) return;

    setIsDeleting(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await axios.delete(`${apiBase}/resumes/${resume._id}`);

      // Notify parent component to refresh the list
      if (onDelete && resume._id) {
        onDelete(resume._id);
      }

      // Dispatch event to refresh resume history
      window.dispatchEvent(new CustomEvent('resumesUpdated'));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete resume. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl bg-white dark:bg-zinc-950 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      {/* Preview Section */}
      <div className="mb-6">
        {isImage ? (
          <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden">
            <img
              src={url}
              alt={filename}
              className="w-full h-full object-cover"
            />
          </div>
        ) : isPDF ? (
          <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden">
            <iframe
              src={url}
              className="w-full h-full"
              title={`PDF preview of ${filename}`}
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-2xl">
                {getFileType()}
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Document preview not available
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-lg">
          {getFileType()}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900 dark:text-white text-lg mb-1 truncate">
            {filename}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">
            Uploaded {niceDate}
          </p>
          {resume.size && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              {(resume.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mt-6">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-center text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors no-underline flex items-center justify-center gap-1"
        >
          <FontAwesomeIcon icon={faEye} className="text-sm" />
          View
        </a>
        <button
          onClick={() => {
            // Create download link with proper Cloudinary parameters
            const downloadUrl = url.replace('/upload/', '/upload/fl_attachment/') + '?_i=1';
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-center text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
        >
          <FontAwesomeIcon icon={faDownload} className="text-sm" />
          Download
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FontAwesomeIcon icon={faTrash} className="text-sm" />
          {isDeleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
