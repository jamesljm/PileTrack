export interface ConcreteDelivery {
  id: string;
  siteId: string;
  pileId: string | null;
  doNumber: string;
  deliveryDate: string;
  supplier: string;
  batchPlant: string | null;
  truckNumber: string | null;
  concreteGrade: string;
  volume: number;
  slumpRequired: number | null;
  slumpActual: number | null;
  batchTime: string | null;
  arrivalTime: string | null;
  pourStartTime: string | null;
  pourEndTime: string | null;
  temperature: number | null;
  cubesTaken: number | null;
  cubeSampleIds: unknown[];
  rejected: boolean;
  rejectionReason: string | null;
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
  pile?: {
    id: string;
    pileId: string;
  } | null;
}

export type ConcreteDeliverySummary = ConcreteDelivery;
