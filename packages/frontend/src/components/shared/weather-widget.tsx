"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WEATHER_CONDITIONS, WEATHER_CONDITION_LABELS } from "@/lib/constants";

interface WeatherWidgetProps {
  value: Record<string, unknown> | null;
  onChange: (value: Record<string, unknown> | null) => void;
}

export function WeatherWidget({ value, onChange }: WeatherWidgetProps) {
  const data = value ?? {};

  const update = (key: string, val: unknown) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label>Condition</Label>
        <Select value={(data.condition as string) ?? ""} onValueChange={(val) => update("condition", val)}>
          <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
          <SelectContent>
            {WEATHER_CONDITIONS.map((c) => (
              <SelectItem key={c} value={c}>{WEATHER_CONDITION_LABELS[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Temperature (C)</Label>
        <Input type="number" step="0.1" placeholder="25" value={(data.temperatureCelsius as number) ?? ""} onChange={(e) => update("temperatureCelsius", e.target.value ? Number(e.target.value) : undefined)} />
      </div>
      <div className="space-y-2">
        <Label>Humidity (%)</Label>
        <Input type="number" min={0} max={100} placeholder="60" value={(data.humidity as number) ?? ""} onChange={(e) => update("humidity", e.target.value ? Number(e.target.value) : undefined)} />
      </div>
      <div className="space-y-2">
        <Label>Wind Speed (km/h)</Label>
        <Input type="number" min={0} placeholder="15" value={(data.windSpeedKmh as number) ?? ""} onChange={(e) => update("windSpeedKmh", e.target.value ? Number(e.target.value) : undefined)} />
      </div>
    </div>
  );
}
