"use client";

import { useCallback } from "react";
import type { Control } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
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
import { CollapsibleSection } from "@/components/shared/collapsible-section";
import { useEquipment } from "@/queries/use-equipment";
import { Plus, Trash2 } from "lucide-react";

interface SheetPilingFormProps {
  control: Control<any>;
  siteId?: string;
}

export function SheetPilingForm({ control, siteId }: SheetPilingFormProps) {
  const { watch, setValue, getValues } = useFormContext();
  const { data: equipmentData } = useEquipment({ siteId, pageSize: 100 });
  const siteEquipment = (equipmentData as any)?.data ?? [];

  const addEquipment = useCallback(() => {
    const eq = getValues("equipmentUsed") || [];
    setValue("equipmentUsed", [
      ...eq,
      { equipmentId: "", name: "", hours: 0, isDowntime: false, downtimeReason: "" },
    ]);
  }, [getValues, setValue]);

  const removeEquipment = useCallback(
    (index: number) => {
      const eq = getValues("equipmentUsed") || [];
      setValue(
        "equipmentUsed",
        eq.filter((_: unknown, i: number) => i !== index),
      );
    },
    [getValues, setValue],
  );

  return (
    <div className="space-y-3">
      {/* Details */}
      <CollapsibleSection title="Details" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={control} name="pileNumber" render={({ field }) => (
            <FormItem><FormLabel>Pile Number</FormLabel><FormControl><Input placeholder="SP-001" className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="type" render={({ field }) => (
            <FormItem><FormLabel>Sheet Pile Type</FormLabel><FormControl><Input placeholder="e.g. AZ 26" className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="length" render={({ field }) => (
            <FormItem><FormLabel>Length (m)</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="toeLevel" render={({ field }) => (
            <FormItem><FormLabel>Toe Level (mPD)</FormLabel><FormControl><Input type="number" step="0.01" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="driveMethod" render={({ field }) => (
            <FormItem><FormLabel>Drive Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select method" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="VIBRATORY">Vibratory</SelectItem><SelectItem value="IMPACT">Impact</SelectItem><SelectItem value="PRESS">Press</SelectItem><SelectItem value="JACKING">Jacking</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="interlockCondition" render={({ field }) => (
            <FormItem><FormLabel>Interlock Condition</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select condition" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="GOOD">Good</SelectItem><SelectItem value="FAIR">Fair</SelectItem><SelectItem value="POOR">Poor</SelectItem><SelectItem value="DAMAGED">Damaged</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <FormField control={control} name="finalSet" render={({ field }) => (
            <FormItem><FormLabel>Final Set (mm/blow) - Optional</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="inclination" render={({ field }) => (
            <FormItem><FormLabel>Inclination (deg) - Optional</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="penetrationRate" render={({ field }) => (
            <FormItem><FormLabel>Penetration Rate (m/min) - Optional</FormLabel><FormControl><Input type="number" step="0.01" className="min-h-[44px]" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="clutchType" render={({ field }) => (
            <FormItem><FormLabel>Clutch Type - Optional</FormLabel><FormControl><Input className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="vibroHammerModel" render={({ field }) => (
            <FormItem><FormLabel>Vibro Hammer Model - Optional</FormLabel><FormControl><Input className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="sectionModulus" render={({ field }) => (
            <FormItem><FormLabel>Section Modulus (cm3/m) - Optional</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="coatingType" render={({ field }) => (
            <FormItem><FormLabel>Coating Type - Optional</FormLabel><FormControl><Input className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="mt-4">
          <FormField control={control} name="weldingRequired" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              <FormLabel>Welding Required</FormLabel><FormMessage />
            </FormItem>
          )} />
        </div>
      </CollapsibleSection>

      {/* Timing */}
      <CollapsibleSection title="Timing">
        {(["setup", "driving", "welding"] as const).map((stage) => (
          <div key={stage} className="grid grid-cols-3 gap-2 mb-3 items-end">
            <span className="text-sm font-medium capitalize self-center">{stage}</span>
            <FormField control={control} name={`stageTimings.${stage}.start`} render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Start</FormLabel><FormControl><Input type="time" className="min-h-[44px]" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={control} name={`stageTimings.${stage}.end`} render={({ field }) => (
              <FormItem><FormLabel className="text-xs">End</FormLabel><FormControl><Input type="time" className="min-h-[44px]" {...field} /></FormControl></FormItem>
            )} />
          </div>
        ))}
      </CollapsibleSection>

      {/* Equipment Used */}
      <CollapsibleSection title="Equipment Used">
        <div className="flex justify-end mb-2">
          <Button type="button" variant="outline" size="sm" onClick={addEquipment} className="min-h-[44px]">
            <Plus className="h-4 w-4 mr-1" /> Add Equipment
          </Button>
        </div>
        {(watch("equipmentUsed") || []).map((_: unknown, index: number) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 p-2 border rounded items-end">
            <FormField control={control} name={`equipmentUsed.${index}.name`} render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Equipment</FormLabel>
                <Select onValueChange={(val) => { const eq = siteEquipment.find((e: any) => e.id === val); if (eq) { field.onChange(eq.name); setValue(`equipmentUsed.${index}.equipmentId`, eq.id); } else { field.onChange(val); } }} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                  <SelectContent>{siteEquipment.map((eq: any) => (<SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>))}</SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={control} name={`equipmentUsed.${index}.hours`} render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Hours</FormLabel><FormControl><Input type="number" step="0.5" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl></FormItem>
            )} />
            <FormField control={control} name={`equipmentUsed.${index}.isDowntime`} render={({ field }) => (
              <FormItem className="flex flex-row items-end space-x-2 space-y-0 pb-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs">Downtime?</FormLabel></FormItem>
            )} />
            <FormField control={control} name={`equipmentUsed.${index}.downtimeReason`} render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Reason</FormLabel><FormControl><Input className="min-h-[44px]" {...field} /></FormControl></FormItem>
            )} />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeEquipment(index)} className="min-h-[44px] text-red-500"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </CollapsibleSection>
    </div>
  );
}
