"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-4 md:left-auto md:right-4 md:w-96 bg-card border rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start gap-3">
        <Download className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-sm">Install PileTrack</p>
          <p className="text-xs text-muted-foreground mt-1">Install the app for a better experience with offline support.</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={handleInstall}>Install</Button>
            <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>Not now</Button>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
