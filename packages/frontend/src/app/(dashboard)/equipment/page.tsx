"use client";

import { useEquipment } from "@/queries/use-equipment";
import { DataTable } from "@/components/tables/data-table";
import { equipmentColumns } from "@/components/tables/columns/equipment-columns";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QrCode } from "lucide-react";

export default function EquipmentPage() {
  const { data, isLoading } = useEquipment();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">Equipment</h1><p className="text-muted-foreground">All equipment across sites</p></div>
        <Link href="/equipment/scan"><Button variant="outline" className="w-full sm:w-auto"><QrCode className="mr-2 h-4 w-4" />Scan QR</Button></Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable columns={equipmentColumns} data={data?.data ?? []} searchKey="name" searchPlaceholder="Search equipment..."
          filterOptions={[{ key: "category", label: "Category", options: Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })) }]}
        />
      )}
    </div>
  );
}
