"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reading_controller_1 = __importDefault(require("./reading.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post('/', reading_controller_1.default.submit.bind(reading_controller_1.default));
router.get('/', reading_controller_1.default.getAll.bind(reading_controller_1.default));
router.get('/pending', role_middleware_1.isSupervisorOrAdmin, reading_controller_1.default.getPending.bind(reading_controller_1.default));
router.get('/my-history', reading_controller_1.default.getMyHistory.bind(reading_controller_1.default));
router.get('/category/:buildingId/:categoryId', reading_controller_1.default.getByCategory.bind(reading_controller_1.default));
router.post('/:id/approve', role_middleware_1.isSupervisorOrAdmin, reading_controller_1.default.approve.bind(reading_controller_1.default));
router.post('/:id/reject', role_middleware_1.isSupervisorOrAdmin, reading_controller_1.default.reject.bind(reading_controller_1.default));
router.post('/:id/comments', reading_controller_1.default.addComment.bind(reading_controller_1.default));
exports.default = router;
//# sourceMappingURL=reading.routes.js.map