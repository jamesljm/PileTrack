"use client";

import { use } from "react";
import { useDailyLogs } from "@/queries/use-daily-logs";
import { DataTable } from "@/components/tables/data-table";
import { dailyLogColumns } from "@/components/tables/columns/daily-log-columns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { DAILY_LOG_STATUS_COLORS } from "@/lib/constants";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import type { DailyLog, DailyLogStatus } from "@piletrack/shared";

function DailyLogMobileCard({ item, siteId }: { item: DailyLog; siteId: string }) {
  const totalWorkforce = item.workforce?.reduce((s, w) => s + (w.headcount ?? 0), 0) ?? 0;

  return (
    <Link href={`/sites/${siteId}/daily-logs/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">
              {new Date(item.logDate).toLocaleDateString()}
            </p>
            <Badge className={`text-[10px] px-1.5 py-0 ${DAILY_LOG_STATUS_COLORS[item.status as DailyLogStatus] ?? ""}`}>
              {item.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{totalWorkforce} pax</span>
            {item.createdBy && (
              <>
                <span>-</span>
                <span>{item.createdBy.firstName} {item.createdBy.lastName}</span>
              </>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

export default function SiteDailyLogsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useDailyLogs({ siteId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Daily Logs</h1>
        <Link href={`/sites/${siteId}/daily-logs/new`}>
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">New Daily Log</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={dailyLogColumns}
          data={data?.data ?? []}
          searchKey="logDate"
          searchPlaceholder="Search by date..."
          filterOptions={[{
            key: "status",
            label: "Status",
            options: [
              { value: "DRAFT", label: "Draft" },
              { value: "SUBMITTED", label: "Submitted" },
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
            ],
          }]}
          renderMobileCard={(item) => (
            <DailyLogMobileCard item={item as DailyLog} siteId={siteId} />
          )}
        />
      )}
    </div>
  );
}
