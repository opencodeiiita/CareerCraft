# Backend Overview

The CareerCraft backend is built with **Node.js** and **Express**, serving as the persistent layer for the application. It handles user authentication, data storage (MongoDB), and file management (Cloudinary).

## Purpose
*   **Authentication**: Secure user signup, login, and session management via JWT.
*   **Persistence**: Storing user profiles, resumes, and generated cover letters.
*   **Orchestration**: Managing file uploads and coordinating with the Frontend.

## Architecture

The backend follows a standard **MVC (Model-View-Controller)** pattern:

*   **Models**: Mongoose schemas defining data structure (`src/models`).
*   **Controllers**: Business logic handling requests and responses (`src/controllers`).
*   **Routes**: API endpoint definitions mapping URLs to controllers (`src/routes`).
*   **Middleware**: Interceptors for Authentication (`verifyJWT`) and File Uploads (`multer`).

## Tech Stack
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Storage**: Cloudinary (for Resumes)
*   **Auth**: JSON Web Tokens (JWT) + Bcrypt
*   **Rate Limiting**: `express-rate-limit` + Redis (Abuse Protection)
*   **Validation**: Zod (implied) / Manual checks

## Middleware
*   **Security**: `helmet`, `cors`
*   **Rate Limiter**: Global, Auth, and Service-specific limiters.
*   **Auth**: `verifyJWT` (Bearer Token)
*   **File Handling**: `multer` (Multipart uploads)

## Key Directories
*   `src/app.js`: Application setup (Middleware, CORS, Routes).
*   `src/server.js`: Entry point, DB connection, Server start.
*   `src/routes/`: Route definitions.
*   `src/controllers/`: Request handlers.
*   `src/models/`: Database schemas.
