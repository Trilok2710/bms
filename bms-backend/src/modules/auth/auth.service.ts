import { prisma } from '../../config/prisma';
import { hashPassword, verifyPassword } from '../../utils/helpers';
import { generateToken } from '../../utils/jwt';
import { sanitizeEmail, sanitizeString } from '../../utils/sanitization';
import { 
  AuthenticationError, 
  ConflictError, 
  NotFoundError,
  handlePrismaError 
} from '../../utils/errors';
import { RegisterInput, LoginInput, AuthResponse } from './auth.types';

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    try {
      // Sanitize and validate inputs
      const email = sanitizeEmail(input.email);
      const firstName = sanitizeString(input.firstName);
      const lastName = sanitizeString(input.lastName);

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictError('Email already registered');
      }

      let organizationId: string;

      // If inviteCode is provided, find organization
      if (input.inviteCode) {
        const org = await prisma.organization.findUnique({
          where: { inviteCode: sanitizeString(input.inviteCode) },
        });

        if (!org) {
          throw new NotFoundError('Invalid invite code');
        }

        organizationId = org.id;
      } else if (input.role === 'ADMIN') {
        // Admins create new organizations
        const org = await prisma.organization.create({
          data: {
            name: input.organizationName ? sanitizeString(input.organizationName) : `${firstName}'s Organization`,
            inviteCode: this.generateInviteCode(),
          },
        });
        organizationId = org.id;
      } else {
        throw new Error('Supervisors and technicians must use an invite code');
      }

      // Hash password
      const hashedPassword = await hashPassword(input.password);

      // Create user
      const user = await prisma.user.create({
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
      const token = generateToken({
        userId: user.id,
        organizationId: user.organizationId,
        email: user.email,
        role: user.role,
      });

      // Fetch organization to get its name
      const org = await prisma.organization.findUnique({
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
    } catch (error) {
      if (error instanceof ConflictError || error instanceof NotFoundError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      // Sanitize email
      const email = sanitizeEmail(input.email);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      if (!user.isActive) {
        throw new AuthenticationError('User account is inactive');
      }

      const isPasswordValid = await verifyPassword(input.password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      const token = generateToken({
        userId: user.id,
        organizationId: user.organizationId,
        email: user.email,
        role: user.role,
      });

      // Fetch organization to get its name
      const org = await prisma.organization.findUnique({
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
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  }

  async getMe(userId: string) {
    try {
      const user = await prisma.user.findUnique({
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
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

export default new AuthService();
