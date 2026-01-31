"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = __importDefault(require("./analytics.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/org/stats', analytics_controller_1.default.getOrgStats.bind(analytics_controller_1.default));
router.get('/category/:categoryId', analytics_controller_1.default.getCategoryStats.bind(analytics_controller_1.default));
router.get('/building/:buildingId', analytics_controller_1.default.getBuildingStats.bind(analytics_controller_1.default));
router.get('/trend/:categoryId', analytics_controller_1.default.getReadingTrend.bind(analytics_controller_1.default));
router.get('/staff/performance', analytics_controller_1.default.getStaffPerformance.bind(analytics_controller_1.default));
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map