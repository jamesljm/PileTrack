"use client";

import { useEquipmentUtilization } from "@/queries/use-reports";
import { ActivitySummaryChart } from "@/components/charts/activity-summary-chart";
import { EquipmentUtilizationChart } from "@/components/charts/equipment-utilization-chart";
import { DailyOutputChart } from "@/components/charts/daily-output-chart";
import { CardsSkeleton } from "@/components/shared/loading-skeleton";

export default function ReportsPage() {
  const { data, isLoading } = useEquipmentUtilization();
  const utilization = data?.data;

  const utilizationData = utilization?.byStatus
    ? Object.entries(utilization.byStatus).map(([name, value]) => ({ name, value: value as number }))
    : [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Reports</h1><p className="text-muted-foreground">Global reports and analytics dashboard</p></div>
      {isLoading ? <CardsSkeleton count={2} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivitySummaryChart data={[]} title="Activities by Type" />
          <EquipmentUtilizationChart data={utilizationData} />
          <DailyOutputChart data={[]} />
        </div>
      )}
    </div>
  );
}
