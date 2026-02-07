"use client";

import { use } from "react";
import { useActivities } from "@/queries/use-activities";
import { DataTable } from "@/components/tables/data-table";
import { activityColumns } from "@/components/tables/columns/activity-columns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Plus, ChevronRight, User } from "lucide-react";
import { ACTIVITY_TYPE_LABELS, ACTIVITY_STATUS_COLORS } from "@/lib/constants";
import { format } from "date-fns";
import type { ActivityRecord } from "@piletrack/shared";
import { ActivityType, ActivityStatus } from "@piletrack/shared";

function ActivityMobileCard({ item, siteId }: { item: ActivityRecord; siteId: string }) {
  const typeName = ACTIVITY_TYPE_LABELS[item.activityType as ActivityType] ?? item.activityType;
  const statusColor = ACTIVITY_STATUS_COLORS[item.status as ActivityStatus] ?? "";
  const createdBy = item.createdBy ? `${item.createdBy.firstName} ${item.createdBy.lastName}` : "";

  return (
    <Link href={`/sites/${siteId}/activities/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{typeName}</p>
            <Badge className={`text-[10px] px-1.5 py-0 ${statusColor}`}>
              {item.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{format(new Date(item.activityDate), "dd MMM yyyy")}</span>
            {createdBy && (
              <>
                <span>-</span>
                <span className="flex items-center gap-0.5">
                  <User className="h-3 w-3" />
                  {createdBy}
                </span>
              </>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

export default function SiteActivitiesPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useActivities({ siteId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Activities</h1>
        <Link href={`/sites/${siteId}/activities/new`}>
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">New Activity</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
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
          renderMobileCard={(item) => <ActivityMobileCard item={item as ActivityRecord} siteId={siteId} />}
        />
      )}
    </div>
  );
}
