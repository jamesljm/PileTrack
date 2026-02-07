import { prisma } from "../config/database";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from "../utils/api-error";
import type { HoldPoint, HoldPointType } from "@prisma/client";
import { logger } from "../config/logger";

const DEFAULT_CHECKLISTS: Record<string, Array<{ item: string; checked: boolean }>> = {
  PRE_BORING: [
    { item: "Pile position verified by surveyor", checked: false },
    { item: "Platform level checked", checked: false },
    { item: "Casing aligned and plumb", checked: false },
    { item: "Equipment inspected", checked: false },
    { item: "Ground conditions as expected", checked: false },
  ],
  PRE_CAGE: [
    { item: "Bore cleaned and free of debris", checked: false },
    { item: "Bore depth confirmed", checked: false },
    { item: "Slurry properties within spec", checked: false },
    { item: "Reinforcement cage dimensions checked", checked: false },
    { item: "Cage spacers in place", checked: false },
    { item: "Sonic logging tubes fitted (if required)", checked: false },
  ],
  PRE_CONCRETE: [
    { item: "Cage positioned at correct level", checked: false },
    { item: "Tremie pipe in place and checked", checked: false },
    { item: "Concrete delivery confirmed", checked: false },
    { item: "Slump test equipment ready", checked: false },
    { item: "Cube moulds prepared", checked: false },
  ],
};

export interface SignHoldPointInput {
  checklist: Array<{ item: string; checked: boolean }>;
  signatureData: string;
  signedByName: string;
  comments?: string;
}

class HoldPointService {
  /**
   * Auto-creates 3 hold points for a given activity.
   */
  async createForActivity(activityId: string): Promise<HoldPoint[]> {
    const activity = await prisma.activityRecord.findFirst({
      where: { id: activityId, deletedAt: null },
    });
    if (!activity) {
      throw new NotFoundError("Activity record");
    }

    // Check if hold points already exist
    const existing = await prisma.holdPoint.findMany({
      where: { activityId },
    });
    if (existing.length > 0) {
      return existing;
    }

    const types: HoldPointType[] = ["PRE_BORING", "PRE_CAGE", "PRE_CONCRETE"];
    const holdPoints = await prisma.$transaction(
      types.map((type) =>
        prisma.holdPoint.create({
          data: {
            activityId,
            type,
            status: "PENDING",
            checklist: DEFAULT_CHECKLISTS[type] ?? [],
          },
        }),
      ),
    );

    logger.info({ activityId, count: holdPoints.length }, "Hold points created for activity");
    return holdPoints;
  }

  /**
   * Gets all hold points for an activity, ordered by type.
   */
  async getByActivity(activityId: string): Promise<HoldPoint[]> {
    const holdPoints = await prisma.holdPoint.findMany({
      where: { activityId },
      include: {
        signedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { type: "asc" },
    });

    return holdPoints;
  }

  /**
   * Gets a single hold point by ID.
   */
  async getById(id: string): Promise<HoldPoint> {
    const holdPoint = await prisma.holdPoint.findUnique({
      where: { id },
      include: {
        signedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        activity: {
          select: { id: true, activityType: true, siteId: true },
        },
      },
    });
    if (!holdPoint) {
      throw new NotFoundError("Hold point");
    }
    return holdPoint;
  }

  /**
   * Signs/approves a hold point with signature data.
   * Enforces sequence: HP2 needs HP1 approved, HP3 needs HP2 approved.
   */
  async sign(
    hpId: string,
    userId: string,
    input: SignHoldPointInput,
  ): Promise<HoldPoint> {
    const holdPoint = await this.getById(hpId);

    if (holdPoint.status !== "PENDING") {
      throw new ValidationError("Only pending hold points can be signed");
    }

    // Enforce sequence
    await this.enforceSequence(holdPoint.activityId, holdPoint.type);

    const updated = await prisma.holdPoint.update({
      where: { id: hpId },
      data: {
        status: "APPROVED",
        checklist: input.checklist,
        signedByName: input.signedByName,
        signedById: userId,
        signedAt: new Date(),
        signatureData: input.signatureData,
        comments: input.comments,
      },
      include: {
        signedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    logger.info({ holdPointId: hpId, type: holdPoint.type, userId }, "Hold point signed");
    return updated;
  }

  /**
   * Rejects a hold point with notes.
   */
  async reject(
    hpId: string,
    userId: string,
    rejectionNotes: string,
  ): Promise<HoldPoint> {
    const holdPoint = await this.getById(hpId);

    if (holdPoint.status !== "PENDING") {
      throw new ValidationError("Only pending hold points can be rejected");
    }

    const updated = await prisma.holdPoint.update({
      where: { id: hpId },
      data: {
        status: "REJECTED",
        rejectionNotes,
        signedById: userId,
        signedAt: new Date(),
      },
      include: {
        signedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    logger.info({ holdPointId: hpId, type: holdPoint.type, userId }, "Hold point rejected");
    return updated;
  }

  /**
   * Enforces that hold points must be approved in sequence.
   */
  private async enforceSequence(activityId: string, currentType: HoldPointType): Promise<void> {
    const typeOrder: HoldPointType[] = ["PRE_BORING", "PRE_CAGE", "PRE_CONCRETE"];
    const currentIndex = typeOrder.indexOf(currentType);

    if (currentIndex <= 0) return; // First hold point has no prerequisites

    const previousType = typeOrder[currentIndex - 1]!;
    const previous = await prisma.holdPoint.findUnique({
      where: {
        activityId_type: {
          activityId,
          type: previousType,
        },
      },
    });

    if (!previous || previous.status !== "APPROVED") {
      throw new ValidationError(
        `Cannot sign ${currentType.replace(/_/g, " ")} — previous hold point (${previousType.replace(/_/g, " ")}) must be approved first`,
      );
    }
  }
}

export const holdPointService = new HoldPointService();
