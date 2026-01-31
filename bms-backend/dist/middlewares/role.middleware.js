"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupervisorOrAdmin = exports.isAdmin = exports.roleMiddleware = void 0;
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
// Helper middleware for specific role checks
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
            error: 'Only admins can perform this action'
        });
    }
    next();
};
exports.isAdmin = isAdmin;
const isSupervisorOrAdmin = (req, res, next) => {
    if (!req.user || !['ADMIN', 'SUPERVISOR'].includes(req.user.role)) {
        return res.status(403).json({
            error: 'Only supervisors and admins can perform this action'
        });
    }
    next();
};
exports.isSupervisorOrAdmin = isSupervisorOrAdmin;
//# sourceMappingURL=role.middleware.js.map