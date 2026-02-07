"use client";

import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  Info,
  HardHat,
  Beaker,
  ClipboardCheck,
  Droplets,
  ShieldAlert,
} from "lucide-react";

import { useSiteDashboard } from "@/queries/use-dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardsSkeleton } from "@/components/shared/loading-skeleton";
import { PILE_STATUS_LABELS } from "@/lib/constants";

// ─── Pie chart colors keyed by PileStatus enum values ───────────────────────

const PIE_COLORS: Record<string, string> = {
  PLANNED: "#94a3b8",
  SET_UP: "#60a5fa",
  BORED: "#f59e0b",
  CAGED: "#a78bfa",
  CONCRETED: "#f97316",
  TESTED: "#06b6d4",
  APPROVED: "#22c55e",
  REJECTED: "#ef4444",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function statusLabel(status: string): string {
  return (
    PILE_STATUS_LABELS[status as keyof typeof PILE_STATUS_LABELS] ??
    status.replace(/_/g, " ")
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function SiteCommandCenter({ siteId }: { siteId: string }) {
  const { data: response, isLoading, isError, error } = useSiteDashboard(siteId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardsSkeleton count={5} />
        <CardsSkeleton count={2} />
        <CardsSkeleton count={1} />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Failed to load dashboard</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {(error as Error)?.message ?? "An unexpected error occurred."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const dashboard = response?.data;

  if (!dashboard) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No dashboard data available for this site.
        </CardContent>
      </Card>
    );
  }

  const { kpis, pilesByStatus, alerts, productionTrend } = dashboard;

  // Build pie data from pilesByStatus
  const pieData = Object.entries(pilesByStatus).map(([status, value]) => ({
    name: statusLabel(status),
    value,
    status,
  }));

  // Format production trend dates
  const trendData = productionTrend.map((pt) => ({
    ...pt,
    label: formatDate(pt.date),
  }));

  // Derive approximate pass/total counts from testsPassRate and pilesCompleted.
  // The API provides a percentage; we estimate the denominator from completed piles.
  const testsTotal = kpis.pilesCompleted;
  const testsPassed =
    kpis.testsPassRate > 0
      ? Math.round(testsTotal * (kpis.testsPassRate / 100))
      : 0;

  return (
    <div className="space-y-6">
      {/* ───── Row 1: KPI Health Strip ───── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {/* Pile Progress */}
        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pile Progress</CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.pilesCompleted}/{kpis.totalPiles}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.completionPercentage.toFixed(1)}% complete
            </p>
            {/* Mini progress bar */}
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{
                  width: `${Math.min(kpis.completionPercentage, 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Concrete Usage */}
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concrete Usage</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.totalConcreteUsed.toLocaleString()} m&sup3;
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.avgOverconsumption.toFixed(1)}% overconsumption
            </p>
          </CardContent>
        </Card>

        {/* Open NCRs */}
        <Card className="border-t-4 border-t-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open NCRs</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{kpis.openNCRs}</span>
              {kpis.criticalNCRs > 0 && (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  {kpis.criticalNCRs} critical
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              non-conformance reports
            </p>
          </CardContent>
        </Card>

        {/* Tests Pass Rate */}
        <Card className="border-t-4 border-t-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Pass Rate</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.testsPassRate}%</div>
            <p className="text-xs text-muted-foreground">
              ({testsPassed}/{testsTotal})
            </p>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="border-t-4 border-t-violet-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* ───── Row 2: Charts ───── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Production Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Production Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No production data available yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={trendData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorPiles"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#22c55e"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#22c55e"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorConcrete"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                    label={{
                      value: "Piles",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 12 },
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                    label={{
                      value: "Concrete (m\u00B3)",
                      angle: 90,
                      position: "insideRight",
                      style: { fontSize: 12 },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--popover))",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="pilesCompleted"
                    name="Piles Completed"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#colorPiles)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="concreteUsed"
                    name="Concrete (m\u00B3)"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorConcrete)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pile Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Pile Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No pile status data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={PIE_COLORS[entry.status] ?? "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--popover))",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ───── Row 3: Alerts Panel ───── */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, idx) => {
              const severityStyles =
                alert.severity === "critical"
                  ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                  : alert.severity === "warning"
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                    : "border-blue-500 bg-blue-50 dark:bg-blue-950/20";

              const Icon =
                alert.severity === "critical" || alert.severity === "warning"
                  ? AlertTriangle
                  : Info;

              const iconColor =
                alert.severity === "critical"
                  ? "text-red-600"
                  : alert.severity === "warning"
                    ? "text-amber-600"
                    : "text-blue-600";

              return (
                <div
                  key={`${alert.type}-${idx}`}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${severityStyles}`}
                >
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium capitalize">
                      {alert.type.replace(/_/g, " ")}
                    </p>
                    {alert.link ? (
                      <Link
                        href={alert.link}
                        className="text-sm underline underline-offset-2 hover:opacity-80"
                      >
                        {alert.message}
                      </Link>
                    ) : (
                      <p className="text-sm">{alert.message}</p>
                    )}
                  </div>
                  <Badge
                    className={
                      alert.severity === "critical"
                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                        : alert.severity === "warning"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
