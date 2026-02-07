"use client";

import { use } from "react";
import Link from "next/link";
import { useBoreholeLog } from "@/queries/use-borehole-logs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

interface Stratum {
  from: number;
  to: number;
  description: string;
  blowCount?: number;
}

interface SptResult {
  depth: number;
  blowCount: number;
}

export default function BoreholeLogDetailPage({
  params,
}: {
  params: Promise<{ siteId: string; logId: string }>;
}) {
  const { siteId, logId } = use(params);
  const { data, isLoading } = useBoreholeLog(logId);
  const log = data?.data as Record<string, any> | undefined;

  if (isLoading) return <FormSkeleton />;
  if (!log)
    return (
      <p className="text-center py-12 text-muted-foreground">
        Borehole log not found
      </p>
    );

  const strata: Stratum[] = (() => {
    try {
      if (Array.isArray(log.strata)) return log.strata;
      if (typeof log.strata === "string") return JSON.parse(log.strata);
      return [];
    } catch {
      return [];
    }
  })();

  const sptResults: SptResult[] = (() => {
    try {
      if (Array.isArray(log.sptResults)) return log.sptResults;
      if (typeof log.sptResults === "string")
        return JSON.parse(log.sptResults);
      return [];
    } catch {
      return [];
    }
  })();

  function formatDate(value: unknown): string {
    if (!value) return "\u2014";
    try {
      return format(new Date(String(value)), "dd MMM yyyy");
    } catch {
      return String(value);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}/borehole-logs`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-lg md:text-2xl font-bold truncate">
          Borehole: {log.boreholeId ?? "\u2014"}
        </h1>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-3">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Log Date:</span>{" "}
              <span className="font-medium">{formatDate(log.logDate)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Depth:</span>{" "}
              <span className="font-medium">
                {log.totalDepth != null ? `${log.totalDepth} m` : "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Ground Level:</span>{" "}
              <span className="font-medium">
                {log.groundLevel != null ? `${log.groundLevel} m` : "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Groundwater Level:</span>{" "}
              <span className="font-medium">
                {log.groundwaterLevel != null
                  ? `${log.groundwaterLevel} m`
                  : "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Casing Depth:</span>{" "}
              <span className="font-medium">
                {log.casingDepth != null ? `${log.casingDepth} m` : "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Drilling Method:</span>{" "}
              <span className="font-medium">
                {log.drillingMethod ?? "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Contractor:</span>{" "}
              <span className="font-medium">
                {log.contractor ?? "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Logged By:</span>{" "}
              <span className="font-medium">{log.loggedBy ?? "\u2014"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span>{" "}
              <span className="font-medium">{log.location ?? "\u2014"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strata */}
      {strata.length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-3">Strata</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">
                      From (m)
                    </th>
                    <th className="text-left py-2 px-2 font-medium">To (m)</th>
                    <th className="text-left py-2 px-2 font-medium">
                      Description
                    </th>
                    <th className="text-right py-2 px-2 font-medium">
                      SPT N-value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {strata.map((layer, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-2">{layer.from}</td>
                      <td className="py-2 px-2">{layer.to}</td>
                      <td className="py-2 px-2">{layer.description}</td>
                      <td className="py-2 px-2 text-right">
                        {layer.blowCount ?? "\u2014"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SPT Results */}
      {sptResults.length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-3">SPT Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">
                      Depth (m)
                    </th>
                    <th className="text-right py-2 px-2 font-medium">
                      Blow Count (N-value)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sptResults.map((result, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-2">{result.depth}</td>
                      <td className="py-2 px-2 text-right">
                        {result.blowCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remarks */}
      {log.remarks && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Remarks</h3>
            <p className="text-sm">{log.remarks}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
