"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { NCRForm } from "@/components/forms/ncr-form";
import { useCreateNCR } from "@/queries/use-ncrs";
import { toast } from "@/components/ui/use-toast";

export default function NewNCRPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createNCR = useCreateNCR();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createNCR.mutateAsync({ ...data, siteId } as any);
      toast({ title: "NCR raised", description: "The NCR has been created successfully." });
      router.push(`/sites/${siteId}/ncrs`);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create NCR.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg md:text-2xl font-bold">Raise NCR</h1>
      <NCRForm onSubmit={handleSubmit} isLoading={createNCR.isPending} />
    </div>
  );
}
