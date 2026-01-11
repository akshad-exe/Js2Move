import dotenv from 'dotenv';
import path from 'node:path';
import { z } from 'zod';
import { logger } from './logger';

// Load .env from repo root so local dev envs are picked up predictably
dotenv.config({ path: path.join(__dirname, '../../.env') });

const EnvConfigSchema = z.object({
  PORT: z.coerce
    .number({
      error: 'PORT must be a valid number',
    })
    .int()
    .positive()
    .default(3001),

  NODE_ENV: z
    .enum(['development', 'production', 'test'] as const, {
      error: 'NODE_ENV must be one of: development, production, test',
    })
    .default('development'),

  // Optional: not required for all environments (sqlite fallback, etc.)
  DATABASE_URL: z.string().optional(),

  // Feature flags
  START_INDEXER: z
    .enum(['true', 'false'] as const)
    .transform((val) => val === 'true')
    .default(false),

  // CORS configuration
  CORS_ORIGINS: z.union([
    z.string(),
    z.array(z.string())
  ]).optional(),
  CORS_ALLOW_CREDENTIALS: z.coerce.boolean().default(false),
  CORS_MAX_AGE: z.coerce.number().int().nonnegative().default(60 * 60 * 24),

  // Blockchain configuration
  RPC_ENDPOINT: z.string().url().optional(),
  CHAIN_ID: z.coerce.number().int().positive().optional(),
  DEPLOYER_PRIVATE_KEY: z.string().optional(),
  FAUCET_URL: z.string().url().optional(),

});

export type EnvConfig = z.infer<typeof EnvConfigSchema>;

const rawConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  START_INDEXER: process.env.START_INDEXER,
  CORS_ORIGINS: (() => {
    const corsOrigins = process.env.CORS_ORIGINS;
    if (!corsOrigins) return undefined;
    // Try to parse as JSON array first
    try {
      const parsed = JSON.parse(corsOrigins);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Not JSON, treat as comma-separated string
    }
    return corsOrigins;
  })(),
  CORS_ALLOW_CREDENTIALS: process.env.CORS_ALLOW_CREDENTIALS,
  CORS_MAX_AGE: process.env.CORS_MAX_AGE,
  RPC_ENDPOINT: process.env.RPC_ENDPOINT,
  CHAIN_ID: process.env.CHAIN_ID,
  DEPLOYER_PRIVATE_KEY: process.env.DEPLOYER_PRIVATE_KEY,
  FAUCET_URL: process.env.FAUCET_URL,
};

let envVars: EnvConfig;

try {
  envVars = EnvConfigSchema.parse(rawConfig);
  logger.info('[SYSTEM] Environment configuration loaded.');
} catch (error) {
  if (error instanceof z.ZodError) {
    logger.error('[SYSTEM] Environment configuration validation failed:', error.issues);
    error.issues.forEach((err) => {
      logger.error(`- ${err.path.join('.')}: ${err.message}`);
    });
  } else {
    logger.error('Unknown error during environment config validation:', error);
  }
  throw new Error('Environment configuration validation failed. Check environment variables.');
}

export const { PORT, NODE_ENV,  DATABASE_URL, START_INDEXER, CORS_MAX_AGE, CORS_ALLOW_CREDENTIALS, CORS_ORIGINS, RPC_ENDPOINT, CHAIN_ID, DEPLOYER_PRIVATE_KEY, FAUCET_URL } = envVars;

export const CORS_ORIGINS_ARRAY = CORS_ORIGINS
  ? Array.isArray(CORS_ORIGINS)
    ? CORS_ORIGINS
    : CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
  : undefined;

export default envVars;
