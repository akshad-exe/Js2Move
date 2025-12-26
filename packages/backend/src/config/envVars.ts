import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file early so zod sees values during parse
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3001').transform((val) => parseInt(val, 10)),
  DATABASE_URL: z.string().optional(),
  START_INDEXER: z.string().default('false').transform((v) => v === 'true'),
  // Comma-separated list of allowed origins for CORS (e.g. https://app.example.com, http://localhost:3000)
  CORS_ORIGINS: z.string().optional(),
  // Whether to allow credentials (Access-Control-Allow-Credentials)
  CORS_ALLOW_CREDENTIALS: z.string().default('false').transform((v) => v === 'true'),
  // Preflight cache window in seconds
  CORS_MAX_AGE: z.string().default(String(60 * 60 * 24)).transform((v) => parseInt(v, 10)),
});

let parsedEnv;
try {
  parsedEnv = envSchema.parse(process.env);
} catch (err: any) {
  if (err && err.errors) {
    const details = err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new Error(`Environment validation failed: ${details}`);
  }
  throw err;
}

// Log immediately after envs are validated (use require to avoid import-order issues)
const { taggedLogger } = require('@/config/logger');
const SYSTEM = taggedLogger('SYSTEM');
SYSTEM.info('Environment configuration loaded.');

export const env = parsedEnv;

export const PORT = env.PORT as number;
export const NODE_ENV = env.NODE_ENV as string;
export const DATABASE_URL = env.DATABASE_URL as string | undefined;
export const START_INDEXER = env.START_INDEXER as boolean;

export const CORS_ORIGINS = env.CORS_ORIGINS
  ? (env.CORS_ORIGINS as string)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : undefined;

export const CORS_ALLOW_CREDENTIALS = env.CORS_ALLOW_CREDENTIALS as boolean;
export const CORS_MAX_AGE = env.CORS_MAX_AGE as number;

export default env;
