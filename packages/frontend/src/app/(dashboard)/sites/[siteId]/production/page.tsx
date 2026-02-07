"use client";

import { use, useState } from "react";
import { useProduction } from "@/queries/use-production";
import type { ProductionKPIs } from "@/queries/use-production";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { OverconsumptionBadge } from "@/components/shared/overconsumption-badge";
import { ACTIVITY_TYPE_LABELS } from "@/lib/constants";
import type { ActivityType } from "@piletrack/shared";
import Link from "next/link";

export default function ProductionPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = use(params);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, isLoading } = useProduction(
    siteId,
    fromDate || undefined,
    toDate || undefined,
  );
  const kpis = data?.data as ProductionKPIs | undefined;

  if (isLoading) return <FormSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold">Production Dashboard</h1>
        <div className="flex gap-2">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="From"
            className="w-[150px] min-h-[44px]"
          />
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="To"
            className="w-[150px] min-h-[44px]"
          />
        </div>
      </div>

      {!kpis ? (
        <p className="text-center py-12 text-muted-foreground">
          No production data available
        </p>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  Piles Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold">
                  {kpis.pilesCompleted}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  Total Metres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold">
                  {kpis.metresDrilled.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground ml-1">m</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  Avg Cycle Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold">
                  {kpis.avgCycleTimeMinutes > 0
                    ? `${Math.floor(kpis.avgCycleTimeMinutes / 60)}h ${kpis.avgCycleTimeMinutes % 60}m`
                    : "—"}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  Avg Overconsumption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`text-3xl font-bold ${
                    kpis.avgOverconsumption > 10
                      ? "text-red-600"
                      : kpis.avgOverconsumption > 5
                        ? "text-amber-600"
                        : "text-green-600"
                  }`}
                >
                  {kpis.avgOverconsumption > 0
                    ? `${kpis.avgOverconsumption.toFixed(1)}%`
                    : "—"}
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  Total Concrete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">
                  {kpis.totalConcreteUsed.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground ml-1">m³</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  Rig Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">
                  {kpis.rigUtilization}%
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase">
                  Equipment Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">
                  {kpis.equipmentHours.length}
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Overconsumption per pile */}
          {kpis.overconsumptionByPile.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Overconsumption by Pile (Worst First)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {kpis.overconsumptionByPile.map((pile) => (
                    <Link
                      key={pile.activityId}
                      href={`/sites/${siteId}/activities/${pile.activityId}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border"
                    >
                      <div>
                        <span className="font-medium">{pile.pileId}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {ACTIVITY_TYPE_LABELS[pile.activityType as ActivityType] ?? pile.activityType}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {pile.activityDate}
                        </span>
                      </div>
                      <OverconsumptionBadge
                        theoreticalVolume={pile.theoreticalVolume}
                        actualVolume={pile.actualVolume}
                        overconsumptionPct={pile.overconsumptionPct}
                      />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Equipment Hours */}
          {kpis.equipmentHours.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Equipment Hours Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Equipment</th>
                        <th className="text-right py-2 px-2">Total Hours</th>
                        <th className="text-right py-2 px-2">Productive</th>
                        <th className="text-right py-2 px-2">Downtime</th>
                        <th className="text-right py-2 px-2">Utilization</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpis.equipmentHours.map((eq, i) => {
                        const util =
                          eq.totalHours > 0
                            ? Math.round(
                                (eq.productiveHours / eq.totalHours) * 100,
                              )
                            : 0;
                        return (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2 px-2 font-medium">
                              {eq.name}
                            </td>
                            <td className="py-2 px-2 text-right">
                              {eq.totalHours.toFixed(1)}
                            </td>
                            <td className="py-2 px-2 text-right">
                              {eq.productiveHours.toFixed(1)}
                            </td>
                            <td className="py-2 px-2 text-right">
                              {eq.downtimeHours > 0 && (
                                <span className="text-red-600">
                                  {eq.downtimeHours.toFixed(1)}
                                </span>
                              )}
                              {eq.downtimeHours === 0 && "0.0"}
                            </td>
                            <td className="py-2 px-2 text-right">
                              <Badge
                                className={
                                  util >= 80
                                    ? "bg-green-100 text-green-800"
                                    : util >= 50
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {util}%
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
