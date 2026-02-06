"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRScannerModal } from "@/components/modals/qr-scanner-modal";
import { useScanQR } from "@/queries/use-equipment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EQUIPMENT_CATEGORY_LABELS, EQUIPMENT_STATUS_COLORS } from "@/lib/constants";
import { QrCode, Camera } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import type { Equipment, EquipmentCategory, EquipmentStatus } from "@piletrack/shared";

export default function ScanQRPage() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const scanQR = useScanQR();
  const router = useRouter();

  const handleScan = async (code: string) => {
    try {
      const result = await scanQR.mutateAsync(code);
      setEquipment(result.data);
    } catch {
      toast({ title: "Not found", description: "No equipment found for this QR code.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Scan QR Code</h1><p className="text-muted-foreground">Scan an equipment QR code to view details</p></div>
      <div className="flex justify-center">
        <Button size="lg" onClick={() => setScannerOpen(true)}><Camera className="mr-2 h-5 w-5" />Open Scanner</Button>
      </div>
      <QRScannerModal open={scannerOpen} onOpenChange={setScannerOpen} onScan={handleScan} />
      {equipment && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>{equipment.name}</CardTitle>
              <Badge className={EQUIPMENT_STATUS_COLORS[equipment.status as EquipmentStatus]}>{equipment.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Code: {equipment.code}</p>
            <p>Category: {EQUIPMENT_CATEGORY_LABELS[equipment.category as EquipmentCategory]}</p>
            <p>Manufacturer: {equipment.manufacturer ?? "N/A"}</p>
            <p>Model: {equipment.model ?? "N/A"}</p>
            {equipment.siteId && (
              <Button variant="outline" className="mt-4" onClick={() => router.push(`/sites/${equipment.siteId}/equipment/${equipment.id}`)}>View Full Details</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
