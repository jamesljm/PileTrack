"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface SoilNailingFormProps { control: Control<any>; }

export function SoilNailingForm({ control }: SoilNailingFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="nailId" render={({ field }) => (<FormItem><FormLabel>Nail ID</FormLabel><FormControl><Input placeholder="SN-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="rowNumber" render={({ field }) => (<FormItem><FormLabel>Row Number</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="length" render={({ field }) => (<FormItem><FormLabel>Length (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="diameter" render={({ field }) => (<FormItem><FormLabel>Bar Diameter (mm)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="angle" render={({ field }) => (<FormItem><FormLabel>Angle (degrees)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="drillHoleDiameter" render={({ field }) => (<FormItem><FormLabel>Drill Hole Diameter (mm)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="nailMaterial" render={({ field }) => (<FormItem><FormLabel>Nail Material</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger></FormControl><SelectContent><SelectItem value="STEEL_BAR">Steel Bar</SelectItem><SelectItem value="SELF_DRILLING">Self Drilling</SelectItem><SelectItem value="FIBREGLASS">Fibreglass</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="groutPressure" render={({ field }) => (<FormItem><FormLabel>Grout Pressure (bar)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="groutVolume" render={({ field }) => (<FormItem><FormLabel>Grout Volume (litres)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="spacingHorizontal" render={({ field }) => (<FormItem><FormLabel>Horizontal Spacing (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="spacingVertical" render={({ field }) => (<FormItem><FormLabel>Vertical Spacing (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="facingType" render={({ field }) => (<FormItem><FormLabel>Facing Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="SHOTCRETE">Shotcrete</SelectItem><SelectItem value="MESH">Mesh</SelectItem><SelectItem value="PRECAST">Precast</SelectItem><SelectItem value="NONE">None</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="facingThickness" render={({ field }) => (<FormItem><FormLabel>Facing Thickness (mm) - Optional</FormLabel><FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="drainageProvided" render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Drainage Provided</FormLabel></FormItem>
      )} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="pullOutTestLoad" render={({ field }) => (<FormItem><FormLabel>Pull-out Test Load (kN) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="headPlateSize" render={({ field }) => (<FormItem><FormLabel>Head Plate Size - Optional</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
    </div>
  );
}
