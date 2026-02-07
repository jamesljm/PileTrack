"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { EquipmentForm } from "@/components/forms/equipment-form";
import { useCreateEquipment } from "@/queries/use-equipment";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg md:text-2xl font-bold">Add Equipment</h1>
      </div>
      <EquipmentForm onSubmit={handleSubmit} isLoading={createEquipment.isPending} />
    </div>
  );
}
