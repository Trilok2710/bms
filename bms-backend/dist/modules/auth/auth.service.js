"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../../config/prisma");
const helpers_1 = require("../../utils/helpers");
const jwt_1 = require("../../utils/jwt");
const sanitization_1 = require("../../utils/sanitization");
const errors_1 = require("../../utils/errors");
class AuthService {
    async register(input) {
        try {
            // Sanitize and validate inputs
            const email = (0, sanitization_1.sanitizeEmail)(input.email);
            const firstName = (0, sanitization_1.sanitizeString)(input.firstName);
            const lastName = (0, sanitization_1.sanitizeString)(input.lastName);
            // Check if user exists
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new errors_1.ConflictError('Email already registered');
            }
            let organizationId;
            // If inviteCode is provided, find organization
            if (input.inviteCode) {
                const org = await prisma_1.prisma.organization.findUnique({
                    where: { inviteCode: (0, sanitization_1.sanitizeString)(input.inviteCode) },
                });
                if (!org) {
                    throw new errors_1.NotFoundError('Invalid invite code');
                }
                organizationId = org.id;
            }
            else if (input.role === 'ADMIN') {
                // Admins create new organizations
                const org = await prisma_1.prisma.organization.create({
                    data: {
                        name: input.organizationName ? (0, sanitization_1.sanitizeString)(input.organizationName) : `${firstName}'s Organization`,
                        inviteCode: this.generateInviteCode(),
                    },
                });
                organizationId = org.id;
            }
            else {
                throw new Error('Supervisors and technicians must use an invite code');
            }
            // Hash password
            const hashedPassword = await (0, helpers_1.hashPassword)(input.password);
            // Create user
            const user = await prisma_1.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    role: input.role,
                    organizationId,
                },
            });
            // Generate token
            const token = (0, jwt_1.generateToken)({
                userId: user.id,
                organizationId: user.organizationId,
                email: user.email,
                role: user.role,
            });
            // Fetch organization to get its name
            const org = await prisma_1.prisma.organization.findUnique({
                where: { id: organizationId },
                select: { name: true },
            });
            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    organizationId: user.organizationId,
                },
                organizationName: org?.name,
            };
        }
        catch (error) {
            if (error instanceof errors_1.ConflictError || error instanceof errors_1.NotFoundError) {
                throw error;
            }
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async login(input) {
        try {
            // Sanitize email
            const email = (0, sanitization_1.sanitizeEmail)(input.email);
            const user = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new errors_1.AuthenticationError('Invalid email or password');
            }
            if (!user.isActive) {
                throw new errors_1.AuthenticationError('User account is inactive');
            }
            const isPasswordValid = await (0, helpers_1.verifyPassword)(input.password, user.password);
            if (!isPasswordValid) {
                throw new errors_1.AuthenticationError('Invalid email or password');
            }
            const token = (0, jwt_1.generateToken)({
                userId: user.id,
                organizationId: user.organizationId,
                email: user.email,
                role: user.role,
            });
            // Fetch organization to get its name
            const org = await prisma_1.prisma.organization.findUnique({
                where: { id: user.organizationId },
                select: { name: true },
            });
            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    organizationId: user.organizationId,
                },
                organizationName: org?.name,
            };
        }
        catch (error) {
            if (error instanceof errors_1.AuthenticationError) {
                throw error;
            }
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    async getMe(userId) {
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    organizationId: true,
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            inviteCode: true,
                        },
                    },
                },
            });
            if (!user) {
                throw new errors_1.NotFoundError('User not found');
            }
            return user;
        }
        catch (error) {
            throw (0, errors_1.handlePrismaError)(error);
        }
    }
    generateInviteCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map