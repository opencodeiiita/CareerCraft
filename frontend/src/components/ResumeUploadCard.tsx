'use client';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface UploadedResume {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
}

export default function ResumeUploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [uploadedResume, setUploadedResume] = useState<UploadedResume | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    setUploadedResume(null);
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type)) {
      setError('Please upload correct format: PDF or MS Word files only.');
      return;
    }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Choose a file first.');
      return;
    }
    setStatus('Uploading...');
    setError('');

    console.log('🚀 Starting upload for file:', file.name);
    console.log('🚀 File size:', (file.size / 1024 / 1024).toFixed(2) + ' MB');
    console.log('🚀 File type:', file.type);
    console.log('🚀 API endpoint:', `${apiBase}/resumes/upload`);

    try {
      const form = new FormData();
      form.append('resume', file);

      console.log('📤 Creating FormData...');
      console.log('📤 FormData entries:');
      for (let pair of form.entries()) {
        console.log('  -', pair[0], ':', pair[1]);
      }

      console.log('📡 Sending request to:', `${apiBase}/resumes/upload`);
      console.log('📡 Request method: POST');
      console.log('📡 Request headers: Content-Type: multipart/form-data');

      // Create a timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('⏰ Request aborted due to timeout');
      }, 120000); // 2 minutes

      // Get auth token for user association
      const token = localStorage.getItem('token');

      // Use axios instead of fetch
      const response = await axios.post(`${apiBase}/resumes/upload`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
        timeout: 120000, // 120 seconds timeout for Cloudinary
        withCredentials: false, // Set to true if you need credentials
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`📊 Upload progress: ${progress}% (${progressEvent.loaded}/${progressEvent.total} bytes)`);
          }
        }
      });

      clearTimeout(timeoutId);

      console.log('📡 Response received!');
      console.log('📡 Response status:', response.status);
      console.log('📡 Response status text:', response.statusText);
      console.log('📡 Response headers:', response.headers);
      console.log('📡 Response data:', response.data);

      const body = response.data;

      if (!body.success) {
        const msg = body?.message || JSON.stringify(body);
        console.error('❌ Upload failed:', msg);
        setError('Upload failed: ' + msg);
        setStatus('');
        return;
      }

      console.log('✅ Upload successful!');
      console.log('✅ Resume data:', body.resume);
      setUploadedResume(body.resume);
      setFile(null);
      setStatus('Upload successful!');

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setStatus('');
      }, 3000);

      // Dispatch event to refresh resume history
      window.dispatchEvent(new CustomEvent('resumesUpdated'));
    } catch (err) {
      console.error('❌ Upload error:', err);
      console.error('❌ Error type:', err.constructor.name);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error code:', err.code);

      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          console.error('❌ Request was aborted');
          setError('Upload was cancelled or timed out.');
        } else if (err.response) {
          // Server responded with error status
          const status = err.response.status;
          const data = err.response.data;
          console.error('❌ Server error:', status, data);
          console.error('❌ Server error headers:', err.response.headers);
          setError(`Server error (${status}): ${data?.message || 'Unknown error'}`);
        } else if (err.request) {
          // Request was made but no response received
          console.error('❌ No response received:', err.request);
          console.error('❌ Request details:', {
            method: err.request?.method,
            url: err.request?.url,
            status: err.request?.status,
            statusText: err.request?.statusText
          });
          setError('No response from server. Please check your connection.');
        } else {
          // Something else happened
          console.error('❌ Request error:', err.message);
          setError('Upload error: ' + err.message);
        }
      } else {
        console.error('❌ Non-Axios error:', err);
        setError('Upload error: ' + (err as Error).message);
      }
      setStatus('');
    }
  };

  const handleReset = () => {
    setFile(null);
    setError('');
    setStatus('');
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-950 shadow-sm">
      <div className="mb-6">
        <label className="block mb-3 font-semibold text-zinc-900 dark:text-white">
          Upload Resume
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-zinc-500 dark:text-zinc-400
              file:mr-4 file:py-2.5 file:px-4 file:rounded-lg
              file:border-0 file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/20 dark:file:text-blue-300
              hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30
              file:cursor-pointer file:transition-colors
              cursor-pointer"
          />
          {file && (
            <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm">
                  {file.type.includes('pdf') ? '📄' : '📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!file || status === 'Uploading...'}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium 
            hover:bg-blue-700 transition-colors disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed
            dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
        >
          {status === 'Uploading...' ? 'Uploading...' : 'Upload'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 
            bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 font-medium
            hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {status && status !== 'Uploading...' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-green-700 dark:text-green-300 text-sm font-medium">
              {status}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-red-700 dark:text-red-300 text-sm font-medium">
              {error}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
