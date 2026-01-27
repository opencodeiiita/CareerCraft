"use client";
import React, { useState } from "react";
import BlogCard from "./BlogCard";
import { BLOGS, BLOG_CATEGORIES, BlogCategory } from "./data";

export default function BlogsPage() {
  const [selected, setSelected] = useState<BlogCategory | "All">("All");
  const filtered =
    selected === "All" ? BLOGS : BLOGS.filter((b) => b.category === selected);

  return (
    <main className="min-h-screen py-8 px-4 md:px-12 lg:px-24 bg-background text-foreground">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Career Blogs & Experience Stories
      </h1>
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${selected === "All" ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:text-white" : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700"}`}
          onClick={() => setSelected("All")}
        >
          All
        </button>
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-1 ${selected === cat.value ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:text-white" : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700"}`}
            onClick={() => setSelected(cat.value)}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            No blogs found for this category.
          </div>
        ) : (
          filtered.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        )}
      </div>
    </main>
  );
}
