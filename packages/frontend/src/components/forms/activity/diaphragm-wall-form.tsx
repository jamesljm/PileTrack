"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DiaphragmWallFormProps { control: Control<any>; }

export function DiaphragmWallForm({ control }: DiaphragmWallFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="panelId" render={({ field }) => (<FormItem><FormLabel>Panel ID</FormLabel><FormControl><Input placeholder="DW-P01" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="panelSequence" render={({ field }) => (<FormItem><FormLabel>Panel Sequence</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="length" render={({ field }) => (<FormItem><FormLabel>Length (m)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="width" render={({ field }) => (<FormItem><FormLabel>Width (m)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="depth" render={({ field }) => (<FormItem><FormLabel>Depth (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="excavationMethod" render={({ field }) => (<FormItem><FormLabel>Excavation Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger></FormControl><SelectContent><SelectItem value="GRAB">Grab</SelectItem><SelectItem value="CUTTER">Cutter</SelectItem><SelectItem value="HYDROMILL">Hydromill</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="jointType" render={({ field }) => (<FormItem><FormLabel>Joint Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="CWS">CWS</SelectItem><SelectItem value="STOP_END">Stop End</SelectItem><SelectItem value="CUTTER">Cutter</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="slurryLevel" render={({ field }) => (<FormItem><FormLabel>Slurry Level (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="slurryDensity" render={({ field }) => (<FormItem><FormLabel>Slurry Density (g/cm3)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="reinforcementCage" render={({ field }) => (<FormItem><FormLabel>Reinforcement Cage Details</FormLabel><FormControl><Input placeholder="Cage details..." {...field} /></FormControl><FormMessage /></FormItem>)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="concreteVolume" render={({ field }) => (<FormItem><FormLabel>Concrete Volume (m3)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="concreteGrade" render={({ field }) => (<FormItem><FormLabel>Concrete Grade</FormLabel><FormControl><Input placeholder="C40" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="tremiePipeCount" render={({ field }) => (<FormItem><FormLabel>Tremie Pipe Count</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="guideWallLevel" render={({ field }) => (<FormItem><FormLabel>Guide Wall Level (m)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="overbreak" render={({ field }) => (<FormItem><FormLabel>Overbreak (m3) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
      </div>
    </div>
  );
}
