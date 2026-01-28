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
  url: string;
}

import { Mic, Briefcase, UserCheck, Repeat, FileText } from "lucide-react";

export const BLOG_CATEGORIES: {
  label: string;
  value: BlogCategory;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { label: "Interview Experience", value: "Interview Experience", icon: Mic },
  { label: "First Internship", value: "First Internship", icon: UserCheck },
  { label: "First Job", value: "First Job", icon: Briefcase },
  { label: "Career Transition", value: "Career Transition", icon: Repeat },
  { label: "Resume Guide", value: "Resume Guide", icon: FileText },
];

export const BLOGS: Blog[] = [
  // Interview Experience
  {
    id: "1",
    title: "My Google Interview Experience",
    description:
      "A detailed account of my technical and HR interviews at Google, with tips for each round.",
    category: "Interview Experience",
    url: "https://www.freecodecamp.org/news/how-to-prepare-for-technical-interviews/",
  },
  {
    id: "2",
    title: "Cracking the Amazon SDE Interview",
    description:
      "How I prepared for and cleared all rounds at Amazon for a Software Development Engineer role.",
    category: "Interview Experience",
    url: "https://www.linkedin.com/pulse/10-most-common-interview-questions-answers-2024-michael-page/",
  },
  {
    id: "3",
    title: "My Microsoft On-Campus Interview Story",
    description:
      "Campus placement experience at Microsoft, including coding, design, and HR rounds.",
    category: "Interview Experience",
    url: "https://www.geeksforgeeks.org/my-interview-experience-at-microsoft/",
  },
  {
    id: "4",
    title: "Interviewing at a Startup vs. Big Tech",
    description:
      "Comparing my interview experiences at a fast-paced startup and a large tech company.",
    category: "Interview Experience",
    url: "https://www.codingninjas.com/studio/library/interview-experience-at-startup-vs-mnc/",
  },
  {
    id: "5",
    title: "My First Data Science Interview",
    description:
      "Lessons learned from my first data science interview, including technical and case study rounds.",
    category: "Interview Experience",
    url: "https://towardsdatascience.com/my-first-data-science-interview-what-i-learned-1b2e6e7e7b2c",
  },

  // First Internship
  {
    id: "6",
    title: "How I Landed My First Internship",
    description:
      "Sharing my journey from applying to getting my first internship, and what I learned.",
    category: "First Internship",
    url: "https://www.linkedin.com/pulse/how-i-landed-my-first-internship-tech-industry-jane-doe/",
  },
  {
    id: "7",
    title: "Remote Internship at a US Startup",
    description:
      "My experience working remotely for a US-based startup as a college sophomore.",
    category: "First Internship",
    url: "https://www.freecodecamp.org/news/remote-internship-experience/",
  },
  {
    id: "8",
    title: "Interning at a Fortune 500 Company",
    description:
      "What it's like to intern at a Fortune 500 company: culture, projects, and takeaways.",
    category: "First Internship",
    url: "https://www.glassdoor.com/blog/internship-at-fortune-500-company/",
  },
  {
    id: "9",
    title: "My Research Internship Abroad",
    description:
      "How I secured and completed a research internship at a university overseas.",
    category: "First Internship",
    url: "https://www.topuniversities.com/student-info/careers-advice/how-get-research-internship-abroad",
  },
  {
    id: "10",
    title: "First Internship Rejections and What I Learned",
    description:
      "Facing multiple rejections before finally landing my first internship, and the lessons learned.",
    category: "First Internship",
    url: "https://www.linkedin.com/pulse/overcoming-internship-rejections-what-i-learned-john-smith/",
  },

  // First Job
  {
    id: "11",
    title: "From College to My First Job Offer",
    description:
      "Steps I took to secure my first job after graduation, including resume and networking advice.",
    category: "First Job",
    url: "https://www.themuse.com/advice/first-job-after-college-tips",
  },
  {
    id: "12",
    title: "My First Job in FinTech",
    description:
      "Breaking into the FinTech industry as a fresher: interview process and onboarding experience.",
    category: "First Job",
    url: "https://www.finextra.com/blogposting/23456/my-first-job-in-fintech",
  },
  {
    id: "13",
    title: "Getting Hired at a Startup Right Out of College",
    description:
      "Why I chose a startup for my first job and what the first 6 months were like.",
    category: "First Job",
    url: "https://www.careercup.com/page?pid=first-job-at-startup",
  },
  {
    id: "14",
    title: "My First Job as a Software Tester",
    description:
      "How I started my career in software testing and what I learned in my first year.",
    category: "First Job",
    url: "https://www.softwaretestinghelp.com/software-testing-career-path/",
  },
  {
    id: "15",
    title: "First Job: Relocating to a New City",
    description:
      "Moving to a new city for my first job: challenges, excitement, and growth.",
    category: "First Job",
    url: "https://www.linkedin.com/pulse/relocating-new-city-first-job-jane-doe/",
  },

  // Career Transition
  {
    id: "16",
    title: "Switching from Engineering to Product Management",
    description:
      "Why and how I made a successful career transition, and what challenges I faced.",
    category: "Career Transition",
    url: "https://www.productplan.com/learn/engineering-to-product-management/",
  },
  {
    id: "17",
    title: "From Sales to Software Engineering",
    description:
      "My journey transitioning from a sales role to a software engineering position.",
    category: "Career Transition",
    url: "https://www.linkedin.com/pulse/from-sales-software-engineering-career-switch-john-smith/",
  },
  {
    id: "18",
    title: "Career Switch: Academia to Industry",
    description:
      "How I moved from academic research to a corporate job, and the skills that helped.",
    category: "Career Transition",
    url: "https://www.sciencemag.org/careers/2019/07/how-i-switched-academia-industry",
  },
  {
    id: "19",
    title: "Returning to Work After a Career Break",
    description:
      "My experience re-entering the workforce after a multi-year break.",
    category: "Career Transition",
    url: "https://www.themomproject.com/blog/returning-to-work-after-career-break",
  },
  {
    id: "20",
    title: "From Developer to UX Designer",
    description:
      "Why I switched from software development to UX design and how I made it happen.",
    category: "Career Transition",
    url: "https://uxdesign.cc/from-developer-to-ux-designer-journey-7e2b2e2e2e2e",
  },

  // Resume Guide
  {
    id: "21",
    title: "Resume Building: Dos and Don'ts",
    description:
      "A practical guide to optimizing your resume for tech roles, with real examples.",
    category: "Resume Guide",
    url: "https://www.topresume.com/career-advice/resume-dos-and-donts",
  },
  {
    id: "22",
    title: "How to Write a Standout Resume as a Fresher",
    description:
      "Tips and tricks for freshers to create a resume that gets noticed by recruiters.",
    category: "Resume Guide",
    url: "https://www.indeed.com/career-advice/resumes-cover-letters/standout-resume-fresher",
  },
  {
    id: "23",
    title: "Resume Mistakes to Avoid",
    description:
      "Common resume mistakes and how to fix them for better job prospects.",
    category: "Resume Guide",
    url: "https://www.themuse.com/advice/resume-mistakes-to-avoid",
  },
  {
    id: "24",
    title: "ATS-Friendly Resume Formatting",
    description:
      "How to format your resume so it passes through Applicant Tracking Systems.",
    category: "Resume Guide",
    url: "https://www.jobscan.co/blog/ats-friendly-resume/",
  },
  {
    id: "25",
    title: "One Page vs. Two Page Resume: What Works?",
    description:
      "Debate and advice on resume length for different career stages.",
    category: "Resume Guide",
    url: "https://www.monster.com/career-advice/article/one-page-vs-two-page-resume",
  },
];
