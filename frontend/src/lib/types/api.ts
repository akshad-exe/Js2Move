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

export interface GasEstimateRequest {
  source: string;
  network?: string;
  mode?: 'fast' | 'accurate'; // 'fast' = synthetic simulation (default), 'accurate' = full compile + simulate
}

export interface GasEstimateResponse {
  estimatedGas: number;
  maxGas?: number;
  gasPrice?: number; // may be atomic or APT depending on the endpoint
  totalCost?: number; // atomic total cost (e.g., octas)
  totalCostAPT?: number; // cost in APT
  currency?: string;
  details?: any;
}

export interface GasPriceResponse {
  gasPrice: number; // price per gas unit in APT
  unit: string;
  lastUpdated: string;
}
