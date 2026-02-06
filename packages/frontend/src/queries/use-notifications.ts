import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@piletrack/shared";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (page: number) => [...notificationKeys.lists(), page] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export function useNotifications(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: notificationKeys.list(page),
    queryFn: () =>
      api.get<PaginatedResponse<Notification>>("/notifications", {
        page: String(page),
        pageSize: String(pageSize),
      }),
    refetchInterval: 60_000, // Refetch every minute
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () =>
      api.get<ApiResponse<{ count: number }>>("/notifications/unread-count"),
    refetchInterval: 30_000, // Refetch every 30 seconds
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.patch<void>(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<void>("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
