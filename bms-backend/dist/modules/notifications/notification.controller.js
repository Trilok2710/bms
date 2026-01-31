"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = __importDefault(require("./notification.service"));
class NotificationController {
    async getNotifications(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const result = await notification_service_1.default.getUserNotifications(req.user.userId, skip, limit);
            res.status(200).json({
                data: {
                    notifications: result.notifications,
                    pagination: result.pagination,
                },
            });
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getUnreadCount(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const count = await notification_service_1.default.getUnreadCount(req.user.userId);
            res.status(200).json({ data: { unreadCount: count } });
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async markAsRead(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const notification = await notification_service_1.default.markAsRead(req.user.userId, id);
            res.status(200).json({ data: notification });
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async markAllAsRead(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            await notification_service_1.default.markAllAsRead(req.user.userId);
            res.status(200).json({ data: { message: 'All notifications marked as read' } });
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async deleteNotification(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            await notification_service_1.default.deleteNotification(req.user.userId, id);
            res.status(200).json({ data: { message: 'Notification deleted' } });
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.NotificationController = NotificationController;
exports.default = new NotificationController();
//# sourceMappingURL=notification.controller.js.map