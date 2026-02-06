"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <AlertTriangle className="h-16 w-16 text-destructive" />
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-center">{error.message || "An unexpected error occurred."}</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
