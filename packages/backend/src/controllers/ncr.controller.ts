import type { Request, Response, NextFunction } from "express";
import { ncrService } from "../services/ncr.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

export class NCRController {
  async getNCRs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        siteId: req.query.siteId as string | undefined,
        status: req.query.status as string | undefined,
        priority: req.query.priority as string | undefined,
        category: req.query.category as string | undefined,
      };

      const { data, total } = await ncrService.getNCRs(filter, pagination);
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

  async getNCRById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ncr = await ncrService.getNCRById(req.params.id!);
      const response: ApiResponse = { success: true, data: ncr, requestId: req.requestId };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createNCR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const ncr = await ncrService.createNCR(req.body, userId);
      const response: ApiResponse = {
        success: true,
        data: ncr,
        message: "NCR created successfully",
        requestId: req.requestId,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateNCR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ncr = await ncrService.updateNCR(req.params.id!, req.body);
      const response: ApiResponse = {
        success: true,
        data: ncr,
        message: "NCR updated successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteNCR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ncrService.deleteNCR(req.params.id!);
      const response: ApiResponse = {
        success: true,
        data: null,
        message: "NCR deleted successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async investigateNCR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ncr = await ncrService.investigateNCR(req.params.id!);
      const response: ApiResponse = {
        success: true,
        data: ncr,
        message: "NCR moved to investigating",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async resolveNCR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ncr = await ncrService.resolveNCR(req.params.id!, req.body);
      const response: ApiResponse = {
        success: true,
        data: ncr,
        message: "NCR resolved",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async closeNCR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const ncr = await ncrService.closeNCR(req.params.id!, userId);
      const response: ApiResponse = {
        success: true,
        data: ncr,
        message: "NCR closed",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const ncrController = new NCRController();
