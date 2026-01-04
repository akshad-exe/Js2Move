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
  title: string;
  description: string;
  category: string;
  code: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  author?: string;
}

export interface ExamplesResponse {
  examples: CodeExample[];
  total: number;
}

export interface GasEstimateRequest {
  source: string;
  network?: string;
}

export interface GasEstimateResponse {
  estimatedGas: number;
  gasPrice: number;
  totalCost: number;
}

export interface GasPriceResponse {
  gasPrice: number;
  unit: string;
  lastUpdated: string;
}
