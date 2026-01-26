# Routing & Navigation

The application uses file-system based routing via Next.js App Router.

## Route Structure

### Public Routes
Any user can access these pages.
*   `/`: **Home** - Landing page with hero section and features.
*   `/about`: **About** - Project information.
*   `/signin`: **Sign In** - User login form.
*   `/signup`: **Sign Up** - New user registration.
*   `/resume-analysis`: **Resume Analysis** - Public tool (Instant analysis, no login required for basic usage).

### Protected Routes
Requires `isLoggedIn` state.
*   `/resume-upload`: **My Resumes** - Dashboard to manage uploaded files.
*   `/cover-letter`: **Get Cover Letter** - Tool to generate cover letters.
*   `/my-cover-letters`: **Saved Cover Letters** - Archive of generated letters.
*   `/[username]`: **Profile** - User profile settings (Owner only access).

## Route Protection

Route protection is currently handled **Client-Side** within components and the Navbar.
*   **Navbar**: Conditionally renders links based on `isAuthenticated()`.
*   **Page-Level**: Protected pages check `isAuthenticated()` on mount and redirect to `/signin` if false.

## Navigation Flow
1.  **Guest**: Lands on Home -> Tries "Get Cover Letter" -> Redirected to Sign In -> Authenticates -> Redirected to Cover Letter Tool.
2.  **User**: Logs in -> Dasboard/Home -> Navigates to "My Resumes" -> Uploads File -> Views History.
