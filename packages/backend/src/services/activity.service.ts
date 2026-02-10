import { z } from "zod";
import { prisma } from "../config/database";
import { activityRepository } from "../repositories/activity.repository";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from "../utils/api-error";
import type { ActivityRecord, ActivityType, ActivityStatus } from "@prisma/client";
import { logger } from "../config/logger";
import { notificationService } from "./notification.service";
import {
  activityDetailSchemaMap,
} from "@piletrack/shared";
import { equipmentUsageService } from "./equipment-usage.service";

export interface CreateActivityInput {
  siteId: string;
  activityType: ActivityType;
  activityDate: Date;
  weather?: unknown;
  details: unknown;
  remarks?: string;
  photos?: string[];
  clientId?: string;
}

export interface UpdateActivityInput {
  activityType?: ActivityType;
  activityDate?: Date;
  weather?: unknown;
  details?: unknown;
  remarks?: string;
  photos?: string[];
}

/**
 * Computes theoretical concrete volume for circular piles.
 * diameter in mm, depth in m → volume in m³
 */
function computeTheoreticalVolume(diameterMm: number, depthM: number): number {
  const radiusM = diameterMm / 2000;
  return Math.PI * radiusM * radiusM * depthM;
}

/**
 * Computes overconsumption percentage.
 */
function computeOverconsumption(actual: number, theoretical: number): number {
  if (theoretical <= 0) return 0;
  return ((actual - theoretical) / theoretical) * 100;
}

/**
 * Computes theoretical volume for rectangular sections (diaphragm wall, pilecap).
 * All dimensions in metres.
 */
function computeRectangularVolume(length: number, width: number, depth: number): number {
  return length * width * depth;
}

/**
 * Computes theoretical volume for caisson piles.
 * diameter in m, depth in m → volume in m³
 */
function computeCaissonVolume(diameterM: number, depthM: number): number {
  const radiusM = diameterM / 2;
  return Math.PI * radiusM * radiusM * depthM;
}

/**
 * Auto-enriches activity details with computed fields based on activity type.
 */
