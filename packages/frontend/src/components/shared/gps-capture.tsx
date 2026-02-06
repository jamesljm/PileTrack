"use client";

import { useGeolocation } from "@/hooks/use-geolocation";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface GpsCaptureProps {
  value: { lat: number; lng: number } | null;
  onChange: (value: { lat: number; lng: number } | null) => void;
}

export function GpsCapture({ value, onChange }: GpsCaptureProps) {
  const { lat, lng, error, loading, getCurrentPosition } = useGeolocation();

  useEffect(() => {
    if (lat !== null && lng !== null) {
      onChange({ lat, lng });
    }
  }, [lat, lng, onChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" onClick={getCurrentPosition} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MapPin className="h-4 w-4 mr-2" />}
          {value ? "Update Location" : "Capture GPS"}
        </Button>
        {value && (
          <span className="text-sm text-muted-foreground">
            {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
