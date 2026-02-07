"use client";

import { useCallback, useMemo } from "react";
import type { Control } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
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
import { OverconsumptionBadge } from "@/components/shared/overconsumption-badge";
import { useEquipment } from "@/queries/use-equipment";
import { Plus, Trash2 } from "lucide-react";

interface PilecapFormProps {
  control: Control<any>;
  siteId?: string;
}

export function PilecapForm({ control, siteId }: PilecapFormProps) {
  const { watch, setValue, getValues } = useFormContext();
  const { data: equipmentData } = useEquipment({ siteId, pageSize: 100 });
  const siteEquipment = (equipmentData as any)?.data ?? [];

  // Watch for overconsumption calculations
  const length = watch("length");
  const width = watch("width");
  const depth = watch("depth");
  const concreteVolume = watch("concreteVolume");
  const concreteTrucks = watch("concreteTrucks") || [];

  // Compute theoretical volume (L x W x D)
  const theoretical = useMemo(() => {
    if (length > 0 && width > 0 && depth > 0) return length * width * depth;
    return 0;
  }, [length, width, depth]);

  const truckTotal = useMemo(() => {
    return (concreteTrucks as Array<{ volume: number; accepted: boolean }>)
      .filter((t) => t.accepted !== false)
      .reduce((sum: number, t) => sum + (Number(t.volume) || 0), 0);
  }, [concreteTrucks]);

  const actualVolume = concreteVolume || truckTotal || 0;
  const overconsumption = theoretical > 0 ? ((actualVolume - theoretical) / theoretical) * 100 : 0;

  const addTruck = useCallback(() => {
    const trucks = getValues("concreteTrucks") || [];
    setValue("concreteTrucks", [
      ...trucks,
      { ticketNo: "", volume: 0, slump: 0, temperature: undefined, arrivalTime: "", accepted: true },
    ]);
  }, [getValues, setValue]);

  const removeTruck = useCallback(
    (index: number) => {
      const trucks = getValues("concreteTrucks") || [];
      setValue(
        "concreteTrucks",
        trucks.filter((_: unknown, i: number) => i !== index),
      );
    },
    [getValues, setValue],
  );

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
        <div className="mt-0">
          <FormField control={control} name="pilecapId" render={({ field }) => (
            <FormItem><FormLabel>Pilecap ID</FormLabel><FormControl><Input placeholder="PC-001" className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <FormField control={control} name="length" render={({ field }) => (
            <FormItem><FormLabel>Length (m)</FormLabel><FormControl><Input type="number" step="0.01" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="width" render={({ field }) => (
            <FormItem><FormLabel>Width (m)</FormLabel><FormControl><Input type="number" step="0.01" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="depth" render={({ field }) => (
            <FormItem><FormLabel>Depth (m)</FormLabel><FormControl><Input type="number" step="0.01" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="mt-4">
          <FormField control={control} name="reinforcementDetails" render={({ field }) => (
            <FormItem><FormLabel>Reinforcement Details</FormLabel><FormControl><Input placeholder="Reinforcement details..." className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="formworkType" render={({ field }) => (
            <FormItem><FormLabel>Formwork Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="TIMBER">Timber</SelectItem><SelectItem value="STEEL">Steel</SelectItem><SelectItem value="PLYWOOD">Plywood</SelectItem><SelectItem value="SYSTEM">System</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="curingMethod" render={({ field }) => (
            <FormItem><FormLabel>Curing Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select method" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="WATER">Water</SelectItem><SelectItem value="MEMBRANE">Membrane</SelectItem><SelectItem value="STEAM">Steam</SelectItem><SelectItem value="BLANKET">Blanket</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="cubeTestRef" render={({ field }) => (
            <FormItem><FormLabel>Cube Test Reference - Optional</FormLabel><FormControl><Input className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="blindingThickness" render={({ field }) => (
            <FormItem><FormLabel>Blinding Thickness (m) - Optional</FormLabel><FormControl><Input type="number" step="0.01" className="min-h-[44px]" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="flex gap-6 mt-4">
          <FormField control={control} name="waterproofing" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Waterproofing</FormLabel></FormItem>
          )} />
          <FormField control={control} name="holdingDownBolts" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Holding Down Bolts</FormLabel></FormItem>
          )} />
        </div>
      </CollapsibleSection>

      {/* Concrete */}
      <CollapsibleSection
        title="Concrete"
        defaultOpen
        badge={
          theoretical > 0 && actualVolume > 0 ? (
            <OverconsumptionBadge
              theoreticalVolume={theoretical}
              actualVolume={actualVolume}
              overconsumptionPct={overconsumption}
            />
          ) : null
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={control} name="concreteVolume" render={({ field }) => (
            <FormItem>
              <FormLabel>Concrete Volume (m3)</FormLabel>
              <FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
              <FormDescription>
                {truckTotal > 0 && `Truck total: ${truckTotal.toFixed(2)} m³`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="concreteGrade" render={({ field }) => (
            <FormItem><FormLabel>Concrete Grade</FormLabel><FormControl><Input placeholder="C40" className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* Theoretical display */}
        {theoretical > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-md text-sm">
            <span className="font-medium">Theoretical: {theoretical.toFixed(2)} m³</span>
            {actualVolume > 0 && (
              <>
                <span className="mx-2">|</span>
                <span className="font-medium">Actual: {actualVolume.toFixed(2)} m³</span>
                <span className="mx-2">|</span>
                <span className={`font-bold ${overconsumption > 10 ? "text-red-600" : overconsumption > 5 ? "text-amber-600" : "text-green-600"}`}>
                  Overconsumption: {overconsumption.toFixed(1)}%
                </span>
              </>
            )}
          </div>
        )}

        {/* Concrete Trucks */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Concrete Trucks</span>
            <Button type="button" variant="outline" size="sm" onClick={addTruck} className="min-h-[44px]">
              <Plus className="h-4 w-4 mr-1" /> Add Truck
            </Button>
          </div>
          {concreteTrucks.map((_: unknown, index: number) => (
            <div key={index} className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-2 p-2 border rounded items-end">
              <FormField control={control} name={`concreteTrucks.${index}.ticketNo`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Ticket #</FormLabel><FormControl><Input className="min-h-[44px]" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`concreteTrucks.${index}.volume`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Volume (m³)</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`concreteTrucks.${index}.slump`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Slump (mm)</FormLabel><FormControl><Input type="number" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`concreteTrucks.${index}.temperature`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Temp (°C)</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`concreteTrucks.${index}.arrivalTime`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Arrival</FormLabel><FormControl><Input type="time" className="min-h-[44px]" {...field} /></FormControl></FormItem>
              )} />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeTruck(index)} className="min-h-[44px] text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {concreteTrucks.length > 0 && (
            <div className="text-sm text-right font-medium mt-1">Running Total: {truckTotal.toFixed(2)} m³</div>
          )}
        </div>
      </CollapsibleSection>

      {/* Timing */}
      <CollapsibleSection title="Timing">
        {(["setup", "formwork", "reinforcement", "concreting"] as const).map((stage) => (
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
