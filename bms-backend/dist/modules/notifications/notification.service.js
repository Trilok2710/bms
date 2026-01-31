"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../config/prisma");
class NotificationService {
    async createNotification(input) {
        return await prisma_1.prisma.notification.create({
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
    async getUserNotifications(userId, skip = 0, take = 50) {
        const notifications = await prisma_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
        const total = await prisma_1.prisma.notification.count({ where: { userId } });
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
    async getUnreadCount(userId) {
        return await prisma_1.prisma.notification.count({
            where: { userId, isRead: false },
        });
    }
    async markAsRead(userId, notificationId) {
        // Verify notification belongs to user before marking as read
        const notification = await prisma_1.prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId: userId,
            },
        });
        if (!notification) {
            throw new Error('Notification not found or you do not have permission to access it');
        }
        return await prisma_1.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return await prisma_1.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    async deleteNotification(userId, notificationId) {
        // Verify notification belongs to user before deleting
        const notification = await prisma_1.prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId: userId,
            },
        });
        if (!notification) {
            throw new Error('Notification not found or you do not have permission to delete it');
        }
        return await prisma_1.prisma.notification.delete({
            where: { id: notificationId },
        });
    }
}
exports.default = new NotificationService();
//# sourceMappingURL=notification.service.js.map