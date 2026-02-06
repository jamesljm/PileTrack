import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  ActivityRecord,
  ActivitySummary,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";
import type {
  CreateActivityInput,
  UpdateActivityInput,
  ApproveActivityInput,
  RejectActivityInput,
  ActivityFilter,
} from "@piletrack/shared";

const activityKeys = {
  all: ["activities"] as const,
  lists: () => [...activityKeys.all, "list"] as const,
  list: (filters: ActivityFilter & { page?: number; pageSize?: number }) =>
    [...activityKeys.lists(), filters] as const,
  details: () => [...activityKeys.all, "detail"] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
  pending: () => [...activityKeys.all, "pending"] as const,
};

export function useActivities(
  filters: ActivityFilter & { page?: number; pageSize?: number } = {},
) {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.siteId) params.siteId = filters.siteId;
      if (filters.activityType) params.activityType = filters.activityType;
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom.toISOString();
      if (filters.dateTo) params.dateTo = filters.dateTo.toISOString();
      if (filters.createdBy) params.createdBy = filters.createdBy;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<ActivitySummary>>(
        "/activities",
        params,
      );
    },
  });
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () =>
      api.get<ApiResponse<ActivityRecord>>(`/activities/${id}`),
    enabled: !!id,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityInput) =>
      api.post<ApiResponse<ActivityRecord>>("/activities", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: activityKeys.pending() });
    },
  });
}

export function useUpdateActivity(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateActivityInput) =>
      api.patch<ApiResponse<ActivityRecord>>(`/activities/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
  });
}

export function useApproveActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ApproveActivityInput;
    }) =>
      api.post<ApiResponse<ActivityRecord>>(
        `/activities/${id}/approve`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useRejectActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: RejectActivityInput;
    }) =>
      api.post<ApiResponse<ActivityRecord>>(
        `/activities/${id}/reject`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function usePendingActivities(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...activityKeys.pending(), { page, pageSize }],
    queryFn: () => {
      const params: Record<string, string> = {
        status: "SUBMITTED",
        page: String(page),
        pageSize: String(pageSize),
      };
      return api.get<PaginatedResponse<ActivitySummary>>(
        "/activities",
        params,
      );
    },
  });
}
