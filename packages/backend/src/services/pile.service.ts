import { prisma } from "../config/database";
import { pileRepository } from "../repositories/pile.repository";
import { NotFoundError, ValidationError } from "../utils/api-error";
import type { Pile } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreatePileInput {
  siteId: string;
  pileId: string;
  pileType: string;
  designLength?: number;
  designDiameter?: number;
  cutOffLevel?: number;
  platformLevel?: number;
  gridRef?: string;
  gpsLat?: number;
  gpsLng?: number;
  concreteGrade?: string;
  concreteVolume?: number;
  remarks?: string;
}

export interface UpdatePileInput {
  pileId?: string;
  pileType?: string;
  designLength?: number;
  actualLength?: number;
  designDiameter?: number;
  cutOffLevel?: number;
  platformLevel?: number;
  gridRef?: string;
  gpsLat?: number;
  gpsLng?: number;
  concreteGrade?: string;
  concreteVolume?: number;
  actualConcreteVol?: number;
  overconsumption?: number;
  remarks?: string;
}

const PILE_INCLUDE = {
  site: { select: { id: true, name: true, code: true } },
  createdBy: { select: { id: true, firstName: true, lastName: true } },
};

class PileService {
  async getPiles(
    filter: { siteId?: string; status?: string; pileType?: string },
    pagination: { skip: number; take: number },
  ): Promise<{ data: Pile[]; total: number }> {
    return pileRepository.findAllFiltered(filter, pagination);
  }

  async getPileById(id: string): Promise<Pile> {
    const pile = await pileRepository.findById(id, PILE_INCLUDE);
    if (!pile) throw new NotFoundError("Pile");
    return pile;
  }

  async createPile(input: CreatePileInput, userId: string): Promise<Pile> {
    const site = await prisma.site.findFirst({ where: { id: input.siteId, deletedAt: null } });
    if (!site) throw new NotFoundError("Site");

    const pile = await prisma.pile.create({
      data: {
        siteId: input.siteId,
        pileId: input.pileId,
        pileType: input.pileType as any,
        designLength: input.designLength,
        designDiameter: input.designDiameter,
        cutOffLevel: input.cutOffLevel,
        platformLevel: input.platformLevel,
        gridRef: input.gridRef,
        gpsLat: input.gpsLat,
        gpsLng: input.gpsLng,
        concreteGrade: input.concreteGrade,
        concreteVolume: input.concreteVolume,
        remarks: input.remarks,
        createdById: userId,
      },
      include: PILE_INCLUDE,
    });

    logger.info({ pileId: pile.id }, "Pile created");
    return pile;
  }

  async updatePile(id: string, input: UpdatePileInput): Promise<Pile> {
    const existing = await pileRepository.findById(id);
    if (!existing) throw new NotFoundError("Pile");

    const data: Record<string, unknown> = {};
    if (input.pileId !== undefined) data.pileId = input.pileId;
    if (input.pileType !== undefined) data.pileType = input.pileType;
    if (input.designLength !== undefined) data.designLength = input.designLength;
    if (input.actualLength !== undefined) data.actualLength = input.actualLength;
    if (input.designDiameter !== undefined) data.designDiameter = input.designDiameter;
    if (input.cutOffLevel !== undefined) data.cutOffLevel = input.cutOffLevel;
    if (input.platformLevel !== undefined) data.platformLevel = input.platformLevel;
    if (input.gridRef !== undefined) data.gridRef = input.gridRef;
    if (input.gpsLat !== undefined) data.gpsLat = input.gpsLat;
    if (input.gpsLng !== undefined) data.gpsLng = input.gpsLng;
    if (input.concreteGrade !== undefined) data.concreteGrade = input.concreteGrade;
    if (input.concreteVolume !== undefined) data.concreteVolume = input.concreteVolume;
    if (input.actualConcreteVol !== undefined) data.actualConcreteVol = input.actualConcreteVol;
    if (input.overconsumption !== undefined) data.overconsumption = input.overconsumption;
    if (input.remarks !== undefined) data.remarks = input.remarks;

    const pile = await prisma.pile.update({
      where: { id },
      data,
      include: PILE_INCLUDE,
    });

    logger.info({ pileId: id }, "Pile updated");
    return pile;
  }

  async deletePile(id: string): Promise<void> {
    const existing = await pileRepository.findById(id);
    if (!existing) throw new NotFoundError("Pile");
    await pileRepository.softDelete(id);
    logger.info({ pileId: id }, "Pile soft-deleted");
  }

  async updatePileStatus(id: string, status: string): Promise<Pile> {
    const existing = await pileRepository.findById(id) as Pile | null;
    if (!existing) throw new NotFoundError("Pile");

    const pile = await prisma.pile.update({
      where: { id },
      data: { status: status as any },
      include: PILE_INCLUDE,
    });

    logger.info({ pileId: id, status }, "Pile status updated");
    return pile;
  }
}

export const pileService = new PileService();
