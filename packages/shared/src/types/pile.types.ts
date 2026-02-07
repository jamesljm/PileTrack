import type { ActivityType, PileStatus } from "../enums";

export interface Pile {
  id: string;
  siteId: string;
  pileId: string;
  pileType: ActivityType;
  status: PileStatus;
  designLength: number | null;
  actualLength: number | null;
  designDiameter: number | null;
  cutOffLevel: number | null;
  platformLevel: number | null;
  gridRef: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  concreteGrade: string | null;
  concreteVolume: number | null;
  actualConcreteVol: number | null;
  overconsumption: number | null;
  remarks: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // Included relations
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  site?: {
    id: string;
    name: string;
    code: string;
  };
}

export type PileSummary = Pile;
