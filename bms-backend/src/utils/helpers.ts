import bcrypt from 'bcrypt';
import { env } from '../config/env';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, env.BCRYPT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getPaginationParams = (
  page: string | undefined,
  limit: string | undefined
): { skip: number; take: number } => {
  const pageNum = page ? Math.max(1, parseInt(page)) : 1;
  const limitNum = limit ? Math.max(1, Math.min(100, parseInt(limit))) : 10;
  
  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};
