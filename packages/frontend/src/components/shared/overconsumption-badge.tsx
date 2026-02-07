"use client";

import { cn } from "@/lib/utils";

interface OverconsumptionBadgeProps {
  theoreticalVolume: number;
  actualVolume: number;
  overconsumptionPct: number;
  className?: string;
}

export function OverconsumptionBadge({
  theoreticalVolume,
  actualVolume,
  overconsumptionPct,
  className,
}: OverconsumptionBadgeProps) {
  const colorClass =
    overconsumptionPct <= 5
      ? "bg-green-100 text-green-800 border-green-200"
      : overconsumptionPct <= 10
        ? "bg-amber-100 text-amber-800 border-amber-200"
        : "bg-red-100 text-red-800 border-red-200";

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center rounded-lg border px-3 py-2",
        colorClass,
        className,
      )}
    >
      <span className="text-lg font-bold">
        {overconsumptionPct >= 0 ? "+" : ""}
        {overconsumptionPct.toFixed(1)}%
      </span>
      <span className="text-xs opacity-75">
        Theoretical: {theoreticalVolume.toFixed(2)} m³ | Actual:{" "}
        {actualVolume.toFixed(2)} m³
      </span>
    </div>
  );
}
