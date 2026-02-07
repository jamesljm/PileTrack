"use client";

import { use, useState } from "react";
import { useTransfers, useApproveTransfer, useShipTransfer, useDeliverTransfer, useCancelTransfer } from "@/queries/use-transfers";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useToast } from "@/components/ui/use-toast";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { TRANSFER_STATUS_COLORS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Plus, Check, Truck, PackageCheck, X, Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import type { TransferWithItems, TransferStatus } from "@piletrack/shared";

function TransferActionButton({ transfer, onAction }: {
  transfer: TransferWithItems;
  onAction: (id: string, action: string) => void;
}) {
  const status = transfer.status as string;

  switch (status) {
    case "REQUESTED":
      return (
        <div className="flex gap-1">
          <Button size="sm" variant="default" onClick={() => onAction(transfer.id, "approve")}>
            <Check className="h-3.5 w-3.5 mr-1" />Approve
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onAction(transfer.id, "cancel")}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      );
    case "APPROVED":
      return (
        <div className="flex gap-1">
          <Button size="sm" variant="default" onClick={() => onAction(transfer.id, "ship")}>
            <Truck className="h-3.5 w-3.5 mr-1" />Ship
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onAction(transfer.id, "cancel")}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      );
    case "IN_TRANSIT":
      return (
        <Button size="sm" variant="default" onClick={() => onAction(transfer.id, "deliver")}>
          <PackageCheck className="h-3.5 w-3.5 mr-1" />Confirm Delivery
        </Button>
      );
    default:
      return null;
  }
}

export default function SiteTransfersPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useTransfers({ fromSiteId: siteId });
  const { toast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<{ id: string; action: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const approveMutation = useApproveTransfer();
  const shipMutation = useShipTransfer();
  const deliverMutation = useDeliverTransfer();
  const cancelMutation = useCancelTransfer();

  const handleAction = (id: string, action: string) => {
    if (action === "cancel") {
      setConfirmDialog({ id, action });
      return;
    }
    executeAction(id, action);
  };

  const executeAction = async (id: string, action: string) => {
    setActionLoading(true);
    try {
      switch (action) {
        case "approve":
          await approveMutation.mutateAsync(id);
          toast({ title: "Transfer approved", description: "Transfer has been approved successfully." });
          break;
        case "ship":
          await shipMutation.mutateAsync(id);
          toast({ title: "Transfer shipped", description: "Transfer has been marked as in transit." });
          break;
        case "deliver":
          await deliverMutation.mutateAsync(id);
          toast({ title: "Transfer delivered", description: "Transfer delivered. Equipment has been moved to the destination site." });
          break;
        case "cancel":
          await cancelMutation.mutateAsync(id);
          toast({ title: "Transfer cancelled", description: "Transfer has been cancelled." });
          break;
      }
    } catch (error: any) {
      toast({ title: "Action failed", description: error.message ?? "Something went wrong.", variant: "destructive" });
    } finally {
      setActionLoading(false);
      setConfirmDialog(null);
    }
  };

  const columns: ColumnDef<TransferWithItems>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => format(new Date(row.getValue("createdAt")), "dd MMM yyyy"),
    },
    {
      accessorKey: "fromSiteName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="From" />,
    },
    {
      accessorKey: "toSiteName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="To" />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={TRANSFER_STATUS_COLORS[status as keyof typeof TRANSFER_STATUS_COLORS] ?? ""}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value === row.getValue(id),
    },
    {
      accessorKey: "requestedByName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Requested By" />,
    },
    {
      id: "itemCount",
      header: "Items",
      cell: ({ row }) => row.original.items?.length ?? 0,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <TransferActionButton transfer={row.original} onAction={handleAction} />
          <Link href={`/sites/${row.original.fromSiteId}/transfers?id=${row.original.id}`}>
            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">Transfers</h1><p className="text-muted-foreground">Equipment and material transfers</p></div>
        <Link href={`/sites/${siteId}/transfers/new`}><Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />New Transfer</Button></Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={columns}
          data={(data?.data ?? []) as any}
          searchKey="fromSiteName"
          searchPlaceholder="Search transfers..."
          filterOptions={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "REQUESTED", label: "Requested" },
                { value: "APPROVED", label: "Approved" },
                { value: "IN_TRANSIT", label: "In Transit" },
                { value: "DELIVERED", label: "Delivered" },
                { value: "CANCELLED", label: "Cancelled" },
              ],
            },
          ]}
        />
      )}

      <Dialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Transfer</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this transfer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(null)} disabled={actionLoading}>
              No, keep it
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDialog && executeAction(confirmDialog.id, confirmDialog.action)}
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, cancel transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
