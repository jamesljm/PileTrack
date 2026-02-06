"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface CaissonPileFormProps { control: Control<any>; }

export function CaissonPileForm({ control }: CaissonPileFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="caissonId" render={({ field }) => (<FormItem><FormLabel>Caisson ID</FormLabel><FormControl><Input placeholder="CS-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="diameter" render={({ field }) => (<FormItem><FormLabel>Diameter (m)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="depth" render={({ field }) => (<FormItem><FormLabel>Depth (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="excavationMethod" render={({ field }) => (<FormItem><FormLabel>Excavation Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger></FormControl><SelectContent><SelectItem value="GRAB">Grab</SelectItem><SelectItem value="RCD">RCD</SelectItem><SelectItem value="HAMMER_GRAB">Hammer Grab</SelectItem><SelectItem value="CHISEL">Chisel</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="reinforcementCage" render={({ field }) => (<FormItem><FormLabel>Reinforcement Cage Details</FormLabel><FormControl><Input placeholder="Cage details..." {...field} /></FormControl><FormMessage /></FormItem>)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="concreteVolume" render={({ field }) => (<FormItem><FormLabel>Concrete Volume (m3)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="concreteGrade" render={({ field }) => (<FormItem><FormLabel>Concrete Grade</FormLabel><FormControl><Input placeholder="C40" {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="linerType" render={({ field }) => (<FormItem><FormLabel>Liner Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="STEEL">Steel</SelectItem><SelectItem value="CONCRETE">Concrete</SelectItem><SelectItem value="NONE">None</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="linerThickness" render={({ field }) => (<FormItem><FormLabel>Liner Thickness (mm) - Optional</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="bellDiameter" render={({ field }) => (<FormItem><FormLabel>Bell Diameter (m) - Optional</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="socketLength" render={({ field }) => (<FormItem><FormLabel>Socket Length (m) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="rockLevel" render={({ field }) => (<FormItem><FormLabel>Rock Level (mPD) - Optional</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="groundwaterLevel" render={({ field }) => (<FormItem><FormLabel>Groundwater Level (m) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
      <div className="flex gap-6">
        <FormField control={control} name="baseGrouting" render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Base Grouting</FormLabel></FormItem>
        )} />
      </div>
      <FormField control={control} name="sonicLoggingTubes" render={({ field }) => (<FormItem><FormLabel>Sonic Logging Tubes</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
    </div>
  );
}
