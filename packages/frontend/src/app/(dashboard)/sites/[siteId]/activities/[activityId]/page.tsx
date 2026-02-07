"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useActivity,
  useSubmitActivity,
  useDeleteActivity,
  useApproveActivity,
  useRejectActivity,
} from "@/queries/use-activities";
import { useHoldPoints } from "@/queries/use-hold-points";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ACTIVITY_TYPE_LABELS, ACTIVITY_STATUS_COLORS } from "@/lib/constants";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { OverconsumptionBadge } from "@/components/shared/overconsumption-badge";
import { HoldPointCard } from "@/components/shared/hold-point-card";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Send, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { ActivityType, ActivityStatus } from "@piletrack/shared";

export default function ActivityDetailPage({ params }: { params: Promise<{ siteId: string; activityId: string }> }) {
  const { siteId, activityId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data, isLoading } = useActivity(activityId);
  const { data: holdPointsData } = useHoldPoints(activityId);
  const activity = data?.data as Record<string, any> | undefined;
  const holdPoints = (holdPointsData?.data ?? []) as Array<Record<string, any>>;

  const submitActivity = useSubmitActivity();
  const deleteActivity = useDeleteActivity();
  const approveActivity = useApproveActivity();
  const rejectActivity = useRejectActivity();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const userRole = user?.role;
  const canApprove = userRole === "ADMIN" || userRole === "SUPERVISOR";
  const canDelete = userRole === "ADMIN" || (activity?.status === "DRAFT" && activity?.createdById === user?.id);

  const handleSubmit = async () => {
    try {
      await submitActivity.mutateAsync(activityId);
      toast({ title: "Activity submitted", description: "The activity has been submitted for approval." });
    } catch {
      toast({ title: "Error", description: "Failed to submit activity.", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteActivity.mutateAsync(activityId);
      toast({ title: "Activity deleted", description: "The activity has been removed." });
      router.push(`/sites/${siteId}/activities`);
    } catch {
      toast({ title: "Error", description: "Failed to delete activity.", variant: "destructive" });
    }
  };

  const handleApprove = async () => {
    try {
      await approveActivity.mutateAsync({ id: activityId, data: {} as any });
      toast({ title: "Activity approved", description: "The activity has been approved." });
    } catch {
      toast({ title: "Error", description: "Failed to approve activity.", variant: "destructive" });
    }
  };

  const handleReject = async () => {
    try {
      await rejectActivity.mutateAsync({ id: activityId, data: { reason: rejectReason } as any });
      toast({ title: "Activity rejected", description: "The activity has been rejected." });
      setRejectDialogOpen(false);
      setRejectReason("");
    } catch {
      toast({ title: "Error", description: "Failed to reject activity.", variant: "destructive" });
    }
  };

  if (isLoading) return <FormSkeleton />;
  if (!activity) return <p className="text-center py-12 text-muted-foreground">Activity not found</p>;

  const weather = activity.weather as Record<string, any> | null;
  const details = (activity.details ?? {}) as Record<string, unknown>;
  const photos = (activity.photos ?? []) as Array<{ uri?: string; caption?: string }>;

  const concreteTrucks = details.concreteTrucks as Array<Record<string, any>> | undefined;
  const stageTimings = details.stageTimings as Record<string, { start?: string; end?: string }> | undefined;
  const equipmentUsed = details.equipmentUsed as Array<Record<string, any>> | undefined;
  const theoreticalVolume = details.theoreticalVolume as number | undefined;
  const actualVolume = details.concreteVolume as number | undefined;
  const overconsumptionPct = details.overconsumptionPct as number | undefined;

  // Fields to exclude from generic display
  const excludedKeys = new Set([
    "concreteTrucks", "stageTimings", "equipmentUsed",
    "theoreticalVolume", "overconsumptionPct",
  ]);

  function calcDuration(start?: string, end?: string): string {
    if (!start || !end) return "\u2014";
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const mins = (eh! * 60 + em!) - (sh! * 60 + sm!);
    if (mins < 0) return "\u2014";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  }

  const status = activity.status as string;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold truncate">{ACTIVITY_TYPE_LABELS[activity.activityType as ActivityType]}</h1>
          <p className="text-xs md:text-sm text-muted-foreground">{activity.activityDate ? format(new Date(activity.activityDate), "dd MMM yyyy") : "\u2014"}</p>
        </div>
        <Badge className={`shrink-0 ${ACTIVITY_STATUS_COLORS[activity.status as ActivityStatus]}`}>{activity.status}</Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {status === "DRAFT" && (
          <Button size="sm" onClick={handleSubmit} disabled={submitActivity.isPending}>
            {submitActivity.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Send className="mr-1.5 h-4 w-4" />}
            Submit
          </Button>
        )}
        {status === "SUBMITTED" && canApprove && (
          <>
            <Button size="sm" onClick={handleApprove} disabled={approveActivity.isPending}>
              {approveActivity.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-1.5 h-4 w-4" />}
              Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setRejectDialogOpen(true)} disabled={rejectActivity.isPending}>
              <XCircle className="mr-1.5 h-4 w-4" />
              Reject
            </Button>
          </>
        )}
        {canDelete && (
          <Button size="sm" variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            Delete
          </Button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>Are you sure you want to delete this activity? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteActivity.isPending}>
              {deleteActivity.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Activity</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this activity.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectActivity.isPending || !rejectReason.trim()}>
              {rejectActivity.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Overconsumption Badge */}
      {theoreticalVolume && actualVolume && overconsumptionPct !== undefined && (
        <OverconsumptionBadge
          theoreticalVolume={theoreticalVolume}
          actualVolume={actualVolume}
          overconsumptionPct={overconsumptionPct}
        />
      )}

      {/* Hold Points */}
      {holdPoints.length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-3">Hold Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {holdPoints.map((hp, index) => (
                <HoldPointCard
                  key={hp.id}
                  holdPoint={hp}
                  previousApproved={index === 0 || holdPoints[index - 1]?.status === "APPROVED"}
                  onUpdate={() => {}}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Details</h3>
            <div className="space-y-1.5 text-sm">
            {Object.entries(details)
              .filter(([key]) => !excludedKeys.has(key))
              .map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {weather && (
            <Card>
              <CardContent className="p-3 md:p-6">
                <h3 className="text-sm font-semibold mb-2">Weather</h3>
                <div className="space-y-1 text-sm">
                  {weather.condition && <p>Condition: {weather.condition}</p>}
                  {weather.temperatureCelsius !== undefined && <p>Temp: {weather.temperatureCelsius}C</p>}
                  {weather.humidity !== undefined && <p>Humidity: {weather.humidity}%</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {activity.remarks && (
            <Card>
              <CardContent className="p-3 md:p-6">
                <h3 className="text-sm font-semibold mb-2">Notes</h3>
                <p className="text-sm">{activity.remarks}</p>
              </CardContent>
            </Card>
          )}

          {activity.site && (
            <Card>
              <CardContent className="p-3 md:p-6">
                <h3 className="text-sm font-semibold mb-1">Site</h3>
                <p className="text-sm font-medium">{activity.site.name}</p>
                <p className="text-xs text-muted-foreground">{activity.site.code}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Concrete Trucks */}
      {concreteTrucks && concreteTrucks.length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Concrete Trucks ({concreteTrucks.length})</h3>
            {/* Mobile: compact card view */}
            <div className="md:hidden space-y-2">
              {concreteTrucks.map((truck, i) => (
                <div key={i} className="border rounded p-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium">#{truck.ticketNo || i + 1}</span>
                    <span className="font-bold">{truck.volume} m³</span>
                  </div>
                  <div className="flex gap-3 text-muted-foreground mt-0.5">
                    {truck.slump > 0 && <span>Slump: {truck.slump}mm</span>}
                    {truck.arrivalTime && <span>{truck.arrivalTime}</span>}
                    {truck.accepted === false && <Badge variant="destructive" className="text-[10px] px-1 py-0">Rejected</Badge>}
                  </div>
                </div>
              ))}
              <div className="text-xs font-medium text-right">
                Total: {concreteTrucks.filter(t => t.accepted !== false).reduce((s, t) => s + (t.volume || 0), 0).toFixed(2)} m³
              </div>
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Ticket #</th>
                    <th className="text-right py-2 px-2">Volume (m³)</th>
                    <th className="text-right py-2 px-2">Slump (mm)</th>
                    <th className="text-right py-2 px-2">Temp (°C)</th>
                    <th className="text-left py-2 px-2">Arrival</th>
                    <th className="text-center py-2 px-2">Accepted</th>
                  </tr>
                </thead>
                <tbody>
                  {concreteTrucks.map((truck, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-2">{truck.ticketNo}</td>
                      <td className="py-2 px-2 text-right">{truck.volume}</td>
                      <td className="py-2 px-2 text-right">{truck.slump}</td>
                      <td className="py-2 px-2 text-right">{truck.temperature ?? "\u2014"}</td>
                      <td className="py-2 px-2">{truck.arrivalTime || "\u2014"}</td>
                      <td className="py-2 px-2 text-center">{truck.accepted !== false ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-medium">
                    <td className="py-2 px-2">Total</td>
                    <td className="py-2 px-2 text-right">
                      {concreteTrucks.filter(t => t.accepted !== false).reduce((s, t) => s + (t.volume || 0), 0).toFixed(2)}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stage Timings */}
      {stageTimings && Object.keys(stageTimings).length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Stage Timings</h3>
            <div className="space-y-1.5 text-sm">
              {Object.entries(stageTimings).map(([stage, timing]) => (
                <div key={stage} className="flex justify-between items-center">
                  <span className="capitalize font-medium">{stage === "cage" ? "Cage Installation" : stage}</span>
                  <span>
                    {timing.start || "\u2014"} → {timing.end || "\u2014"}
                    <span className="ml-2 text-muted-foreground">({calcDuration(timing.start, timing.end)})</span>
                  </span>
                </div>
              ))}
              {(() => {
                let total = 0;
                Object.values(stageTimings).forEach((t) => {
                  if (t.start && t.end) {
                    const [sh, sm] = t.start.split(":").map(Number);
                    const [eh, em] = t.end.split(":").map(Number);
                    const mins = (eh! * 60 + em!) - (sh! * 60 + sm!);
                    if (mins > 0) total += mins;
                  }
                });
                return total > 0 ? (
                  <div className="pt-2 border-t font-medium">
                    Total Cycle: {Math.floor(total / 60)}h {total % 60}m
                  </div>
                ) : null;
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Used */}
      {equipmentUsed && equipmentUsed.length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Equipment Used</h3>
            <div className="space-y-1.5 text-sm">
              {equipmentUsed.map((eq, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{eq.name}</span>
                  <span className="flex items-center gap-1 shrink-0">
                    {eq.hours}h
                    {eq.isDowntime && (
                      <Badge variant="destructive" className="text-[10px] px-1 py-0">DT</Badge>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {photos.length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Photos ({photos.length})</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {photos.map((photo, i) => (
                <div key={i} className="rounded-md overflow-hidden border">
                  {photo.uri && <img src={photo.uri} alt={photo.caption ?? `Photo ${i + 1}`} className="w-full aspect-square object-cover" />}
                  {photo.caption && <p className="text-[10px] p-1.5 text-muted-foreground truncate">{photo.caption}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
