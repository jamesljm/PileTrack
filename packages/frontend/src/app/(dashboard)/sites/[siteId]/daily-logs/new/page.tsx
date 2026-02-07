"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { DailyLogForm } from "@/components/forms/daily-log-form";
import { useCreateDailyLog } from "@/queries/use-daily-logs";
import { toast } from "@/components/ui/use-toast";

export default function NewDailyLogPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createDailyLog = useCreateDailyLog();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createDailyLog.mutateAsync({ ...data, siteId } as any);
      toast({ title: "Daily log created", description: "The daily log has been saved successfully." });
      router.push(`/sites/${siteId}/daily-logs`);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create daily log.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg md:text-2xl font-bold">New Daily Log</h1>
      <DailyLogForm onSubmit={handleSubmit} isLoading={createDailyLog.isPending} />
    </div>
  );
}
