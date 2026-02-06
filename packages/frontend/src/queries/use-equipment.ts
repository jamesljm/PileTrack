import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  Equipment,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";

interface EquipmentFilter {
  siteId?: string;
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface CreateEquipmentInput {
  name: string;
  code: string;
  category: string;
  siteId?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  yearOfManufacture?: number;
  notes?: string;
}

interface UpdateEquipmentInput {
  name?: string;
  code?: string;
  category?: string;
  status?: string;
  siteId?: string | null;
  serialNumber?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  yearOfManufacture?: number | null;
  lastServiceDate?: string | null;
  nextServiceDate?: string | null;
  notes?: string | null;
}

const equipmentKeys = {
  all: ["equipment"] as const,
  lists: () => [...equipmentKeys.all, "list"] as const,
  list: (filters: EquipmentFilter) =>
    [...equipmentKeys.lists(), filters] as const,
  details: () => [...equipmentKeys.all, "detail"] as const,
  detail: (id: string) => [...equipmentKeys.details(), id] as const,
  serviceDue: () => [...equipmentKeys.all, "service-due"] as const,
};

export function useEquipment(filters: EquipmentFilter = {}) {
  return useQuery({
    queryKey: equipmentKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.siteId) params.siteId = filters.siteId;
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<Equipment>>("/equipment", params);
    },
  });
}

export function useEquipmentItem(id: string) {
  return useQuery({
    queryKey: equipmentKeys.detail(id),
    queryFn: () => api.get<ApiResponse<Equipment>>(`/equipment/${id}`),
    enabled: !!id,
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEquipmentInput) =>
      api.post<ApiResponse<Equipment>>("/equipment", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
    },
  });
}

export function useUpdateEquipment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEquipmentInput) =>
      api.patch<ApiResponse<Equipment>>(`/equipment/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
    },
  });
}

export function useScanQR() {
  return useMutation({
    mutationFn: (qrCode: string) =>
      api.get<ApiResponse<Equipment>>("/equipment/scan", { qrCode }),
  });
}

export function useServiceDue() {
  return useQuery({
    queryKey: equipmentKeys.serviceDue(),
    queryFn: () =>
      api.get<ApiResponse<Equipment[]>>("/equipment/service-due"),
  });
}
