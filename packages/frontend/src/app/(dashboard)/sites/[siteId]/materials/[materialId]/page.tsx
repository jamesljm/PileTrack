"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMaterial, useDeleteMaterial } from "@/queries/use-materials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";

export default function MaterialDetailPage({
  params,
}: {
  params: Promise<{ siteId: string; materialId: string }>;
}) {
  const { siteId, materialId } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const { data, isLoading } = useMaterial(materialId);
  const material = data?.data as Record<string, any> | undefined;

  const deleteMaterial = useDeleteMaterial();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMaterial.mutateAsync(materialId);
      toast({
        title: "Material deleted",
        description: "The material has been removed.",
      });
      router.push(`/sites/${siteId}/materials`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete material.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <FormSkeleton />;
  if (!material)
    return (
      <p className="text-center py-12 text-muted-foreground">
        Material not found
      </p>
    );

  const isLowStock =
    material.minimumStock != null &&
    material.currentStock != null &&
    material.currentStock < material.minimumStock;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}/materials`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold truncate">
            {material.name}
          </h1>
        </div>
        <Badge
          className={
            isLowStock
              ? "bg-red-100 text-red-800 shrink-0"
              : "bg-green-100 text-green-800 shrink-0"
          }
        >
          Stock: {material.currentStock ?? 0} {material.unit ?? ""}
        </Badge>
      </div>

      {/* Details Card */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-3">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{material.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unit</span>
              <span className="font-medium">{material.unit ?? "\u2014"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Stock</span>
              <span className="font-medium">
                {material.currentStock ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum Stock</span>
              <span className="font-medium">
                {material.minimumStock ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unit Price</span>
              <span className="font-medium">
                {material.unitPrice != null
                  ? `$${Number(material.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  : "\u2014"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Supplier</span>
              <span className="font-medium">
                {material.supplier ?? "\u2014"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Card */}
      {material.notes && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Notes</h3>
            <p className="text-sm whitespace-pre-wrap">{material.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Button */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-destructive border-destructive/50 hover:bg-destructive/10"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Delete Material
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Material</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{material.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMaterial.isPending}
            >
              {deleteMaterial.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
