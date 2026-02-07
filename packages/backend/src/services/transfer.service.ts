import { prisma } from "../config/database";
import { transferRepository } from "../repositories/transfer.repository";
import { NotFoundError, ValidationError, ForbiddenError } from "../utils/api-error";
import type { Transfer, TransferStatus } from "@prisma/client";
import { logger } from "../config/logger";
import { notificationService } from "./notification.service";

export interface CreateTransferInput {
  fromSiteId: string;
  toSiteId: string;
  notes?: string;
  items: {
    equipmentId?: string;
    materialId?: string;
    quantity?: number;
    notes?: string;
  }[];
}

class TransferService {
  async getTransfers(
    filter: {
      status?: TransferStatus;
      fromSiteId?: string;
      toSiteId?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: Transfer[]; total: number }> {
    return transferRepository.findAllFiltered(filter, pagination);
  }

  async getTransferById(id: string): Promise<Transfer> {
    const transfer = await transferRepository.findByIdWithRelations(id);
    if (!transfer) {
      throw new NotFoundError("Transfer");
    }
    return transfer;
  }

  async createTransfer(userId: string, input: CreateTransferInput): Promise<Transfer> {
    if (input.fromSiteId === input.toSiteId) {
      throw new ValidationError("Source and destination sites must be different");
    }

    // Validate sites exist
    const [fromSite, toSite] = await Promise.all([
      prisma.site.findFirst({ where: { id: input.fromSiteId, deletedAt: null } }),
      prisma.site.findFirst({ where: { id: input.toSiteId, deletedAt: null } }),
    ]);

    if (!fromSite) throw new NotFoundError("Source site");
    if (!toSite) throw new NotFoundError("Destination site");

    if (!input.items || input.items.length === 0) {
      throw new ValidationError("Transfer must include at least one item");
    }

    // Validate items
    for (const item of input.items) {
      if (!item.equipmentId && !item.materialId) {
        throw new ValidationError("Each transfer item must reference equipment or material");
      }

      if (item.equipmentId) {
        const eq = await prisma.equipment.findFirst({
          where: { id: item.equipmentId, deletedAt: null },
        });
        if (!eq) throw new NotFoundError(`Equipment ${item.equipmentId}`);
      }

      if (item.materialId) {
        if (!item.quantity || item.quantity <= 0) {
          throw new ValidationError("Material transfer items must have a positive quantity");
        }
        const mat = await prisma.material.findFirst({
          where: { id: item.materialId, deletedAt: null },
        });
        if (!mat) throw new NotFoundError(`Material ${item.materialId}`);
      }
    }

    const transfer = await prisma.transfer.create({
      data: {
        fromSiteId: input.fromSiteId,
        toSiteId: input.toSiteId,
        requestedById: userId,
        notes: input.notes,
        items: {
          create: input.items.map((item) => ({
            equipmentId: item.equipmentId,
            materialId: item.materialId,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      },
      include: {
        fromSite: { select: { id: true, name: true, code: true } },
        toSite: { select: { id: true, name: true, code: true } },
        requestedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        items: {
          include: {
            equipment: { select: { id: true, name: true, serialNumber: true } },
            material: { select: { id: true, name: true, unit: true } },
          },
        },
      },
    });

    // Notify supervisors of both sites
    const siteUsers = await prisma.siteUser.findMany({
      where: {
        siteId: { in: [input.fromSiteId, input.toSiteId] },
      },
      include: {
        user: { select: { id: true, role: true } },
      },
    });

    for (const su of siteUsers) {
      if (su.user.role === "SUPERVISOR" || su.user.role === "ADMIN") {
        await notificationService.create({
          userId: su.user.id,
          type: "TRANSFER_REQUESTED",
          title: "New Transfer Request",
          message: `Transfer requested from ${fromSite.name} to ${toSite.name}`,
          data: { transferId: transfer.id },
        });
      }
    }

    logger.info({ transferId: transfer.id }, "Transfer created");
    return transfer;
  }

  async approve(id: string, approverId: string): Promise<Transfer> {
    const transfer = await transferRepository.findByIdWithRelations(id);
    if (!transfer) throw new NotFoundError("Transfer");

    if (transfer.status !== "REQUESTED") {
      throw new ValidationError("Only requested transfers can be approved");
    }

    const updated = await prisma.transfer.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: approverId,
        approvedAt: new Date(),
      },
      include: {
        fromSite: { select: { id: true, name: true, code: true } },
        toSite: { select: { id: true, name: true, code: true } },
        requestedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        items: true,
      },
    });

    await notificationService.create({
      userId: transfer.requestedById,
      type: "TRANSFER_APPROVED",
      title: "Transfer Approved",
      message: `Your transfer request has been approved.`,
      data: { transferId: id },
    });

    logger.info({ transferId: id, approverId }, "Transfer approved");
    return updated;
  }

  async ship(id: string): Promise<Transfer> {
    const transfer = await transferRepository.findByIdWithRelations(id);
    if (!transfer) throw new NotFoundError("Transfer");

    if (transfer.status !== "APPROVED") {
      throw new ValidationError("Only approved transfers can be shipped");
    }

    const updated = await prisma.transfer.update({
      where: { id },
      data: {
        status: "IN_TRANSIT",
        shippedAt: new Date(),
      },
      include: {
        fromSite: { select: { id: true, name: true, code: true } },
        toSite: { select: { id: true, name: true, code: true } },
        items: true,
      },
    });

    logger.info({ transferId: id }, "Transfer shipped");
    return updated;
  }

  async deliver(id: string): Promise<Transfer> {
    const transfer = await transferRepository.findByIdWithRelations(id);
    if (!transfer) throw new NotFoundError("Transfer");

    if (transfer.status !== "IN_TRANSIT") {
      throw new ValidationError("Only in-transit transfers can be marked as delivered");
    }

    // Use a transaction to update equipment locations and material stocks
    const updated = await prisma.$transaction(async (tx) => {
      // Get items
      const items = await tx.transferItem.findMany({
        where: { transferId: id },
        include: {
          equipment: true,
          material: true,
        },
      });

      for (const item of items) {
        // Move equipment to destination site
        if (item.equipmentId) {
          // Close old site history record
          const openHistory = await tx.equipmentSiteHistory.findFirst({
            where: {
              equipmentId: item.equipmentId,
              removedAt: null,
            },
            orderBy: { assignedAt: "desc" },
          });
          if (openHistory) {
            await tx.equipmentSiteHistory.update({
              where: { id: openHistory.id },
              data: { removedAt: new Date() },
            });
          }

          await tx.equipment.update({
            where: { id: item.equipmentId },
            data: { siteId: transfer.toSiteId },
          });

          // Create new site history record
          await tx.equipmentSiteHistory.create({
            data: {
              equipmentId: item.equipmentId,
              siteId: transfer.toSiteId,
              transferId: id,
            },
          });
        }

        // Adjust material stock: deduct from source, add to destination
        if (item.materialId && item.quantity) {
          // Deduct from source
          const sourceMaterial = await tx.material.findFirst({
            where: { id: item.materialId },
          });

          if (sourceMaterial) {
            const newSourceStock = sourceMaterial.currentStock - item.quantity;
            const sourceHistory = (sourceMaterial.stockHistory as unknown[] | null) ?? [];

            await tx.material.update({
              where: { id: item.materialId },
              data: {
                currentStock: Math.max(0, newSourceStock),
                stockHistory: [
                  ...sourceHistory,
                  {
                    date: new Date().toISOString(),
                    type: "DEDUCT",
                    quantity: -item.quantity,
                    balance: Math.max(0, newSourceStock),
                    reason: `Transfer to ${transfer.toSiteId}`,
                    referenceType: "TRANSFER",
                    referenceId: id,
                  },
                ],
              },
            });
          }

          // Find or create material at destination
          let destMaterial = await tx.material.findFirst({
            where: {
              siteId: transfer.toSiteId,
              name: item.material?.name ?? "Unknown",
              deletedAt: null,
            },
          });

          if (destMaterial) {
            const destHistory = (destMaterial.stockHistory as unknown[] | null) ?? [];
            await tx.material.update({
              where: { id: destMaterial.id },
              data: {
                currentStock: destMaterial.currentStock + item.quantity,
                stockHistory: [
                  ...destHistory,
                  {
                    date: new Date().toISOString(),
                    type: "ADD",
                    quantity: item.quantity,
                    balance: destMaterial.currentStock + item.quantity,
                    reason: `Transfer from ${transfer.fromSiteId}`,
                    referenceType: "TRANSFER",
                    referenceId: id,
                  },
                ],
              },
            });
          } else if (item.material) {
            await tx.material.create({
              data: {
                siteId: transfer.toSiteId,
                name: item.material.name,
                unit: item.material.unit,
                currentStock: item.quantity,
                minimumStock: 0,
                unitPrice: item.material.unitPrice,
                stockHistory: [
                  {
                    date: new Date().toISOString(),
                    type: "ADD",
                    quantity: item.quantity,
                    balance: item.quantity,
                    reason: `Transfer from ${transfer.fromSiteId}`,
                    referenceType: "TRANSFER",
                    referenceId: id,
                  },
                ],
              },
            });
          }
        }
      }

      return tx.transfer.update({
        where: { id },
        data: {
          status: "DELIVERED",
          deliveredAt: new Date(),
        },
        include: {
          fromSite: { select: { id: true, name: true, code: true } },
          toSite: { select: { id: true, name: true, code: true } },
          requestedBy: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          items: {
            include: {
              equipment: { select: { id: true, name: true, serialNumber: true } },
              material: { select: { id: true, name: true, unit: true } },
            },
          },
        },
      });
    });

    await notificationService.create({
      userId: transfer.requestedById,
      type: "TRANSFER_DELIVERED",
      title: "Transfer Delivered",
      message: `Transfer has been delivered successfully.`,
      data: { transferId: id },
    });

    logger.info({ transferId: id }, "Transfer delivered");
    return updated;
  }

  async cancel(id: string, userId: string): Promise<Transfer> {
    const transfer = await transferRepository.findByIdWithRelations(id);
    if (!transfer) throw new NotFoundError("Transfer");

    if (transfer.status === "DELIVERED" || transfer.status === "CANCELLED") {
      throw new ValidationError(`Cannot cancel a transfer that is ${transfer.status.toLowerCase()}`);
    }

    const updated = await prisma.transfer.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
      include: {
        fromSite: { select: { id: true, name: true, code: true } },
        toSite: { select: { id: true, name: true, code: true } },
        items: true,
      },
    });

    logger.info({ transferId: id, cancelledBy: userId }, "Transfer cancelled");
    return updated;
  }

  async getTransfersBySite(
    siteId: string,
    pagination: { skip: number; take: number },
    direction?: "from" | "to" | "both",
  ): Promise<{ data: Transfer[]; total: number }> {
    return transferRepository.findBySite(siteId, pagination, direction);
  }
}

export const transferService = new TransferService();
