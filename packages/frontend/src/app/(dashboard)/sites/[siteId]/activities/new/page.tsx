"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ActivityFormWrapper } from "@/components/forms/activity/activity-form-wrapper";
import { useCreateActivity } from "@/queries/use-activities";
import { toast } from "@/components/ui/use-toast";

export default function NewActivityPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createActivity = useCreateActivity();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createActivity.mutateAsync(data as any);
      toast({ title: "Activity created", description: "The activity has been submitted successfully." });
      router.push(`/sites/${siteId}/activities`);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create activity.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">New Activity</h1><p className="text-muted-foreground">Record a new piling activity</p></div>
      <ActivityFormWrapper siteId={siteId} onSubmit={handleSubmit} isLoading={createActivity.isPending} />
    </div>
  );
}
