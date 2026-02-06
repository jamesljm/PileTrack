import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  Site,
  SiteSummary,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";
import type { CreateSiteInput, UpdateSiteInput, SiteFilter } from "@piletrack/shared";

const siteKeys = {
  all: ["sites"] as const,
  lists: () => [...siteKeys.all, "list"] as const,
  list: (filters: SiteFilter & { page?: number; pageSize?: number }) =>
    [...siteKeys.lists(), filters] as const,
  details: () => [...siteKeys.all, "detail"] as const,
  detail: (id: string) => [...siteKeys.details(), id] as const,
};

export function useSites(
  filters: SiteFilter & { page?: number; pageSize?: number } = {},
) {
  return useQuery({
    queryKey: siteKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.clientName) params.clientName = filters.clientName;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<SiteSummary>>("/sites", params);
    },
  });
}

export function useSite(id: string) {
  return useQuery({
    queryKey: siteKeys.detail(id),
    queryFn: () => api.get<ApiResponse<Site>>(`/sites/${id}`),
    enabled: !!id,
  });
}

export function useCreateSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSiteInput) =>
      api.post<ApiResponse<Site>>("/sites", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteKeys.lists() });
    },
  });
}

export function useUpdateSite(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSiteInput) =>
      api.patch<ApiResponse<Site>>(`/sites/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: siteKeys.lists() });
    },
  });
}

export function useDeleteSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/sites/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteKeys.lists() });
    },
  });
}
