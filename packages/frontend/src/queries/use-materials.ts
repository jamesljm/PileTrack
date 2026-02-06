import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  Material,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";

interface MaterialFilter {
  siteId?: string;
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

interface CreateMaterialInput {
  name: string;
  code: string;
  unit: string;
  siteId: string;
  currentStock: number;
  minimumStock: number;
  category?: string;
  supplier?: string;
  unitPrice?: number;
  notes?: string;
}

interface UpdateMaterialInput {
  name?: string;
  code?: string;
  unit?: string;
  minimumStock?: number;
  category?: string | null;
  supplier?: string | null;
  unitPrice?: number | null;
  notes?: string | null;
}

interface AdjustStockInput {
  quantity: number;
  reason: string;
}

const materialKeys = {
  all: ["materials"] as const,
  lists: () => [...materialKeys.all, "list"] as const,
  list: (filters: MaterialFilter) =>
    [...materialKeys.lists(), filters] as const,
  details: () => [...materialKeys.all, "detail"] as const,
  detail: (id: string) => [...materialKeys.details(), id] as const,
  lowStock: () => [...materialKeys.all, "low-stock"] as const,
};

export function useMaterials(filters: MaterialFilter = {}) {
  return useQuery({
    queryKey: materialKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.siteId) params.siteId = filters.siteId;
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<Material>>("/materials", params);
    },
  });
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: () => api.get<ApiResponse<Material>>(`/materials/${id}`),
    enabled: !!id,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialInput) =>
      api.post<ApiResponse<Material>>("/materials", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
}

export function useUpdateMaterial(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMaterialInput) =>
      api.patch<ApiResponse<Material>>(`/materials/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
}

export function useAdjustStock(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdjustStockInput) =>
      api.post<ApiResponse<Material>>(
        `/materials/${id}/adjust-stock`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: materialKeys.lowStock() });
    },
  });
}

export function useLowStock(siteId?: string) {
  return useQuery({
    queryKey: [...materialKeys.lowStock(), siteId],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (siteId) params.siteId = siteId;
      return api.get<ApiResponse<Material[]>>("/materials/low-stock", params);
    },
  });
}
