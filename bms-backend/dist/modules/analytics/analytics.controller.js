"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = __importDefault(require("./analytics.service"));
class AnalyticsController {
    async getOrgStats(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const stats = await analytics_service_1.default.getOrgStats(req.user.organizationId);
            res.status(200).json(stats);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getCategoryStats(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const stats = await analytics_service_1.default.getCategoryStats(req.user.organizationId, req.params.categoryId);
            res.status(200).json(stats);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getBuildingStats(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const stats = await analytics_service_1.default.getBuildingStats(req.user.organizationId, req.params.buildingId);
            res.status(200).json(stats);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getReadingTrend(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { days } = req.query;
            const trend = await analytics_service_1.default.getReadingTrend(req.user.organizationId, req.params.categoryId, days ? parseInt(days) : 30);
            res.status(200).json(trend);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
    async getStaffPerformance(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const performance = await analytics_service_1.default.getStaffPerformance(req.user.organizationId);
            res.status(200).json(performance);
        }
        catch (error) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
exports.default = new AnalyticsController();
//# sourceMappingURL=analytics.controller.js.map