/**
 * Auth API Service
 * Replaces Supabase Auth with Lucia Auth
 */

import { apiClient } from "../client";

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
}

export interface AuthResponse {
  user: User;
  session: Session;
  token: string;
}

export const authApi = {
  async signUp(email: string, password: string, username: string) {
    return apiClient.post<AuthResponse>("/auth/signup", {
      email,
      password,
      username,
    });
  },

  async signIn(email: string, password: string) {
    return apiClient.post<AuthResponse>("/auth/signin", {
      email,
      password,
    });
  },

  async signOut() {
    return apiClient.post("/auth/signout", {});
  },

  async getSession() {
    return apiClient.get<{ session: Session | null; user: User | null }>(
      "/auth/session"
    );
  },

  async signInWithGoogle() {
    const { data, error } = await apiClient.get<{ url: string }>(
      "/auth/google"
    );
    if (error) return { data: null, error };
    if (data?.url) {
      window.location.href = data.url;
    }
    return { data, error };
  },

  async handleOAuthCallback(code: string, state: string) {
    return apiClient.post<AuthResponse>("/auth/callback", { code, state });
  },

  async resetPassword(email: string) {
    return apiClient.post("/auth/reset-password", { email });
  },

  async updatePassword(newPassword: string) {
    return apiClient.post("/auth/update-password", { newPassword });
  },
};
