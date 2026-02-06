"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { EquipmentForm } from "@/components/forms/equipment-form";
import { useCreateEquipment } from "@/queries/use-equipment";
import { toast } from "@/components/ui/use-toast";

export default function NewEquipmentPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createEquipment = useCreateEquipment();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createEquipment.mutateAsync({ ...data, siteId } as any);
      toast({ title: "Equipment created", description: "The equipment has been added successfully." });
      router.push(`/sites/${siteId}/equipment`);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create equipment.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Add Equipment</h1><p className="text-muted-foreground">Add new equipment to this site</p></div>
      <EquipmentForm onSubmit={handleSubmit} isLoading={createEquipment.isPending} />
    </div>
  );
}
