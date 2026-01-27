export type BlogCategory =
  | "Interview Experience"
  | "First Internship"
  | "First Job"
  | "Career Transition"
  | "Resume Guide";

export interface Blog {
  id: string;
  title: string;
  description: string;
  category: BlogCategory;
  image?: string;
}

export const BLOG_CATEGORIES: {
  label: string;
  value: BlogCategory;
  icon: string;
}[] = [
  { label: "Interview Experience", value: "Interview Experience", icon: "🎤" },
  { label: "First Internship", value: "First Internship", icon: "🧑‍💼" },
  { label: "First Job", value: "First Job", icon: "💼" },
  { label: "Career Transition", value: "Career Transition", icon: "🔄" },
  { label: "Resume Guide", value: "Resume Guide", icon: "📄" },
];

export const BLOGS: Blog[] = [
  {
    id: "1",
    title: "My Google Interview Experience",
    description:
      "A detailed account of my technical and HR interviews at Google, with tips for each round.",
    category: "Interview Experience",
  },
  {
    id: "2",
    title: "How I Landed My First Internship",
    description:
      "Sharing my journey from applying to getting my first internship, and what I learned.",
    category: "First Internship",
  },
  {
    id: "3",
    title: "From College to My First Job Offer",
    description:
      "Steps I took to secure my first job after graduation, including resume and networking advice.",
    category: "First Job",
  },
  {
    id: "4",
    title: "Switching from Engineering to Product Management",
    description:
      "Why and how I made a successful career transition, and what challenges I faced.",
    category: "Career Transition",
  },
  {
    id: "5",
    title: "Resume Building: Dos and Don'ts",
    description:
      "A practical guide to optimizing your resume for tech roles, with real examples.",
    category: "Resume Guide",
  },
];
