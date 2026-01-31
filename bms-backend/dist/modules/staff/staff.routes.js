"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staff_controller_1 = __importDefault(require("./staff.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/', staff_controller_1.default.getAll.bind(staff_controller_1.default));
router.post('/invite', role_middleware_1.isAdmin, staff_controller_1.default.invite.bind(staff_controller_1.default));
router.get('/role/:role', staff_controller_1.default.getByRole.bind(staff_controller_1.default));
router.get('/:id', staff_controller_1.default.getById.bind(staff_controller_1.default));
router.patch('/:id/role', role_middleware_1.isAdmin, staff_controller_1.default.updateRole.bind(staff_controller_1.default));
router.delete('/:id', role_middleware_1.isAdmin, staff_controller_1.default.deactivate.bind(staff_controller_1.default));
exports.default = router;
//# sourceMappingURL=staff.routes.js.map