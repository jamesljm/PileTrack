"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ActivityFormWrapper } from "@/components/forms/activity/activity-form-wrapper";
import { useCreateActivity } from "@/queries/use-activities";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg md:text-2xl font-bold">New Activity</h1>
      </div>
      <ActivityFormWrapper siteId={siteId} onSubmit={handleSubmit} isLoading={createActivity.isPending} />
    </div>
  );
}
