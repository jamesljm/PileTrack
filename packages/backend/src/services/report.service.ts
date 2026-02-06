import { prisma } from "../config/database";
import { startOfDayUTC, endOfDayUTC } from "../utils/date";
import { arrayToCsv } from "../utils/csv-exporter";
import { NotFoundError } from "../utils/api-error";

class ReportService {
  async dailySummary(
    siteId: string,
    date: Date,
  ): Promise<Record<string, unknown>> {
    const site = await prisma.site.findFirst({
      where: { id: siteId, deletedAt: null },
    });
    if (!site) throw new NotFoundError("Site");

    const dayStart = startOfDayUTC(date);
    const dayEnd = endOfDayUTC(date);

    const [activities, equipmentUsed, materialsUsed] = await Promise.all([
      prisma.activityRecord.findMany({
        where: {
          siteId,
          activityDate: { gte: dayStart, lte: dayEnd },
          deletedAt: null,
        },
        include: {
          createdBy: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { activityType: "asc" },
      }),
      prisma.equipment.findMany({
        where: { siteId, status: "IN_USE", deletedAt: null },
        select: { id: true, name: true, category: true, status: true },
      }),
      prisma.material.findMany({
        where: { siteId, deletedAt: null },
        select: {
          id: true,
          name: true,
          unit: true,
          currentStock: true,
          minimumStock: true,
        },
      }),
    ]);

    const summary: Record<string, number> = {};
    for (const activity of activities) {
      const type = activity.activityType;
      summary[type] = (summary[type] ?? 0) + 1;
    }

    return {
      site: { id: site.id, name: site.name, code: site.code },
      date: date.toISOString().split("T")[0],
      activitiesByType: summary,
      totalActivities: activities.length,
      approvedActivities: activities.filter((a) => a.status === "APPROVED").length,
      pendingActivities: activities.filter((a) => a.status === "SUBMITTED").length,
      activities,
      equipmentInUse: equipmentUsed.length,
      equipment: equipmentUsed,
      materials: materialsUsed,
      lowStockMaterials: materialsUsed.filter((m) => m.currentStock <= m.minimumStock),
    };
  }

  async weeklySummary(
    siteId: string,
    weekStartDate: Date,
  ): Promise<Record<string, unknown>> {
    const site = await prisma.site.findFirst({
      where: { id: siteId, deletedAt: null },
    });
    if (!site) throw new NotFoundError("Site");

    const weekStart = startOfDayUTC(weekStartDate);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const activities = await prisma.activityRecord.findMany({
      where: {
        siteId,
        activityDate: { gte: weekStart, lt: weekEnd },
        deletedAt: null,
      },
      include: {
        createdBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    // Group by day
    const dailyBreakdown: Record<string, number> = {};
    const typeBreakdown: Record<string, number> = {};
    const statusBreakdown: Record<string, number> = {};

    for (const activity of activities) {
      const dayKey = activity.activityDate.toISOString().split("T")[0]!;
      dailyBreakdown[dayKey] = (dailyBreakdown[dayKey] ?? 0) + 1;
      typeBreakdown[activity.activityType] = (typeBreakdown[activity.activityType] ?? 0) + 1;
      statusBreakdown[activity.status] = (statusBreakdown[activity.status] ?? 0) + 1;
    }

    return {
      site: { id: site.id, name: site.name, code: site.code },
      weekStart: weekStart.toISOString().split("T")[0],
      weekEnd: weekEnd.toISOString().split("T")[0],
      totalActivities: activities.length,
      dailyBreakdown,
      typeBreakdown,
      statusBreakdown,
    };
  }

  async siteSummary(siteId: string): Promise<Record<string, unknown>> {
    const site = await prisma.site.findFirst({
      where: { id: siteId, deletedAt: null },
    });
    if (!site) throw new NotFoundError("Site");

    const [
      totalActivities,
      approvedActivities,
      totalEquipment,
      totalMaterials,
      teamMembers,
      pendingTransfers,
      activityByType,
    ] = await Promise.all([
      prisma.activityRecord.count({ where: { siteId, deletedAt: null } }),
      prisma.activityRecord.count({ where: { siteId, status: "APPROVED", deletedAt: null } }),
      prisma.equipment.count({ where: { siteId, deletedAt: null } }),
      prisma.material.count({ where: { siteId, deletedAt: null } }),
      prisma.siteUser.count({ where: { siteId } }),
      prisma.transfer.count({
        where: {
          OR: [{ fromSiteId: siteId }, { toSiteId: siteId }],
          status: { in: ["REQUESTED", "APPROVED", "IN_TRANSIT"] },
          deletedAt: null,
        },
      }),
      prisma.activityRecord.groupBy({
        by: ["activityType"],
        where: { siteId, deletedAt: null },
        _count: { id: true },
      }),
    ]);

    return {
      site,
      stats: {
        totalActivities,
        approvedActivities,
        completionRate: totalActivities > 0
          ? Math.round((approvedActivities / totalActivities) * 100)
          : 0,
        totalEquipment,
        totalMaterials,
        teamMembers,
        pendingTransfers,
      },
      activityByType: activityByType.map((g) => ({
        type: g.activityType,
        count: g._count.id,
      })),
    };
  }

  async equipmentUtilization(
    siteId?: string,
  ): Promise<Record<string, unknown>> {
    const where = {
      deletedAt: null,
      ...(siteId ? { siteId } : {}),
    };

    const [total, inUse, available, maintenance, decommissioned, byCategory] =
      await Promise.all([
        prisma.equipment.count({ where }),
        prisma.equipment.count({ where: { ...where, status: "IN_USE" } }),
        prisma.equipment.count({ where: { ...where, status: "AVAILABLE" } }),
        prisma.equipment.count({ where: { ...where, status: "MAINTENANCE" } }),
        prisma.equipment.count({ where: { ...where, status: "DECOMMISSIONED" } }),
        prisma.equipment.groupBy({
          by: ["category"],
          where,
          _count: { id: true },
        }),
      ]);

    return {
      total,
      utilization: {
        inUse,
        available,
        maintenance,
        decommissioned,
        utilizationRate: total > 0 ? Math.round((inUse / total) * 100) : 0,
      },
      byCategory: byCategory.map((g) => ({
        category: g.category,
        count: g._count.id,
      })),
    };
  }

  async exportActivitiesCsv(
    siteId: string,
    from?: Date,
    to?: Date,
  ): Promise<string> {
    const where = {
      siteId,
      deletedAt: null,
      ...(from || to
        ? {
            activityDate: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };

    const activities = await prisma.activityRecord.findMany({
      where,
      include: {
        createdBy: { select: { firstName: true, lastName: true } },
        approvedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { activityDate: "desc" },
    });

    const headers = [
      "Date",
      "Type",
      "Status",
      "Created By",
      "Approved By",
      "Remarks",
      "Created At",
    ];

    const rows = activities.map((a) => [
      a.activityDate.toISOString().split("T")[0]!,
      a.activityType,
      a.status,
      `${a.createdBy.firstName} ${a.createdBy.lastName}`,
      a.approvedBy ? `${a.approvedBy.firstName} ${a.approvedBy.lastName}` : "",
      a.remarks ?? "",
      a.createdAt.toISOString(),
    ]);

    return arrayToCsv(headers, rows);
  }
}

export const reportService = new ReportService();
