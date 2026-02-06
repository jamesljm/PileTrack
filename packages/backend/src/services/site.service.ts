import { prisma } from "../config/database";
import { siteRepository } from "../repositories/site.repository";
import { NotFoundError, ConflictError } from "../utils/api-error";
import type { Site, SiteStatus } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreateSiteInput {
  name: string;
  code: string;
  address: string;
  clientName: string;
  contractNumber?: string;
  gpsLat?: number;
  gpsLng?: number;
  startDate?: Date;
  expectedEndDate?: Date;
  description?: string;
}

export interface UpdateSiteInput {
  name?: string;
  code?: string;
  address?: string;
  clientName?: string;
  contractNumber?: string | null;
  gpsLat?: number | null;
  gpsLng?: number | null;
  startDate?: Date | null;
  expectedEndDate?: Date | null;
  status?: SiteStatus;
  description?: string | null;
}

class SiteService {
  async getSites(
    filter: {
      search?: string;
      status?: string;
      clientName?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: Site[]; total: number }> {
    return siteRepository.findAllFiltered(filter, pagination);
  }

  async getSiteById(id: string): Promise<Site> {
    const site = await siteRepository.findWithUsers(id);
    if (!site) {
      throw new NotFoundError("Site");
    }
    return site;
  }

  async createSite(input: CreateSiteInput): Promise<Site> {
    const existingCode = await siteRepository.findByCode(input.code);
    if (existingCode) {
      throw new ConflictError(`A site with code '${input.code}' already exists`);
    }

    const site = await prisma.site.create({
      data: {
        name: input.name,
        code: input.code,
        address: input.address,
        clientName: input.clientName,
        contractNumber: input.contractNumber,
        gpsLat: input.gpsLat,
        gpsLng: input.gpsLng,
        startDate: input.startDate,
        expectedEndDate: input.expectedEndDate,
        description: input.description,
      },
    });

    logger.info({ siteId: site.id, code: site.code }, "Site created");
    return site;
  }

  async updateSite(id: string, input: UpdateSiteInput): Promise<Site> {
    const existing = await siteRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Site");
    }

    if (input.code) {
      const codeConflict = await siteRepository.findByCode(input.code);
      if (codeConflict && codeConflict.id !== id) {
        throw new ConflictError(`A site with code '${input.code}' already exists`);
      }
    }

    const site = await prisma.site.update({
      where: { id },
      data: input,
    });

    logger.info({ siteId: site.id }, "Site updated");
    return site;
  }

  async deleteSite(id: string): Promise<void> {
    const existing = await siteRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Site");
    }

    await siteRepository.softDelete(id);
    logger.info({ siteId: id }, "Site soft-deleted");
  }

  async assignUser(siteId: string, userId: string, siteRole?: string): Promise<void> {
    const site = await siteRepository.findById(siteId);
    if (!site) {
      throw new NotFoundError("Site");
    }

    const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
    if (!user) {
      throw new NotFoundError("User");
    }

    await siteRepository.assignUser(siteId, userId, siteRole);
    logger.info({ siteId, userId, siteRole }, "User assigned to site");
  }

  async removeUser(siteId: string, userId: string): Promise<void> {
    await siteRepository.removeUser(siteId, userId);
    logger.info({ siteId, userId }, "User removed from site");
  }

  async getSiteUsers(siteId: string): Promise<unknown[]> {
    const site = await siteRepository.findById(siteId);
    if (!site) {
      throw new NotFoundError("Site");
    }

    return siteRepository.getSiteUsers(siteId);
  }

  async getDashboard(siteId: string): Promise<Record<string, unknown>> {
    const site = await siteRepository.findById(siteId);
    if (!site) {
      throw new NotFoundError("Site");
    }

    const [
      activitiesCount,
      pendingActivities,
      equipmentCount,
      equipmentInUse,
      materialsCount,
      lowStockCount,
      siteUsersCount,
      recentActivities,
    ] = await Promise.all([
      prisma.activityRecord.count({
        where: { siteId, deletedAt: null },
      }),
      prisma.activityRecord.count({
        where: { siteId, status: "SUBMITTED", deletedAt: null },
      }),
      prisma.equipment.count({
        where: { siteId, deletedAt: null },
      }),
      prisma.equipment.count({
        where: { siteId, status: "IN_USE", deletedAt: null },
      }),
      prisma.material.count({
        where: { siteId, deletedAt: null },
      }),
      prisma.material.findMany({
        where: { siteId, deletedAt: null },
      }).then((materials) => materials.filter((m) => m.currentStock <= m.minimumStock).length),
      prisma.siteUser.count({
        where: { siteId },
      }),
      prisma.activityRecord.findMany({
        where: { siteId, deletedAt: null },
        orderBy: { activityDate: "desc" },
        take: 5,
        include: {
          createdBy: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
    ]);

    return {
      site,
      stats: {
        totalActivities: activitiesCount,
        pendingApproval: pendingActivities,
        totalEquipment: equipmentCount,
        equipmentInUse,
        totalMaterials: materialsCount,
        lowStockAlerts: lowStockCount,
        teamMembers: siteUsersCount,
      },
      recentActivities,
    };
  }
}

export const siteService = new SiteService();
