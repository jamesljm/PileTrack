import { API_URL } from "./constants";
import {
  getAccessToken,
  isTokenExpired,
  refreshTokens,
  clearTokens,
} from "./auth";

type RequestInterceptor = (config: RequestInit) => RequestInit;
type ResponseInterceptor = (response: Response) => Response;

class ApiClient {
  private baseUrl: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    let token = getAccessToken();

    if (token && isTokenExpired(token)) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshPromise = refreshTokens()
          .then((result) => {
            this.isRefreshing = false;
            this.refreshPromise = null;
            return result !== null;
          })
          .catch(() => {
            this.isRefreshing = false;
            this.refreshPromise = null;
            return false;
          });
      }

      if (this.refreshPromise) {
        const success = await this.refreshPromise;
        if (!success) {
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          throw new Error("Session expired");
        }
      }

      token = getAccessToken();
    }

    if (token) {
      return { Authorization: `Bearer ${token}` };
    }

    return {};
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const authHeaders = await this.getAuthHeaders();

    let config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
    };

    for (const interceptor of this.requestInterceptors) {
      config = interceptor(config);
    }

    const url = `${this.baseUrl}${path}`;
    let response = await fetch(url, config);

    for (const interceptor of this.responseInterceptors) {
      response = interceptor(response);
    }

    if (response.status === 401) {
      const refreshResult = await refreshTokens();
      if (refreshResult) {
        const retryConfig: RequestInit = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${refreshResult.accessToken}`,
          },
        };
        response = await fetch(url, retryConfig);
      } else {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Session expired");
      }
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(
        errorBody?.error?.message ?? `Request failed with status ${response.status}`,
      );
      (error as any).status = response.status;
      (error as any).data = errorBody;
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    let url = path;
    if (params) {
      const searchParams = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
      );
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export const api = new ApiClient(API_URL);
