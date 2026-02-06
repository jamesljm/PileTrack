"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (comments?: string) => void;
  isLoading?: boolean;
}

export function ApprovalDialog({ open, onOpenChange, onApprove, isLoading }: ApprovalDialogProps) {
  const [comments, setComments] = useState("");

  const handleApprove = () => {
    onApprove(comments || undefined);
    setComments("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Activity</DialogTitle>
          <DialogDescription>Are you sure you want to approve this activity? You can optionally add comments.</DialogDescription>
        </DialogHeader>
        <Textarea placeholder="Optional comments..." value={comments} onChange={(e) => setComments(e.target.value)} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleApprove} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
