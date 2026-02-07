"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { TransferForm } from "@/components/forms/transfer-form";
import { useCreateTransfer } from "@/queries/use-transfers";
import { useSites } from "@/queries/use-sites";
import { useEquipment } from "@/queries/use-equipment";
import { useMaterials } from "@/queries/use-materials";
import { toast } from "@/components/ui/use-toast";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTransferPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createTransfer = useCreateTransfer();
  const { data: sitesData, isLoading } = useSites({ pageSize: 100 });

  const [fromSiteId, setFromSiteId] = useState(siteId);

  const { data: equipmentData } = useEquipment({ siteId: fromSiteId, pageSize: 100 });
  const { data: materialsData } = useMaterials({ siteId: fromSiteId, pageSize: 100 });

  const handleSubmit = async (data: any) => {
    try {
      await createTransfer.mutateAsync(data);
      toast({ title: "Transfer requested", description: "The transfer request has been submitted." });
      router.push(`/sites/${siteId}/transfers`);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create transfer.", variant: "destructive" });
    }
  };

  if (isLoading) return <FormSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg md:text-2xl font-bold">New Transfer</h1>
      </div>
      <TransferForm
        sites={sitesData?.data ?? []}
        equipment={equipmentData?.data ?? []}
        materials={materialsData?.data ?? []}
        defaultFromSiteId={siteId}
        onFromSiteChange={setFromSiteId}
        onSubmit={handleSubmit}
        isLoading={createTransfer.isPending}
      />
    </div>
  );
}
