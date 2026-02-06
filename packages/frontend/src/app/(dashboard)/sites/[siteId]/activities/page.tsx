"use client";

import { use } from "react";
import { useActivities } from "@/queries/use-activities";
import { DataTable } from "@/components/tables/data-table";
import { activityColumns } from "@/components/tables/columns/activity-columns";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ACTIVITY_TYPE_LABELS, ACTIVITY_STATUS_COLORS } from "@/lib/constants";
import { ActivityType, ActivityStatus } from "@piletrack/shared";

export default function SiteActivitiesPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useActivities({ siteId });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Activities</h1><p className="text-muted-foreground">All activities for this site</p></div>
        <Link href={`/sites/${siteId}/activities/new`}><Button><Plus className="mr-2 h-4 w-4" />New Activity</Button></Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={activityColumns}
          data={data?.data ?? []}
          searchKey="siteName"
          searchPlaceholder="Search activities..."
          filterOptions={[
            { key: "activityType", label: "Type", options: Object.entries(ACTIVITY_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })) },
            { key: "status", label: "Status", options: Object.keys(ACTIVITY_STATUS_COLORS).map((s) => ({ value: s, label: s })) },
          ]}
        />
      )}
    </div>
  );
}
