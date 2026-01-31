"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const org_controller_1 = __importDefault(require("./org.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/', org_controller_1.default.getDetails.bind(org_controller_1.default));
router.get('/users', org_controller_1.default.getUsers.bind(org_controller_1.default));
router.get('/invite-code', org_controller_1.default.getInviteCode.bind(org_controller_1.default));
router.post('/invite-code', role_middleware_1.isAdmin, org_controller_1.default.regenerateInviteCode.bind(org_controller_1.default));
router.delete('/users/:userId', role_middleware_1.isAdmin, org_controller_1.default.deactivateUser.bind(org_controller_1.default));
exports.default = router;
//# sourceMappingURL=org.routes.js.map