import type { TokenPayload } from "@piletrack/shared";
import { API_URL } from "./constants";

const ACCESS_TOKEN_KEY = "piletrack_access_token";
const REFRESH_TOKEN_KEY = "piletrack_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getTokenPayload(): TokenPayload | null {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]!));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token?: string | null): boolean {
  const t = token ?? getAccessToken();
  if (!t) return true;

  try {
    const parts = t.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]!));
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now - 30; // 30 second buffer
  } catch {
    return true;
  }
}

export async function refreshTokens(): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    const tokens = {
      accessToken: data.data.accessToken as string,
      refreshToken: data.data.refreshToken as string,
    };
    setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  } catch {
    clearTokens();
    return null;
  }
}
