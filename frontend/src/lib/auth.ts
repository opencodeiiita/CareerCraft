import { apiRequest, ApiResponse } from "./api";

export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  jwtToken?: string;
}

export async function signup(
  username: string,
  email: string,
  password: string,
): Promise<ApiResponse<AuthResponse>> {
  const response = await fetch("http://localhost:5000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  if (data.data?.jwtToken) {
    localStorage.setItem("token", data.data.jwtToken);
    window.dispatchEvent(new Event("auth-change"));
  }

  return data;
}

export async function signin(
  email: string,
  password: string,
): Promise<ApiResponse<AuthResponse>> {
  const response = await apiRequest<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.data.jwtToken) {
    localStorage.setItem("token", response.data.jwtToken);
    window.dispatchEvent(new Event("auth-change"));
  }

  return response;
}

export async function getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
  const token = localStorage.getItem("token");
  return apiRequest<{ user: User }>("/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function logout(): void {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth-change"));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
