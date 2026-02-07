import { prisma } from "../config/database";
import { logger } from "../config/logger";

export interface DashboardData {
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
  recentActivities: unknown[];
  alerts: Array<{ type: string; message: string; severity: string; link?: string }>;
  productionTrend: Array<{ date: string; pilesCompleted: number; concreteUsed: number }>;
}

class DashboardService {
  async getSiteDashboard(siteId: string): Promise<DashboardData> {
    const [
      piles,
      ncrs,
      activities,
      dailyLogs,
      testResults,
      concreteDeliveries,
    ] = await Promise.all([
      prisma.pile.findMany({ where: { siteId, deletedAt: null } }),
      prisma.nCR.findMany({ where: { siteId, deletedAt: null } }),
      prisma.activityRecord.findMany({
        where: { siteId, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          createdBy: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      prisma.dailyLog.findMany({ where: { siteId, deletedAt: null, status: "SUBMITTED" } }),
      prisma.testResult.findMany({ where: { siteId, deletedAt: null } }),
      prisma.concreteDelivery.findMany({ where: { siteId, deletedAt: null } }),
    ]);

    const totalPiles = piles.length;
    const pilesCompleted = piles.filter((p) => p.status === "APPROVED").length;
    const pilesInProgress = piles.filter((p) =>
      ["SET_UP", "BORED", "CAGED", "CONCRETED", "TESTED"].includes(p.status),
    ).length;
    const completionPercentage = totalPiles > 0 ? Math.round((pilesCompleted / totalPiles) * 100) : 0;

    const totalConcreteUsed = concreteDeliveries.reduce((sum, cd) => sum + cd.volume, 0);

    const pilesWithOverconsumption = piles.filter((p) => p.overconsumption != null && p.overconsumption > 0);
    const avgOverconsumption =
      pilesWithOverconsumption.length > 0
        ? Math.round(
            (pilesWithOverconsumption.reduce((sum, p) => sum + (p.overconsumption ?? 0), 0) /
              pilesWithOverconsumption.length) *
              10,
          ) / 10
        : 0;

    const openNCRs = ncrs.filter((n) => !["CLOSED", "VOIDED"].includes(n.status)).length;
    const criticalNCRs = ncrs.filter(
      (n) => n.priority === "CRITICAL" && !["CLOSED", "VOIDED"].includes(n.status),
    ).length;

    const pendingActivities = await prisma.activityRecord.count({
      where: { siteId, deletedAt: null, status: "SUBMITTED" },
    });
    const pendingApprovals = pendingActivities + dailyLogs.length;

    const totalTests = testResults.length;
    const passedTests = testResults.filter((t) => t.status === "PASS").length;
    const testsPassRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    // Pile status distribution
    const pilesByStatus: Record<string, number> = {};
    for (const pile of piles) {
      pilesByStatus[pile.status] = (pilesByStatus[pile.status] ?? 0) + 1;
    }

    // Alerts
    const alerts: DashboardData["alerts"] = [];

    const highOverconsumption = piles.filter((p) => (p.overconsumption ?? 0) > 15);
    if (highOverconsumption.length > 0) {
      alerts.push({
        type: "overconsumption",
        message: `${highOverconsumption.length} pile(s) with >15% concrete overconsumption`,
        severity: "warning",
      });
    }

    const overdueNCRs = ncrs.filter(
      (n) =>
        n.dueDate &&
        new Date(n.dueDate) < new Date() &&
        !["CLOSED", "VOIDED"].includes(n.status),
    );
    if (overdueNCRs.length > 0) {
      alerts.push({
        type: "overdue_ncr",
        message: `${overdueNCRs.length} overdue NCR(s)`,
        severity: "error",
      });
    }

    if (criticalNCRs > 0) {
      alerts.push({
        type: "critical_ncr",
        message: `${criticalNCRs} critical NCR(s) open`,
        severity: "error",
      });
    }

    if (pendingApprovals > 5) {
      alerts.push({
        type: "pending_approvals",
        message: `${pendingApprovals} items pending approval`,
        severity: "info",
      });
    }

    // Production trend (last 14 days)
    const now = new Date();
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const productionTrend: DashboardData["productionTrend"] = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayPiles = piles.filter((p) => {
        const updated = new Date(p.updatedAt);
        return (
          updated.toISOString().split("T")[0] === dateStr &&
          p.status === "APPROVED"
        );
      }).length;

      const dayConcrete = concreteDeliveries
        .filter((cd) => new Date(cd.deliveryDate).toISOString().split("T")[0] === dateStr)
        .reduce((sum, cd) => sum + cd.volume, 0);

      productionTrend.push({
        date: dateStr,
        pilesCompleted: dayPiles,
        concreteUsed: Math.round(dayConcrete * 10) / 10,
      });
    }

    logger.debug({ siteId }, "Dashboard data fetched");

    return {
      kpis: {
        totalPiles,
        pilesCompleted,
        pilesInProgress,
        completionPercentage,
        totalConcreteUsed: Math.round(totalConcreteUsed * 10) / 10,
        avgOverconsumption,
        openNCRs,
        criticalNCRs,
        pendingApprovals,
        testsPassRate,
      },
      pilesByStatus,
      recentActivities: activities,
      alerts,
      productionTrend,
    };
  }
}

export const dashboardService = new DashboardService();
