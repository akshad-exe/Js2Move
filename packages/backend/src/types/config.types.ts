/**
 * @js2move/backend - Configuration Types
 */

import { z } from 'zod';

export interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL?: string;
  START_INDEXER: boolean;
  CORS_ORIGINS?: string[];
  CORS_ALLOW_CREDENTIALS: boolean;
  CORS_MAX_AGE: number;
  RPC_TESTNET?: string;
  RPC_MAINNET?: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

export interface AppConfig {
  port: number;
  env: 'development' | 'production' | 'test';
  isDev: boolean;
  isProd: boolean;
  isTest: boolean;
  databaseUrl?: string;
  startIndexer: boolean;
  corsOrigins: string[];
  corsAllowCredentials: boolean;
  corsMaxAge: number;
  rpcEndpoints: {
    testnet: string;
    mainnet: string;
  };
  logLevel: string;
}

export interface ServerConfig {
  port: number;
  host: string;
  env: string;
}

export interface DatabaseConfig {
  url?: string;
  provider: 'sqlite' | 'postgres' | 'mysql';
}
