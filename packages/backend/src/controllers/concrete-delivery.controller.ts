import type { Request, Response, NextFunction } from "express";
import { concreteDeliveryService } from "../services/concrete-delivery.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

export class ConcreteDeliveryController {
  async getConcreteDeliveries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        siteId: req.query.siteId as string | undefined,
        pileId: req.query.pileId as string | undefined,
        from: req.query.from as string | undefined,
        to: req.query.to as string | undefined,
      };

      const { data, total } = await concreteDeliveryService.getConcreteDeliveries(filter, pagination);
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

  async getConcreteDeliveryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cd = await concreteDeliveryService.getConcreteDeliveryById(req.params.id!);
      const response: ApiResponse = { success: true, data: cd, requestId: req.requestId };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createConcreteDelivery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const cd = await concreteDeliveryService.createConcreteDelivery(req.body, userId);
      const response: ApiResponse = {
        success: true,
        data: cd,
        message: "Concrete delivery created successfully",
        requestId: req.requestId,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateConcreteDelivery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cd = await concreteDeliveryService.updateConcreteDelivery(req.params.id!, req.body);
      const response: ApiResponse = {
        success: true,
        data: cd,
        message: "Concrete delivery updated successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteConcreteDelivery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await concreteDeliveryService.deleteConcreteDelivery(req.params.id!);
      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Concrete delivery deleted successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const concreteDeliveryController = new ConcreteDeliveryController();
