"use client";

import { use } from "react";
import { useEquipmentItem } from "@/queries/use-equipment";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EQUIPMENT_CATEGORY_LABELS, EQUIPMENT_STATUS_COLORS } from "@/lib/constants";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import type { EquipmentCategory, EquipmentStatus } from "@piletrack/shared";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function EquipmentDetailPage({ params }: { params: Promise<{ siteId: string; equipmentId: string }> }) {
  const { siteId, equipmentId } = use(params);
  const { data, isLoading } = useEquipmentItem(equipmentId);
  const eq = data?.data;
  const site = (eq as any)?.site as { id: string; name: string; code: string } | null | undefined;

  if (isLoading) return <FormSkeleton />;
  if (!eq) return <p className="text-center py-12 text-muted-foreground">Equipment not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-start sm:justify-between">
        <div><h1 className="text-2xl font-bold">{eq.name}</h1><p className="text-muted-foreground">{eq.code}</p></div>
        <div className="flex gap-2">
          <Badge variant="outline">{EQUIPMENT_CATEGORY_LABELS[eq.category as EquipmentCategory]}</Badge>
          <Badge className={EQUIPMENT_STATUS_COLORS[eq.status as EquipmentStatus]}>{eq.status}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" />Current Location</CardTitle></CardHeader>
        <CardContent>
          {site ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{site.name}</p>
                <p className="text-sm text-muted-foreground">{site.code}</p>
              </div>
              <Link href={`/sites/${site.id}`} className="text-sm text-primary hover:underline">
                View Site
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not assigned to any site</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Equipment Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Serial Number:</span> <span className="font-medium">{eq.serialNumber ?? "N/A"}</span></div>
          <div><span className="text-muted-foreground">Manufacturer:</span> <span className="font-medium">{eq.manufacturer ?? "N/A"}</span></div>
          <div><span className="text-muted-foreground">Model:</span> <span className="font-medium">{eq.model ?? "N/A"}</span></div>
          <div><span className="text-muted-foreground">Year:</span> <span className="font-medium">{eq.yearOfManufacture ?? "N/A"}</span></div>
          <div><span className="text-muted-foreground">Last Service:</span> <span className="font-medium">{eq.lastServiceDate ? new Date(eq.lastServiceDate).toLocaleDateString() : "N/A"}</span></div>
          <div><span className="text-muted-foreground">Next Service:</span> <span className="font-medium">{eq.nextServiceDate ? new Date(eq.nextServiceDate).toLocaleDateString() : "N/A"}</span></div>
          {eq.notes && <div className="col-span-2"><span className="text-muted-foreground">Notes:</span> <span className="font-medium">{eq.notes}</span></div>}
        </CardContent>
      </Card>
    </div>
  );
}
