"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({ icon: Icon, label, value, trend, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-3 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <Icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{label}</p>
            <p className="text-lg md:text-2xl font-bold">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                {trend.value >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={cn(trend.value >= 0 ? "text-green-600" : "text-red-600")}>
                  {trend.value >= 0 ? "+" : ""}{trend.value}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
