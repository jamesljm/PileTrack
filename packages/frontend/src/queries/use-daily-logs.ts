import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  DailyLog,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";

interface DailyLogFilter {
  siteId?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

interface CreateDailyLogInput {
  siteId: string;
  logDate: string;
  workforce?: unknown[];
  safety?: Record<string, unknown>;
  delays?: unknown[];
  materialUsage?: unknown[];
  weather?: Record<string, unknown>;
  remarks?: string;
  photos?: string[];
}

interface UpdateDailyLogInput {
  workforce?: unknown[];
  safety?: Record<string, unknown>;
  delays?: unknown[];
  materialUsage?: unknown[];
  weather?: Record<string, unknown>;
  remarks?: string;
  photos?: string[];
}

const dailyLogKeys = {
  all: ["daily-logs"] as const,
  lists: () => [...dailyLogKeys.all, "list"] as const,
  list: (filters: DailyLogFilter) =>
    [...dailyLogKeys.lists(), filters] as const,
  details: () => [...dailyLogKeys.all, "detail"] as const,
  detail: (id: string) => [...dailyLogKeys.details(), id] as const,
};

export function useDailyLogs(filters: DailyLogFilter = {}) {
  return useQuery({
    queryKey: dailyLogKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.siteId) params.siteId = filters.siteId;
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<DailyLog>>("/daily-logs", params);
    },
  });
}

export function useDailyLog(id: string) {
  return useQuery({
    queryKey: dailyLogKeys.detail(id),
    queryFn: () => api.get<ApiResponse<DailyLog>>(`/daily-logs/${id}`),
    enabled: !!id,
  });
}

export function useCreateDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDailyLogInput) =>
      api.post<ApiResponse<DailyLog>>("/daily-logs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.lists() });
    },
  });
}

export function useUpdateDailyLog(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDailyLogInput) =>
      api.patch<ApiResponse<DailyLog>>(`/daily-logs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.lists() });
    },
  });
}

export function useDeleteDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/daily-logs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.all });
    },
  });
}

export function useSubmitDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<ApiResponse<DailyLog>>(`/daily-logs/${id}/submit`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.all });
    },
  });
}

export function useApproveDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<ApiResponse<DailyLog>>(`/daily-logs/${id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.all });
    },
  });
}

export function useRejectDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rejectionNotes }: { id: string; rejectionNotes: string }) =>
      api.post<ApiResponse<DailyLog>>(`/daily-logs/${id}/reject`, { rejectionNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.all });
    },
  });
}
