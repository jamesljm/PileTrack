import type { Request, Response, NextFunction } from "express";
import { activityService } from "../services/activity.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";
import type { ActivityType, ActivityStatus } from "@prisma/client";

export class ActivitiesController {
  async getActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const siteId = req.query.siteId as string;
      const filters = {
        activityType: req.query.activityType as ActivityType | undefined,
        status: req.query.status as ActivityStatus | undefined,
        from: req.query.from ? new Date(req.query.from as string) : undefined,
        to: req.query.to ? new Date(req.query.to as string) : undefined,
      };

      const { data, total } = await activityService.getActivities(siteId, pagination, filters);
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

  async getActivityById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await activityService.getActivityById(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: activity,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await activityService.createActivity(req.user!.id, req.body);

      const response: ApiResponse = {
        success: true,
        data: activity,
        message: "Activity created successfully",
        requestId: req.requestId,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await activityService.updateActivity(
        req.params.id!,
        req.user!.id,
        req.body,
      );

      const response: ApiResponse = {
        success: true,
        data: activity,
        message: "Activity updated successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await activityService.deleteActivity(req.params.id!, req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Activity deleted successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async submitForApproval(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await activityService.submitForApproval(
        req.params.id!,
        req.user!.id,
      );

      const response: ApiResponse = {
        success: true,
        data: activity,
        message: "Activity submitted for approval",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await activityService.approve(req.params.id!, req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: activity,
        message: "Activity approved",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rejectionNotes } = req.body;
      const activity = await activityService.reject(
        req.params.id!,
        req.user!.id,
        rejectionNotes,
      );

      const response: ApiResponse = {
        success: true,
        data: activity,
        message: "Activity rejected",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getPendingApprovals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const siteIds = req.query.siteIds
        ? (req.query.siteIds as string).split(",")
        : undefined;

      const { data, total } = await activityService.getPendingApprovals(siteIds, pagination);
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

export const activitiesController = new ActivitiesController();
