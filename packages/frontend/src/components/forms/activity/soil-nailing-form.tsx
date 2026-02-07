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

interface SoilNailingFormProps {
  control: Control<any>;
  siteId?: string;
}

export function SoilNailingForm({ control, siteId }: SoilNailingFormProps) {
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
          <FormField control={control} name="nailId" render={({ field }) => (
            <FormItem><FormLabel>Nail ID</FormLabel><FormControl><Input placeholder="SN-001" className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="rowNumber" render={({ field }) => (
            <FormItem><FormLabel>Row Number</FormLabel><FormControl><Input type="number" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <FormField control={control} name="length" render={({ field }) => (
            <FormItem><FormLabel>Length (m)</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="diameter" render={({ field }) => (
            <FormItem><FormLabel>Bar Diameter (mm)</FormLabel><FormControl><Input type="number" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="angle" render={({ field }) => (
            <FormItem><FormLabel>Angle (degrees)</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="drillHoleDiameter" render={({ field }) => (
            <FormItem><FormLabel>Drill Hole Diameter (mm)</FormLabel><FormControl><Input type="number" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="nailMaterial" render={({ field }) => (
            <FormItem><FormLabel>Nail Material</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select material" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="STEEL_BAR">Steel Bar</SelectItem><SelectItem value="SELF_DRILLING">Self Drilling</SelectItem><SelectItem value="FIBREGLASS">Fibreglass</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="groutPressure" render={({ field }) => (
            <FormItem><FormLabel>Grout Pressure (bar)</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="groutVolume" render={({ field }) => (
            <FormItem><FormLabel>Grout Volume (litres)</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="spacingHorizontal" render={({ field }) => (
            <FormItem><FormLabel>Horizontal Spacing (m)</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="spacingVertical" render={({ field }) => (
            <FormItem><FormLabel>Vertical Spacing (m)</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="facingType" render={({ field }) => (
            <FormItem><FormLabel>Facing Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="SHOTCRETE">Shotcrete</SelectItem><SelectItem value="MESH">Mesh</SelectItem><SelectItem value="PRECAST">Precast</SelectItem><SelectItem value="NONE">None</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="facingThickness" render={({ field }) => (
            <FormItem><FormLabel>Facing Thickness (mm) - Optional</FormLabel><FormControl><Input type="number" step="1" className="min-h-[44px]" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="mt-4">
          <FormField control={control} name="drainageProvided" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Drainage Provided</FormLabel></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="pullOutTestLoad" render={({ field }) => (
            <FormItem><FormLabel>Pull-out Test Load (kN) - Optional</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="headPlateSize" render={({ field }) => (
            <FormItem><FormLabel>Head Plate Size - Optional</FormLabel><FormControl><Input className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
      </CollapsibleSection>

      {/* Timing */}
      <CollapsibleSection title="Timing">
        {(["setup", "drilling", "grouting", "facing"] as const).map((stage) => (
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
