import { notificationRepository } from "../repositories/notification.repository";
import type { Notification, NotificationType } from "@prisma/client";
import { NotFoundError } from "../utils/api-error";
import { logger } from "../config/logger";

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: unknown;
}

class NotificationService {
  async create(input: CreateNotificationInput): Promise<Notification> {
    const notification = await notificationRepository.createNotification({
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data,
    });

    logger.debug({ notificationId: notification.id, userId: input.userId, type: input.type }, "Notification created");
    return notification;
  }

  async getUserNotifications(
    userId: string,
    pagination: { skip: number; take: number },
    unreadOnly: boolean = false,
  ): Promise<{ data: Notification[]; total: number }> {
    return notificationRepository.findByUser(userId, pagination, unreadOnly);
  }

  async markRead(id: string, userId: string): Promise<Notification> {
    const notification = await notificationRepository.markAsRead(id, userId);
    if (!notification) {
      throw new NotFoundError("Notification");
    }
    return notification;
  }

  async markAllRead(userId: string): Promise<{ count: number }> {
    const count = await notificationRepository.markAllAsRead(userId);
    return { count };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return notificationRepository.getUnreadCount(userId);
  }
}

export const notificationService = new NotificationService();
