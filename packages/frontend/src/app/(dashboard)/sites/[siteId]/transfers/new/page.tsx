"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { TransferForm } from "@/components/forms/transfer-form";
import { useCreateTransfer } from "@/queries/use-transfers";
import { useSites } from "@/queries/use-sites";
import { toast } from "@/components/ui/use-toast";
import { FormSkeleton } from "@/components/shared/loading-skeleton";

export default function NewTransferPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createTransfer = useCreateTransfer();
  const { data: sitesData, isLoading } = useSites({ pageSize: 100 });

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
      <h1 className="text-lg md:text-2xl font-bold">New Transfer</h1>
      <TransferForm sites={sitesData?.data ?? []} defaultFromSiteId={siteId} onSubmit={handleSubmit} isLoading={createTransfer.isPending} />
    </div>
  );
}
