/**
 * API Types - Deployment endpoints
 */

export enum Network {
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
  DEVNET = 'devnet',
  LOCAL = 'local',
}

export enum DeploymentStatus {
  PENDING = 'pending',
  COMPILING = 'compiling',
  DEPLOYING = 'deploying',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export interface DeployRequest {
  source: string;
  network: Network;
  privateKey?: string;
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

export interface GasEstimateRequest {
  source: string;
  network: Network;
}

export interface GasEstimateResponse {
  estimatedGas: number;
  maxGas: number;
  gasPrice: number;
  totalCost: number;
  currency: string;
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
