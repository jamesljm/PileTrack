"use client";

import { use } from "react";
import { useTestResults } from "@/queries/use-test-results";
import { DataTable } from "@/components/tables/data-table";
import { testResultColumns } from "@/components/tables/columns/test-result-columns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { TEST_TYPE_LABELS, TEST_RESULT_STATUS_COLORS } from "@/lib/constants";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import type { TestResult, TestType, TestResultStatus } from "@piletrack/shared";

function TestResultMobileCard({ item, siteId }: { item: TestResult; siteId: string }) {
  return (
    <Link href={`/sites/${siteId}/test-results/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            {item.pileId && <Badge variant="outline" className="text-xs">{item.pileId}</Badge>}
            <Badge variant="outline" className="text-xs">
              {TEST_TYPE_LABELS[item.testType as TestType] ?? item.testType}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{new Date(item.testDate).toLocaleDateString()}</span>
            {item.conductedBy && (
              <>
                <span>-</span>
                <span className="truncate">{item.conductedBy}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={`text-[10px] px-1.5 py-0 ${TEST_RESULT_STATUS_COLORS[item.status as TestResultStatus] ?? ""}`}>
            {item.status}
          </Badge>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}

export default function SiteTestResultsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useTestResults({ siteId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Test Results</h1>
        <Link href={`/sites/${siteId}/test-results/new`}>
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">New Test Result</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={testResultColumns}
          data={data?.data ?? []}
          searchKey="pileId"
          searchPlaceholder="Search by pile ID..."
          filterOptions={[
            {
              key: "testType",
              label: "Test Type",
              options: Object.entries(TEST_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })),
            },
            {
              key: "status",
              label: "Status",
              options: [
                { value: "PENDING", label: "Pending" },
                { value: "PASS", label: "Pass" },
                { value: "FAIL", label: "Fail" },
                { value: "INCONCLUSIVE", label: "Inconclusive" },
              ],
            },
          ]}
          renderMobileCard={(item) => (
            <TestResultMobileCard item={item as TestResult} siteId={siteId} />
          )}
        />
      )}
    </div>
  );
}
