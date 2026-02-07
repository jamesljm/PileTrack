"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ConcreteDeliveryForm } from "@/components/forms/concrete-delivery-form";
import { useCreateConcreteDelivery } from "@/queries/use-concrete-deliveries";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg md:text-2xl font-bold">New Concrete Delivery</h1>
      </div>
      <ConcreteDeliveryForm onSubmit={handleSubmit} isLoading={createCD.isPending} />
    </div>
  );
}
