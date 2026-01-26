# Frontend Overview

CareerCraft's frontend is a modern web application built with **Next.js 16**, designed for performance, SEO, and specific client-side interactivity.

## Purpose
*   **User Interface**: Responsive, accessible UI for job seekers.
*   **Orchestration**: Manages communication between the User, ML Service (Analysis), and Backend (Persistence).
*   **Authentication**: Handles user sessions via JWT and Context.

## Architecture

The application uses the **App Router** (`src/app`) structure:

*   **Pages**: React Server Components by default, with leafy Client Components.
*   **Layouts**: Global and nested layouts for persistent UI (Navbar/Footer).
*   **Components**: Atomic UI blocks (`src/components/`).
*   **Lib**: Utilities and API clients (`src/lib/`).

## Tech Stack
*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS 4
*   **Icons**: Lucide React + FontAwesome
*   **Theme**: `next-themes` (Dark/Light mode)
*   **State**: React Hooks (`useState`, `useEffect`)

## Key Directories
*   `src/app/`: Page routes.
*   `src/components/`: Reusable UI components (Navbar, Cards, Modals).
*   `src/lib/`: Helper functions (Auth, API calls).
*   `public/`: Static assets (Logos, Images).
