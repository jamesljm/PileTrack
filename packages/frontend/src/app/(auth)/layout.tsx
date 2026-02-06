import { HardHat } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <HardHat className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">PileTrack</span>
        </div>
        <Card className="p-6">{children}</Card>
      </div>
    </div>
  );
}
