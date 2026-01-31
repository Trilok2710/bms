import dotenv from 'dotenv';

dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_EXPIRE', 'FRONTEND_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Validate JWT_SECRET in production
const nodeEnv = process.env.NODE_ENV || 'development';
if (nodeEnv === 'production') {
  const jwtSecret = process.env.JWT_SECRET;
  
  // In production, JWT_SECRET must not be the default value
  if (jwtSecret === 'your-super-secret-jwt-key-change-in-production' || !jwtSecret || jwtSecret.length < 32) {
    throw new Error('SECURITY ERROR: In production, JWT_SECRET must be a strong secret of at least 32 characters');
  }

  // Ensure FRONTEND_URL is HTTPS in production
  if (!process.env.FRONTEND_URL?.startsWith('https://')) {
    console.warn('WARNING: FRONTEND_URL should use HTTPS in production');
  }
}

export const env = {
  NODE_ENV: nodeEnv as string,
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRE: (process.env.JWT_EXPIRE || '7d') as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10), // Increased from 10 to 12 for better security
};

// Additional security validations
if (env.BCRYPT_ROUNDS < 10) {
  console.warn('WARNING: BCRYPT_ROUNDS should be at least 10 for adequate password hashing');
}

