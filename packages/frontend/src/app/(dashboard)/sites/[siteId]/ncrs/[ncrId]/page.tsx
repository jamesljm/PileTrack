"use client";

import { use } from "react";
import { useNCR } from "@/queries/use-ncrs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  NCR_STATUS_COLORS,
  NCR_STATUS_LABELS,
  NCR_PRIORITY_COLORS,
  NCR_PRIORITY_LABELS,
  NCR_CATEGORY_LABELS,
} from "@/lib/constants";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import type { NCRStatus, NCRPriority, NCRCategory } from "@piletrack/shared";

export default function NCRDetailPage({
  params,
}: {
  params: Promise<{ siteId: string; ncrId: string }>;
}) {
  const { siteId, ncrId } = use(params);
  const { data, isLoading } = useNCR(ncrId);
  const ncr = data?.data as Record<string, any> | undefined;

  if (isLoading) return <FormSkeleton />;
  if (!ncr)
    return (
      <p className="text-center py-12 text-muted-foreground">NCR not found</p>
    );

  const raisedBy = ncr.raisedBy as
    | { firstName?: string; lastName?: string }
    | null
    | undefined;
  const assignedTo = ncr.assignedTo as
    | { firstName?: string; lastName?: string }
    | null
    | undefined;
  const closedBy = ncr.closedBy as
    | { firstName?: string; lastName?: string }
    | null
    | undefined;

  const formatName = (
    person: { firstName?: string; lastName?: string } | null | undefined,
  ) => {
    if (!person) return "\u2014";
    return [person.firstName, person.lastName].filter(Boolean).join(" ") || "\u2014";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}/ncrs`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold truncate">
            {ncr.ncrNumber}
          </h1>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge
          className={
            NCR_STATUS_COLORS[ncr.status as NCRStatus] ??
            "bg-gray-100 text-gray-800"
          }
        >
          {NCR_STATUS_LABELS[ncr.status as NCRStatus] ?? ncr.status}
        </Badge>
        <Badge
          className={
            NCR_PRIORITY_COLORS[ncr.priority as NCRPriority] ??
            "bg-gray-100 text-gray-800"
          }
        >
          {NCR_PRIORITY_LABELS[ncr.priority as NCRPriority] ?? ncr.priority}
        </Badge>
        {ncr.category && (
          <Badge variant="outline">
            {NCR_CATEGORY_LABELS[ncr.category as NCRCategory] ?? ncr.category}
          </Badge>
        )}
      </div>

      {/* Title & Description */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-2">Title &amp; Description</h3>
          <div className="space-y-2 text-sm">
            <p className="font-medium">{ncr.title}</p>
            {ncr.description && (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {ncr.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Root Cause */}
      {ncr.rootCause && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Root Cause</h3>
            <p className="text-sm whitespace-pre-wrap">{ncr.rootCause}</p>
          </CardContent>
        </Card>
      )}

      {/* Corrective Action */}
      {ncr.correctiveAction && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Corrective Action</h3>
            <p className="text-sm whitespace-pre-wrap">
              {ncr.correctiveAction}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Preventive Action */}
      {ncr.preventiveAction && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Preventive Action</h3>
            <p className="text-sm whitespace-pre-wrap">
              {ncr.preventiveAction}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Assignment Info */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-2">Assignment</h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Raised By</span>
              <span className="font-medium">{formatName(raisedBy)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assigned To</span>
              <span className="font-medium">{formatName(assignedTo)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date</span>
              <span className="font-medium">
                {ncr.dueDate
                  ? format(new Date(ncr.dueDate), "dd MMM yyyy")
                  : "\u2014"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Closed By</span>
              <span className="font-medium">{formatName(closedBy)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Closed At</span>
              <span className="font-medium">
                {ncr.closedAt
                  ? format(new Date(ncr.closedAt), "dd MMM yyyy HH:mm")
                  : "\u2014"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
