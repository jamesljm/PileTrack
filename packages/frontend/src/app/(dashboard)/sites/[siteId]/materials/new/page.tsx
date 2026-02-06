"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { MaterialForm } from "@/components/forms/material-form";
import { useCreateMaterial } from "@/queries/use-materials";
import { toast } from "@/components/ui/use-toast";

export default function NewMaterialPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createMaterial = useCreateMaterial();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createMaterial.mutateAsync({ ...data, siteId } as any);
      toast({ title: "Material created", description: "The material has been added successfully." });
      router.push(`/sites/${siteId}/materials`);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create material.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Add Material</h1><p className="text-muted-foreground">Add a new material to this site</p></div>
      <MaterialForm onSubmit={handleSubmit} isLoading={createMaterial.isPending} />
    </div>
  );
}
