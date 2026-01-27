# API Documentation

Base URL: `http://localhost:5000/api`

## Rate Limiting

To ensure strict abuse protection, the API implements the following limits:

| Scope | Limit | Window | Affected Routes |
| :--- | :--- | :--- | :--- |
| **Global** | 100 req | 15 min | All endpoints |
| **Auth** | 10 req | 15 min | `/auth/signup`, `/auth/signin` |
| **ML Service** | 20 req | 60 min | `/resumes/upload`, `/cover-letters/generate` |

**Response Headers**:
*   `RateLimit-Limit`: Maximum requests allowed.
*   `RateLimit-Remaining`: Requests remaining in current window.
*   `RateLimit-Reset`: Time (seconds) until window resets.

**Error Response (429 Too Many Requests)**:
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

## Authentication

### Sign Up
*   **Endpoint**: `POST /auth/signup`
*   **Body**: `username`, `email`, `password`
*   **Response**: User object + JWT Token

### Sign In
*   **Endpoint**: `POST /auth/signin`
*   **Body**: `email`, `password`
*   **Response**: User object + JWT Token (Set as Cookie)

### Get Current User
*   **Endpoint**: `GET /auth/me`
*   **Headers**: `Authorization: Bearer <token>`
*   **Response**: User profile details

---

## Resumes

### Upload Resume
*   **Endpoint**: `POST /resumes/upload`
*   **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
*   **Body**: `resume` (File - PDF/DOCX)
*   **Response**: Resume metadata (Cloudinary URL)

### Get My Resumes
*   **Endpoint**: `GET /resumes`
*   **Response**: List of uploaded resumes

### Delete Resume
*   **Endpoint**: `DELETE /resumes/:id`
*   **Response**: Success message

---

## Cover Letters

### Save Cover Letter
*   **Endpoint**: `POST /cover-letters`
*   **Body**:
    ```json
    {
      "companyName": "Google",
      "jobTitle": "Frontend Dev",
      "jobDescription": "Text...",
      "tone": "confident",
      "coverLetter": { "greeting": "...", "body": ["..."], "closing": "..." }
    }
    ```
*   **Response**: Saved Cover Letter object

### Get All Cover Letters
*   **Endpoint**: `GET /cover-letters`
*   **Response**: List of saved cover letters

---

## Profile

### Get Profile
*   **Endpoint**: `GET /profile/:username`
*   **Response**: Public profile details (Resumes, Skills, Links)

### Update Profile
*   **Endpoint**: `PUT /profile/update`
*   **Body**: `address`, `city`, `github`, `leetcode`, etc.
*   **Response**: Updated User object
