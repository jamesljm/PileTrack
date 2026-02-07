"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import {
  WORKFORCE_TRADES,
  DELAY_REASONS,
  WEATHER_CONDITIONS,
  WEATHER_CONDITION_LABELS,
} from "@/lib/constants";
import { useState } from "react";

const workforceEntrySchema = z.object({
  trade: z.string().min(1, "Trade is required"),
  headcount: z.coerce.number().int().min(1, "Min 1"),
  hours: z.coerce.number().min(0.5, "Min 0.5"),
});

const delayEntrySchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  durationMins: z.coerce.number().int().min(1, "Min 1 min"),
  description: z.string().optional(),
});

const materialUsageEntrySchema = z.object({
  materialName: z.string().min(1, "Name is required"),
  quantity: z.coerce.number().min(0),
  unit: z.string().min(1, "Unit is required"),
  purpose: z.string().optional(),
});

const dailyLogFormSchema = z.object({
  logDate: z.string().min(1, "Date is required"),
  weather: z.string().optional(),
  workforce: z.array(workforceEntrySchema),
  safetyToolboxTopic: z.string().optional(),
  safetyToolboxAttendees: z.coerce.number().int().min(0).optional(),
  safetyIncidents: z.string().optional(),
  safetyNearMisses: z.string().optional(),
  delays: z.array(delayEntrySchema),
  materialUsage: z.array(materialUsageEntrySchema),
  remarks: z.string().max(5000).optional(),
});

type DailyLogFormValues = z.infer<typeof dailyLogFormSchema>;

interface DailyLogFormProps {
  defaultValues?: Partial<DailyLogFormValues>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
  isUpdate?: boolean;
}

