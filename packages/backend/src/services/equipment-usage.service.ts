import { prisma } from "../config/database";
import { NotFoundError } from "../utils/api-error";
import { logger } from "../config/logger";

interface UsageHistoryEntry {
  activityId: string;
  activityDate: string;
  activityType: string;
  siteId: string;
  siteName: string;
  hours: number;
  isDowntime: boolean;
  downtimeReason: string | null;
}

interface UsageSummary {
  totalHours: number;
  productiveHours: number;
  downtimeHours: number;
  utilizationRate: number;
}

class EquipmentUsageService {
  async getUsageHistory(
    equipmentId: string,
    dateRange?: { from?: Date; to?: Date },
  ): Promise<UsageHistoryEntry[]> {
    const equipment = await prisma.equipment.findFirst({
      where: { id: equipmentId, deletedAt: null },
    });
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    // Query approved activities that reference this equipment in their details
    const where: any = {
      status: "APPROVED",
      deletedAt: null,
    };

    if (dateRange?.from || dateRange?.to) {
      where.activityDate = {};
      if (dateRange.from) where.activityDate.gte = dateRange.from;
      if (dateRange.to) where.activityDate.lte = dateRange.to;
    }

    const activities = await prisma.activityRecord.findMany({
      where,
      select: {
        id: true,
        activityDate: true,
        activityType: true,
        siteId: true,
        details: true,
        site: { select: { id: true, name: true } },
      },
      orderBy: { activityDate: "desc" },
    });

    const usageEntries: UsageHistoryEntry[] = [];

    for (const activity of activities) {
      const details = (activity.details ?? {}) as Record<string, unknown>;
      const equipmentUsed = details.equipmentUsed as Array<{
        equipmentId: string;
        hours?: number;
        isDowntime?: boolean;
        downtimeReason?: string;
      }> | undefined;

      if (!equipmentUsed) continue;

      for (const entry of equipmentUsed) {
        if (entry.equipmentId === equipmentId) {
          usageEntries.push({
            activityId: activity.id,
            activityDate: activity.activityDate.toISOString(),
            activityType: activity.activityType,
            siteId: activity.siteId,
            siteName: activity.site.name,
            hours: entry.hours ?? 0,
            isDowntime: entry.isDowntime ?? false,
            downtimeReason: entry.downtimeReason ?? null,
          });
        }
      }
    }

    return usageEntries;
  }

  async getUsageSummary(equipmentId: string): Promise<UsageSummary> {
    const usageHistory = await this.getUsageHistory(equipmentId);

    let totalHours = 0;
    let productiveHours = 0;
    let downtimeHours = 0;

    for (const entry of usageHistory) {
      totalHours += entry.hours;
      if (entry.isDowntime) {
        downtimeHours += entry.hours;
      } else {
        productiveHours += entry.hours;
      }
    }

    const utilizationRate = totalHours > 0 ? (productiveHours / totalHours) * 100 : 0;

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      productiveHours: Math.round(productiveHours * 100) / 100,
      downtimeHours: Math.round(downtimeHours * 100) / 100,
      utilizationRate: Math.round(utilizationRate * 10) / 10,
    };
  }

  async recalculateHours(equipmentId: string): Promise<number> {
    const summary = await this.getUsageSummary(equipmentId);

    await prisma.equipment.update({
      where: { id: equipmentId },
      data: { totalUsageHours: summary.totalHours },
    });

    logger.info(
      { equipmentId, totalUsageHours: summary.totalHours },
      "Equipment usage hours recalculated",
    );

    return summary.totalHours;
  }

  async checkServiceDueByHours(equipmentId: string): Promise<{
    isDue: boolean;
    currentHours: number;
    intervalHours: number | null;
    hoursUntilService: number | null;
  }> {
    const equipment = await prisma.equipment.findFirst({
      where: { id: equipmentId, deletedAt: null },
    });
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    const intervalHours = equipment.serviceIntervalHours;
    if (!intervalHours) {
      return {
        isDue: false,
        currentHours: equipment.totalUsageHours,
        intervalHours: null,
        hoursUntilService: null,
      };
    }

    // Find the meter reading from the last service record
    const lastService = await prisma.serviceRecord.findFirst({
      where: { equipmentId, deletedAt: null },
      orderBy: { serviceDate: "desc" },
      select: { meterReading: true },
    });

    const lastServiceHours = lastService?.meterReading ?? 0;
    const hoursSinceService = equipment.totalUsageHours - lastServiceHours;
    const isDue = hoursSinceService >= intervalHours;
    const hoursUntilService = intervalHours - hoursSinceService;

    return {
      isDue,
      currentHours: equipment.totalUsageHours,
      intervalHours,
      hoursUntilService: Math.max(0, hoursUntilService),
    };
  }
}

export const equipmentUsageService = new EquipmentUsageService();
