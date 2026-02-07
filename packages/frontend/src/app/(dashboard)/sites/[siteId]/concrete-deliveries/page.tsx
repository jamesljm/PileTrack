"use client";

import { use } from "react";
import { useConcreteDeliveries } from "@/queries/use-concrete-deliveries";
import { DataTable } from "@/components/tables/data-table";
import { concreteDeliveryColumns } from "@/components/tables/columns/concrete-delivery-columns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Plus, ChevronRight, ArrowLeft } from "lucide-react";
import type { ConcreteDelivery } from "@piletrack/shared";

function CDMobileCard({ item, siteId }: { item: ConcreteDelivery; siteId: string }) {
  return (
    <Link href={`/sites/${siteId}/concrete-deliveries/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{item.doNumber}</p>
            <Badge variant="outline" className="text-[10px]">{item.concreteGrade}</Badge>
            {item.rejected && <Badge className="text-[10px] bg-red-100 text-red-800">Rejected</Badge>}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{new Date(item.deliveryDate).toLocaleDateString()}</span>
            <span>-</span>
            <span>{item.volume} m³</span>
            <span>-</span>
            <span>{item.supplier}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

export default function SiteConcreteDeliveriesPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useConcreteDeliveries({ siteId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Link href={`/sites/${siteId}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg md:text-2xl font-bold">Concrete Deliveries</h1>
        </div>
        <Link href={`/sites/${siteId}/concrete-deliveries/new`}>
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">New Delivery</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={concreteDeliveryColumns}
          data={data?.data ?? []}
          searchKey="doNumber"
          searchPlaceholder="Search by DO number..."
          renderMobileCard={(item) => <CDMobileCard item={item as ConcreteDelivery} siteId={siteId} />}
        />
      )}
    </div>
  );
}
