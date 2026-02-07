import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  Transfer,
  TransferWithItems,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";

interface TransferFilter {
  fromSiteId?: string;
  toSiteId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

interface CreateTransferInput {
  fromSiteId: string;
  toSiteId: string;
  notes?: string;
  items: Array<{
    equipmentId?: string;
    materialId?: string;
    quantity: number;
  }>;
}

const transferKeys = {
  all: ["transfers"] as const,
  lists: () => [...transferKeys.all, "list"] as const,
  list: (filters: TransferFilter) =>
    [...transferKeys.lists(), filters] as const,
  details: () => [...transferKeys.all, "detail"] as const,
  detail: (id: string) => [...transferKeys.details(), id] as const,
};

export function useTransfers(filters: TransferFilter = {}) {
  return useQuery({
    queryKey: transferKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.fromSiteId) params.fromSiteId = filters.fromSiteId;
      if (filters.toSiteId) params.toSiteId = filters.toSiteId;
      if (filters.status) params.status = filters.status;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<Transfer>>("/transfers", params);
    },
  });
}

export function useTransfer(id: string) {
  return useQuery({
    queryKey: transferKeys.detail(id),
    queryFn: () =>
      api.get<ApiResponse<TransferWithItems>>(`/transfers/${id}`),
    enabled: !!id,
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransferInput) =>
      api.post<ApiResponse<Transfer>>("/transfers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transferKeys.lists() });
    },
  });
}

export function useApproveTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<ApiResponse<Transfer>>(`/transfers/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transferKeys.all });
    },
  });
}

export function useShipTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<ApiResponse<Transfer>>(`/transfers/${id}/ship`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transferKeys.all });
    },
  });
}

export function useDeliverTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<ApiResponse<Transfer>>(`/transfers/${id}/deliver`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transferKeys.all });
    },
  });
}

export function useCancelTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<ApiResponse<Transfer>>(`/transfers/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transferKeys.all });
    },
  });
}