function enrichDetails(activityType: ActivityType, details: Record<string, unknown>): Record<string, unknown> {
  const enriched = { ...details };

  switch (activityType) {
    case "BORED_PILING": {
      const diameter = details.diameter as number | undefined;
      const depth = details.depth as number | undefined;
      const concreteVolume = details.concreteVolume as number | undefined;
      const trucks = details.concreteTrucks as Array<{ volume: number; accepted: boolean }> | undefined;

      if (diameter && depth) {
        enriched.theoreticalVolume = Math.round(computeTheoreticalVolume(diameter, depth) * 100) / 100;
      }

      // Sum truck volumes if trucks provided and concreteVolume not explicitly set differently
      if (trucks && trucks.length > 0) {
        const truckTotal = trucks
          .filter((t) => t.accepted !== false)
          .reduce((sum, t) => sum + (t.volume || 0), 0);
        if (!concreteVolume || concreteVolume === 0) {
          enriched.concreteVolume = Math.round(truckTotal * 100) / 100;
        }
      }

      const actualVol = enriched.concreteVolume as number | undefined;
      const theoVol = enriched.theoreticalVolume as number | undefined;
      if (actualVol && theoVol && theoVol > 0) {
        enriched.overconsumptionPct = Math.round(computeOverconsumption(actualVol, theoVol) * 10) / 10;
      }
      break;
    }
    case "DIAPHRAGM_WALL": {
      const length = details.length as number | undefined;
      const width = details.width as number | undefined;
      const depth = details.depth as number | undefined;
      const concreteVolume = details.concreteVolume as number | undefined;
      const trucks = details.concreteTrucks as Array<{ volume: number; accepted: boolean }> | undefined;

      if (length && width && depth) {
        enriched.theoreticalVolume = Math.round(computeRectangularVolume(length, width, depth) * 100) / 100;
      }
      if (trucks && trucks.length > 0) {
        const truckTotal = trucks.filter((t) => t.accepted !== false).reduce((sum, t) => sum + (t.volume || 0), 0);
        if (!concreteVolume || concreteVolume === 0) {
          enriched.concreteVolume = Math.round(truckTotal * 100) / 100;
        }
      }
      const actualVol = enriched.concreteVolume as number | undefined;
      const theoVol = enriched.theoreticalVolume as number | undefined;
      if (actualVol && theoVol && theoVol > 0) {
        enriched.overconsumptionPct = Math.round(computeOverconsumption(actualVol, theoVol) * 10) / 10;
      }
      break;
    }
    case "CAISSON_PILE": {
      const diameter = details.diameter as number | undefined;
      const depth = details.depth as number | undefined;
      const concreteVolume = details.concreteVolume as number | undefined;
      const trucks = details.concreteTrucks as Array<{ volume: number; accepted: boolean }> | undefined;

      if (diameter && depth) {
        enriched.theoreticalVolume = Math.round(computeCaissonVolume(diameter, depth) * 100) / 100;
      }
      if (trucks && trucks.length > 0) {
        const truckTotal = trucks.filter((t) => t.accepted !== false).reduce((sum, t) => sum + (t.volume || 0), 0);
        if (!concreteVolume || concreteVolume === 0) {
          enriched.concreteVolume = Math.round(truckTotal * 100) / 100;
        }
      }
      const actualVol = enriched.concreteVolume as number | undefined;
      const theoVol = enriched.theoreticalVolume as number | undefined;
      if (actualVol && theoVol && theoVol > 0) {
        enriched.overconsumptionPct = Math.round(computeOverconsumption(actualVol, theoVol) * 10) / 10;
      }
      break;
    }
    case "PILECAP": {
      const length = details.length as number | undefined;
      const width = details.width as number | undefined;
      const depth = details.depth as number | undefined;
      const concreteVolume = details.concreteVolume as number | undefined;
      const trucks = details.concreteTrucks as Array<{ volume: number; accepted: boolean }> | undefined;

      if (length && width && depth) {
        enriched.theoreticalVolume = Math.round(computeRectangularVolume(length, width, depth) * 100) / 100;
      }
      if (trucks && trucks.length > 0) {
        const truckTotal = trucks.filter((t) => t.accepted !== false).reduce((sum, t) => sum + (t.volume || 0), 0);
        if (!concreteVolume || concreteVolume === 0) {
          enriched.concreteVolume = Math.round(truckTotal * 100) / 100;
        }
      }
      const actualVol = enriched.concreteVolume as number | undefined;
      const theoVol = enriched.theoreticalVolume as number | undefined;
      if (actualVol && theoVol && theoVol > 0) {
        enriched.overconsumptionPct = Math.round(computeOverconsumption(actualVol, theoVol) * 10) / 10;
      }
      break;
    }
    case "MICROPILING": {
      const diameter = details.diameter as number | undefined;
      const depth = details.depth as number | undefined;
      const groutVolume = details.groutVolume as number | undefined;

      if (diameter && depth) {
        // Theoretical grout volume: π × (diameter/2000)² × depth × 1000 (litres)
        const theoLitres = Math.PI * Math.pow(diameter / 2000, 2) * depth * 1000;
        enriched.theoreticalGroutVolume = Math.round(theoLitres * 100) / 100;
      }
      const theoGrout = enriched.theoreticalGroutVolume as number | undefined;
      if (groutVolume && theoGrout && theoGrout > 0) {
        enriched.overconsumptionPct = Math.round(computeOverconsumption(groutVolume, theoGrout) * 10) / 10;
      }
      break;
    }
  }

  return enriched;
}

