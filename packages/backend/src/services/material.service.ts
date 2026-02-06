import { prisma } from "../config/database";
import { materialRepository } from "../repositories/material.repository";
import { NotFoundError, ValidationError } from "../utils/api-error";
import type { Material } from "@prisma/client";
import { logger } from "../config/logger";
import { notificationService } from "./notification.service";

export interface CreateMaterialInput {
  siteId: string;
  name: string;
  unit: string;
  currentStock?: number;
  minimumStock?: number;
  unitPrice?: number;
  supplier?: string;
  notes?: string;
}

export interface UpdateMaterialInput {
  name?: string;
  unit?: string;
  minimumStock?: number;
  unitPrice?: number;
  supplier?: string;
  notes?: string;
}

export interface AdjustStockInput {
  quantity: number; // positive = add, negative = deduct
  reason: string;
  referenceType?: string; // e.g., "TRANSFER", "USAGE", "DELIVERY"
  referenceId?: string;
}

class MaterialService {
  async getMaterials(
    filter: {
      search?: string;
      siteId?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: Material[]; total: number }> {
    return materialRepository.findAllFiltered(filter, pagination);
  }

  async getMaterialById(id: string): Promise<Material> {
    const material = await materialRepository.findById(id, {
      site: { select: { id: true, name: true, code: true } },
    });
    if (!material) {
      throw new NotFoundError("Material");
    }
    return material;
  }

  async createMaterial(input: CreateMaterialInput): Promise<Material> {
    const site = await prisma.site.findFirst({
      where: { id: input.siteId, deletedAt: null },
    });
    if (!site) {
      throw new NotFoundError("Site");
    }

    const material = await prisma.material.create({
      data: {
        siteId: input.siteId,
        name: input.name,
        unit: input.unit,
        currentStock: input.currentStock ?? 0,
        minimumStock: input.minimumStock ?? 0,
        unitPrice: input.unitPrice ?? 0,
        supplier: input.supplier,
        notes: input.notes,
        stockHistory: [
          {
            date: new Date().toISOString(),
            type: "INITIAL",
            quantity: input.currentStock ?? 0,
            balance: input.currentStock ?? 0,
            reason: "Initial stock",
          },
        ],
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });

    logger.info({ materialId: material.id, name: material.name }, "Material created");
    return material;
  }

  async updateMaterial(id: string, input: UpdateMaterialInput): Promise<Material> {
    const existing = await materialRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Material");
    }

    const material = await prisma.material.update({
      where: { id },
      data: input,
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });

    logger.info({ materialId: id }, "Material updated");
    return material;
  }

  async deleteMaterial(id: string): Promise<void> {
    const existing = await materialRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Material");
    }

    await materialRepository.softDelete(id);
    logger.info({ materialId: id }, "Material soft-deleted");
  }

  async adjustStock(id: string, input: AdjustStockInput): Promise<Material> {
    const existing = await materialRepository.findById(id) as Material | null;
    if (!existing) {
      throw new NotFoundError("Material");
    }

    const newStock = existing.currentStock + input.quantity;
    if (newStock < 0) {
      throw new ValidationError(
        `Insufficient stock. Current: ${existing.currentStock}, Requested deduction: ${Math.abs(input.quantity)}`,
      );
    }

    const currentHistory = (existing.stockHistory as unknown[] | null) ?? [];
    const historyEntry = {
      date: new Date().toISOString(),
      type: input.quantity >= 0 ? "ADD" : "DEDUCT",
      quantity: input.quantity,
      balance: newStock,
      reason: input.reason,
      referenceType: input.referenceType,
      referenceId: input.referenceId,
    };

    const material = await prisma.material.update({
      where: { id },
      data: {
        currentStock: newStock,
        stockHistory: [...currentHistory, historyEntry],
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });

    // Check for low stock alert
    if (newStock <= existing.minimumStock) {
      // Notify site supervisors
      const siteUsers = await prisma.siteUser.findMany({
        where: { siteId: existing.siteId },
        include: {
          user: { select: { id: true, role: true } },
        },
      });

      for (const su of siteUsers) {
        if (su.user.role === "SUPERVISOR" || su.user.role === "ADMIN") {
          await notificationService.create({
            userId: su.user.id,
            type: "LOW_STOCK_ALERT",
            title: "Low Stock Alert",
            message: `${existing.name} stock is low (${newStock} ${existing.unit}). Minimum: ${existing.minimumStock} ${existing.unit}`,
            data: { materialId: id, currentStock: newStock, minimumStock: existing.minimumStock },
          });
        }
      }
    }

    logger.info(
      { materialId: id, adjustment: input.quantity, newStock },
      "Material stock adjusted",
    );

    return material;
  }

  async getLowStock(
    siteId?: string,
    pagination: { skip: number; take: number } = { skip: 0, take: 20 },
  ): Promise<{ data: Material[]; total: number }> {
    return materialRepository.findLowStock(siteId, pagination);
  }
}

export const materialService = new MaterialService();
