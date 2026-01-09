export interface DeploymentRequest {
  source: string;
  network?: string;
  moduleName?: string;
  gasLimit?: number;
  moveToml?: string;
}

export interface DeploymentResponse {
  success: boolean;
  deploymentId: string;
  txHash: string;
  address?: string;
  error?: string;
  message?: string;
}

export interface Deployment {
  id: string;
  txHash: string;
  address: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  gasUsed?: number;
  error?: string;
  moduleName?: string;
}

export interface DeploymentStatus {
  status: 'pending' | 'success' | 'failed';
  confirmations: number;
  gasUsed?: number;
  error?: string;
}
