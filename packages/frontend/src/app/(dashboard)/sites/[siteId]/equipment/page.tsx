"use client";

import { use, useState } from "react";
import { useEquipment, useUpdateEquipment } from "@/queries/use-equipment";
import { DataTable } from "@/components/tables/data-table";
import { equipmentColumns } from "@/components/tables/columns/equipment-columns";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_STATUS_COLORS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_CONDITION_COLORS,
} from "@/lib/constants";
import Link from "next/link";
import { Plus, Clock, AlertTriangle, ChevronRight, PackagePlus, Loader2 } from "lucide-react";
import type { Equipment, EquipmentCategory, EquipmentStatus, EquipmentCondition } from "@piletrack/shared";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse } from "@piletrack/shared";

function SiteEquipmentMobileCard({ item, siteId }: { item: Equipment; siteId: string }) {
  const isServiceDue = item.nextServiceDate && new Date(item.nextServiceDate) < new Date();

  return (
    <Link href={`/sites/${siteId}/equipment/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{item.name}</p>
            {isServiceDue && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{item.code}</span>
            <span>-</span>
            <span>{EQUIPMENT_CATEGORY_LABELS[item.category as EquipmentCategory]}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-[10px] px-1.5 py-0 ${EQUIPMENT_STATUS_COLORS[item.status as EquipmentStatus]}`}>
              {item.status.replace(/_/g, " ")}
            </Badge>
            {(item as any).condition && (
              <Badge className={`text-[10px] px-1.5 py-0 ${EQUIPMENT_CONDITION_COLORS[(item as any).condition as EquipmentCondition] ?? ""}`}>
                {EQUIPMENT_CONDITION_LABELS[(item as any).condition as EquipmentCondition] ?? (item as any).condition}
              </Badge>
            )}
            {(item as any).totalUsageHours > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {(item as any).totalUsageHours.toFixed(0)}h
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

function AssignExistingDialog({
  open,
  onOpenChange,
  siteId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
}) {
  const { data: unassignedData, isLoading } = useEquipment({
    unassigned: true,
    pageSize: 100,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assigning, setAssigning] = useState(false);

  const unassigned = (unassignedData?.data ?? []) as Equipment[];

  const toggleItem = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAssign = async () => {
    if (selected.size === 0) return;
    setAssigning(true);
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          api.patch<ApiResponse<Equipment>>(`/equipment/${id}`, { siteId }),
        ),
      );
      toast({
        title: "Equipment assigned",
        description: `${selected.size} item${selected.size !== 1 ? "s" : ""} assigned to this site.`,
      });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setSelected(new Set());
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Assignment failed",
        description: error.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Existing Equipment</DialogTitle>
          <DialogDescription>
            Select unassigned equipment to add to this site.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-1 min-h-0 py-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : unassigned.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No unassigned equipment available.
            </p>
          ) : (
            unassigned.map((eq) => (
              <label
                key={eq.id}
                className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={selected.has(eq.id)}
                  onCheckedChange={() => toggleItem(eq.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{eq.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {eq.code} &middot; {EQUIPMENT_CATEGORY_LABELS[eq.category as EquipmentCategory] ?? eq.category}
                  </p>
                </div>
                <Badge className={`text-[10px] px-1.5 py-0 shrink-0 ${EQUIPMENT_STATUS_COLORS[eq.status as EquipmentStatus] ?? ""}`}>
                  {eq.status.replace(/_/g, " ")}
                </Badge>
              </label>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={assigning}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={selected.size === 0 || assigning}>
            {assigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign {selected.size > 0 ? `(${selected.size})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SiteEquipmentPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useEquipment({ siteId });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Site Equipment</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-9" onClick={() => setAssignDialogOpen(true)}>
            <PackagePlus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Assign Existing</span>
            <span className="sm:hidden">Assign</span>
          </Button>
          <Link href={`/sites/${siteId}/equipment/new`}>
            <Button size="sm" className="h-9">
              <Plus className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Add Equipment</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </Link>
        </div>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={equipmentColumns}
          data={data?.data ?? []}
          searchKey="name"
          searchPlaceholder="Search equipment..."
          filterOptions={[{ key: "category", label: "Category", options: Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })) }]}
          renderMobileCard={(item) => <SiteEquipmentMobileCard item={item as Equipment} siteId={siteId} />}
        />
      )}

      <AssignExistingDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        siteId={siteId}
      />
    </div>
  );
}
