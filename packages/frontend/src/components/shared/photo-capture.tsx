"use client";

import { useCamera } from "@/hooks/use-camera";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, X, Image as ImageIcon } from "lucide-react";

interface PhotoCaptureProps {
  photos: Array<{ uri: string; caption?: string }>;
  onChange: (photos: Array<{ uri: string; caption?: string }>) => void;
  maxPhotos?: number;
}

export function PhotoCapture({ photos, onChange, maxPhotos = 20 }: PhotoCaptureProps) {
  const { capture, loading } = useCamera();

  const handleCapture = async () => {
    if (photos.length >= maxPhotos) return;
    const result = await capture();
    if (result) {
      onChange([...photos, { uri: result }]);
    }
  };

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updated = [...photos];
    updated[index] = { ...updated[index]!, caption };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="relative group rounded-md overflow-hidden border">
            <img src={photo.uri} alt={`Photo ${index + 1}`} className="w-full aspect-square object-cover" />
            <button type="button" onClick={() => handleRemove(index)} className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="h-3 w-3 text-white" />
            </button>
            <Input
              placeholder="Caption..."
              value={photo.caption ?? ""}
              onChange={(e) => handleCaptionChange(index, e.target.value)}
              className="rounded-none border-0 border-t text-xs h-8"
            />
          </div>
        ))}
      </div>
      {photos.length < maxPhotos && (
        <Button type="button" variant="outline" onClick={handleCapture} disabled={loading}>
          {loading ? (
            <span className="animate-pulse">Capturing...</span>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Add Photo ({photos.length}/{maxPhotos})
            </>
          )}
        </Button>
      )}
      {photos.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          <span>No photos added yet</span>
        </div>
      )}
    </div>
  );
}
