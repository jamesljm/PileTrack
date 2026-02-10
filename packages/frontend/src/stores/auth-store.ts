import { create } from "zustand";
import type { UserRole } from "@piletrack/shared";
import {
  getAccessToken,
  getTokenPayload,
  isTokenExpired,
  setTokens,
  clearTokens,
  refreshTokens,
} from "@/lib/auth";
import { api } from "@/lib/api-client";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const response = await api.post<{
      data: {
        tokens: { accessToken: string; refreshToken: string };
        user: AuthUser;
      };
    }>("/auth/login", { email, password });

    const { tokens, user } = response.data;
    setTokens(tokens.accessToken, tokens.refreshToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user: AuthUser) => {
    set({ user, isAuthenticated: true });
  },

  initialize: async () => {
    const token = getAccessToken();
    if (!token) {
      set({ isLoading: false });
      return;
    }

    if (isTokenExpired(token)) {
      const result = await refreshTokens();
      if (!result) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
    }

    const payload = getTokenPayload();
    if (!payload) {
      clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const response = await api.get<{
        data: AuthUser;
      }>("/auth/me");
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      // Only clear tokens on 401 (invalid/expired token)
      // For network errors (server restart, offline), keep tokens and use JWT payload
      if (error?.status === 401) {
        clearTokens();
        set({ user: null, isAuthenticated: false, isLoading: false });
      } else {
        // Use basic user info from JWT payload as fallback
        set({
          user: {
            id: payload.userId,
            email: payload.email,
            firstName: "",
            lastName: "",
            role: payload.role as UserRole,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      }
    }
  },
}));
