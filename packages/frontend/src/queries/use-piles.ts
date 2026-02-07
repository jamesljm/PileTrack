import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  Pile,
  PileSummary,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";

const pileKeys = {
  all: ["piles"] as const,
  lists: () => [...pileKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...pileKeys.lists(), filters] as const,
  details: () => [...pileKeys.all, "detail"] as const,
  detail: (id: string) => [...pileKeys.details(), id] as const,
};

export function usePiles(
  filters: {
    siteId?: string;
    status?: string;
    pileType?: string;
    page?: number;
    pageSize?: number;
  } = {},
) {
  return useQuery({
    queryKey: pileKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.siteId) params.siteId = filters.siteId;
      if (filters.status) params.status = filters.status;
      if (filters.pileType) params.pileType = filters.pileType;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<PileSummary>>("/piles", params);
    },
  });
}

export function usePile(id: string) {
  return useQuery({
    queryKey: pileKeys.detail(id),
    queryFn: () => api.get<ApiResponse<Pile>>(`/piles/${id}`),
    enabled: !!id,
  });
}

export function useCreatePile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<ApiResponse<Pile>>("/piles", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pileKeys.lists() });
    },
  });
}

export function useUpdatePile(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.patch<ApiResponse<Pile>>(`/piles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pileKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: pileKeys.lists() });
    },
  });
}

export function useDeletePile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/piles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pileKeys.all });
    },
  });
}

export function useUpdatePileStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch<ApiResponse<Pile>>(`/piles/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pileKeys.all });
    },
  });
}
