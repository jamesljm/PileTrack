"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import type { ConcreteDelivery } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const concreteDeliveryColumns: ColumnDef<ConcreteDelivery>[] = [
  {
    accessorKey: "doNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="DO #" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("doNumber")}</span>,
  },
  {
    accessorKey: "deliveryDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const d = row.getValue("deliveryDate");
      return d ? format(new Date(d as string), "dd MMM yyyy") : "-";
    },
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Supplier" />,
  },
  {
    accessorKey: "concreteGrade",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Grade" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("concreteGrade")}</Badge>,
  },
  {
    accessorKey: "volume",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Volume (m³)" />,
    cell: ({ row }) => <span>{row.getValue("volume")} m³</span>,
  },
  {
    id: "slump",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slump (mm)" />,
    cell: ({ row }) => {
      const req = row.original.slumpRequired;
      const act = row.original.slumpActual;
      if (act != null) return <span>{act}mm {req ? <span className="text-xs text-muted-foreground">/ {req}mm</span> : ""}</span>;
      return <span className="text-muted-foreground">-</span>;
    },
  },
  {
    id: "linkedPile",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pile" />,
    cell: ({ row }) => {
      const pile = (row.original as any).pile;
      return pile ? <Badge variant="outline">{pile.pileId}</Badge> : <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: "rejected",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const rejected = row.getValue("rejected");
      return rejected
        ? <Badge className="bg-red-100 text-red-800">Rejected</Badge>
        : <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const cd = row.original;
      return (
        <Link href={`/sites/${cd.siteId}/concrete-deliveries/${cd.id}`}>
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />View</Button>
        </Link>
      );
    },
  },
];
