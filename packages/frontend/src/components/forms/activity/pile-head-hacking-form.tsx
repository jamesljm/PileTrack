"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PileHeadHackingFormProps { control: Control<any>; }

export function PileHeadHackingForm({ control }: PileHeadHackingFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="pileId" render={({ field }) => (<FormItem><FormLabel>Pile ID</FormLabel><FormControl><Input placeholder="BP-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="hackingLevel" render={({ field }) => (<FormItem><FormLabel>Hacking Level (mPD)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="method" render={({ field }) => (<FormItem><FormLabel>Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger></FormControl><SelectContent><SelectItem value="MANUAL">Manual</SelectItem><SelectItem value="MECHANICAL">Mechanical</SelectItem><SelectItem value="HYDRAULIC">Hydraulic</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="inspectionStatus" render={({ field }) => (<FormItem><FormLabel>Inspection Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="PENDING">Pending</SelectItem><SelectItem value="PASSED">Passed</SelectItem><SelectItem value="FAILED">Failed</SelectItem><SelectItem value="REWORK">Rework</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="reinforcementExposed" render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Reinforcement Exposed</FormLabel></FormItem>
      )} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="wasteVolume" render={({ field }) => (<FormItem><FormLabel>Waste Volume (m3)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="exposedRebarLength" render={({ field }) => (<FormItem><FormLabel>Exposed Rebar Length (m) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="pileIntegrity" render={({ field }) => (<FormItem><FormLabel>Pile Integrity - Optional</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select integrity" /></SelectTrigger></FormControl><SelectContent><SelectItem value="GOOD">Good</SelectItem><SelectItem value="MINOR_DEFECT">Minor Defect</SelectItem><SelectItem value="MAJOR_DEFECT">Major Defect</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
      <FormField control={control} name="defectDescription" render={({ field }) => (<FormItem><FormLabel>Defect Description - Optional</FormLabel><FormControl><Textarea placeholder="Describe any defects..." {...field} /></FormControl><FormMessage /></FormItem>)} />
    </div>
  );
}
