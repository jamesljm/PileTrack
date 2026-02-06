import type { Request, Response, NextFunction } from "express";
import { notificationService } from "../services/notification.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

export class NotificationsController {
  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const unreadOnly = req.query.unreadOnly === "true";

      const { data, total } = await notificationService.getUserNotifications(
        req.user!.id,
        pagination,
        unreadOnly,
      );
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

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await notificationService.markRead(
        req.params.id!,
        req.user!.id,
      );

      const response: ApiResponse = {
        success: true,
        data: notification,
        message: "Notification marked as read",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await notificationService.markAllRead(req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: "All notifications marked as read",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await notificationService.getUnreadCount(req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: { count },
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const notificationsController = new NotificationsController();
