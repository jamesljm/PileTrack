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
import { ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const stratumEntrySchema = z.object({
  fromDepth: z.coerce.number().min(0),
  toDepth: z.coerce.number().min(0),
  description: z.string().min(1, "Description is required"),
  soilType: z.string().optional(),
  color: z.string().optional(),
  moisture: z.string().optional(),
  consistency: z.string().optional(),
});

const sptEntrySchema = z.object({
  depth: z.coerce.number().min(0),
  blows1: z.coerce.number().int().min(0),
  blows2: z.coerce.number().int().min(0),
  blows3: z.coerce.number().int().min(0),
});

const boreholeLogFormSchema = z.object({
  boreholeId: z.string().min(1, "Borehole ID is required").max(50),
  logDate: z.string().min(1, "Date is required"),
  location: z.string().max(200).optional(),
  gpsLat: z.coerce.number().optional(),
  gpsLng: z.coerce.number().optional(),
  totalDepth: z.coerce.number().positive("Total depth must be positive"),
  groundLevel: z.coerce.number().optional(),
  groundwaterLevel: z.coerce.number().optional(),
  casingDepth: z.coerce.number().optional(),
  drillingMethod: z.string().max(100).optional(),
  contractor: z.string().max(200).optional(),
  loggedBy: z.string().max(200).optional(),
  strata: z.array(stratumEntrySchema),
  sptResults: z.array(sptEntrySchema),
  remarks: z.string().max(5000).optional(),
});

type BoreholeLogFormValues = z.infer<typeof boreholeLogFormSchema>;

interface BoreholeLogFormProps {
  defaultValues?: Partial<BoreholeLogFormValues>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
  isUpdate?: boolean;
}

export function BoreholeLogForm({
  defaultValues,
  onSubmit,
  isLoading,
  isUpdate,
}: BoreholeLogFormProps) {
  const [sptOpen, setSptOpen] = useState(false);
  const [remarksOpen, setRemarksOpen] = useState(false);

  const form = useForm<BoreholeLogFormValues>({
    resolver: zodResolver(boreholeLogFormSchema),
    defaultValues: {
      boreholeId: "",
      logDate: new Date().toISOString().split("T")[0],
      location: "",
      totalDepth: 0,
      drillingMethod: "",
      contractor: "",
      loggedBy: "",
      strata: [{ fromDepth: 0, toDepth: 1, description: "", soilType: "", color: "", moisture: "", consistency: "" }],
      sptResults: [],
      remarks: "",
      ...defaultValues,
    },
  });

  const strataFields = useFieldArray({ control: form.control, name: "strata" });
  const sptFields = useFieldArray({ control: form.control, name: "sptResults" });

  const handleFormSubmit = async (values: BoreholeLogFormValues) => {
    const sptWithNValue = values.sptResults.map((spt) => ({
      ...spt,
      nValue: Number(spt.blows2) + Number(spt.blows3),
    }));

    await onSubmit({
      ...values,
      gpsLat: values.gpsLat || undefined,
      gpsLng: values.gpsLng || undefined,
      groundLevel: values.groundLevel || undefined,
      groundwaterLevel: values.groundwaterLevel || undefined,
      casingDepth: values.casingDepth || undefined,
      sptResults: sptWithNValue,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
        {/* Borehole Info */}
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-medium">Borehole Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormField control={form.control} name="boreholeId" render={({ field }) => (
              <FormItem>
                <FormLabel>Borehole ID</FormLabel>
                <FormControl><Input placeholder="BH-01" className="min-h-[44px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="logDate" render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl><Input type="date" className="min-h-[44px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="totalDepth" render={({ field }) => (
              <FormItem>
                <FormLabel>Total Depth (m)</FormLabel>
                <FormControl><Input type="number" step={0.1} className="min-h-[44px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl><Input placeholder="Description or chainage" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <FormField control={form.control} name="groundLevel" render={({ field }) => (
              <FormItem>
                <FormLabel>Ground Level (m)</FormLabel>
                <FormControl>
                  <Input type="number" step={0.01} className="min-h-[44px]" {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="groundwaterLevel" render={({ field }) => (
              <FormItem>
                <FormLabel>GW Level (m)</FormLabel>
                <FormControl>
                  <Input type="number" step={0.01} className="min-h-[44px]" {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="casingDepth" render={({ field }) => (
              <FormItem>
                <FormLabel>Casing Depth (m)</FormLabel>
                <FormControl>
                  <Input type="number" step={0.01} className="min-h-[44px]" {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="drillingMethod" render={({ field }) => (
              <FormItem>
                <FormLabel>Drilling Method</FormLabel>
                <FormControl><Input placeholder="Rotary" className="min-h-[44px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField control={form.control} name="contractor" render={({ field }) => (
              <FormItem>
                <FormLabel>Contractor</FormLabel>
                <FormControl><Input placeholder="Drilling contractor" className="min-h-[44px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="loggedBy" render={({ field }) => (
              <FormItem>
                <FormLabel>Logged By</FormLabel>
                <FormControl><Input placeholder="Engineer name" className="min-h-[44px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Soil Strata */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Soil Strata</h3>
            <span className="text-xs text-muted-foreground">{strataFields.fields.length} layers</span>
          </div>
          {strataFields.fields.map((field, index) => (
            <div key={field.id} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Layer {index + 1}</span>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => strataFields.remove(index)} disabled={strataFields.fields.length <= 1}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <FormField control={form.control} name={`strata.${index}.fromDepth`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">From (m)</FormLabel>
                    <FormControl><Input type="number" step={0.1} className="min-h-[44px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`strata.${index}.toDepth`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">To (m)</FormLabel>
                    <FormControl><Input type="number" step={0.1} className="min-h-[44px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`strata.${index}.soilType`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Soil Type</FormLabel>
                    <FormControl><Input placeholder="Clay" className="min-h-[44px]" {...field} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`strata.${index}.color`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Color</FormLabel>
                    <FormControl><Input placeholder="Brown" className="min-h-[44px]" {...field} /></FormControl>
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name={`strata.${index}.description`} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Description</FormLabel>
                  <FormControl><Input placeholder="Stiff brown clay with gravel" className="min-h-[44px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => strataFields.append({ fromDepth: 0, toDepth: 0, description: "", soilType: "", color: "", moisture: "", consistency: "" })}>
            <Plus className="h-4 w-4 mr-1" />Add Layer
          </Button>
        </div>

        {/* SPT Results */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 min-h-[48px] text-left font-medium hover:bg-muted/50 transition-colors"
            onClick={() => setSptOpen(!sptOpen)}
          >
            SPT Results ({sptFields.fields.length})
            <ChevronDown className={`h-5 w-5 transition-transform ${sptOpen ? "rotate-180" : ""}`} />
          </button>
          {sptOpen && (
            <div className="px-4 pb-4 space-y-3">
              {sptFields.fields.map((field, index) => {
                const blows2 = Number(form.watch(`sptResults.${index}.blows2`)) || 0;
                const blows3 = Number(form.watch(`sptResults.${index}.blows3`)) || 0;
                const nValue = blows2 + blows3;
                return (
                  <div key={field.id} className="grid grid-cols-[80px_60px_60px_60px_60px_40px] gap-2 items-end">
                    <FormField control={form.control} name={`sptResults.${index}.depth`} render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel className="text-xs">Depth</FormLabel>}
                        <FormControl><Input type="number" step={0.5} className="min-h-[44px]" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`sptResults.${index}.blows1`} render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel className="text-xs">N1</FormLabel>}
                        <FormControl><Input type="number" min={0} className="min-h-[44px]" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`sptResults.${index}.blows2`} render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel className="text-xs">N2</FormLabel>}
                        <FormControl><Input type="number" min={0} className="min-h-[44px]" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`sptResults.${index}.blows3`} render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel className="text-xs">N3</FormLabel>}
                        <FormControl><Input type="number" min={0} className="min-h-[44px]" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <div>
                      {index === 0 && <p className="text-xs font-medium mb-2">N-value</p>}
                      <div className="min-h-[44px] flex items-center justify-center rounded border bg-muted text-sm font-bold">
                        {nValue}
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="min-h-[44px]" onClick={() => sptFields.remove(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                );
              })}
              <Button type="button" variant="outline" size="sm" onClick={() => sptFields.append({ depth: 0, blows1: 0, blows2: 0, blows3: 0 })}>
                <Plus className="h-4 w-4 mr-1" />Add SPT
              </Button>
            </div>
          )}
        </div>

        {/* Remarks */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 min-h-[48px] text-left font-medium hover:bg-muted/50 transition-colors"
            onClick={() => setRemarksOpen(!remarksOpen)}
          >
            Remarks & Photos
            <ChevronDown className={`h-5 w-5 transition-transform ${remarksOpen ? "rotate-180" : ""}`} />
          </button>
          {remarksOpen && (
            <div className="px-4 pb-4 space-y-3">
              <FormField control={form.control} name="remarks" render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl><Textarea placeholder="Additional notes..." className="min-h-[80px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto min-h-[44px]">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUpdate ? "Update Borehole Log" : "Create Borehole Log"}
        </Button>
      </form>
    </Form>
  );
}
