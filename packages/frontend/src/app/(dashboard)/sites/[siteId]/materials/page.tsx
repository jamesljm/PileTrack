"use client";

import { use, useState } from "react";
import { useMaterials, useDeleteMaterial } from "@/queries/use-materials";
import { DataTable } from "@/components/tables/data-table";
import { materialColumns } from "@/components/tables/columns/material-columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Plus, AlertTriangle, ChevronRight, Trash2, Loader2, MoreVertical, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import type { Material } from "@piletrack/shared";

function MaterialMobileCard({
  item,
  siteId,
  onDelete,
}: {
  item: Material;
  siteId: string;
  onDelete: (item: Material) => void;
}) {
  const isLowStock = item.currentStock <= item.minimumStock;

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Link href={`/sites/${siteId}/materials/${item.id}`} className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate">{item.name}</p>
          {isLowStock && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{item.code}</span>
          {item.category && (
            <>
              <span>-</span>
              <span>{item.category}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className={isLowStock ? "text-destructive font-semibold" : "text-foreground font-medium"}>
            {item.currentStock} {item.unit}
          </span>
          <span className="text-muted-foreground">min: {item.minimumStock}</span>
          {item.unitPrice && (
            <span className="text-muted-foreground">${item.unitPrice}/{item.unit}</span>
          )}
        </div>
      </Link>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => { e.preventDefault(); onDelete(item); }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Link href={`/sites/${siteId}/materials/${item.id}`}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}

export default function SiteMaterialsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useMaterials({ siteId });
  const deleteMaterial = useDeleteMaterial();
  const { toast } = useToast();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null);

  const handleDelete = async () => {
    if (!deletingMaterial) return;
    try {
      await deleteMaterial.mutateAsync(deletingMaterial.id);
      toast({ title: "Material deleted", description: `"${deletingMaterial.name}" has been removed.` });
      setDeleteDialogOpen(false);
      setDeletingMaterial(null);
    } catch {
      toast({ title: "Error", description: "Failed to delete material.", variant: "destructive" });
    }
  };

  const openDeleteDialog = (material: Material) => {
    setDeletingMaterial(material);
    setDeleteDialogOpen(true);
  };

  // Add actions column to the existing material columns
  const columnsWithActions: ColumnDef<Material>[] = [
    ...materialColumns,
    {
      id: "actions",
      cell: ({ row }) => {
        const material = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/sites/${siteId}/materials/${material.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => openDeleteDialog(material)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Materials</h1>
        <Link href={`/sites/${siteId}/materials/new`}>
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Add Material</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={columnsWithActions}
          data={data?.data ?? []}
          searchKey="name"
          searchPlaceholder="Search materials..."
          renderMobileCard={(item) => (
            <MaterialMobileCard
              item={item as Material}
              siteId={siteId}
              onDelete={openDeleteDialog}
            />
          )}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setDeletingMaterial(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Material</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingMaterial?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMaterial.isPending}>
              {deleteMaterial.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
