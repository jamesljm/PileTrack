import { prisma } from "../config/database";
import { concreteDeliveryRepository } from "../repositories/concrete-delivery.repository";
import { NotFoundError } from "../utils/api-error";
import type { ConcreteDelivery } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreateConcreteDeliveryInput {
  siteId: string;
  pileId?: string;
  doNumber: string;
  deliveryDate: string;
  supplier: string;
  batchPlant?: string;
  truckNumber?: string;
  concreteGrade: string;
  volume: number;
  slumpRequired?: number;
  slumpActual?: number;
  batchTime?: string;
  arrivalTime?: string;
  pourStartTime?: string;
  pourEndTime?: string;
  temperature?: number;
  cubesTaken?: number;
  cubeSampleIds?: unknown[];
  rejected?: boolean;
  rejectionReason?: string;
  remarks?: string;
}

export interface UpdateConcreteDeliveryInput {
  pileId?: string;
  doNumber?: string;
  deliveryDate?: string;
  supplier?: string;
  batchPlant?: string;
  truckNumber?: string;
  concreteGrade?: string;
  volume?: number;
  slumpRequired?: number;
  slumpActual?: number;
  batchTime?: string;
  arrivalTime?: string;
  pourStartTime?: string;
  pourEndTime?: string;
  temperature?: number;
  cubesTaken?: number;
  cubeSampleIds?: unknown[];
  rejected?: boolean;
  rejectionReason?: string;
  remarks?: string;
}

const CD_INCLUDE = {
  site: { select: { id: true, name: true, code: true } },
  createdBy: { select: { id: true, firstName: true, lastName: true } },
  pile: { select: { id: true, pileId: true } },
};

class ConcreteDeliveryService {
  async getConcreteDeliveries(
    filter: { siteId?: string; pileId?: string; from?: string; to?: string },
    pagination: { skip: number; take: number },
  ): Promise<{ data: ConcreteDelivery[]; total: number }> {
    return concreteDeliveryRepository.findAllFiltered(filter, pagination);
  }

  async getConcreteDeliveryById(id: string): Promise<ConcreteDelivery> {
    const cd = await concreteDeliveryRepository.findById(id, CD_INCLUDE);
    if (!cd) throw new NotFoundError("ConcreteDelivery");
    return cd;
  }

  async createConcreteDelivery(input: CreateConcreteDeliveryInput, userId: string): Promise<ConcreteDelivery> {
    const site = await prisma.site.findFirst({ where: { id: input.siteId, deletedAt: null } });
    if (!site) throw new NotFoundError("Site");

    const cd = await prisma.concreteDelivery.create({
      data: {
        siteId: input.siteId,
        pileId: input.pileId || null,
        doNumber: input.doNumber,
        deliveryDate: new Date(input.deliveryDate),
        supplier: input.supplier,
        batchPlant: input.batchPlant,
        truckNumber: input.truckNumber,
        concreteGrade: input.concreteGrade,
        volume: input.volume,
        slumpRequired: input.slumpRequired,
        slumpActual: input.slumpActual,
        batchTime: input.batchTime ? new Date(input.batchTime) : null,
        arrivalTime: input.arrivalTime ? new Date(input.arrivalTime) : null,
        pourStartTime: input.pourStartTime ? new Date(input.pourStartTime) : null,
        pourEndTime: input.pourEndTime ? new Date(input.pourEndTime) : null,
        temperature: input.temperature,
        cubesTaken: input.cubesTaken,
        cubeSampleIds: (input.cubeSampleIds as any) ?? [],
        rejected: input.rejected ?? false,
        rejectionReason: input.rejectionReason,
        remarks: input.remarks,
        createdById: userId,
      },
      include: CD_INCLUDE,
    });

    logger.info({ concreteDeliveryId: cd.id }, "Concrete delivery created");
    return cd;
  }

  async updateConcreteDelivery(id: string, input: UpdateConcreteDeliveryInput): Promise<ConcreteDelivery> {
    const existing = await concreteDeliveryRepository.findById(id);
    if (!existing) throw new NotFoundError("ConcreteDelivery");

    const data: Record<string, unknown> = {};
    if (input.pileId !== undefined) data.pileId = input.pileId || null;
    if (input.doNumber !== undefined) data.doNumber = input.doNumber;
    if (input.deliveryDate !== undefined) data.deliveryDate = new Date(input.deliveryDate);
    if (input.supplier !== undefined) data.supplier = input.supplier;
    if (input.batchPlant !== undefined) data.batchPlant = input.batchPlant;
    if (input.truckNumber !== undefined) data.truckNumber = input.truckNumber;
    if (input.concreteGrade !== undefined) data.concreteGrade = input.concreteGrade;
    if (input.volume !== undefined) data.volume = input.volume;
    if (input.slumpRequired !== undefined) data.slumpRequired = input.slumpRequired;
    if (input.slumpActual !== undefined) data.slumpActual = input.slumpActual;
    if (input.batchTime !== undefined) data.batchTime = input.batchTime ? new Date(input.batchTime) : null;
    if (input.arrivalTime !== undefined) data.arrivalTime = input.arrivalTime ? new Date(input.arrivalTime) : null;
    if (input.pourStartTime !== undefined) data.pourStartTime = input.pourStartTime ? new Date(input.pourStartTime) : null;
    if (input.pourEndTime !== undefined) data.pourEndTime = input.pourEndTime ? new Date(input.pourEndTime) : null;
    if (input.temperature !== undefined) data.temperature = input.temperature;
    if (input.cubesTaken !== undefined) data.cubesTaken = input.cubesTaken;
    if (input.cubeSampleIds !== undefined) data.cubeSampleIds = input.cubeSampleIds;
    if (input.rejected !== undefined) data.rejected = input.rejected;
    if (input.rejectionReason !== undefined) data.rejectionReason = input.rejectionReason;
    if (input.remarks !== undefined) data.remarks = input.remarks;

    const cd = await prisma.concreteDelivery.update({
      where: { id },
      data,
      include: CD_INCLUDE,
    });

    logger.info({ concreteDeliveryId: id }, "Concrete delivery updated");
    return cd;
  }

  async deleteConcreteDelivery(id: string): Promise<void> {
    const existing = await concreteDeliveryRepository.findById(id);
    if (!existing) throw new NotFoundError("ConcreteDelivery");
    await concreteDeliveryRepository.softDelete(id);
    logger.info({ concreteDeliveryId: id }, "Concrete delivery soft-deleted");
  }
}

export const concreteDeliveryService = new ConcreteDeliveryService();
