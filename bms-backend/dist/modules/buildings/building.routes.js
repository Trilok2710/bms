"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const building_controller_1 = __importDefault(require("./building.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post('/', role_middleware_1.isAdmin, building_controller_1.default.create.bind(building_controller_1.default));
router.get('/', building_controller_1.default.getAll.bind(building_controller_1.default));
router.get('/:id', building_controller_1.default.getById.bind(building_controller_1.default));
router.patch('/:id', role_middleware_1.isAdmin, building_controller_1.default.update.bind(building_controller_1.default));
router.delete('/:id', role_middleware_1.isAdmin, building_controller_1.default.delete.bind(building_controller_1.default));
exports.default = router;
//# sourceMappingURL=building.routes.js.map