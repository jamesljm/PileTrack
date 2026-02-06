import type { Request, Response, NextFunction } from "express";
import { equipmentService } from "../services/equipment.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

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
}

export const equipmentController = new EquipmentController();
