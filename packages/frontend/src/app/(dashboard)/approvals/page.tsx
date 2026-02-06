"use client";

import { useState } from "react";
import { usePendingActivities, useApproveActivity, useRejectActivity } from "@/queries/use-activities";
import { ApprovalCard } from "@/components/cards/approval-card";
import { ApprovalDialog } from "@/components/modals/approval-dialog";
import { RejectionDialog } from "@/components/modals/rejection-dialog";
import { CardsSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "@/components/ui/use-toast";
import { CheckSquare } from "lucide-react";
import type { ActivityType } from "@piletrack/shared";

export default function ApprovalsPage() {
  const { data, isLoading } = usePendingActivities();
  const approveActivity = useApproveActivity();
  const rejectActivity = useRejectActivity();
  const [approvalId, setApprovalId] = useState<string | null>(null);
  const [rejectionId, setRejectionId] = useState<string | null>(null);

  const handleApprove = async (comments?: string) => {
    if (!approvalId) return;
    try {
      await approveActivity.mutateAsync({ id: approvalId, data: { comments } });
      toast({ title: "Activity approved" });
      setApprovalId(null);
    } catch { toast({ title: "Error", description: "Failed to approve.", variant: "destructive" }); }
  };

  const handleReject = async (reason: string) => {
    if (!rejectionId) return;
    try {
      await rejectActivity.mutateAsync({ id: rejectionId, data: { reason } });
      toast({ title: "Activity rejected" });
      setRejectionId(null);
    } catch { toast({ title: "Error", description: "Failed to reject.", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Pending Approvals</h1><p className="text-muted-foreground">Review and approve submitted activities</p></div>
      {isLoading ? <CardsSkeleton count={4} /> : data?.data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map((activity) => (
            <ApprovalCard key={activity.id} id={activity.id} activityType={(activity as any).activityType as ActivityType} date={(activity as any).activityDate} siteName={(activity as any).site?.name} createdByName={(activity as any).createdBy ? `${(activity as any).createdBy.firstName} ${(activity as any).createdBy.lastName}` : undefined} onApprove={setApprovalId} onReject={setRejectionId} />
          ))}
        </div>
      ) : <EmptyState icon={CheckSquare} title="No pending approvals" description="All activities have been reviewed." />}
      <ApprovalDialog open={!!approvalId} onOpenChange={() => setApprovalId(null)} onApprove={handleApprove} isLoading={approveActivity.isPending} />
      <RejectionDialog open={!!rejectionId} onOpenChange={() => setRejectionId(null)} onReject={handleReject} isLoading={rejectActivity.isPending} />
    </div>
  );
}
