"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle } from "lucide-react";

interface QRScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (code: string) => void;
}

export function QRScannerModal({ open, onOpenChange, onScan }: QRScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);
      }
    } catch {
      setError("Unable to access camera. Please grant camera permission.");
    }
  }, []);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [open, startCamera, stopCamera]);

  // Basic QR detection loop using canvas
  useEffect(() => {
    if (!scanning) return;
    let animationId: number;

    const scan = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationId = requestAnimationFrame(scan);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Use BarcodeDetector API if available (Chrome/Edge)
      if ("BarcodeDetector" in window) {
        const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        detector
          .detect(canvas)
          .then((barcodes: Array<{ rawValue: string }>) => {
            if (barcodes.length > 0 && barcodes[0]) {
              onScan(barcodes[0].rawValue);
              stopCamera();
              onOpenChange(false);
            }
          })
          .catch(() => {
            // Detection failed, continue scanning
          });
      }

      animationId = requestAnimationFrame(scan);
    };

    animationId = requestAnimationFrame(scan);
    return () => cancelAnimationFrame(animationId);
  }, [scanning, onScan, stopCamera, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) stopCamera(); onOpenChange(val); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-square bg-black rounded-md overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />
          {!scanning && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button onClick={startCamera}><Camera className="mr-2 h-4 w-4" />Start Camera</Button>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <p className="text-white text-center text-sm">{error}</p>
            </div>
          )}
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-white/50 rounded-lg" />
            </div>
          )}
        </div>
        {scanning && (
          <Button variant="outline" onClick={stopCamera}><StopCircle className="mr-2 h-4 w-4" />Stop Scanning</Button>
        )}
        <p className="text-xs text-muted-foreground text-center">
          Point the camera at a QR code on the equipment. QR detection works best in Chrome and Edge browsers.
        </p>
      </DialogContent>
    </Dialog>
  );
}
