import type { Request, Response, NextFunction } from "express";
import { transferService } from "../services/transfer.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";
import type { TransferStatus } from "@prisma/client";

export class TransfersController {
  async getTransfers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        status: req.query.status as TransferStatus | undefined,
        fromSiteId: req.query.fromSiteId as string | undefined,
        toSiteId: req.query.toSiteId as string | undefined,
      };

      const { data, total } = await transferService.getTransfers(filter, pagination);
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

  async getTransferById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transfer = await transferService.getTransferById(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: transfer,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createTransfer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transfer = await transferService.createTransfer(req.user!.id, req.body);

      const response: ApiResponse = {
        success: true,
        data: transfer,
        message: "Transfer request created successfully",
        requestId: req.requestId,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transfer = await transferService.approve(req.params.id!, req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: transfer,
        message: "Transfer approved",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async ship(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transfer = await transferService.ship(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: transfer,
        message: "Transfer marked as shipped",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deliver(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transfer = await transferService.deliver(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: transfer,
        message: "Transfer delivered successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transfer = await transferService.cancel(req.params.id!, req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: transfer,
        message: "Transfer cancelled",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const transfersController = new TransfersController();
