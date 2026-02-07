import type { Request, Response, NextFunction } from "express";
import { pileService } from "../services/pile.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

export class PileController {
  async getPiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        siteId: req.query.siteId as string | undefined,
        status: req.query.status as string | undefined,
        pileType: req.query.pileType as string | undefined,
      };

      const { data, total } = await pileService.getPiles(filter, pagination);
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

  async getPileById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pile = await pileService.getPileById(req.params.id!);
      const response: ApiResponse = { success: true, data: pile, requestId: req.requestId };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createPile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const pile = await pileService.createPile(req.body, userId);
      const response: ApiResponse = {
        success: true,
        data: pile,
        message: "Pile created successfully",
        requestId: req.requestId,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updatePile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pile = await pileService.updatePile(req.params.id!, req.body);
      const response: ApiResponse = {
        success: true,
        data: pile,
        message: "Pile updated successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deletePile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await pileService.deletePile(req.params.id!);
      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Pile deleted successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updatePileStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pile = await pileService.updatePileStatus(req.params.id!, req.body.status);
      const response: ApiResponse = {
        success: true,
        data: pile,
        message: "Pile status updated successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const pileController = new PileController();
