import type { Request, Response, NextFunction } from "express";
import { boreholeLogService } from "../services/borehole-log.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

export class BoreholeLogController {
  async getBoreholeLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        siteId: req.query.siteId as string | undefined,
        search: req.query.search as string | undefined,
      };

      const { data, total } = await boreholeLogService.getBoreholeLogs(filter, pagination);
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

  async getBoreholeLogById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await boreholeLogService.getBoreholeLogById(req.params.id!);
      const response: ApiResponse = { success: true, data: log, requestId: req.requestId };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createBoreholeLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const log = await boreholeLogService.createBoreholeLog(req.body, userId);
      const response: ApiResponse = {
        success: true,
        data: log,
        message: "Borehole log created successfully",
        requestId: req.requestId,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateBoreholeLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await boreholeLogService.updateBoreholeLog(req.params.id!, req.body);
      const response: ApiResponse = {
        success: true,
        data: log,
        message: "Borehole log updated successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteBoreholeLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await boreholeLogService.deleteBoreholeLog(req.params.id!);
      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Borehole log deleted successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const boreholeLogController = new BoreholeLogController();
