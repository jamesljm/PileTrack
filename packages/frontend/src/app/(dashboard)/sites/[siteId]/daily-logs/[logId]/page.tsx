"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDailyLog, useApproveDailyLog, useRejectDailyLog } from "@/queries/use-daily-logs";
import { DAILY_LOG_STATUS_COLORS } from "@/lib/constants";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import type { DailyLogStatus } from "@piletrack/shared";

export default function DailyLogDetailPage({
  params,
}: {
  params: Promise<{ siteId: string; logId: string }>;
}) {
  const { siteId, logId } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const { data, isLoading } = useDailyLog(logId);
  const log = data?.data as Record<string, any> | undefined;

  const approveDailyLog = useApproveDailyLog();
  const rejectDailyLog = useRejectDailyLog();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState("");

  const handleApprove = async () => {
    try {
      await approveDailyLog.mutateAsync(logId);
      toast({
        title: "Daily log approved",
        description: "The daily log has been approved.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to approve daily log.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    try {
      await rejectDailyLog.mutateAsync({ id: logId, rejectionNotes });
      toast({
        title: "Daily log rejected",
        description: "The daily log has been rejected.",
      });
      setRejectDialogOpen(false);
      setRejectionNotes("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to reject daily log.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <FormSkeleton />;
  if (!log)
    return (
      <p className="text-center py-12 text-muted-foreground">
        Daily log not found
      </p>
    );

  const status = log.status as string;
  const workforce = (log.workforce ?? []) as Array<Record<string, any>>;
  const safety = (log.safety ?? {}) as Record<string, any>;
  const delays = (log.delays ?? []) as Array<Record<string, any>>;
  const materialUsage = (log.materialUsage ?? []) as Array<Record<string, any>>;
  const weather = log.weather as Record<string, any> | null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}/daily-logs`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold truncate">
            Daily Log{" "}
            {log.logDate
              ? format(new Date(log.logDate), "dd MMM yyyy")
              : ""}
          </h1>
        </div>
        <Badge
          className={`shrink-0 ${DAILY_LOG_STATUS_COLORS[status as DailyLogStatus] ?? "bg-gray-100 text-gray-800"}`}
        >
          {status}
        </Badge>
      </div>

      {/* Approve / Reject Buttons */}
      {status === "SUBMITTED" && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={approveDailyLog.isPending}
          >
            {approveDailyLog.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-1.5 h-4 w-4" />
            )}
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setRejectDialogOpen(true)}
            disabled={rejectDailyLog.isPending}
          >
            <XCircle className="mr-1.5 h-4 w-4" />
            Reject
          </Button>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Daily Log</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this daily log.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectionNotes}
            onChange={(e) => setRejectionNotes(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectDailyLog.isPending || !rejectionNotes.trim()}
            >
              {rejectDailyLog.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Notes (if previously rejected) */}
      {status === "REJECTED" && log.rejectionNotes && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="font-semibold mb-1">Rejection Reason</p>
          <p>{log.rejectionNotes}</p>
        </div>
      )}

      {/* Workforce Card */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-3">Workforce</h3>
          {workforce.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No workforce data recorded.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trade</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workforce.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell>{entry.trade ?? "\u2014"}</TableCell>
                    <TableCell className="text-right">
                      {entry.count ?? "\u2014"}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.hours ?? "\u2014"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Safety Card */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-3">Safety</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Toolbox Talk</span>
              <span className="font-medium">
                {safety.toolboxTalk ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Incidents</span>
              <span className="font-medium">{safety.incidents ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Near Misses</span>
              <span className="font-medium">{safety.nearMisses ?? 0}</span>
            </div>
            {safety.topic && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Topic</span>
                <span className="font-medium">{safety.topic}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delays Card */}
      {delays.length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-3">Delays</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delays.map((delay, i) => (
                  <TableRow key={i}>
                    <TableCell>{delay.type ?? "\u2014"}</TableCell>
                    <TableCell className="text-right">
                      {delay.duration ?? "\u2014"}
                    </TableCell>
                    <TableCell>{delay.description ?? "\u2014"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Material Usage Card */}
      {materialUsage.length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-3">Material Usage</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialUsage.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {entry.material ?? entry.materialName ?? "\u2014"}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.quantity ?? "\u2014"}
                    </TableCell>
                    <TableCell>{entry.unit ?? "\u2014"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Weather Card */}
      {weather && Object.keys(weather).length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Weather</h3>
            <div className="space-y-1 text-sm">
              {weather.condition && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condition</span>
                  <span className="font-medium">{weather.condition}</span>
                </div>
              )}
              {weather.temperatureCelsius !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className="font-medium">
                    {weather.temperatureCelsius}&deg;C
                  </span>
                </div>
              )}
              {weather.humidity !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Humidity</span>
                  <span className="font-medium">{weather.humidity}%</span>
                </div>
              )}
              {weather.windSpeed !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wind Speed</span>
                  <span className="font-medium">{weather.windSpeed} km/h</span>
                </div>
              )}
              {weather.rainfall !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rainfall</span>
                  <span className="font-medium">{weather.rainfall} mm</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remarks Card */}
      {log.remarks && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Remarks</h3>
            <p className="text-sm whitespace-pre-wrap">{log.remarks}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
