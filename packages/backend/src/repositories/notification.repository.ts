import type { Notification, NotificationType } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super("notification");
  }

  async findByUser(
    userId: string,
    pagination: { skip: number; take: number },
    unreadOnly: boolean = false,
  ): Promise<{ data: Notification[]; total: number }> {
    const where = {
      userId,
      ...(unreadOnly ? { readAt: null } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
    ]);

    return { data, total };
  }

  async markAsRead(id: string, userId: string): Promise<Notification | null> {
    return prisma.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    }).then(async () => {
      return prisma.notification.findUnique({ where: { id } });
    });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return result.count;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, readAt: null },
    });
  }

  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: unknown;
  }): Promise<Notification> {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data as object | undefined,
      },
    });
  }
}

export const notificationRepository = new NotificationRepository();
