/**
 * @js2move/backend - Core API Types
 * Shared between Backend and Frontend
 */

/**
 * Compilation Request/Response Types
 */
export interface CompileRequest {
  source: string;
  options?: Record<string, any>;
}

export interface CompileError {
  stage: 'lexer' | 'parser' | 'generator';
  message: string;
  line: number;
  column: number;
  code: string;
  suggestion?: string;
}

export interface CompileWarning {
  message: string;
  line: number;
  column: number;
  code: string;
}

export interface CompileResponse {
  success: boolean;
  output?: string;
  errors?: CompileError[];
  warnings?: CompileWarning[];
  executionTime?: number;
}

export interface ValidationRequest {
  source: string;
}

export interface ValidationResponse {
  valid: boolean;
  errors: CompileError[];
  warnings: CompileWarning[];
}

export interface AnalysisResponse {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Deployment Types
 */
export type Network = 'testnet' | 'mainnet' | 'devnet' | 'local';

export type DeploymentStatus = 'pending' | 'compiling' | 'deploying' | 'confirmed' | 'failed';

export interface DeployRequest {
  source: string;
  network: Network;
  privateKey?: string;
  accountAddress?: string; // For wallet-based deployment
  moduleName?: string;
  gasLimit?: number;
}

export interface DeployResponse {
  success: boolean;
  deploymentId?: string;
  address?: string;
  txHash?: string;
  gasUsed?: number;
  deploymentUrl?: string;
  error?: string;
  estimatedCost?: number;
}

export interface DeployOptions {
  source: string;
  network: Network;
  privateKey?: string;
  moduleName?: string;
  gasLimit?: number;
}

export interface DeploymentStatusRequest {
  deploymentId?: string;
  txHash?: string;
  network: Network;
}

export interface DeploymentStatusResponse {
  status: DeploymentStatus;
  deploymentId: string;
  address?: string;
  txHash?: string;
  timestamp: Date;
  gasUsed?: number;
  error?: string;
}

export interface DeploymentHistoryRequest {
  userId?: string;
  network?: Network;
  limit?: number;
  offset?: number;
}

export interface DeploymentHistoryResponse {
  deployments: DeploymentRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DeploymentRecord {
  id: string;
  address: string;
  network: Network;
  txHash: string;
  status: DeploymentStatus;
  gasUsed: number;
  moduleName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Gas Estimation Types
 */
export interface GasEstimateRequest {
  source: string;
  network?: Network;
}

export interface GasEstimateResponse {
  estimatedGas: number;
  maxGas: number;
  gasPrice: number;
  totalCost: number;
  currency: string;
}

export interface GasPriceResponse {
  gasPrice: number;
  unit: string;
  lastUpdated: string;
}

/**
 * Blockchain/Network Types
 */
export interface NetworkStatus {
  status: 'ok' | 'degraded' | 'offline';
  uptime: number;
  env: string;
  db: { connected: boolean };
  indexer?: { lastIndexedBlock?: number };
  timestamp: string;
}

export interface Transaction {
  hash: string;
  status: 'success' | 'failed' | 'pending';
  from: string;
  to?: string;
  amount?: string;
  gasUsed?: number;
  timestamp: string;
  error?: string;
}

export interface AccountInfo {
  address: string;
  balance: string;
  resources?: Record<string, any>;
  sequenceNumber?: number;
  lastUpdated: string;
}

/**
 * Code Examples Types
 */
export interface CodeExample {
  id: string;
  name: string;
  description?: string;
  source: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  author?: string;
}

export interface ExamplesResponse {
  examples: CodeExample[];
  total: number;
}
