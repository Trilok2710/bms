import { prisma } from '../../config/prisma';
import { NotificationInput } from './notification.types';

class NotificationService {
  async createNotification(input: NotificationInput) {
    return await prisma.notification.create({
      data: {
        userId: input.userId,
        organizationId: input.organizationId,
        type: input.type,
        title: input.title,
        message: input.message,
        taskId: input.taskId,
        readingId: input.readingId,
        isRead: false,
      },
    });
  }

  async getUserNotifications(userId: string, skip: number = 0, take: number = 50) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    const total = await prisma.notification.count({ where: { userId } });

    return {
      notifications,
      pagination: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take),
      },
    };
  }

  async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    // Verify notification belongs to user before marking as read
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: userId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found or you do not have permission to access it');
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async deleteNotification(userId: string, notificationId: string) {
    // Verify notification belongs to user before deleting
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: userId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found or you do not have permission to delete it');
    }

    return await prisma.notification.delete({
      where: { id: notificationId },
    });
  }
}

export default new NotificationService();
