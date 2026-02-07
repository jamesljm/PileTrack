import { prisma } from "../config/database";
import { dailyLogRepository } from "../repositories/daily-log.repository";
import { NotFoundError, ValidationError } from "../utils/api-error";
import type { DailyLog } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreateDailyLogInput {
  siteId: string;
  logDate: string;
  workforce?: unknown[];
  safety?: Record<string, unknown>;
  delays?: unknown[];
  materialUsage?: unknown[];
  weather?: Record<string, unknown>;
  remarks?: string;
  photos?: string[];
}

export interface UpdateDailyLogInput {
  workforce?: unknown[];
  safety?: Record<string, unknown>;
  delays?: unknown[];
  materialUsage?: unknown[];
  weather?: Record<string, unknown>;
  remarks?: string;
  photos?: string[];
}

class DailyLogService {
  async getDailyLogs(
    filter: { siteId?: string; status?: string; from?: string; to?: string },
    pagination: { skip: number; take: number },
  ): Promise<{ data: DailyLog[]; total: number }> {
    return dailyLogRepository.findAllFiltered(filter, pagination);
  }

  async getDailyLogById(id: string): Promise<DailyLog> {
    const log = await dailyLogRepository.findById(id, {
      site: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true } },
      approvedBy: { select: { id: true, firstName: true, lastName: true } },
    });
    if (!log) throw new NotFoundError("DailyLog");
    return log;
  }

  async createDailyLog(input: CreateDailyLogInput, userId: string): Promise<DailyLog> {
    const site = await prisma.site.findFirst({ where: { id: input.siteId, deletedAt: null } });
    if (!site) throw new NotFoundError("Site");

    const log = await prisma.dailyLog.create({
      data: {
        siteId: input.siteId,
        logDate: new Date(input.logDate),
        workforce: (input.workforce as any) ?? [],
        safety: (input.safety as any) ?? {},
        delays: (input.delays as any) ?? [],
        materialUsage: (input.materialUsage as any) ?? [],
        weather: (input.weather as any) ?? null,
        remarks: input.remarks,
        photos: (input.photos as any) ?? [],
        createdById: userId,
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    logger.info({ dailyLogId: log.id }, "Daily log created");
    return log;
  }

  async updateDailyLog(id: string, input: UpdateDailyLogInput): Promise<DailyLog> {
    const existing = await dailyLogRepository.findById(id);
    if (!existing) throw new NotFoundError("DailyLog");

    const data: Record<string, unknown> = {};
    if (input.workforce !== undefined) data.workforce = input.workforce;
    if (input.safety !== undefined) data.safety = input.safety;
    if (input.delays !== undefined) data.delays = input.delays;
    if (input.materialUsage !== undefined) data.materialUsage = input.materialUsage;
    if (input.weather !== undefined) data.weather = input.weather;
    if (input.remarks !== undefined) data.remarks = input.remarks;
    if (input.photos !== undefined) data.photos = input.photos;

    const log = await prisma.dailyLog.update({
      where: { id },
      data,
      include: {
        site: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        approvedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    logger.info({ dailyLogId: id }, "Daily log updated");
    return log;
  }

  async deleteDailyLog(id: string): Promise<void> {
    const existing = await dailyLogRepository.findById(id);
    if (!existing) throw new NotFoundError("DailyLog");
    await dailyLogRepository.softDelete(id);
    logger.info({ dailyLogId: id }, "Daily log soft-deleted");
  }

  async submitDailyLog(id: string): Promise<DailyLog> {
    const existing = await dailyLogRepository.findById(id) as DailyLog | null;
    if (!existing) throw new NotFoundError("DailyLog");
    if (existing.status !== "DRAFT") throw new ValidationError("Only DRAFT logs can be submitted");

    const log = await prisma.dailyLog.update({
      where: { id },
      data: { status: "SUBMITTED" },
      include: {
        site: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    logger.info({ dailyLogId: id }, "Daily log submitted");
    return log;
  }

  async approveDailyLog(id: string, userId: string): Promise<DailyLog> {
    const existing = await dailyLogRepository.findById(id) as DailyLog | null;
    if (!existing) throw new NotFoundError("DailyLog");
    if (existing.status !== "SUBMITTED") throw new ValidationError("Only SUBMITTED logs can be approved");

    const log = await prisma.dailyLog.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: userId,
        approvedAt: new Date(),
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        approvedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    logger.info({ dailyLogId: id, approvedBy: userId }, "Daily log approved");
    return log;
  }

  async rejectDailyLog(id: string, userId: string, rejectionNotes: string): Promise<DailyLog> {
    const existing = await dailyLogRepository.findById(id) as DailyLog | null;
    if (!existing) throw new NotFoundError("DailyLog");
    if (existing.status !== "SUBMITTED") throw new ValidationError("Only SUBMITTED logs can be rejected");

    const log = await prisma.dailyLog.update({
      where: { id },
      data: {
        status: "REJECTED",
        approvedById: userId,
        rejectionNotes,
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        approvedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    logger.info({ dailyLogId: id, rejectedBy: userId }, "Daily log rejected");
    return log;
  }
}

export const dailyLogService = new DailyLogService();
