import { prisma } from "../config/database";
import { startOfDayUTC, endOfDayUTC } from "../utils/date";
import { NotFoundError } from "../utils/api-error";

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

interface ProductionKPIs {
  pilesCompleted: number;
  metresDrilled: number;
  avgOverconsumption: number;
  avgCycleTimeMinutes: number;
  totalConcreteUsed: number;
  overconsumptionByPile: PileOverconsumption[];
  equipmentHours: EquipmentHoursSummary[];
  rigUtilization: number;
}

class ProductionKPIService {
  async getKPIs(
    siteId: string,
    from?: Date,
    to?: Date,
  ): Promise<ProductionKPIs> {
    const site = await prisma.site.findFirst({
      where: { id: siteId, deletedAt: null },
    });
    if (!site) throw new NotFoundError("Site");

    const dateFilter = {
      ...(from ? { gte: startOfDayUTC(from) } : {}),
      ...(to ? { lte: endOfDayUTC(to) } : {}),
    };

    const activities = await prisma.activityRecord.findMany({
      where: {
        siteId,
        status: "APPROVED",
        deletedAt: null,
        ...(from || to ? { activityDate: dateFilter } : {}),
      },
      orderBy: { activityDate: "desc" },
    });

    let pilesCompleted = 0;
    let metresDrilled = 0;
    let totalConcreteUsed = 0;
    let overconsumptionSum = 0;
    let overconsumptionCount = 0;
    let cycleTimeSum = 0;
    let cycleTimeCount = 0;
    const overconsumptionByPile: PileOverconsumption[] = [];
    const equipmentMap = new Map<string, EquipmentHoursSummary>();

    const pilingTypes = new Set([
      "BORED_PILING",
      "MICROPILING",
      "CAISSON_PILE",
      "DIAPHRAGM_WALL",
      "SHEET_PILING",
    ]);

    for (const activity of activities) {
      const details = (activity.details ?? {}) as Record<string, unknown>;

      // Count piles (activities with a pile/panel/caisson ID)
      const pileId =
        (details.pileId as string) ??
        (details.panelId as string) ??
        (details.caissonId as string) ??
        (details.pileNumber as string) ??
        (details.pilecapId as string) ??
        (details.nailId as string) ??
        (details.anchorId as string);

      if (pileId) {
        pilesCompleted++;
      }

      // Sum metres drilled (depth field on piling activities)
      if (pilingTypes.has(activity.activityType)) {
        const depth = details.depth as number | undefined;
        if (depth && depth > 0) {
          metresDrilled += depth;
        }
      }

      // Concrete volume
      const concreteVolume = details.concreteVolume as number | undefined;
      if (concreteVolume && concreteVolume > 0) {
        totalConcreteUsed += concreteVolume;
      }

      // Overconsumption
      const overconsumptionPct = details.overconsumptionPct as number | undefined;
      const theoreticalVolume = details.theoreticalVolume as number | undefined;
      if (overconsumptionPct !== undefined && overconsumptionPct !== null) {
        overconsumptionSum += overconsumptionPct;
        overconsumptionCount++;

        if (pileId && theoreticalVolume && concreteVolume) {
          overconsumptionByPile.push({
            activityId: activity.id,
            pileId,
            activityType: activity.activityType,
            theoreticalVolume,
            actualVolume: concreteVolume,
            overconsumptionPct,
            activityDate: activity.activityDate.toISOString().split("T")[0]!,
          });
        }
      }

      // Cycle time from stage timings
      const stageTimings = details.stageTimings as Record<string, { start?: string; end?: string }> | undefined;
      if (stageTimings) {
        let totalMinutes = 0;
        for (const stage of Object.values(stageTimings)) {
          if (stage.start && stage.end) {
            const [sh, sm] = stage.start.split(":").map(Number);
            const [eh, em] = stage.end.split(":").map(Number);
            const mins = (eh! * 60 + em!) - (sh! * 60 + sm!);
            if (mins > 0) totalMinutes += mins;
          }
        }
        if (totalMinutes > 0) {
          cycleTimeSum += totalMinutes;
          cycleTimeCount++;
        }
      }

      // Equipment hours
      const equipmentUsed = details.equipmentUsed as Array<{
        equipmentId?: string;
        name: string;
        hours: number;
        isDowntime?: boolean;
      }> | undefined;

      if (equipmentUsed) {
        for (const eq of equipmentUsed) {
          const key = eq.equipmentId || eq.name;
          const existing = equipmentMap.get(key);
          if (existing) {
            existing.totalHours += eq.hours;
            if (eq.isDowntime) {
              existing.downtimeHours += eq.hours;
            } else {
              existing.productiveHours += eq.hours;
            }
          } else {
            equipmentMap.set(key, {
              equipmentId: eq.equipmentId,
              name: eq.name,
              totalHours: eq.hours,
              downtimeHours: eq.isDowntime ? eq.hours : 0,
              productiveHours: eq.isDowntime ? 0 : eq.hours,
            });
          }
        }
      }
    }

    // Sort overconsumption worst-first
    overconsumptionByPile.sort((a, b) => b.overconsumptionPct - a.overconsumptionPct);

    const equipmentHours = Array.from(equipmentMap.values()).sort(
      (a, b) => b.totalHours - a.totalHours,
    );

    // Rig utilization: productive hours / total hours
    const totalEquipmentHours = equipmentHours.reduce((s, e) => s + e.totalHours, 0);
    const productiveEquipmentHours = equipmentHours.reduce((s, e) => s + e.productiveHours, 0);
    const rigUtilization = totalEquipmentHours > 0
      ? Math.round((productiveEquipmentHours / totalEquipmentHours) * 100)
      : 0;

    return {
      pilesCompleted,
      metresDrilled: Math.round(metresDrilled * 100) / 100,
      avgOverconsumption: overconsumptionCount > 0
        ? Math.round((overconsumptionSum / overconsumptionCount) * 10) / 10
        : 0,
      avgCycleTimeMinutes: cycleTimeCount > 0
        ? Math.round(cycleTimeSum / cycleTimeCount)
        : 0,
      totalConcreteUsed: Math.round(totalConcreteUsed * 100) / 100,
      overconsumptionByPile,
      equipmentHours,
      rigUtilization,
    };
  }

  /**
   * Get daily production numbers (piles completed today).
   */
  async getDailyPiles(siteId: string, date: Date): Promise<number> {
    const dayStart = startOfDayUTC(date);
    const dayEnd = endOfDayUTC(date);

    const count = await prisma.activityRecord.count({
      where: {
        siteId,
        status: "APPROVED",
        deletedAt: null,
        activityDate: { gte: dayStart, lte: dayEnd },
      },
    });

    return count;
  }
}

export const productionKPIService = new ProductionKPIService();
