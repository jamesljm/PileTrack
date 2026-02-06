import type { Request, Response, NextFunction } from "express";
import { siteService } from "../services/site.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

export class SitesController {
  async getSites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        search: req.query.search as string | undefined,
        status: req.query.status as string | undefined,
        clientName: req.query.clientName as string | undefined,
      };

      const { data, total } = await siteService.getSites(filter, pagination);
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

  async getSiteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const site = await siteService.getSiteById(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: site,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createSite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const site = await siteService.createSite(req.body);

      const response: ApiResponse = {
        success: true,
        data: site,
        message: "Site created successfully",
        requestId: req.requestId,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateSite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const site = await siteService.updateSite(req.params.id!, req.body);

      const response: ApiResponse = {
        success: true,
        data: site,
        message: "Site updated successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteSite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await siteService.deleteSite(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Site deleted successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async assignUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, role } = req.body;
      await siteService.assignUser(req.params.id!, userId, role);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "User assigned to site successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async removeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await siteService.removeUser(req.params.id!, req.params.userId!);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "User removed from site successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSiteUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await siteService.getSiteUsers(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: users,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dashboard = await siteService.getDashboard(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: dashboard,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const sitesController = new SitesController();