export function DailyLogForm({
  defaultValues,
  onSubmit,
  isLoading,
  isUpdate,
}: DailyLogFormProps) {
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [delaysOpen, setDelaysOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);

  const form = useForm<DailyLogFormValues>({
    resolver: zodResolver(dailyLogFormSchema),
    defaultValues: {
      logDate: new Date().toISOString().split("T")[0],
      weather: "",
      workforce: [{ trade: "", headcount: 1, hours: 8 }],
      safetyToolboxTopic: "",
      safetyToolboxAttendees: 0,
      safetyIncidents: "",
      safetyNearMisses: "",
      delays: [],
      materialUsage: [],
      remarks: "",
      ...defaultValues,
    },
  });

  const workforceFields = useFieldArray({ control: form.control, name: "workforce" });
  const delayFields = useFieldArray({ control: form.control, name: "delays" });
  const materialFields = useFieldArray({ control: form.control, name: "materialUsage" });

  const handleFormSubmit = async (values: DailyLogFormValues) => {
    const incidents = values.safetyIncidents
      ? values.safetyIncidents.split("\n").filter(Boolean)
      : [];
    const nearMisses = values.safetyNearMisses
      ? values.safetyNearMisses.split("\n").filter(Boolean)
      : [];

    await onSubmit({
      logDate: values.logDate,
      weather: values.weather ? { condition: values.weather } : null,
      workforce: values.workforce,
      safety: {
        toolboxTopic: values.safetyToolboxTopic || undefined,
        toolboxAttendees: values.safetyToolboxAttendees || 0,
        incidents,
        nearMisses,
      },
      delays: values.delays,
      materialUsage: values.materialUsage,
      remarks: values.remarks || undefined,
    });
  };

  const totalHeadcount = form.watch("workforce")?.reduce((s, w) => s + (Number(w.headcount) || 0), 0) ?? 0;
  const totalHours = form.watch("workforce")?.reduce((s, w) => s + (Number(w.hours) || 0) * (Number(w.headcount) || 0), 0) ?? 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
        {/* Date & Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField control={form.control} name="logDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl><Input type="date" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="weather" render={({ field }) => (
            <FormItem>
              <FormLabel>Weather</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select weather" /></SelectTrigger></FormControl>
                <SelectContent>
                  {WEATHER_CONDITIONS.map((w) => (
                    <SelectItem key={w} value={w}>{WEATHER_CONDITION_LABELS[w]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Workforce */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Workforce</h3>
            <span className="text-xs text-muted-foreground">
              {totalHeadcount} pax / {totalHours.toFixed(0)} man-hrs
            </span>
          </div>
          {workforceFields.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_80px_80px_40px] gap-2 items-end">
              <FormField control={form.control} name={`workforce.${index}.trade`} render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Trade</FormLabel>}
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select trade" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {WORKFORCE_TRADES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name={`workforce.${index}.headcount`} render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Count</FormLabel>}
                  <FormControl><Input type="number" min={1} className="min-h-[44px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name={`workforce.${index}.hours`} render={({ field }) => (
                <FormItem>
                  {index === 0 && <FormLabel>Hours</FormLabel>}
                  <FormControl><Input type="number" min={0.5} step={0.5} className="min-h-[44px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="min-h-[44px]"
                onClick={() => workforceFields.remove(index)}
                disabled={workforceFields.fields.length <= 1}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => workforceFields.append({ trade: "", headcount: 1, hours: 8 })}
          >
            <Plus className="h-4 w-4 mr-1" />Add Trade
          </Button>
        </div>

        {/* Safety */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 min-h-[48px] text-left font-medium hover:bg-muted/50 transition-colors"
            onClick={() => setSafetyOpen(!safetyOpen)}
          >
            Safety
            <ChevronDown className={`h-5 w-5 transition-transform ${safetyOpen ? "rotate-180" : ""}`} />
          </button>
          {safetyOpen && (
            <div className="px-4 pb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField control={form.control} name="safetyToolboxTopic" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Toolbox Talk Topic</FormLabel>
                    <FormControl><Input placeholder="e.g. Working at height" className="min-h-[44px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="safetyToolboxAttendees" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attendees</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} className="min-h-[44px]" {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="safetyIncidents" render={({ field }) => (
                <FormItem>
                  <FormLabel>Incidents (one per line)</FormLabel>
                  <FormControl><Textarea placeholder="Describe any incidents..." className="min-h-[80px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="safetyNearMisses" render={({ field }) => (
                <FormItem>
                  <FormLabel>Near Misses (one per line)</FormLabel>
                  <FormControl><Textarea placeholder="Describe any near misses..." className="min-h-[80px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}
        </div>

        {/* Delays */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 min-h-[48px] text-left font-medium hover:bg-muted/50 transition-colors"
            onClick={() => setDelaysOpen(!delaysOpen)}
          >
            Delays ({delayFields.fields.length})
            <ChevronDown className={`h-5 w-5 transition-transform ${delaysOpen ? "rotate-180" : ""}`} />
          </button>
          {delaysOpen && (
            <div className="px-4 pb-4 space-y-3">
              {delayFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_100px_40px] gap-2 items-end">
                  <FormField control={form.control} name={`delays.${index}.reason`} render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Reason</FormLabel>}
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Reason" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {DELAY_REASONS.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`delays.${index}.durationMins`} render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Mins</FormLabel>}
                      <FormControl><Input type="number" min={1} className="min-h-[44px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="button" variant="ghost" size="icon" className="min-h-[44px]" onClick={() => delayFields.remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => delayFields.append({ reason: "", durationMins: 30, description: "" })}>
                <Plus className="h-4 w-4 mr-1" />Add Delay
              </Button>
            </div>
          )}
        </div>

        {/* Material Usage */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 min-h-[48px] text-left font-medium hover:bg-muted/50 transition-colors"
            onClick={() => setMaterialsOpen(!materialsOpen)}
          >
            Material Usage ({materialFields.fields.length})
            <ChevronDown className={`h-5 w-5 transition-transform ${materialsOpen ? "rotate-180" : ""}`} />
          </button>
          {materialsOpen && (
            <div className="px-4 pb-4 space-y-3">
              {materialFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_80px_80px_40px] gap-2 items-end">
                  <FormField control={form.control} name={`materialUsage.${index}.materialName`} render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Material</FormLabel>}
                      <FormControl><Input placeholder="e.g. Concrete G40" className="min-h-[44px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`materialUsage.${index}.quantity`} render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Qty</FormLabel>}
                      <FormControl><Input type="number" min={0} step={0.1} className="min-h-[44px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`materialUsage.${index}.unit`} render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Unit</FormLabel>}
                      <FormControl><Input placeholder="m3" className="min-h-[44px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="button" variant="ghost" size="icon" className="min-h-[44px]" onClick={() => materialFields.remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => materialFields.append({ materialName: "", quantity: 0, unit: "", purpose: "" })}>
                <Plus className="h-4 w-4 mr-1" />Add Material
              </Button>
            </div>
          )}
        </div>

        {/* Remarks */}
        <FormField control={form.control} name="remarks" render={({ field }) => (
          <FormItem>
            <FormLabel>Remarks</FormLabel>
            <FormControl><Textarea placeholder="General remarks and observations..." className="min-h-[80px]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto min-h-[44px]">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUpdate ? "Update Daily Log" : "Create Daily Log"}
        </Button>
      </form>
    </Form>
  );
}
