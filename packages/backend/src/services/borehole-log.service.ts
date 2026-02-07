import { prisma } from "../config/database";
import { boreholeLogRepository } from "../repositories/borehole-log.repository";
import { NotFoundError } from "../utils/api-error";
import type { BoreholeLog } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreateBoreholeLogInput {
  siteId: string;
  boreholeId: string;
  logDate: string;
  location?: string;
  gpsLat?: number;
  gpsLng?: number;
  totalDepth: number;
  groundLevel?: number;
  groundwaterLevel?: number;
  casingDepth?: number;
  strata?: unknown[];
  sptResults?: unknown[];
  remarks?: string;
  photos?: string[];
  drillingMethod?: string;
  contractor?: string;
  loggedBy?: string;
}

export interface UpdateBoreholeLogInput {
  boreholeId?: string;
  logDate?: string;
  location?: string;
  gpsLat?: number;
  gpsLng?: number;
  totalDepth?: number;
  groundLevel?: number;
  groundwaterLevel?: number;
  casingDepth?: number;
  strata?: unknown[];
  sptResults?: unknown[];
  remarks?: string;
  photos?: string[];
  drillingMethod?: string;
  contractor?: string;
  loggedBy?: string;
}

class BoreholeLogService {
  async getBoreholeLogs(
    filter: { siteId?: string; search?: string },
    pagination: { skip: number; take: number },
  ): Promise<{ data: BoreholeLog[]; total: number }> {
    return boreholeLogRepository.findAllFiltered(filter, pagination);
  }

  async getBoreholeLogById(id: string): Promise<BoreholeLog> {
    const log = await boreholeLogRepository.findById(id, {
      site: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true } },
    });
    if (!log) throw new NotFoundError("BoreholeLog");
    return log;
  }

  async createBoreholeLog(input: CreateBoreholeLogInput, userId: string): Promise<BoreholeLog> {
    const site = await prisma.site.findFirst({ where: { id: input.siteId, deletedAt: null } });
    if (!site) throw new NotFoundError("Site");

    const log = await prisma.boreholeLog.create({
      data: {
        siteId: input.siteId,
        boreholeId: input.boreholeId,
        logDate: new Date(input.logDate),
        location: input.location,
        gpsLat: input.gpsLat,
        gpsLng: input.gpsLng,
        totalDepth: input.totalDepth,
        groundLevel: input.groundLevel,
        groundwaterLevel: input.groundwaterLevel,
        casingDepth: input.casingDepth,
        strata: (input.strata as any) ?? [],
        sptResults: (input.sptResults as any) ?? [],
        remarks: input.remarks,
        photos: (input.photos as any) ?? [],
        drillingMethod: input.drillingMethod,
        contractor: input.contractor,
        loggedBy: input.loggedBy,
        createdById: userId,
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    logger.info({ boreholeLogId: log.id }, "Borehole log created");
    return log;
  }

  async updateBoreholeLog(id: string, input: UpdateBoreholeLogInput): Promise<BoreholeLog> {
    const existing = await boreholeLogRepository.findById(id);
    if (!existing) throw new NotFoundError("BoreholeLog");

    const data: Record<string, unknown> = {};
    if (input.boreholeId !== undefined) data.boreholeId = input.boreholeId;
    if (input.logDate !== undefined) data.logDate = new Date(input.logDate);
    if (input.location !== undefined) data.location = input.location;
    if (input.gpsLat !== undefined) data.gpsLat = input.gpsLat;
    if (input.gpsLng !== undefined) data.gpsLng = input.gpsLng;
    if (input.totalDepth !== undefined) data.totalDepth = input.totalDepth;
    if (input.groundLevel !== undefined) data.groundLevel = input.groundLevel;
    if (input.groundwaterLevel !== undefined) data.groundwaterLevel = input.groundwaterLevel;
    if (input.casingDepth !== undefined) data.casingDepth = input.casingDepth;
    if (input.strata !== undefined) data.strata = input.strata;
    if (input.sptResults !== undefined) data.sptResults = input.sptResults;
    if (input.remarks !== undefined) data.remarks = input.remarks;
    if (input.photos !== undefined) data.photos = input.photos;
    if (input.drillingMethod !== undefined) data.drillingMethod = input.drillingMethod;
    if (input.contractor !== undefined) data.contractor = input.contractor;
    if (input.loggedBy !== undefined) data.loggedBy = input.loggedBy;

    const log = await prisma.boreholeLog.update({
      where: { id },
      data,
      include: {
        site: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    logger.info({ boreholeLogId: id }, "Borehole log updated");
    return log;
  }

  async deleteBoreholeLog(id: string): Promise<void> {
    const existing = await boreholeLogRepository.findById(id);
    if (!existing) throw new NotFoundError("BoreholeLog");
    await boreholeLogRepository.softDelete(id);
    logger.info({ boreholeLogId: id }, "Borehole log soft-deleted");
  }
}

export const boreholeLogService = new BoreholeLogService();
