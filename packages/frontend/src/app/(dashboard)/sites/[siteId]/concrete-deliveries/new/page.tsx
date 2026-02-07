"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ConcreteDeliveryForm } from "@/components/forms/concrete-delivery-form";
import { useCreateConcreteDelivery } from "@/queries/use-concrete-deliveries";
import { toast } from "@/components/ui/use-toast";

export default function NewConcreteDeliveryPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createCD = useCreateConcreteDelivery();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createCD.mutateAsync({ ...data, siteId } as any);
      toast({ title: "Delivery recorded", description: "The concrete delivery has been saved." });
      router.push(`/sites/${siteId}/concrete-deliveries`);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create delivery.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg md:text-2xl font-bold">New Concrete Delivery</h1>
      <ConcreteDeliveryForm onSubmit={handleSubmit} isLoading={createCD.isPending} />
    </div>
  );
}
