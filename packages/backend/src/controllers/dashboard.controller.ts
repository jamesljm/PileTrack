import type { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service";
import type { ApiResponse } from "../types";

export class DashboardController {
  async getSiteDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await dashboardService.getSiteDashboard(req.params.siteId!);
      const response: ApiResponse = {
        success: true,
        data,
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
