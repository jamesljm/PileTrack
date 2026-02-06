"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (reason: string) => void;
  isLoading?: boolean;
}

export function RejectionDialog({ open, onOpenChange, onReject, isLoading }: RejectionDialogProps) {
  const [reason, setReason] = useState("");

  const handleReject = () => {
    if (!reason.trim()) return;
    onReject(reason);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Activity</DialogTitle>
          <DialogDescription>Please provide a reason for rejecting this activity.</DialogDescription>
        </DialogHeader>
        <Textarea placeholder="Reason for rejection (required)..." value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-[100px]" />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
          <Button variant="destructive" onClick={handleReject} disabled={isLoading || !reason.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
