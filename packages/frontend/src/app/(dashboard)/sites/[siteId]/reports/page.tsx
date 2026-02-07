"use client";

import { use, useState } from "react";
import { useSiteSummary, exportCSV, exportPDF } from "@/queries/use-reports";
import { ActivitySummaryChart } from "@/components/charts/activity-summary-chart";
import { SiteProgressChart } from "@/components/charts/site-progress-chart";
import { CardsSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ACTIVITY_TYPE_LABELS } from "@/lib/constants";
import { Download, FileText, Loader2 } from "lucide-react";

export default function SiteReportsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useSiteSummary(siteId);
  const summary = data?.data;
  const { toast } = useToast();

  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const handleExportCSV = async () => {
    setExportingCSV(true);
    try {
      await exportCSV(siteId);
      toast({ title: "Export complete", description: "CSV report downloaded." });
    } catch {
      toast({ title: "Export failed", description: "Could not download CSV report.", variant: "destructive" });
    } finally {
      setExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      await exportPDF(siteId);
      toast({ title: "Export complete", description: "PDF report downloaded." });
    } catch {
      toast({ title: "Export failed", description: "Could not download PDF report.", variant: "destructive" });
    } finally {
      setExportingPDF(false);
    }
  };

  if (isLoading) return <CardsSkeleton count={2} />;

  const activityByTypeData = summary?.activitiesByType
    ? Object.entries(summary.activitiesByType).map(([key, count]) => ({
        name: ACTIVITY_TYPE_LABELS[key as keyof typeof ACTIVITY_TYPE_LABELS] ?? key,
        count: count as number,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Site Reports</h1>
          <p className="text-muted-foreground">Analytics and reports for this site</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={exportingCSV}>
            {exportingCSV ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Download className="mr-1.5 h-4 w-4" />}
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={exportingPDF}>
            {exportingPDF ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FileText className="mr-1.5 h-4 w-4" />}
            Export PDF
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitySummaryChart data={activityByTypeData} />
        <SiteProgressChart data={[]} title="Daily Activity Progress" />
      </div>
    </div>
  );
}
