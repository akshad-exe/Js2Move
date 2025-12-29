/**
 * SDK Configuration Types
 */

import { Network } from '../api';

export interface SDKConfig {
  apiUrl?: string;
  apiKey?: string;
  network?: Network;
  timeout?: number;
  retryAttempts?: number;
}

export interface CLIConfig {
  defaultNetwork: Network;
  defaultOutputDir: string;
  verboseLogging: boolean;
  colorOutput: boolean;
}

export interface BackendConfig {
  port: number;
  databaseUrl: string;
  movementRpcUrl: string;
  jwtSecret: string;
  corsOrigin: string[];
}
