"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const org_routes_1 = __importDefault(require("../modules/org/org.routes"));
const building_routes_1 = __importDefault(require("../modules/buildings/building.routes"));
const category_routes_1 = __importDefault(require("../modules/categories/category.routes"));
const task_routes_1 = __importDefault(require("../modules/tasks/task.routes"));
const reading_routes_1 = __importDefault(require("../modules/readings/reading.routes"));
const staff_routes_1 = __importDefault(require("../modules/staff/staff.routes"));
const analytics_routes_1 = __importDefault(require("../modules/analytics/analytics.routes"));
const notification_routes_1 = __importDefault(require("../modules/notifications/notification.routes"));
const router = (0, express_1.Router)();
// Health check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Mount routes
router.use('/auth', auth_routes_1.default);
router.use('/org', org_routes_1.default);
router.use('/buildings', building_routes_1.default);
router.use('/categories', category_routes_1.default);
router.use('/tasks', task_routes_1.default);
router.use('/readings', reading_routes_1.default);
router.use('/staff', staff_routes_1.default);
router.use('/analytics', analytics_routes_1.default);
router.use('/notifications', notification_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map