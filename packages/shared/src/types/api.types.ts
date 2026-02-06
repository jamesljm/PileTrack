/**
 * Standard API success response wrapper.
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * Paginated API response for list endpoints.
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  timestamp: string;
}

/**
 * Standard API error response.
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}
