"use client";

import { useFleetStats } from "@/queries/use-equipment";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_STATUS_COLORS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_CONDITION_COLORS,
} from "@/lib/constants";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import {
  Wrench,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function FleetDashboardPage() {
  const { data, isLoading } = useFleetStats();
  const stats = data?.data;

  if (isLoading) return <FormSkeleton />;
  if (!stats) {
    return (
      <p className="text-center py-12 text-muted-foreground">
        Unable to load fleet statistics.
      </p>
    );
  }

  const inUseCount = stats.byStatus["IN_USE"] ?? 0;
  const maintenanceCount = stats.byStatus["MAINTENANCE"] ?? 0;

  return (
    <div className="space-y-4">
      <h1 className="text-lg md:text-2xl font-bold">Fleet Dashboard</h1>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-blue-100 p-1.5 md:p-2 shrink-0">
                <Wrench className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Total</p>
                <p className="text-lg md:text-2xl font-bold">{stats.totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-green-100 p-1.5 md:p-2 shrink-0">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground">In Use</p>
                <p className="text-lg md:text-2xl font-bold">{inUseCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-yellow-100 p-1.5 md:p-2 shrink-0">
                <Wrench className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Maint.</p>
                <p className="text-lg md:text-2xl font-bold">{maintenanceCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-red-100 p-1.5 md:p-2 shrink-0">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Overdue</p>
                <p className="text-lg md:text-2xl font-bold">{stats.serviceOverdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Fleet Value and Avg Utilization */}
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-emerald-100 p-1.5 md:p-2 shrink-0">
                <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs text-muted-foreground">Fleet Value</p>
                <p className="text-base md:text-2xl font-bold truncate">
                  ${stats.totalFleetValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-purple-100 p-1.5 md:p-2 shrink-0">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Avg Hours</p>
                <p className="text-base md:text-2xl font-bold">{stats.avgUtilizationRate.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">By Status</h3>
            <div className="space-y-1.5">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <Badge className={`text-[10px] md:text-xs ${EQUIPMENT_STATUS_COLORS[status as keyof typeof EQUIPMENT_STATUS_COLORS] ?? ""}`}>
                    {status.replace(/_/g, " ")}
                  </Badge>
                  <span className="font-medium text-sm">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">By Condition</h3>
            <div className="space-y-1.5">
              {Object.entries(stats.byCondition).map(([condition, count]) => (
                <div key={condition} className="flex items-center justify-between">
                  <Badge className={`text-[10px] md:text-xs ${EQUIPMENT_CONDITION_COLORS[condition as keyof typeof EQUIPMENT_CONDITION_COLORS] ?? ""}`}>
                    {EQUIPMENT_CONDITION_LABELS[condition as keyof typeof EQUIPMENT_CONDITION_LABELS] ?? condition}
                  </Badge>
                  <span className="font-medium text-sm">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">By Category</h3>
            <div className="space-y-1.5">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-muted-foreground truncate">
                    {EQUIPMENT_CATEGORY_LABELS[category as keyof typeof EQUIPMENT_CATEGORY_LABELS] ?? category}
                  </span>
                  <span className="font-medium text-sm">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Top Used and Service Due Soon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Most Used
            </h3>
            {stats.topUsed.length === 0 ? (
              <p className="text-xs text-muted-foreground">No usage data</p>
            ) : (
              <div className="space-y-2">
                {stats.topUsed.map((eq, i) => (
                  <div key={eq.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs text-muted-foreground w-4 shrink-0">{i + 1}.</span>
                      <span className="text-sm font-medium truncate">{eq.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{eq.totalUsageHours.toFixed(1)}h</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Service Due
            </h3>
            {stats.serviceDueSoon.length === 0 ? (
              <p className="text-xs text-muted-foreground">No upcoming service</p>
            ) : (
              <div className="space-y-2">
                {stats.serviceDueSoon.map((eq) => (
                  <div key={eq.id} className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">{eq.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {eq.nextServiceDate ? new Date(eq.nextServiceDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
