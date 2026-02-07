import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  NCR,
  NCRSummary,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";

const ncrKeys = {
  all: ["ncrs"] as const,
  lists: () => [...ncrKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...ncrKeys.lists(), filters] as const,
  details: () => [...ncrKeys.all, "detail"] as const,
  detail: (id: string) => [...ncrKeys.details(), id] as const,
};

export function useNCRs(
  filters: {
    siteId?: string;
    status?: string;
    priority?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  } = {},
) {
  return useQuery({
    queryKey: ncrKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.siteId) params.siteId = filters.siteId;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.category) params.category = filters.category;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<NCRSummary>>("/ncrs", params);
    },
  });
}

export function useNCR(id: string) {
  return useQuery({
    queryKey: ncrKeys.detail(id),
    queryFn: () => api.get<ApiResponse<NCR>>(`/ncrs/${id}`),
    enabled: !!id,
  });
}

export function useCreateNCR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<ApiResponse<NCR>>("/ncrs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ncrKeys.lists() });
    },
  });
}

export function useUpdateNCR(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.patch<ApiResponse<NCR>>(`/ncrs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ncrKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ncrKeys.lists() });
    },
  });
}

export function useDeleteNCR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/ncrs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ncrKeys.all });
    },
  });
}

export function useInvestigateNCR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<ApiResponse<NCR>>(`/ncrs/${id}/investigate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ncrKeys.all });
    },
  });
}

export function useResolveNCR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { rootCause?: string; correctiveAction?: string; preventiveAction?: string };
    }) => api.post<ApiResponse<NCR>>(`/ncrs/${id}/resolve`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ncrKeys.all });
    },
  });
}

export function useCloseNCR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<ApiResponse<NCR>>(`/ncrs/${id}/close`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ncrKeys.all });
    },
  });
}
