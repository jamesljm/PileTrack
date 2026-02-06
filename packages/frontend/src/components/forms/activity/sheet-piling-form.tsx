"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface SheetPilingFormProps { control: Control<any>; }

export function SheetPilingForm({ control }: SheetPilingFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="pileNumber" render={({ field }) => (<FormItem><FormLabel>Pile Number</FormLabel><FormControl><Input placeholder="SP-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="type" render={({ field }) => (<FormItem><FormLabel>Sheet Pile Type</FormLabel><FormControl><Input placeholder="e.g. AZ 26" {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="length" render={({ field }) => (<FormItem><FormLabel>Length (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="toeLevel" render={({ field }) => (<FormItem><FormLabel>Toe Level (mPD)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="driveMethod" render={({ field }) => (<FormItem><FormLabel>Drive Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger></FormControl><SelectContent><SelectItem value="VIBRATORY">Vibratory</SelectItem><SelectItem value="IMPACT">Impact</SelectItem><SelectItem value="PRESS">Press</SelectItem><SelectItem value="JACKING">Jacking</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="interlockCondition" render={({ field }) => (<FormItem><FormLabel>Interlock Condition</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger></FormControl><SelectContent><SelectItem value="GOOD">Good</SelectItem><SelectItem value="FAIR">Fair</SelectItem><SelectItem value="POOR">Poor</SelectItem><SelectItem value="DAMAGED">Damaged</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="finalSet" render={({ field }) => (<FormItem><FormLabel>Final Set (mm/blow) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="inclination" render={({ field }) => (<FormItem><FormLabel>Inclination (deg) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="penetrationRate" render={({ field }) => (<FormItem><FormLabel>Penetration Rate (m/min) - Optional</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="clutchType" render={({ field }) => (<FormItem><FormLabel>Clutch Type - Optional</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="vibroHammerModel" render={({ field }) => (<FormItem><FormLabel>Vibro Hammer Model - Optional</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="sectionModulus" render={({ field }) => (<FormItem><FormLabel>Section Modulus (cm3/m) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="coatingType" render={({ field }) => (<FormItem><FormLabel>Coating Type - Optional</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="weldingRequired" render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          <FormLabel>Welding Required</FormLabel><FormMessage />
        </FormItem>
      )} />
    </div>
  );
}
