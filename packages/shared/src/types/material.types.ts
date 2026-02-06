/**
 * Full Material entity matching the Prisma model.
 */
export interface Material {
  id: string;
  name: string;
  code: string;
  unit: string;
  siteId: string;
  currentStock: number;
  minimumStock: number;
  category: string | null;
  supplier: string | null;
  unitPrice: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
