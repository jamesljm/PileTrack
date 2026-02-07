"use client";

import { use } from "react";
import Link from "next/link";
import { useTransfer } from "@/queries/use-transfers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { TRANSFER_STATUS_COLORS } from "@/lib/constants";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { TransferStatus } from "@piletrack/shared";

const STATUS_BADGE_COLORS: Record<string, string> = {
  REQUESTED: "bg-blue-100 text-blue-800",
  APPROVED: "bg-yellow-100 text-yellow-800",
  IN_TRANSIT: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

function formatDate(value: string | null | undefined): string {
  if (!value) return "\u2014";
  try {
    return format(new Date(value), "dd MMM yyyy, HH:mm");
  } catch {
    return "\u2014";
  }
}

export default function TransferDetailPage({
  params,
}: {
  params: Promise<{ siteId: string; transferId: string }>;
}) {
  const { siteId, transferId } = use(params);
  const { data, isLoading, isError } = useTransfer(transferId);
  const transfer = data?.data as Record<string, any> | undefined;

  if (isLoading) return <FormSkeleton />;

  if (isError || !transfer) {
    return (
      <div className="space-y-4">
        <Link href={`/sites/${siteId}/transfers`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Transfers
          </Button>
        </Link>
        <p className="text-center py-12 text-muted-foreground">
          Transfer not found
        </p>
      </div>
    );
  }

  const status = (transfer.status as string) ?? "REQUESTED";
  const badgeColor = STATUS_BADGE_COLORS[status] ?? "bg-gray-100 text-gray-800";

  const fromSite = transfer.fromSite as Record<string, any> | undefined;
  const toSite = transfer.toSite as Record<string, any> | undefined;
  const requestedBy = transfer.requestedBy as Record<string, any> | undefined;
  const approvedBy = transfer.approvedBy as Record<string, any> | undefined;
  const items = (transfer.items ?? []) as Array<Record<string, any>>;

  const fromSiteLabel = fromSite
    ? `${fromSite.name}${fromSite.code ? ` (${fromSite.code})` : ""}`
    : transfer.fromSiteId ?? "\u2014";
  const toSiteLabel = toSite
    ? `${toSite.name}${toSite.code ? ` (${toSite.code})` : ""}`
    : transfer.toSiteId ?? "\u2014";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <Link href={`/sites/${siteId}/transfers`}>
            <Button variant="ghost" size="sm" className="mb-1 -ml-2">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Transfers
            </Button>
          </Link>
          <h1 className="text-lg md:text-2xl font-bold">Transfer</h1>
        </div>
        <Badge className={`shrink-0 ${badgeColor}`}>
          {status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {/* Transfer Info */}
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-3">Transfer Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground shrink-0">Route:</span>
                <span className="font-medium flex items-center gap-1.5 min-w-0">
                  <span className="truncate">{fromSiteLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{toSiteLabel}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested By</span>
                <span className="font-medium">
                  {requestedBy?.name ?? transfer.requestedByName ?? "\u2014"}
                </span>
              </div>
              {(approvedBy || transfer.approvedByName) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved By</span>
                  <span className="font-medium">
                    {approvedBy?.name ?? transfer.approvedByName ?? "\u2014"}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-3">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested</span>
                <span className="font-medium">
                  {formatDate(transfer.createdAt)}
                </span>
              </div>
              {transfer.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved</span>
                  <span className="font-medium">
                    {formatDate(transfer.approvedAt)}
                  </span>
                </div>
              )}
              {transfer.shippedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipped</span>
                  <span className="font-medium">
                    {formatDate(transfer.shippedAt)}
                  </span>
                </div>
              )}
              {transfer.deliveredAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivered</span>
                  <span className="font-medium">
                    {formatDate(transfer.deliveredAt)}
                  </span>
                </div>
              )}
              {transfer.cancelledAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-destructive">
                    Cancelled
                  </span>
                  <span className="font-medium text-destructive">
                    {formatDate(transfer.cancelledAt)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      {items.length > 0 && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-3">
              Items ({items.length})
            </h3>
            {/* Mobile: card view */}
            <div className="md:hidden space-y-2">
              {items.map((item, i) => {
                const label =
                  item.equipment?.name ??
                  item.material?.name ??
                  item.equipmentId ??
                  item.materialId ??
                  `Item ${i + 1}`;
                return (
                  <div key={item.id ?? i} className="border rounded p-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-medium truncate">{label}</span>
                      <span className="font-bold shrink-0">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-muted-foreground mt-0.5">
                        {item.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">#</th>
                    <th className="text-left py-2 px-2">Item</th>
                    <th className="text-left py-2 px-2">Type</th>
                    <th className="text-right py-2 px-2">Quantity</th>
                    <th className="text-left py-2 px-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    const isEquipment = !!(item.equipment || item.equipmentId);
                    const label =
                      item.equipment?.name ??
                      item.material?.name ??
                      item.equipmentId ??
                      item.materialId ??
                      "\u2014";
                    return (
                      <tr key={item.id ?? i} className="border-b last:border-0">
                        <td className="py-2 px-2">{i + 1}</td>
                        <td className="py-2 px-2 font-medium">{label}</td>
                        <td className="py-2 px-2">
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {isEquipment ? "Equipment" : "Material"}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 text-right">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-2 text-muted-foreground">
                          {item.notes || "\u2014"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {transfer.notes && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Notes</h3>
            <p className="text-sm whitespace-pre-wrap">{transfer.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
