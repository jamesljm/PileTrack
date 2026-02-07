import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  TestResult,
  PaginatedResponse,
  ApiResponse,
} from "@piletrack/shared";

interface TestResultFilter {
  siteId?: string;
  testType?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface CreateTestResultInput {
  siteId: string;
  activityId?: string;
  testType: string;
  testDate: string;
  pileId?: string;
  status?: string;
  results?: Record<string, unknown>;
  remarks?: string;
  photos?: string[];
  conductedBy?: string;
}

interface UpdateTestResultInput {
  activityId?: string | null;
  testType?: string;
  testDate?: string;
  pileId?: string;
  status?: string;
  results?: Record<string, unknown>;
  remarks?: string;
  photos?: string[];
  conductedBy?: string;
}

const testResultKeys = {
  all: ["test-results"] as const,
  lists: () => [...testResultKeys.all, "list"] as const,
  list: (filters: TestResultFilter) =>
    [...testResultKeys.lists(), filters] as const,
  details: () => [...testResultKeys.all, "detail"] as const,
  detail: (id: string) => [...testResultKeys.details(), id] as const,
};

export function useTestResults(filters: TestResultFilter = {}) {
  return useQuery({
    queryKey: testResultKeys.list(filters),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters.siteId) params.siteId = filters.siteId;
      if (filters.testType) params.testType = filters.testType;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);
      return api.get<PaginatedResponse<TestResult>>("/test-results", params);
    },
  });
}

export function useTestResult(id: string) {
  return useQuery({
    queryKey: testResultKeys.detail(id),
    queryFn: () => api.get<ApiResponse<TestResult>>(`/test-results/${id}`),
    enabled: !!id,
  });
}

export function useCreateTestResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTestResultInput) =>
      api.post<ApiResponse<TestResult>>("/test-results", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testResultKeys.lists() });
    },
  });
}

export function useUpdateTestResult(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTestResultInput) =>
      api.patch<ApiResponse<TestResult>>(`/test-results/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testResultKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: testResultKeys.lists() });
    },
  });
}

export function useDeleteTestResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/test-results/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testResultKeys.all });
    },
  });
}
