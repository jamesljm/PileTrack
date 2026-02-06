"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyOutputChartProps {
  data: Array<{
    date: string;
    approved: number;
    submitted: number;
    rejected: number;
  }>;
  title?: string;
}

export function DailyOutputChart({
  data,
  title = "Daily Output",
}: DailyOutputChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar
                dataKey="approved"
                fill="#22c55e"
                stackId="a"
                name="Approved"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="submitted"
                fill="#3b82f6"
                stackId="a"
                name="Submitted"
              />
              <Bar
                dataKey="rejected"
                fill="#ef4444"
                stackId="a"
                name="Rejected"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
