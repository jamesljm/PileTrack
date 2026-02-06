import type { Request, Response, NextFunction } from "express";
import { materialService } from "../services/material.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

export class MaterialsController {
  async getMaterials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        search: req.query.search as string | undefined,
        siteId: req.query.siteId as string | undefined,
      };

      const { data, total } = await materialService.getMaterials(filter, pagination);
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

  async getMaterialById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const material = await materialService.getMaterialById(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: material,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createMaterial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const material = await materialService.createMaterial(req.body);

      const response: ApiResponse = {
        success: true,
        data: material,
        message: "Material created successfully",
        requestId: req.requestId,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateMaterial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const material = await materialService.updateMaterial(req.params.id!, req.body);

      const response: ApiResponse = {
        success: true,
        data: material,
        message: "Material updated successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteMaterial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await materialService.deleteMaterial(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Material deleted successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async adjustStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const material = await materialService.adjustStock(req.params.id!, req.body);

      const response: ApiResponse = {
        success: true,
        data: material,
        message: "Stock adjusted successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const siteId = req.query.siteId as string | undefined;

      const { data, total } = await materialService.getLowStock(siteId, pagination);
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
}

export const materialsController = new MaterialsController();
