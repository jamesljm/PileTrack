export interface StratumEntry {
  fromDepth: number;
  toDepth: number;
  description: string;
  soilType?: string;
  color?: string;
  moisture?: string;
  consistency?: string;
}

export interface SPTEntry {
  depth: number;
  blows1: number;
  blows2: number;
  blows3: number;
  nValue: number;
  remarks?: string;
}

export interface BoreholeLog {
  id: string;
  siteId: string;
  boreholeId: string;
  logDate: string;
  location: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  totalDepth: number;
  groundLevel: number | null;
  groundwaterLevel: number | null;
  casingDepth: number | null;
  strata: StratumEntry[];
  sptResults: SPTEntry[];
  remarks: string | null;
  photos: string[] | null;
  drillingMethod: string | null;
  contractor: string | null;
  loggedBy: string | null;
  createdById: string;
  createdBy?: { firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}
