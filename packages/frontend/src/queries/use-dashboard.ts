import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse } from "@piletrack/shared";

export interface SiteDashboardData {
  kpis: {
    totalPiles: number;
    pilesCompleted: number;
    pilesInProgress: number;
    completionPercentage: number;
    totalConcreteUsed: number;
    avgOverconsumption: number;
    openNCRs: number;
    criticalNCRs: number;
    pendingApprovals: number;
    testsPassRate: number;
  };
  pilesByStatus: Record<string, number>;
  recentActivities: Array<Record<string, unknown>>;
  alerts: Array<{
    type: string;
    message: string;
    severity: string;
    link?: string;
  }>;
  productionTrend: Array<{
    date: string;
    pilesCompleted: number;
    concreteUsed: number;
  }>;
}

const dashboardKeys = {
  all: ["dashboard"] as const,
  site: (siteId: string) => [...dashboardKeys.all, siteId] as const,
};

export function useSiteDashboard(siteId: string) {
  return useQuery({
    queryKey: dashboardKeys.site(siteId),
    queryFn: () =>
      api.get<ApiResponse<SiteDashboardData>>(`/dashboard/${siteId}`),
    enabled: !!siteId,
    refetchInterval: 60_000, // refresh every minute
  });
}
