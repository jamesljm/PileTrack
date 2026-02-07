"use client";

import { use } from "react";
import { redirect } from "next/navigation";
import { useEquipmentItem } from "@/queries/use-equipment";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_STATUS_COLORS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_CONDITION_COLORS,
} from "@/lib/constants";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import type { EquipmentCategory, EquipmentStatus, EquipmentCondition } from "@piletrack/shared";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function StandaloneEquipmentDetailPage({
  params,
}: {
  params: Promise<{ equipmentId: string }>;
}) {
  const { equipmentId } = use(params);
  const { data, isLoading } = useEquipmentItem(equipmentId);
  const eq = data?.data;
  const site = (eq as any)?.site as { id: string; name: string; code: string } | null | undefined;

  if (isLoading) return <FormSkeleton />;
  if (!eq)
    return (
      <p className="text-center py-12 text-muted-foreground">
        Equipment not found
      </p>
    );

  // If it has a site, redirect to the site-scoped detail page
  if (eq.siteId && site) {
    redirect(`/sites/${eq.siteId}/equipment/${equipmentId}`);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold truncate">{eq.name}</h1>
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
            <span>{eq.code}</span>
            <span>-</span>
            <span>{EQUIPMENT_CATEGORY_LABELS[eq.category as EquipmentCategory]}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge className={`text-[10px] md:text-xs px-1.5 py-0 ${EQUIPMENT_STATUS_COLORS[eq.status as EquipmentStatus]}`}>
            {eq.status}
          </Badge>
          <Badge className={`text-[10px] md:text-xs px-1.5 py-0 ${EQUIPMENT_CONDITION_COLORS[(eq as any).condition as EquipmentCondition] ?? "bg-gray-100 text-gray-800"}`}>
            {EQUIPMENT_CONDITION_LABELS[(eq as any).condition as EquipmentCondition] ?? "Unknown"}
          </Badge>
        </div>
      </div>

      {site && (
        <Link href={`/sites/${site.id}`}>
          <div className="flex items-center gap-2 rounded-lg border p-3 active:bg-accent/50 transition-colors">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{site.name}</p>
              <p className="text-xs text-muted-foreground">{site.code}</p>
            </div>
          </div>
        </Link>
      )}

      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-3">Details</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Serial Number:</span>{" "}
              <span className="font-medium">{eq.serialNumber ?? "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Manufacturer:</span>{" "}
              <span className="font-medium">{eq.manufacturer ?? "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Model:</span>{" "}
              <span className="font-medium">{eq.model ?? "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Year:</span>{" "}
              <span className="font-medium">{eq.yearOfManufacture ?? "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Hours:</span>{" "}
              <span className="font-medium">{(eq as any).totalUsageHours?.toFixed(1) ?? "0.0"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Service:</span>{" "}
              <span className="font-medium">
                {eq.lastServiceDate ? new Date(eq.lastServiceDate).toLocaleDateString() : "N/A"}
              </span>
            </div>
            {eq.notes && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Notes:</span>{" "}
                <span className="font-medium">{eq.notes}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        This equipment is not assigned to a site. Assign it to a site to access full details.
      </p>
    </div>
  );
}
