"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface GroundAnchorFormProps { control: Control<any>; }

export function GroundAnchorForm({ control }: GroundAnchorFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="anchorId" render={({ field }) => (<FormItem><FormLabel>Anchor ID</FormLabel><FormControl><Input placeholder="GA-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="type" render={({ field }) => (<FormItem><FormLabel>Anchor Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="TEMPORARY">Temporary</SelectItem><SelectItem value="PERMANENT">Permanent</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="freeLength" render={({ field }) => (<FormItem><FormLabel>Free Length (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="bondLength" render={({ field }) => (<FormItem><FormLabel>Bond Length (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="designLoad" render={({ field }) => (<FormItem><FormLabel>Design Load (kN)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="testLoad" render={({ field }) => (<FormItem><FormLabel>Test Load (kN) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="lockOffLoad" render={({ field }) => (<FormItem><FormLabel>Lock-off Load (kN) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="strandCount" render={({ field }) => (<FormItem><FormLabel>Strand Count</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="inclination" render={({ field }) => (<FormItem><FormLabel>Inclination (degrees)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="drillHoleDiameter" render={({ field }) => (<FormItem><FormLabel>Drill Hole Diameter (mm)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="groutPressure" render={({ field }) => (<FormItem><FormLabel>Grout Pressure (bar)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={control} name="corrosionProtection" render={({ field }) => (<FormItem><FormLabel>Corrosion Protection</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl><SelectContent><SelectItem value="SINGLE">Single</SelectItem><SelectItem value="DOUBLE">Double</SelectItem><SelectItem value="NONE">None</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
      <FormField control={control} name="creepTest" render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Creep Test Performed</FormLabel></FormItem>
      )} />
      <FormField control={control} name="stressingRecord" render={({ field }) => (<FormItem><FormLabel>Stressing Record - Optional</FormLabel><FormControl><Textarea placeholder="Stressing record details..." {...field} /></FormControl><FormMessage /></FormItem>)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="anchorHeadType" render={({ field }) => (<FormItem><FormLabel>Anchor Head Type - Optional</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="wallType" render={({ field }) => (<FormItem><FormLabel>Wall Type - Optional</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
    </div>
  );
}
