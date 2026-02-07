"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PileForm } from "@/components/forms/pile-form";
import { useCreatePile } from "@/queries/use-piles";
import { toast } from "@/components/ui/use-toast";

export default function NewPilePage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createPile = useCreatePile();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createPile.mutateAsync({ ...data, siteId } as any);
      toast({ title: "Pile created", description: "The pile has been saved successfully." });
      router.push(`/sites/${siteId}/piles`);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create pile.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg md:text-2xl font-bold">New Pile</h1>
      <PileForm onSubmit={handleSubmit} isLoading={createPile.isPending} />
    </div>
  );
}
