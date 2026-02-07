import type { Request, Response, NextFunction } from "express";
import { dailyLogService } from "../services/daily-log.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

export class DailyLogController {
  async getDailyLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        siteId: req.query.siteId as string | undefined,
        status: req.query.status as string | undefined,
        from: req.query.from as string | undefined,
        to: req.query.to as string | undefined,
      };

      const { data, total } = await dailyLogService.getDailyLogs(filter, pagination);
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

  async getDailyLogById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await dailyLogService.getDailyLogById(req.params.id!);
      const response: ApiResponse = { success: true, data: log, requestId: req.requestId };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createDailyLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const log = await dailyLogService.createDailyLog(req.body, userId);
      const response: ApiResponse = {
        success: true,
        data: log,
        message: "Daily log created successfully",
        requestId: req.requestId,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateDailyLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await dailyLogService.updateDailyLog(req.params.id!, req.body);
      const response: ApiResponse = {
        success: true,
        data: log,
        message: "Daily log updated successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteDailyLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await dailyLogService.deleteDailyLog(req.params.id!);
      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Daily log deleted successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async submitDailyLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = await dailyLogService.submitDailyLog(req.params.id!);
      const response: ApiResponse = {
        success: true,
        data: log,
        message: "Daily log submitted for approval",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async approveDailyLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const log = await dailyLogService.approveDailyLog(req.params.id!, userId);
      const response: ApiResponse = {
        success: true,
        data: log,
        message: "Daily log approved",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async rejectDailyLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const log = await dailyLogService.rejectDailyLog(req.params.id!, userId, req.body.rejectionNotes);
      const response: ApiResponse = {
        success: true,
        data: log,
        message: "Daily log rejected",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const dailyLogController = new DailyLogController();
