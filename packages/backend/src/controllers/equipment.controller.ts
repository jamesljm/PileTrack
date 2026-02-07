import type { Request, Response, NextFunction } from "express";
import { equipmentService } from "../services/equipment.service";
import { equipmentUsageService } from "../services/equipment-usage.service";
import { serviceRecordService } from "../services/service-record.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";
import { prisma } from "../config/database";

export class EquipmentController {
  async getEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        status: req.query.status as string | undefined,
        siteId: req.query.siteId as string | undefined,
      };

      const { data, total } = await equipmentService.getEquipment(filter, pagination);
      const result = buildPaginatedResponse(data, total, pagination.page, pagination.pageSize);

      const response: PaginatedResponse = {
        success: true,
        data: result.data,
        pagination: result.pagination,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getEquipmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const equipment = await equipmentService.getEquipmentById(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: equipment,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const equipment = await equipmentService.createEquipment(req.body);

      const response: ApiResponse = {
        success: true,
        data: equipment,
        message: "Equipment created successfully",
        requestId: req.requestId,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const equipment = await equipmentService.updateEquipment(req.params.id!, req.body);

      const response: ApiResponse = {
        success: true,
        data: equipment,
        message: "Equipment updated successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await equipmentService.deleteEquipment(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Equipment deleted successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async generateQR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await equipmentService.generateQR(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: result,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async scanQR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { qrCode } = req.body;
      const equipment = await equipmentService.scanQR(qrCode);

      const response: ApiResponse = {
        success: true,
        data: equipment,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async logService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const equipment = await equipmentService.logService(req.params.id!, req.body);

      const response: ApiResponse = {
        success: true,
        data: equipment,
        message: "Service logged successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getServiceDue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const beforeDate = req.query.beforeDate
        ? new Date(req.query.beforeDate as string)
        : undefined;

      const { data, total } = await equipmentService.getServiceDue(beforeDate, pagination);
      const result = buildPaginatedResponse(data, total, pagination.page, pagination.pageSize);

      const response: PaginatedResponse = {
        success: true,
        data: result.data,
        pagination: result.pagination,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = await equipmentService.getHistory(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: history,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dateRange = {
        from: req.query.from ? new Date(req.query.from as string) : undefined,
        to: req.query.to ? new Date(req.query.to as string) : undefined,
      };

      const usage = await equipmentUsageService.getUsageHistory(req.params.id!, dateRange);

      const response: ApiResponse = {
        success: true,
        data: usage,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUsageSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await equipmentUsageService.getUsageSummary(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: summary,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const equipmentId = req.params.id!;

      const [usageSummary, costSummary, serviceDue] = await Promise.all([
        equipmentUsageService.getUsageSummary(equipmentId),
        serviceRecordService.getCostSummary(equipmentId),
        equipmentUsageService.checkServiceDueByHours(equipmentId),
      ]);

      const equipment = await equipmentService.getEquipmentById(equipmentId);
      const eq = equipment as any;
      const daysSinceLastService = eq.lastServiceDate
        ? Math.floor((Date.now() - new Date(eq.lastServiceDate).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const response: ApiResponse = {
        success: true,
        data: {
          totalUsageHours: usageSummary.totalHours,
          productiveHours: usageSummary.productiveHours,
          downtimeHours: usageSummary.downtimeHours,
          utilizationRate: usageSummary.utilizationRate,
          totalServiceCost: costSummary.totalCost,
          serviceCount: costSummary.recordCount,
          daysSinceLastService,
          isServiceOverdue: serviceDue.isDue,
        },
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSiteHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const siteHistory = await prisma.equipmentSiteHistory.findMany({
        where: { equipmentId: req.params.id! },
        orderBy: { assignedAt: "desc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
          transfer: { select: { id: true } },
        },
      });

      const response: ApiResponse = {
        success: true,
        data: siteHistory,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getFleetStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await equipmentService.getFleetStats();

      const response: ApiResponse = {
        success: true,
        data: stats,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const equipmentController = new EquipmentController();
