import { prisma } from "../config/database";
import { ncrRepository } from "../repositories/ncr.repository";
import { NotFoundError, ValidationError } from "../utils/api-error";
import type { NCR } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreateNCRInput {
  siteId: string;
  pileId?: string;
  ncrNumber?: string;
  category: string;
  priority?: string;
  title: string;
  description: string;
  assignedToId?: string;
  dueDate?: string;
  photos?: unknown[];
}

export interface UpdateNCRInput {
  category?: string;
  priority?: string;
  title?: string;
  description?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  assignedToId?: string;
  dueDate?: string;
  photos?: unknown[];
}

const NCR_INCLUDE = {
  site: { select: { id: true, name: true, code: true } },
  raisedBy: { select: { id: true, firstName: true, lastName: true } },
  assignedTo: { select: { id: true, firstName: true, lastName: true } },
  closedBy: { select: { id: true, firstName: true, lastName: true } },
  pile: { select: { id: true, pileId: true } },
};

class NCRService {
  async getNCRs(
    filter: { siteId?: string; status?: string; priority?: string; category?: string },
    pagination: { skip: number; take: number },
  ): Promise<{ data: NCR[]; total: number }> {
    return ncrRepository.findAllFiltered(filter, pagination);
  }

  async getNCRById(id: string): Promise<NCR> {
    const ncr = await ncrRepository.findById(id, NCR_INCLUDE);
    if (!ncr) throw new NotFoundError("NCR");
    return ncr;
  }

  async createNCR(input: CreateNCRInput, userId: string): Promise<NCR> {
    const site = await prisma.site.findFirst({ where: { id: input.siteId, deletedAt: null } });
    if (!site) throw new NotFoundError("Site");

    const ncrNumber = input.ncrNumber || await ncrRepository.getNextNcrNumber(input.siteId);

    const ncr = await prisma.nCR.create({
      data: {
        siteId: input.siteId,
        pileId: input.pileId || null,
        ncrNumber,
        category: input.category as any,
        priority: (input.priority as any) ?? "MEDIUM",
        title: input.title,
        description: input.description,
        assignedToId: input.assignedToId || null,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        photos: (input.photos as any) ?? [],
        raisedById: userId,
      },
      include: NCR_INCLUDE,
    });

    logger.info({ ncrId: ncr.id, ncrNumber }, "NCR created");
    return ncr;
  }

  async updateNCR(id: string, input: UpdateNCRInput): Promise<NCR> {
    const existing = await ncrRepository.findById(id);
    if (!existing) throw new NotFoundError("NCR");

    const data: Record<string, unknown> = {};
    if (input.category !== undefined) data.category = input.category;
    if (input.priority !== undefined) data.priority = input.priority;
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.rootCause !== undefined) data.rootCause = input.rootCause;
    if (input.correctiveAction !== undefined) data.correctiveAction = input.correctiveAction;
    if (input.preventiveAction !== undefined) data.preventiveAction = input.preventiveAction;
    if (input.assignedToId !== undefined) data.assignedToId = input.assignedToId || null;
    if (input.dueDate !== undefined) data.dueDate = input.dueDate ? new Date(input.dueDate) : null;
    if (input.photos !== undefined) data.photos = input.photos;

    const ncr = await prisma.nCR.update({
      where: { id },
      data,
      include: NCR_INCLUDE,
    });

    logger.info({ ncrId: id }, "NCR updated");
    return ncr;
  }

  async deleteNCR(id: string): Promise<void> {
    const existing = await ncrRepository.findById(id);
    if (!existing) throw new NotFoundError("NCR");
    await ncrRepository.softDelete(id);
    logger.info({ ncrId: id }, "NCR soft-deleted");
  }

  async investigateNCR(id: string): Promise<NCR> {
    const existing = await ncrRepository.findById(id) as NCR | null;
    if (!existing) throw new NotFoundError("NCR");
    if (existing.status !== "OPEN") throw new ValidationError("Only OPEN NCRs can be moved to investigating");

    const ncr = await prisma.nCR.update({
      where: { id },
      data: { status: "INVESTIGATING" },
      include: NCR_INCLUDE,
    });

    logger.info({ ncrId: id }, "NCR moved to investigating");
    return ncr;
  }

  async resolveNCR(id: string, body: { rootCause?: string; correctiveAction?: string; preventiveAction?: string }): Promise<NCR> {
    const existing = await ncrRepository.findById(id) as NCR | null;
    if (!existing) throw new NotFoundError("NCR");
    if (!["INVESTIGATING", "ACTION_REQUIRED"].includes(existing.status)) {
      throw new ValidationError("NCR must be in INVESTIGATING or ACTION_REQUIRED status to resolve");
    }

    const ncr = await prisma.nCR.update({
      where: { id },
      data: {
        status: "RESOLVED",
        rootCause: body.rootCause ?? existing.rootCause,
        correctiveAction: body.correctiveAction ?? existing.correctiveAction,
        preventiveAction: body.preventiveAction ?? existing.preventiveAction,
      },
      include: NCR_INCLUDE,
    });

    logger.info({ ncrId: id }, "NCR resolved");
    return ncr;
  }

  async closeNCR(id: string, userId: string): Promise<NCR> {
    const existing = await ncrRepository.findById(id) as NCR | null;
    if (!existing) throw new NotFoundError("NCR");
    if (existing.status !== "RESOLVED") throw new ValidationError("Only RESOLVED NCRs can be closed");

    const ncr = await prisma.nCR.update({
      where: { id },
      data: {
        status: "CLOSED",
        closedById: userId,
        closedAt: new Date(),
      },
      include: NCR_INCLUDE,
    });

    logger.info({ ncrId: id, closedBy: userId }, "NCR closed");
    return ncr;
  }

  async voidNCR(id: string): Promise<NCR> {
    const existing = await ncrRepository.findById(id) as NCR | null;
    if (!existing) throw new NotFoundError("NCR");

    const ncr = await prisma.nCR.update({
      where: { id },
      data: { status: "VOIDED" },
      include: NCR_INCLUDE,
    });

    logger.info({ ncrId: id }, "NCR voided");
    return ncr;
  }
}

export const ncrService = new NCRService();
