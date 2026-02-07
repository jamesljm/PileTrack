import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  Equipment,
  ServiceRecord,
  EquipmentSiteHistory,
  EquipmentUsageEntry,
  EquipmentUsageSummary,
  EquipmentStats,
  ServiceCostSummary,
  FleetStats,
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
  condition?: string;
  serviceIntervalHours?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  dailyRate?: number;
  insuranceExpiry?: string;
  notes?: string;
}

interface UpdateEquipmentInput {
  name?: string;
  code?: string;
  category?: string;
  status?: string;
  condition?: string;
  siteId?: string | null;
  serialNumber?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  yearOfManufacture?: number | null;
  lastServiceDate?: string | null;
  nextServiceDate?: string | null;
  serviceIntervalHours?: number | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  dailyRate?: number | null;
  insuranceExpiry?: string | null;
  notes?: string | null;
}

interface CreateServiceRecordInput {
  serviceType: string;
  serviceDate: string;
  description: string;
  performedBy: string;
  cost?: number;
  partsReplaced?: string;
  nextServiceDate?: string;
  meterReading?: number;
  notes?: string;
}

const equipmentKeys = {
  all: ["equipment"] as const,
  lists: () => [...equipmentKeys.all, "list"] as const,
  list: (filters: EquipmentFilter) =>
    [...equipmentKeys.lists(), filters] as const,
  details: () => [...equipmentKeys.all, "detail"] as const,
  detail: (id: string) => [...equipmentKeys.details(), id] as const,
  serviceDue: () => [...equipmentKeys.all, "service-due"] as const,
  serviceRecords: (id: string) =>
    [...equipmentKeys.all, "service-records", id] as const,
  usage: (id: string) =>
    [...equipmentKeys.all, "usage", id] as const,
  usageSummary: (id: string) =>
    [...equipmentKeys.all, "usage-summary", id] as const,
  stats: (id: string) =>
    [...equipmentKeys.all, "stats", id] as const,
  siteHistory: (id: string) =>
    [...equipmentKeys.all, "site-history", id] as const,
  fleetStats: () => [...equipmentKeys.all, "fleet-stats"] as const,
  serviceSummary: (id: string) =>
    [...equipmentKeys.all, "service-summary", id] as const,
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

// ─── Service Records ────────────────────────────────────────────────────────

export function useEquipmentServiceRecords(
  equipmentId: string,
  filters?: { serviceType?: string; page?: number; pageSize?: number },
) {
  return useQuery({
    queryKey: equipmentKeys.serviceRecords(equipmentId),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters?.serviceType) params.serviceType = filters.serviceType;
      if (filters?.page) params.page = String(filters.page);
      if (filters?.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<ServiceRecord>>(
        `/equipment/${equipmentId}/service-records`,
        params,
      );
    },
    enabled: !!equipmentId,
  });
}

export function useCreateServiceRecord(equipmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceRecordInput) =>
      api.post<ApiResponse<ServiceRecord>>(
        `/equipment/${equipmentId}/service-records`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.serviceRecords(equipmentId),
      });
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.detail(equipmentId),
      });
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.stats(equipmentId),
      });
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.serviceSummary(equipmentId),
      });
    },
  });
}

export function useServiceCostSummary(equipmentId: string) {
  return useQuery({
    queryKey: equipmentKeys.serviceSummary(equipmentId),
    queryFn: () =>
      api.get<ApiResponse<ServiceCostSummary>>(
        `/equipment/${equipmentId}/service-records/summary`,
      ),
    enabled: !!equipmentId,
  });
}

// ─── Usage ──────────────────────────────────────────────────────────────────

export function useEquipmentUsage(equipmentId: string) {
  return useQuery({
    queryKey: equipmentKeys.usage(equipmentId),
    queryFn: () =>
      api.get<ApiResponse<EquipmentUsageEntry[]>>(
        `/equipment/${equipmentId}/usage`,
      ),
    enabled: !!equipmentId,
  });
}

export function useEquipmentUsageSummary(equipmentId: string) {
  return useQuery({
    queryKey: equipmentKeys.usageSummary(equipmentId),
    queryFn: () =>
      api.get<ApiResponse<EquipmentUsageSummary>>(
        `/equipment/${equipmentId}/usage/summary`,
      ),
    enabled: !!equipmentId,
  });
}

// ─── Stats ──────────────────────────────────────────────────────────────────

export function useEquipmentStats(equipmentId: string) {
  return useQuery({
    queryKey: equipmentKeys.stats(equipmentId),
    queryFn: () =>
      api.get<ApiResponse<EquipmentStats>>(
        `/equipment/${equipmentId}/stats`,
      ),
    enabled: !!equipmentId,
  });
}

// ─── Site History ───────────────────────────────────────────────────────────

export function useEquipmentSiteHistory(equipmentId: string) {
  return useQuery({
    queryKey: equipmentKeys.siteHistory(equipmentId),
    queryFn: () =>
      api.get<ApiResponse<EquipmentSiteHistory[]>>(
        `/equipment/${equipmentId}/site-history`,
      ),
    enabled: !!equipmentId,
  });
}

// ─── Fleet Stats ────────────────────────────────────────────────────────────

export function useFleetStats() {
  return useQuery({
    queryKey: equipmentKeys.fleetStats(),
    queryFn: () =>
      api.get<ApiResponse<FleetStats>>("/equipment/fleet-stats"),
  });
}
