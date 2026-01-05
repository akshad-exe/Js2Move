/**
 * @js2move/backend - Service Internal Types
 */

/**
 * Database-related types
 */
export interface DeploymentData {
  id: string;
  source: string;
  compiledCode: string;
  txHash: string;
  network: string;
  status: 'pending' | 'success' | 'failed';
  moduleName?: string;
  gasEstimate?: number;
  contractAddress?: string;
  gasUsed?: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExampleData {
  id: string;
  name: string;
  description?: string;
  source: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Service Response Types
 */
export interface DeploymentResult {
  success: boolean;
  deploymentId: string;
  address: string;
  txHash: string;
  gasUsed: number | null;
  error?: string;
}

export interface GasEstimate {
  estimatedGas: number;
  maxGas: number;
  gasPrice: number;
  totalCost: number;
  currency: string;
  totalCostAPT: number;
}

export interface NetworkInfo {
  network: string;
  chainId?: number;
  epoch?: number;
  blockHeight?: number;
  oldestBlockHeight?: number;
  blockTimestamp?: number;
  status: 'healthy' | 'unhealthy';
  error?: string;
}

export interface TransactionInfo {
  hash: string;
  type: string;
  sender: string;
  sequenceNumber: number;
  maxGasAmount: number;
  gasUnitPrice: number;
  expirationTimestampSecs: number;
  payload: Record<string, any>;
  signature: Record<string, any>;
  success: boolean;
  vmStatus: string;
  gasUsed?: number;
  timestamp?: number;
}

export interface Account {
  address: string;
  authenticationKey: string;
  sequenceNumber: number;
  resources: Record<string, any>[];
}

/**
 * Compilation Result (for internal use)
 */
export interface CompilationResult {
  code: string;
  warnings?: string[];
  ir?: any;
}

/**
 * Indexer Types
 */
export interface Checkpoint {
  lastIndexedBlock?: number;
  lastIndexedTime?: string;
}
