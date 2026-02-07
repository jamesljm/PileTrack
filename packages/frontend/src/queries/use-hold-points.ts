import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse } from "@piletrack/shared";

interface HoldPoint {
  id: string;
  activityId: string;
  type: string;
  status: string;
  checklist: Array<{ item: string; checked: boolean }>;
  signedByName?: string;
  signedById?: string;
  signedAt?: string;
  signatureData?: string;
  rejectionNotes?: string;
  comments?: string;
  signedBy?: { id: string; firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}

interface SignHoldPointInput {
  checklist: Array<{ item: string; checked: boolean }>;
  signatureData: string;
  signedByName: string;
  comments?: string;
}

interface RejectHoldPointInput {
  rejectionNotes: string;
}

const holdPointKeys = {
  all: ["hold-points"] as const,
  byActivity: (activityId: string) =>
    [...holdPointKeys.all, "activity", activityId] as const,
};

export function useHoldPoints(activityId: string) {
  return useQuery({
    queryKey: holdPointKeys.byActivity(activityId),
    queryFn: () =>
      api.get<ApiResponse<HoldPoint[]>>(
        `/activities/${activityId}/hold-points`,
      ),
    enabled: !!activityId,
  });
}

export function useCreateHoldPoints(activityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<ApiResponse<HoldPoint[]>>(
        `/activities/${activityId}/hold-points`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: holdPointKeys.byActivity(activityId),
      });
    },
  });
}

export function useSignHoldPoint(activityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hpId, data }: { hpId: string; data: SignHoldPointInput }) =>
      api.post<ApiResponse<HoldPoint>>(`/hold-points/${hpId}/sign`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: holdPointKeys.byActivity(activityId),
      });
    },
  });
}

export function useRejectHoldPoint(activityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hpId,
      data,
    }: {
      hpId: string;
      data: RejectHoldPointInput;
    }) => api.post<ApiResponse<HoldPoint>>(`/hold-points/${hpId}/reject`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: holdPointKeys.byActivity(activityId),
      });
    },
  });
}
