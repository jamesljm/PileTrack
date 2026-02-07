"use client";

import { use } from "react";
import { useNCRs } from "@/queries/use-ncrs";
import { DataTable } from "@/components/tables/data-table";
import { ncrColumns } from "@/components/tables/columns/ncr-columns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { NCR_STATUS_COLORS, NCR_STATUS_LABELS, NCR_PRIORITY_COLORS, NCR_PRIORITY_LABELS } from "@/lib/constants";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import type { NCR, NCRStatus, NCRPriority } from "@piletrack/shared";

function NCRMobileCard({ item, siteId }: { item: NCR; siteId: string }) {
  return (
    <Link href={`/sites/${siteId}/ncrs/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className={`w-1 self-stretch rounded-full ${NCR_PRIORITY_COLORS[item.priority as NCRPriority]?.split(" ")[0] ?? "bg-gray-200"}`} />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{item.ncrNumber}</p>
            <Badge className={`text-[10px] px-1.5 py-0 ${NCR_STATUS_COLORS[item.status as NCRStatus] ?? ""}`}>
              {NCR_STATUS_LABELS[item.status as NCRStatus] ?? item.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">{item.title}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

export default function SiteNCRsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useNCRs({ siteId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Non-Conformance Reports</h1>
        <Link href={`/sites/${siteId}/ncrs/new`}>
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Raise NCR</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={ncrColumns}
          data={data?.data ?? []}
          searchKey="ncrNumber"
          searchPlaceholder="Search NCRs..."
          filterOptions={[{
            key: "status",
            label: "Status",
            options: [
              { value: "OPEN", label: "Open" },
              { value: "INVESTIGATING", label: "Investigating" },
              { value: "ACTION_REQUIRED", label: "Action Required" },
              { value: "RESOLVED", label: "Resolved" },
              { value: "CLOSED", label: "Closed" },
            ],
          }]}
          renderMobileCard={(item) => <NCRMobileCard item={item as NCR} siteId={siteId} />}
        />
      )}
    </div>
  );
}
