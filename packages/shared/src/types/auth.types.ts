import type { UserRole } from "../enums";

/**
 * Login request payload.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response containing tokens and user info.
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
}

/**
 * Register request payload.
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

/**
 * JWT token payload embedded in access tokens.
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
