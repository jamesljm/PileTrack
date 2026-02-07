"use client";

import { use } from "react";
import Link from "next/link";
import { useTestResult } from "@/queries/use-test-results";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import {
  TEST_TYPE_LABELS,
  TEST_RESULT_STATUS_COLORS,
} from "@/lib/constants";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import type { TestType, TestResultStatus } from "@piletrack/shared";

const STATUS_COLORS: Record<string, string> = {
  PASS: "bg-green-100 text-green-800",
  FAIL: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  INCONCLUSIVE: "bg-gray-100 text-gray-800",
};

export default function TestResultDetailPage({
  params,
}: {
  params: Promise<{ siteId: string; resultId: string }>;
}) {
  const { siteId, resultId } = use(params);
  const { data, isLoading } = useTestResult(resultId);
  const result = data?.data as Record<string, any> | undefined;

  if (isLoading) return <FormSkeleton />;
  if (!result)
    return (
      <p className="text-center py-12 text-muted-foreground">
        Test result not found
      </p>
    );

  const results: Record<string, unknown> = (() => {
    try {
      if (result.results && typeof result.results === "object")
        return result.results;
      if (typeof result.results === "string")
        return JSON.parse(result.results);
      return {};
    } catch {
      return {};
    }
  })();

  const statusColor =
    STATUS_COLORS[result.status as string] ??
    TEST_RESULT_STATUS_COLORS[result.status as TestResultStatus] ??
    "bg-gray-100 text-gray-800";

  const testTypeLabel =
    TEST_TYPE_LABELS[result.testType as TestType] ?? result.testType;

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
        <Link href={`/sites/${siteId}/test-results`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-lg md:text-2xl font-bold truncate">Test Result</h1>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs">
          {testTypeLabel}
        </Badge>
        <Badge className={`text-xs ${statusColor}`}>
          {result.status}
        </Badge>
      </div>

      {/* Test Info */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-3">Test Info</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Test Date:</span>{" "}
              <span className="font-medium">
                {formatDate(result.testDate)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Pile ID:</span>{" "}
              <span className="font-medium">
                {result.pileId ?? "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Conducted By:</span>{" "}
              <span className="font-medium">
                {result.conductedBy ?? "\u2014"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-3">Results</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(results).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                  </span>
                  <span className="font-medium">{String(value ?? "\u2014")}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remarks */}
      {result.remarks && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Remarks</h3>
            <p className="text-sm">{result.remarks}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
