import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse } from "@piletrack/shared";

interface DailyReportData {
  date: string;
  totalActivities: number;
  activitiesByType: Record<string, number>;
  activitiesByStatus: Record<string, number>;
}

interface WeeklyReportData {
  weekStart: string;
  weekEnd: string;
  dailyBreakdown: Array<{
    date: string;
    count: number;
  }>;
  totalActivities: number;
  approvedCount: number;
  rejectedCount: number;
}

interface SiteSummaryData {
  siteId: string;
  siteName: string;
  totalActivities: number;
  activitiesByType: Record<string, number>;
  equipmentCount: number;
  materialCount: number;
  pendingApprovals: number;
}

interface EquipmentUtilizationData {
  totalEquipment: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  utilizationRate: number;
}

const reportKeys = {
  all: ["reports"] as const,
  daily: (siteId: string, date: string) =>
    [...reportKeys.all, "daily", siteId, date] as const,
  weekly: (siteId: string, weekStart: string) =>
    [...reportKeys.all, "weekly", siteId, weekStart] as const,
  siteSummary: (siteId: string) =>
    [...reportKeys.all, "site-summary", siteId] as const,
  equipmentUtilization: (siteId?: string) =>
    [...reportKeys.all, "equipment-utilization", siteId] as const,
};

export function useDailyReport(siteId: string, date: string) {
  return useQuery({
    queryKey: reportKeys.daily(siteId, date),
    queryFn: () =>
      api.get<ApiResponse<DailyReportData>>("/reports/daily", {
        siteId,
        date,
      }),
    enabled: !!siteId && !!date,
  });
}

export function useWeeklyReport(siteId: string, weekStart: string) {
  return useQuery({
    queryKey: reportKeys.weekly(siteId, weekStart),
    queryFn: () =>
      api.get<ApiResponse<WeeklyReportData>>("/reports/weekly", {
        siteId,
        weekStart,
      }),
    enabled: !!siteId && !!weekStart,
  });
}

export function useSiteSummary(siteId: string) {
  return useQuery({
    queryKey: reportKeys.siteSummary(siteId),
    queryFn: () =>
      api.get<ApiResponse<SiteSummaryData>>(`/reports/site-summary/${siteId}`),
    enabled: !!siteId,
  });
}

export function useEquipmentUtilization(siteId?: string) {
  return useQuery({
    queryKey: reportKeys.equipmentUtilization(siteId),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (siteId) params.siteId = siteId;
      return api.get<ApiResponse<EquipmentUtilizationData>>(
        "/reports/equipment-utilization",
        params,
      );
    },
  });
}
