"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { BoreholeLogForm } from "@/components/forms/borehole-log-form";
import { useCreateBoreholeLog } from "@/queries/use-borehole-logs";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewBoreholeLogPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createBoreholeLog = useCreateBoreholeLog();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createBoreholeLog.mutateAsync({ ...data, siteId } as any);
      toast({ title: "Borehole log created", description: "The borehole log has been saved successfully." });
      router.push(`/sites/${siteId}/borehole-logs`);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create borehole log.", variant: "destructive" });
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
        <h1 className="text-lg md:text-2xl font-bold">New Borehole Log</h1>
      </div>
      <BoreholeLogForm onSubmit={handleSubmit} isLoading={createBoreholeLog.isPending} />
    </div>
  );
}
