import type { Request, Response, NextFunction } from "express";
import { syncService } from "../services/sync.service";
import type { ApiResponse } from "../types";

export class SyncController {
  async push(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await syncService.pushChanges(req.user!.id, req.body.changes);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: `${result.applied} changes applied, ${result.skipped} skipped`,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async pull(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sinceVersion = Number(req.query.sinceVersion) || 0;
      const result = await syncService.pullChanges(req.user!.id, sinceVersion);

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

  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = await syncService.getStatus(req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: status,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const syncController = new SyncController();
