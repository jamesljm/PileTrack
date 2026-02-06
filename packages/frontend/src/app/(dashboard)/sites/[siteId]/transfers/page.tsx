"use client";

import { use } from "react";
import { useTransfers } from "@/queries/use-transfers";
import { DataTable } from "@/components/tables/data-table";
import { transferColumns } from "@/components/tables/columns/transfer-columns";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function SiteTransfersPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useTransfers({ fromSiteId: siteId });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Transfers</h1><p className="text-muted-foreground">Equipment and material transfers</p></div>
        <Link href={`/sites/${siteId}/transfers/new`}><Button><Plus className="mr-2 h-4 w-4" />New Transfer</Button></Link>
      </div>
      {isLoading ? <TableSkeleton /> : <DataTable columns={transferColumns} data={(data?.data ?? []) as any} searchKey="fromSiteName" searchPlaceholder="Search transfers..." />}
    </div>
  );
}
