"use client";

import { useMemo } from "react";
import { useEquipmentUtilization } from "@/queries/use-reports";
import { useActivities } from "@/queries/use-activities";
import { ActivitySummaryChart } from "@/components/charts/activity-summary-chart";
import { EquipmentUtilizationChart } from "@/components/charts/equipment-utilization-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardsSkeleton } from "@/components/shared/loading-skeleton";
import { ACTIVITY_TYPE_LABELS } from "@/lib/constants";
import { Activity, ClipboardCheck, Clock, AlertTriangle } from "lucide-react";

export default function ReportsPage() {
  // Equipment utilization - may 403 for WORKER users
  const {
    data: utilizationData,
    isLoading: utilizationLoading,
    isError: utilizationError,
  } = useEquipmentUtilization();

  // Activities - available to all authenticated users
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    isError: activitiesError,
  } = useActivities({ pageSize: 100 });

  const utilization = utilizationData?.data;
  const activities = (activitiesData?.data ?? []) as Array<Record<string, any>>;

  // Compute equipment utilization chart data
  const equipmentChartData = useMemo(() => {
    if (!utilization?.byStatus) return [];
    return Object.entries(utilization.byStatus).map(([name, value]) => ({
      name,
      value: value as number,
    }));
  }, [utilization]);

  // Compute activity-by-type counts
  const activityByTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const act of activities) {
      const type = act.activityType as string;
      if (type) {
        counts[type] = (counts[type] ?? 0) + 1;
      }
    }
    return Object.entries(counts).map(([key, count]) => ({
      name:
        ACTIVITY_TYPE_LABELS[key as keyof typeof ACTIVITY_TYPE_LABELS] ?? key,
      count,
    }));
  }, [activities]);

  // Compute activity summary counts
  const activityCounts = useMemo(() => {
    let total = activities.length;
    let approved = 0;
    let pending = 0;
    for (const act of activities) {
      const status = act.status as string;
      if (status === "APPROVED") approved++;
      if (status === "SUBMITTED" || status === "DRAFT") pending++;
    }
    return { total, approved, pending };
  }, [activities]);

  const isLoading = utilizationLoading || activitiesLoading;

  // If both data sources errored, show a friendly message
  if (utilizationError && activitiesError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Global reports and analytics dashboard
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No report data available. You may not have permission to view
              reports, or the data could not be loaded at this time.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Global reports and analytics dashboard
        </p>
      </div>

      {isLoading ? (
        <CardsSkeleton count={3} />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Activities
                  </p>
                  <p className="text-2xl font-bold">{activityCounts.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-md bg-green-100 p-2">
                  <ClipboardCheck className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">
                    {activityCounts.approved}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-md bg-yellow-100 p-2">
                  <Clock className="h-5 w-5 text-yellow-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending / Draft
                  </p>
                  <p className="text-2xl font-bold">{activityCounts.pending}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity by Type chart - always shown if we have activity data */}
            {!activitiesError && (
              <ActivitySummaryChart
                data={activityByTypeData}
                title="Activities by Type"
              />
            )}

            {/* Equipment Utilization chart - only if API succeeded */}
            {!utilizationError ? (
              <EquipmentUtilizationChart data={equipmentChartData} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Equipment Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Access denied or data unavailable.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You may not have permission to view equipment utilization
                      data.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
