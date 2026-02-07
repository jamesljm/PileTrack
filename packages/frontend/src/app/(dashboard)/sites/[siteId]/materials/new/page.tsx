"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { MaterialForm } from "@/components/forms/material-form";
import { useCreateMaterial } from "@/queries/use-materials";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg md:text-2xl font-bold">Add Material</h1>
      </div>
      <MaterialForm onSubmit={handleSubmit} isLoading={createMaterial.isPending} />
    </div>
  );
}
