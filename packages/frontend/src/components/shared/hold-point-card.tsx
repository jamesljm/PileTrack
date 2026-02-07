"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignaturePad } from "./signature-pad";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSignHoldPoint, useRejectHoldPoint } from "@/queries/use-hold-points";

const HP_TYPE_LABELS: Record<string, string> = {
  PRE_BORING: "1. Pre-Boring",
  PRE_CAGE: "2. Pre-Cage",
  PRE_CONCRETE: "3. Pre-Concrete",
};

const HP_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

interface HoldPointCardProps {
  holdPoint: Record<string, any>;
  previousApproved: boolean;
  onUpdate: () => void;
}

export function HoldPointCard({
  holdPoint,
  previousApproved,
  onUpdate,
}: HoldPointCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [checklist, setChecklist] = useState<Array<{ item: string; checked: boolean }>>(
    (holdPoint.checklist as Array<{ item: string; checked: boolean }>) ?? [],
  );
  const [signatureData, setSignatureData] = useState("");
  const [signerName, setSignerName] = useState("");
  const [comments, setComments] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [showReject, setShowReject] = useState(false);

  const signMutation = useSignHoldPoint(holdPoint.activityId);
  const rejectMutation = useRejectHoldPoint(holdPoint.activityId);

  const isPending = holdPoint.status === "PENDING";
  const canSign = isPending && previousApproved;

  const statusIcon =
    holdPoint.status === "APPROVED" ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : holdPoint.status === "REJECTED" ? (
      <XCircle className="h-5 w-5 text-red-600" />
    ) : (
      <Clock className="h-5 w-5 text-yellow-600" />
    );

  const handleSign = async () => {
    if (!signatureData || !signerName) return;
    await signMutation.mutateAsync({
      hpId: holdPoint.id,
      data: { checklist, signatureData, signedByName: signerName, comments: comments || undefined },
    });
    onUpdate();
  };

  const handleReject = async () => {
    if (!rejectionNotes) return;
    await rejectMutation.mutateAsync({
      hpId: holdPoint.id,
      data: { rejectionNotes },
    });
    onUpdate();
  };

  const toggleCheckItem = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  return (
    <Card className={cn("transition-all", !canSign && isPending && "opacity-60")}>
      <CardHeader className="pb-2">
        <button
          type="button"
          className="flex items-center justify-between w-full min-h-[44px]"
          onClick={() => canSign && setExpanded(!expanded)}
          disabled={!canSign && isPending}
        >
          <div className="flex items-center gap-2">
            {statusIcon}
            <CardTitle className="text-sm">
              {HP_TYPE_LABELS[holdPoint.type] ?? holdPoint.type}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={HP_STATUS_STYLES[holdPoint.status] ?? ""}>
              {holdPoint.status}
            </Badge>
            {canSign && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  expanded && "rotate-180",
                )}
              />
            )}
          </div>
        </button>
      </CardHeader>

      {/* Approved summary */}
      {holdPoint.status === "APPROVED" && (
        <CardContent className="pt-0 text-xs text-muted-foreground">
          <p>Signed by: {holdPoint.signedByName}</p>
          {holdPoint.signedAt && (
            <p>
              At: {new Date(holdPoint.signedAt).toLocaleString()}
            </p>
          )}
          {holdPoint.comments && <p>Comments: {holdPoint.comments}</p>}
        </CardContent>
      )}

      {/* Rejected summary */}
      {holdPoint.status === "REJECTED" && (
        <CardContent className="pt-0 text-xs text-red-600">
          <p>Rejection: {holdPoint.rejectionNotes}</p>
        </CardContent>
      )}

      {/* Expanded signing form */}
      {expanded && canSign && (
        <CardContent className="space-y-4">
          {/* Checklist */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Checklist</span>
            {checklist.map((item, i) => (
              <label
                key={i}
                className="flex items-start space-x-3 min-h-[44px] cursor-pointer"
              >
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => toggleCheckItem(i)}
                  className="mt-0.5"
                />
                <span className="text-sm">{item.item}</span>
              </label>
            ))}
          </div>

          {/* Signer name */}
          <div>
            <label className="text-sm font-medium">Your Name</label>
            <Input
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Full name"
              className="min-h-[44px] mt-1"
            />
          </div>

          {/* Signature pad */}
          <div>
            <label className="text-sm font-medium">Signature</label>
            <div className="mt-1">
              <SignaturePad onSignature={setSignatureData} />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="text-sm font-medium">Comments (optional)</label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any additional comments..."
              className="mt-1"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleSign}
              disabled={!signatureData || !signerName || signMutation.isPending}
              className="min-h-[44px] flex-1"
            >
              {signMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Approve & Sign
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowReject(!showReject)}
              className="min-h-[44px]"
            >
              Reject
            </Button>
          </div>

          {/* Rejection form */}
          {showReject && (
            <div className="space-y-2 pt-2 border-t">
              <Textarea
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Reason for rejection..."
              />
              <Button
                type="button"
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionNotes || rejectMutation.isPending}
                className="min-h-[44px] w-full"
              >
                {rejectMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm Rejection
              </Button>
            </div>
          )}
        </CardContent>
      )}

      {/* Show "awaiting previous" message */}
      {isPending && !previousApproved && (
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground italic">
            Awaiting previous hold point approval
          </p>
        </CardContent>
      )}
    </Card>
  );
}