class ActivityService {
  async getActivities(
    siteId: string,
    pagination: { skip: number; take: number },
    filters?: {
      activityType?: ActivityType;
      status?: ActivityStatus;
      from?: Date;
      to?: Date;
    },
  ): Promise<{ data: ActivityRecord[]; total: number }> {
    return activityRepository.findBySite(siteId, pagination, filters);
  }

  async getActivityById(id: string): Promise<ActivityRecord> {
    const activity = await activityRepository.findByIdWithRelations(id);
    if (!activity) {
      throw new NotFoundError("Activity record");
    }
    return activity;
  }

  async createActivity(
    userId: string,
    input: CreateActivityInput,
  ): Promise<ActivityRecord> {
    // Validate details against activity type schema
    this.validateDetails(input.activityType, input.details);

    // Check site exists
    const site = await prisma.site.findFirst({
      where: { id: input.siteId, deletedAt: null },
    });
    if (!site) {
      throw new NotFoundError("Site");
    }

    // Enrich details with computed fields
    const enrichedDetails = enrichDetails(
      input.activityType,
      input.details as Record<string, unknown>,
    );

    const activity = await prisma.activityRecord.create({
      data: {
        siteId: input.siteId,
        activityType: input.activityType,
        activityDate: input.activityDate,
        weather: input.weather as object | undefined,
        details: enrichedDetails as object,
        remarks: input.remarks,
        photos: input.photos ?? [],
        createdById: userId,
        clientId: input.clientId,
        status: "DRAFT",
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        site: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    logger.info({ activityId: activity.id, siteId: input.siteId, type: input.activityType }, "Activity created");
    return activity;
  }

  async updateActivity(
    id: string,
    userId: string,
    input: UpdateActivityInput,
  ): Promise<ActivityRecord> {
    const existing = await activityRepository.findByIdWithRelations(id);
    if (!existing) {
      throw new NotFoundError("Activity record");
    }

    // Only allow editing DRAFT or REJECTED activities
    if (existing.status !== "DRAFT" && existing.status !== "REJECTED") {
      throw new ValidationError("Only draft or rejected activities can be edited");
    }

    // Only creator can edit
    if (existing.createdById !== userId) {
      throw new ForbiddenError("Only the creator can edit this activity");
    }

    // Validate details if provided
    const activityType = input.activityType ?? existing.activityType;
    if (input.details) {
      this.validateDetails(activityType, input.details);
    }

    // Enrich details with computed fields
    const enrichedDetails = input.details
      ? enrichDetails(activityType, input.details as Record<string, unknown>)
      : undefined;

    const activity = await prisma.activityRecord.update({
      where: { id },
      data: {
        ...(input.activityType ? { activityType: input.activityType } : {}),
        ...(input.activityDate ? { activityDate: input.activityDate } : {}),
        ...(input.weather !== undefined ? { weather: input.weather as object } : {}),
        ...(enrichedDetails ? { details: enrichedDetails as object } : {}),
        ...(input.remarks !== undefined ? { remarks: input.remarks } : {}),
        ...(input.photos ? { photos: input.photos } : {}),
        status: "DRAFT", // Reset to draft on edit
        version: { increment: 1 },
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        site: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    logger.info({ activityId: id }, "Activity updated");
    return activity;
  }

  async deleteActivity(id: string, userId: string): Promise<void> {
    const existing = await activityRepository.findByIdWithRelations(id);
    if (!existing) {
      throw new NotFoundError("Activity record");
    }

    if (existing.status === "APPROVED") {
      throw new ValidationError("Approved activities cannot be deleted");
    }

    if (existing.createdById !== userId) {
      throw new ForbiddenError("Only the creator can delete this activity");
    }

    await activityRepository.softDelete(id);
    logger.info({ activityId: id }, "Activity soft-deleted");
  }

  async submitForApproval(id: string, userId: string, userRole?: string): Promise<ActivityRecord> {
    const existing = await activityRepository.findByIdWithRelations(id);
    if (!existing) {
      throw new NotFoundError("Activity record");
    }

    if (existing.status !== "DRAFT" && existing.status !== "REJECTED") {
      throw new ValidationError("Only draft or rejected activities can be submitted for approval");
    }

    if (existing.createdById !== userId && userRole !== "ADMIN") {
      throw new ForbiddenError("Only the creator can submit this activity");
    }

    const activity = await prisma.activityRecord.update({
      where: { id },
      data: { status: "SUBMITTED" },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        site: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    // Notify supervisors/admins
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
          type: "ACTIVITY_SUBMITTED",
          title: "Activity Submitted for Approval",
          message: `A ${existing.activityType.replace(/_/g, " ")} activity has been submitted for approval.`,
          data: { activityId: id, siteId: existing.siteId },
        });
      }
    }

    logger.info({ activityId: id }, "Activity submitted for approval");
    return activity;
  }

  async approve(id: string, approverId: string): Promise<ActivityRecord> {
    const existing = await activityRepository.findByIdWithRelations(id);
    if (!existing) {
      throw new NotFoundError("Activity record");
    }

    if (existing.status !== "SUBMITTED") {
      throw new ValidationError("Only submitted activities can be approved");
    }

    const activity = await prisma.activityRecord.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: approverId,
        approvedAt: new Date(),
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        approvedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        site: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    // Auto-deduct materials from site stock
    await this.autoDeductMaterials(activity);

    // Recalculate equipment usage hours
    await this.recalculateEquipmentHours(activity);

    // Notify the creator
    await notificationService.create({
      userId: existing.createdById,
      type: "ACTIVITY_APPROVED",
      title: "Activity Approved",
      message: `Your ${existing.activityType.replace(/_/g, " ")} activity has been approved.`,
      data: { activityId: id },
    });

    logger.info({ activityId: id, approverId }, "Activity approved");
    return activity;
  }

  async reject(
    id: string,
    approverId: string,
    rejectionNotes: string,
  ): Promise<ActivityRecord> {
    const existing = await activityRepository.findByIdWithRelations(id);
    if (!existing) {
      throw new NotFoundError("Activity record");
    }

    if (existing.status !== "SUBMITTED") {
      throw new ValidationError("Only submitted activities can be rejected");
    }

    const activity = await prisma.activityRecord.update({
      where: { id },
      data: {
        status: "REJECTED",
        approvedById: approverId,
        rejectionNotes,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        site: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    // Notify the creator
    await notificationService.create({
      userId: existing.createdById,
      type: "ACTIVITY_REJECTED",
      title: "Activity Rejected",
      message: `Your ${existing.activityType.replace(/_/g, " ")} activity has been rejected: ${rejectionNotes}`,
      data: { activityId: id, rejectionNotes },
    });

    logger.info({ activityId: id, approverId }, "Activity rejected");
    return activity;
  }

  async getPendingApprovals(
    siteIds?: string[],
    pagination: { skip: number; take: number } = { skip: 0, take: 20 },
  ): Promise<{ data: ActivityRecord[]; total: number }> {
    return activityRepository.findPendingApproval(siteIds, pagination);
  }

  async getActivityDetails(id: string): Promise<ActivityRecord> {
    return this.getActivityById(id);
  }

  private validateDetails(activityType: ActivityType, details: unknown): void {
    const schema = activityDetailSchemaMap[activityType as keyof typeof activityDetailSchemaMap];
    if (schema) {
      const result = schema.safeParse(details);
      if (!result.success) {
        throw new ValidationError(
          `Invalid details for activity type ${activityType}`,
          result.error.errors,
        );
      }
    }
  }

  /**
   * Recalculate equipment usage hours when activity is approved.
   */
  private async recalculateEquipmentHours(activity: ActivityRecord): Promise<void> {
    const details = (activity.details ?? {}) as Record<string, unknown>;
    const equipmentUsed = details.equipmentUsed as Array<{
      equipmentId: string;
      hours?: number;
    }> | undefined;

    if (!equipmentUsed || equipmentUsed.length === 0) return;

    const uniqueIds = [...new Set(equipmentUsed.map((e) => e.equipmentId).filter(Boolean))];

    for (const eqId of uniqueIds) {
      try {
        await equipmentUsageService.recalculateHours(eqId);
      } catch (error) {
        logger.warn({ equipmentId: eqId, activityId: activity.id, error }, "Failed to recalculate equipment hours");
      }
    }
  }

  /**
   * Auto-deduct materials from site stock when activity is approved.
   * Matches material names to activity detail fields.
   */
  private async autoDeductMaterials(activity: ActivityRecord): Promise<void> {
    const details = (activity.details ?? {}) as Record<string, unknown>;
    const siteId = activity.siteId;

    // Collect material deductions: { materialNamePattern: quantity }
    const deductions: Array<{ pattern: string; quantity: number; unit: string }> = [];

    // Concrete volume (m³)
    const concreteVolume = details.concreteVolume as number | undefined;
    if (concreteVolume && concreteVolume > 0) {
      deductions.push({ pattern: "concrete", quantity: concreteVolume, unit: "m³" });
    }

    // Bentonite (litres)
    const bentoniteUsed = details.bentoniteUsed as number | undefined;
    if (bentoniteUsed && bentoniteUsed > 0) {
      deductions.push({ pattern: "bentonite", quantity: bentoniteUsed, unit: "litres" });
    }

    // Grout volume (litres) — for micropiling, soil nailing, ground anchor
    const groutVolume = details.groutVolume as number | undefined;
    if (groutVolume && groutVolume > 0) {
      deductions.push({ pattern: "grout", quantity: groutVolume, unit: "litres" });
    }

    if (deductions.length === 0) return;

    // Find matching materials at this site
    const siteMaterials = await prisma.material.findMany({
      where: { siteId, deletedAt: null },
    });

    for (const deduction of deductions) {
      const matching = siteMaterials.find(
        (m) => m.name.toLowerCase().includes(deduction.pattern),
      );

      if (matching) {
        const newStock = matching.currentStock - deduction.quantity;
        if (newStock < 0) {
          logger.warn(
            { materialId: matching.id, required: deduction.quantity, available: matching.currentStock },
            "Insufficient stock for auto-deduction, skipping",
          );
          continue;
        }

        const currentHistory = (matching.stockHistory as unknown[] | null) ?? [];
        const historyEntry = {
          date: new Date().toISOString(),
          type: "DEDUCT",
          quantity: -deduction.quantity,
          balance: newStock,
          reason: `Auto-deducted for ${activity.activityType.replace(/_/g, " ")} activity`,
          referenceType: "ACTIVITY",
          referenceId: activity.id,
        };

        await prisma.material.update({
          where: { id: matching.id },
          data: {
            currentStock: newStock,
            stockHistory: [...currentHistory, historyEntry],
          },
        });

        // Low stock alert
        if (newStock <= matching.minimumStock) {
          const siteUsers = await prisma.siteUser.findMany({
            where: { siteId },
            include: { user: { select: { id: true, role: true } } },
          });

          for (const su of siteUsers) {
            if (su.user.role === "SUPERVISOR" || su.user.role === "ADMIN") {
              await notificationService.create({
                userId: su.user.id,
                type: "LOW_STOCK_ALERT",
                title: "Low Stock Alert",
                message: `${matching.name} stock is low (${newStock} ${matching.unit}). Minimum: ${matching.minimumStock} ${matching.unit}`,
                data: { materialId: matching.id, currentStock: newStock, minimumStock: matching.minimumStock },
              });
            }
          }
        }

        logger.info(
          { materialId: matching.id, deducted: deduction.quantity, activityId: activity.id },
          "Material auto-deducted on activity approval",
        );
      }
    }
  }
}

export const activityService = new ActivityService();
