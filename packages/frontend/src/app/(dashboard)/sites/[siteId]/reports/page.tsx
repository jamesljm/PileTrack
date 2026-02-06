"use client";

import { use } from "react";
import { useSiteSummary } from "@/queries/use-reports";
import { ActivitySummaryChart } from "@/components/charts/activity-summary-chart";
import { SiteProgressChart } from "@/components/charts/site-progress-chart";
import { CardsSkeleton } from "@/components/shared/loading-skeleton";
import { ACTIVITY_TYPE_LABELS } from "@/lib/constants";

export default function SiteReportsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useSiteSummary(siteId);
  const summary = data?.data;

  if (isLoading) return <CardsSkeleton count={2} />;

  const activityByTypeData = summary?.activitiesByType
    ? Object.entries(summary.activitiesByType).map(([key, count]) => ({
        name: ACTIVITY_TYPE_LABELS[key as keyof typeof ACTIVITY_TYPE_LABELS] ?? key,
        count: count as number,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Site Reports</h1><p className="text-muted-foreground">Analytics and reports for this site</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitySummaryChart data={activityByTypeData} />
        <SiteProgressChart data={[]} title="Daily Activity Progress" />
      </div>
    </div>
  );
}
