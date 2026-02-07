"use client";

import { useCallback } from "react";
import type { Control } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface PileHeadHackingFormProps {
  control: Control<any>;
  siteId?: string;
}

export function PileHeadHackingForm({ control, siteId }: PileHeadHackingFormProps) {
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
          <FormField control={control} name="pileId" render={({ field }) => (
            <FormItem><FormLabel>Pile ID</FormLabel><FormControl><Input placeholder="BP-001" className="min-h-[44px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="hackingLevel" render={({ field }) => (
            <FormItem><FormLabel>Hacking Level (mPD)</FormLabel><FormControl><Input type="number" step="0.01" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="method" render={({ field }) => (
            <FormItem><FormLabel>Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select method" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="MANUAL">Manual</SelectItem><SelectItem value="MECHANICAL">Mechanical</SelectItem><SelectItem value="HYDRAULIC">Hydraulic</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="inspectionStatus" render={({ field }) => (
            <FormItem><FormLabel>Inspection Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="PENDING">Pending</SelectItem><SelectItem value="PASSED">Passed</SelectItem><SelectItem value="FAILED">Failed</SelectItem><SelectItem value="REWORK">Rework</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
          )} />
        </div>
        <div className="mt-4">
          <FormField control={control} name="reinforcementExposed" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Reinforcement Exposed</FormLabel></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField control={control} name="wasteVolume" render={({ field }) => (
            <FormItem><FormLabel>Waste Volume (m3)</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="exposedRebarLength" render={({ field }) => (
            <FormItem><FormLabel>Exposed Rebar Length (m) - Optional</FormLabel><FormControl><Input type="number" step="0.1" className="min-h-[44px]" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="mt-4">
          <FormField control={control} name="pileIntegrity" render={({ field }) => (
            <FormItem><FormLabel>Pile Integrity - Optional</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select integrity" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="GOOD">Good</SelectItem><SelectItem value="MINOR_DEFECT">Minor Defect</SelectItem><SelectItem value="MAJOR_DEFECT">Major Defect</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
          )} />
        </div>
        <div className="mt-4">
          <FormField control={control} name="defectDescription" render={({ field }) => (
            <FormItem><FormLabel>Defect Description - Optional</FormLabel><FormControl><Textarea placeholder="Describe any defects..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
      </CollapsibleSection>

      {/* Timing */}
      <CollapsibleSection title="Timing">
        {(["setup", "hacking", "cleanup"] as const).map((stage) => (
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
