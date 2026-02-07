import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  BoreholeLog,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";

interface BoreholeLogFilter {
  siteId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface CreateBoreholeLogInput {
  siteId: string;
  boreholeId: string;
  logDate: string;
  location?: string;
  gpsLat?: number;
  gpsLng?: number;
  totalDepth: number;
  groundLevel?: number;
  groundwaterLevel?: number;
  casingDepth?: number;
  strata?: unknown[];
  sptResults?: unknown[];
  remarks?: string;
  photos?: string[];
  drillingMethod?: string;
  contractor?: string;
  loggedBy?: string;
}

interface UpdateBoreholeLogInput {
  boreholeId?: string;
  logDate?: string;
  location?: string;
  gpsLat?: number;
  gpsLng?: number;
  totalDepth?: number;
  groundLevel?: number;
  groundwaterLevel?: number;
  casingDepth?: number;
  strata?: unknown[];
  sptResults?: unknown[];
  remarks?: string;
  photos?: string[];
  drillingMethod?: string;
  contractor?: string;
  loggedBy?: string;
}

const boreholeLogKeys = {
  all: ["borehole-logs"] as const,
  lists: () => [...boreholeLogKeys.all, "list"] as const,
  list: (filters: BoreholeLogFilter) =>
    [...boreholeLogKeys.lists(), filters] as const,
  details: () => [...boreholeLogKeys.all, "detail"] as const,
  detail: (id: string) => [...boreholeLogKeys.details(), id] as const,
};

export function useBoreholeLogs(filters: BoreholeLogFilter = {}) {
  return useQuery({
    queryKey: boreholeLogKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.siteId) params.siteId = filters.siteId;
      if (filters.search) params.search = filters.search;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<BoreholeLog>>("/borehole-logs", params);
    },
  });
}

export function useBoreholeLog(id: string) {
  return useQuery({
    queryKey: boreholeLogKeys.detail(id),
    queryFn: () => api.get<ApiResponse<BoreholeLog>>(`/borehole-logs/${id}`),
    enabled: !!id,
  });
}

export function useCreateBoreholeLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoreholeLogInput) =>
      api.post<ApiResponse<BoreholeLog>>("/borehole-logs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boreholeLogKeys.lists() });
    },
  });
}

export function useUpdateBoreholeLog(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBoreholeLogInput) =>
      api.patch<ApiResponse<BoreholeLog>>(`/borehole-logs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boreholeLogKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: boreholeLogKeys.lists() });
    },
  });
}

export function useDeleteBoreholeLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/borehole-logs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boreholeLogKeys.all });
    },
  });
}
