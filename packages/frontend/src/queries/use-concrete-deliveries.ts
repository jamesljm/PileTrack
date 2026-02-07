import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  ConcreteDelivery,
  ConcreteDeliverySummary,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";

const cdKeys = {
  all: ["concrete-deliveries"] as const,
  lists: () => [...cdKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...cdKeys.lists(), filters] as const,
  details: () => [...cdKeys.all, "detail"] as const,
  detail: (id: string) => [...cdKeys.details(), id] as const,
};

export function useConcreteDeliveries(
  filters: {
    siteId?: string;
    pileId?: string;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
  } = {},
) {
  return useQuery({
    queryKey: cdKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.siteId) params.siteId = filters.siteId;
      if (filters.pileId) params.pileId = filters.pileId;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<ConcreteDeliverySummary>>(
        "/concrete-deliveries",
        params,
      );
    },
  });
}

export function useConcreteDelivery(id: string) {
  return useQuery({
    queryKey: cdKeys.detail(id),
    queryFn: () =>
      api.get<ApiResponse<ConcreteDelivery>>(`/concrete-deliveries/${id}`),
    enabled: !!id,
  });
}

export function useCreateConcreteDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<ApiResponse<ConcreteDelivery>>("/concrete-deliveries", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cdKeys.lists() });
    },
  });
}

export function useUpdateConcreteDelivery(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.patch<ApiResponse<ConcreteDelivery>>(
        `/concrete-deliveries/${id}`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cdKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: cdKeys.lists() });
    },
  });
}

export function useDeleteConcreteDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<void>(`/concrete-deliveries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cdKeys.all });
    },
  });
}
