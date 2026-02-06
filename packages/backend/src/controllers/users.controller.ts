import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

export class UsersController {
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        search: req.query.search as string | undefined,
        role: req.query.role as string | undefined,
        status: req.query.status as string | undefined,
        siteId: req.query.siteId as string | undefined,
      };

      const { data, total } = await userService.getUsers(filter, pagination);
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

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: user,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body);

      const response: ApiResponse = {
        success: true,
        data: user,
        message: "User created successfully",
        requestId: req.requestId,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUser(req.params.id!, req.body);

      const response: ApiResponse = {
        success: true,
        data: user,
        message: "User updated successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteUser(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "User deleted successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUserSites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sites = await userService.getUserSites(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: sites,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async bulkCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.bulkCreate(req.body.users);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: `${result.created} users created`,
        requestId: req.requestId,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();
