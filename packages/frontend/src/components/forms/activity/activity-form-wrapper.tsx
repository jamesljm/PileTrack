"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ActivityType, createActivitySchema } from "@piletrack/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACTIVITY_TYPE_LABELS } from "@/lib/constants";
import { WeatherWidget } from "@/components/shared/weather-widget";
import { PhotoCapture } from "@/components/shared/photo-capture";
import { GpsCapture } from "@/components/shared/gps-capture";
import { BoredPilingForm } from "./bored-piling-form";
import { MicropilingForm } from "./micropiling-form";
import { DiaphragmWallForm } from "./diaphragm-wall-form";
import { SheetPilingForm } from "./sheet-piling-form";
import { PilecapForm } from "./pilecap-form";
import { PileHeadHackingForm } from "./pile-head-hacking-form";
import { SoilNailingForm } from "./soil-nailing-form";
import { GroundAnchorForm } from "./ground-anchor-form";
import { CaissonPileForm } from "./caisson-pile-form";
import { Loader2 } from "lucide-react";

const commonSchema = z.object({
  activityType: z.nativeEnum(ActivityType),
  date: z.string().min(1, "Date is required"),
  notes: z.string().max(5000).optional(),
});

type CommonValues = z.infer<typeof commonSchema>;

interface ActivityFormWrapperProps {
  siteId: string;
  defaultValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
}

const DETAIL_FORM_MAP: Record<ActivityType, React.ComponentType<{ control: any; siteId?: string }>> = {
  [ActivityType.BORED_PILING]: BoredPilingForm,
  [ActivityType.MICROPILING]: MicropilingForm,
  [ActivityType.DIAPHRAGM_WALL]: DiaphragmWallForm,
  [ActivityType.SHEET_PILING]: SheetPilingForm,
  [ActivityType.PILECAP]: PilecapForm,
  [ActivityType.PILE_HEAD_HACKING]: PileHeadHackingForm,
  [ActivityType.SOIL_NAILING]: SoilNailingForm,
  [ActivityType.GROUND_ANCHOR]: GroundAnchorForm,
  [ActivityType.CAISSON_PILE]: CaissonPileForm,
};

export function ActivityFormWrapper({
  siteId,
  defaultValues,
  onSubmit,
  isLoading,
}: ActivityFormWrapperProps) {
  const [photos, setPhotos] = useState<Array<{ uri: string; caption?: string }>>([]);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [weather, setWeather] = useState<Record<string, unknown> | null>(null);

  const form = useForm<CommonValues>({
    resolver: zodResolver(commonSchema),
    defaultValues: {
      activityType: (defaultValues?.activityType as ActivityType) ?? ActivityType.BORED_PILING,
      date: (defaultValues?.date as string) ?? new Date().toISOString().split("T")[0],
      notes: (defaultValues?.notes as string) ?? "",
    },
  });

  const selectedType = form.watch("activityType");
  const DetailForm = DETAIL_FORM_MAP[selectedType];

  const handleSubmit = async (common: CommonValues) => {
    const allValues = form.getValues();
    const details: Record<string, unknown> = {};

    // Extract detail fields (everything not in common schema)
    for (const [key, value] of Object.entries(allValues)) {
      if (!["activityType", "date", "notes"].includes(key)) {
        details[key] = value;
      }
    }

    const payload = {
      clientId: crypto.randomUUID(),
      siteId,
      activityType: common.activityType,
      activityDate: new Date(common.date),
      details,
      photos,
      gpsLat: gps?.lat,
      gpsLng: gps?.lng,
      remarks: common.notes,
      weather: weather ?? undefined,
    };

    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-6">
        {/* Common Fields */}
        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">Activity Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="activityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="min-h-[44px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ACTIVITY_TYPE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" className="min-h-[44px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Type-Specific Fields */}
        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">
            {ACTIVITY_TYPE_LABELS[selectedType]} Details
          </h2>
          <DetailForm control={form.control} siteId={siteId} />
        </div>

        {/* Weather */}
        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">Weather</h2>
          <WeatherWidget value={weather} onChange={setWeather} />
        </div>

        {/* GPS */}
        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">GPS Location</h2>
          <GpsCapture value={gps} onChange={setGps} />
        </div>

        {/* Photos */}
        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">Photos</h2>
          <PhotoCapture photos={photos} onChange={setPhotos} maxPhotos={20} />
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sticky submit on mobile */}
        <div className="flex gap-3 sticky bottom-0 bg-background py-3 -mx-3 px-3 md:relative md:mx-0 md:px-0 md:py-0 border-t md:border-0">
          <Button type="submit" disabled={isLoading} className="flex-1 md:flex-none min-h-[44px]">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Activity
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="min-h-[44px]"
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
