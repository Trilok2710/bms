"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = __importDefault(require("./task.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post('/', role_middleware_1.isSupervisorOrAdmin, task_controller_1.default.create.bind(task_controller_1.default));
router.get('/available-for-reading', task_controller_1.default.getAvailableTasksForReading.bind(task_controller_1.default));
router.get('/', task_controller_1.default.getAll.bind(task_controller_1.default));
router.get('/my-tasks', task_controller_1.default.getMyTasks.bind(task_controller_1.default));
router.get('/:id', task_controller_1.default.getById.bind(task_controller_1.default));
router.patch('/:id', role_middleware_1.isSupervisorOrAdmin, task_controller_1.default.update.bind(task_controller_1.default));
router.delete('/:id', role_middleware_1.isSupervisorOrAdmin, task_controller_1.default.delete.bind(task_controller_1.default));
router.post('/:id/assign', role_middleware_1.isSupervisorOrAdmin, task_controller_1.default.assignUsers.bind(task_controller_1.default));
exports.default = router;
//# sourceMappingURL=task.routes.js.map