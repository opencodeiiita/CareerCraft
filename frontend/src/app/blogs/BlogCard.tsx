import React from "react";
import { Blog, BlogCategory } from "./data";

interface BlogCardProps {
  blog: Blog;
  onReadMore?: (id: string) => void;
}

const categoryColors: Record<BlogCategory, string> = {
  "Interview Experience":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "First Internship":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "First Job":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Career Transition":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Resume Guide":
    "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
};

export default function BlogCard({ blog, onReadMore }: BlogCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm p-5 flex flex-col h-full transition hover:shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${categoryColors[blog.category]}`}
        >
          {blog.category}
        </span>
      </div>
      <h2 className="text-lg font-bold mb-1 line-clamp-2">{blog.title}</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-3">
        {blog.description}
      </p>
      <button
        className="mt-auto self-start text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
        onClick={() => onReadMore?.(blog.id)}
        aria-label={`Read more about ${blog.title}`}
      >
        Read more
      </button>
    </div>
  );
}
