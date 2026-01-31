import { NotificationInput } from './notification.types';
declare class NotificationService {
    createNotification(input: NotificationInput): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        type: string;
        title: string;
        taskId: string | null;
        userId: string;
        isRead: boolean;
        readingId: string | null;
    }>;
    getUserNotifications(userId: string, skip?: number, take?: number): Promise<{
        notifications: {
            message: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            type: string;
            title: string;
            taskId: string | null;
            userId: string;
            isRead: boolean;
            readingId: string | null;
        }[];
        pagination: {
            total: number;
            skip: number;
            take: number;
            pages: number;
        };
    }>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(userId: string, notificationId: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        type: string;
        title: string;
        taskId: string | null;
        userId: string;
        isRead: boolean;
        readingId: string | null;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteNotification(userId: string, notificationId: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        type: string;
        title: string;
        taskId: string | null;
        userId: string;
        isRead: boolean;
        readingId: string | null;
    }>;
}
declare const _default: NotificationService;
export default _default;
//# sourceMappingURL=notification.service.d.ts.map