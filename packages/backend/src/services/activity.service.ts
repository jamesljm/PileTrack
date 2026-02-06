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

// Activity-type-specific detail schemas
const boredPilingDetailsSchema = z.object({
  pileId: z.string().min(1),
  pileLength: z.number().positive(),
  pileDiameter: z.number().positive(),
  boringDepth: z.number().positive().optional(),
  concreteVolume: z.number().positive().optional(),
  casingDepth: z.number().optional(),
  rebarCageLength: z.number().optional(),
  slumpTestResult: z.number().optional(),
  remarks: z.string().optional(),
});

const micropilingDetailsSchema = z.object({
  pileId: z.string().min(1),
  pileLength: z.number().positive(),
  pileDiameter: z.number().positive(),
  groutVolume: z.number().optional(),
  casingDepth: z.number().optional(),
  remarks: z.string().optional(),
});

const genericDetailsSchema = z.object({}).passthrough();

const detailSchemaMap: Record<string, z.ZodSchema> = {
  BORED_PILING: boredPilingDetailsSchema,
  MICROPILING: micropilingDetailsSchema,
  DIAPHRAGM_WALL: genericDetailsSchema,
  SHEET_PILING: genericDetailsSchema,
  PILECAP: genericDetailsSchema,
  PILE_HEAD_HACKING: genericDetailsSchema,
  SOIL_NAILING: genericDetailsSchema,
  GROUND_ANCHOR: genericDetailsSchema,
  CAISSON_PILE: genericDetailsSchema,
};

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

    const activity = await prisma.activityRecord.create({
      data: {
        siteId: input.siteId,
        activityType: input.activityType,
        activityDate: input.activityDate,
        weather: input.weather as object | undefined,
        details: input.details as object,
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

    const activity = await prisma.activityRecord.update({
      where: { id },
      data: {
        ...(input.activityType ? { activityType: input.activityType } : {}),
        ...(input.activityDate ? { activityDate: input.activityDate } : {}),
        ...(input.weather !== undefined ? { weather: input.weather as object } : {}),
        ...(input.details ? { details: input.details as object } : {}),
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

  async submitForApproval(id: string, userId: string): Promise<ActivityRecord> {
    const existing = await activityRepository.findByIdWithRelations(id);
    if (!existing) {
      throw new NotFoundError("Activity record");
    }

    if (existing.status !== "DRAFT" && existing.status !== "REJECTED") {
      throw new ValidationError("Only draft or rejected activities can be submitted for approval");
    }

    if (existing.createdById !== userId) {
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
    const schema = detailSchemaMap[activityType];
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
}

export const activityService = new ActivityService();
