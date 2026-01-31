"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationParams = exports.formatDate = exports.generateInviteCode = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../config/env");
const hashPassword = async (password) => {
    return bcrypt_1.default.hash(password, env_1.env.BCRYPT_ROUNDS);
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hash) => {
    return bcrypt_1.default.compare(password, hash);
};
exports.verifyPassword = verifyPassword;
const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};
exports.generateInviteCode = generateInviteCode;
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};
exports.formatDate = formatDate;
const getPaginationParams = (page, limit) => {
    const pageNum = page ? Math.max(1, parseInt(page)) : 1;
    const limitNum = limit ? Math.max(1, Math.min(100, parseInt(limit))) : 10;
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.getPaginationParams = getPaginationParams;
//# sourceMappingURL=helpers.js.map