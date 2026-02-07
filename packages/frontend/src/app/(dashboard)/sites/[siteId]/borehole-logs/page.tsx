"use client";

import { use } from "react";
import { useBoreholeLogs } from "@/queries/use-borehole-logs";
import { DataTable } from "@/components/tables/data-table";
import { boreholeLogColumns } from "@/components/tables/columns/borehole-log-columns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import type { BoreholeLog } from "@piletrack/shared";

function BoreholeLogMobileCard({ item, siteId }: { item: BoreholeLog; siteId: string }) {
  return (
    <Link href={`/sites/${siteId}/borehole-logs/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{item.boreholeId}</Badge>
            <span className="text-sm font-semibold">{item.totalDepth}m</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{new Date(item.logDate).toLocaleDateString()}</span>
            {item.location && (
              <>
                <span>-</span>
                <span className="truncate">{item.location}</span>
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {item.strata?.length ?? 0} layers
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

export default function SiteBoreholeLogsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useBoreholeLogs({ siteId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Borehole Logs</h1>
        <Link href={`/sites/${siteId}/borehole-logs/new`}>
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">New Borehole Log</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={boreholeLogColumns}
          data={data?.data ?? []}
          searchKey="boreholeId"
          searchPlaceholder="Search boreholes..."
          renderMobileCard={(item) => (
            <BoreholeLogMobileCard item={item as BoreholeLog} siteId={siteId} />
          )}
        />
      )}
    </div>
  );
}
