export type { UserRole } from "@prisma/client";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  requestId?: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
