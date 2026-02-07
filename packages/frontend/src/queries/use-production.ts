import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse } from "@piletrack/shared";

interface PileOverconsumption {
  activityId: string;
  pileId: string;
  activityType: string;
  theoreticalVolume: number;
  actualVolume: number;
  overconsumptionPct: number;
  activityDate: string;
}

interface EquipmentHoursSummary {
  equipmentId?: string;
  name: string;
  totalHours: number;
  downtimeHours: number;
  productiveHours: number;
}

export interface ProductionKPIs {
  pilesCompleted: number;
  metresDrilled: number;
  avgOverconsumption: number;
  avgCycleTimeMinutes: number;
  totalConcreteUsed: number;
  overconsumptionByPile: PileOverconsumption[];
  equipmentHours: EquipmentHoursSummary[];
  rigUtilization: number;
}

const productionKeys = {
  all: ["production"] as const,
  site: (siteId: string, from?: string, to?: string) =>
    [...productionKeys.all, siteId, from, to] as const,
};

export function useProduction(siteId: string, from?: string, to?: string) {
  return useQuery({
    queryKey: productionKeys.site(siteId, from, to),
    queryFn: () => {
      const params: Record<string, string> = {};
      if (from) params.from = from;
      if (to) params.to = to;
      return api.get<ApiResponse<ProductionKPIs>>(
        `/sites/${siteId}/production`,
        params,
      );
    },
    enabled: !!siteId,
  });
}
