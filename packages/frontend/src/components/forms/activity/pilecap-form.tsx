"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PilecapFormProps { control: Control<any>; }

export function PilecapForm({ control }: PilecapFormProps) {
  return (
    <div className="space-y-4">
      <FormField control={control} name="pilecapId" render={({ field }) => (<FormItem><FormLabel>Pilecap ID</FormLabel><FormControl><Input placeholder="PC-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="length" render={({ field }) => (<FormItem><FormLabel>Length (m)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="width" render={({ field }) => (<FormItem><FormLabel>Width (m)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="depth" render={({ field }) => (<FormItem><FormLabel>Depth (m)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="reinforcementDetails" render={({ field }) => (<FormItem><FormLabel>Reinforcement Details</FormLabel><FormControl><Input placeholder="Reinforcement details..." {...field} /></FormControl><FormMessage /></FormItem>)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="concreteVolume" render={({ field }) => (<FormItem><FormLabel>Concrete Volume (m3)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="concreteGrade" render={({ field }) => (<FormItem><FormLabel>Concrete Grade</FormLabel><FormControl><Input placeholder="C40" {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="formworkType" render={({ field }) => (<FormItem><FormLabel>Formwork Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="TIMBER">Timber</SelectItem><SelectItem value="STEEL">Steel</SelectItem><SelectItem value="PLYWOOD">Plywood</SelectItem><SelectItem value="SYSTEM">System</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="curingMethod" render={({ field }) => (<FormItem><FormLabel>Curing Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger></FormControl><SelectContent><SelectItem value="WATER">Water</SelectItem><SelectItem value="MEMBRANE">Membrane</SelectItem><SelectItem value="STEAM">Steam</SelectItem><SelectItem value="BLANKET">Blanket</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="cubeTestRef" render={({ field }) => (<FormItem><FormLabel>Cube Test Reference - Optional</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="blindingThickness" render={({ field }) => (<FormItem><FormLabel>Blinding Thickness (m) - Optional</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="flex gap-6">
        <FormField control={control} name="waterproofing" render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Waterproofing</FormLabel></FormItem>
        )} />
        <FormField control={control} name="holdingDownBolts" render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Holding Down Bolts</FormLabel></FormItem>
        )} />
      </div>
    </div>
  );
}
