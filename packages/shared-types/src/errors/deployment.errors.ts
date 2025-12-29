/**
 * Deployment Error Classes
 */

export enum DeploymentErrorCode {
  INVALID_NETWORK = 'INVALID_NETWORK',
  INSUFFICIENT_GAS = 'INSUFFICIENT_GAS',
  COMPILATION_FAILED = 'COMPILATION_FAILED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_PRIVATE_KEY = 'INVALID_PRIVATE_KEY',
  CONTRACT_ALREADY_EXISTS = 'CONTRACT_ALREADY_EXISTS',
  TIMEOUT = 'TIMEOUT',
}

export class DeploymentError extends Error {
  constructor(
    public code: DeploymentErrorCode,
    message: string,
    public txHash?: string
  ) {
    super(message);
    this.name = 'DeploymentError';
  }
}

export class NetworkError extends Error {
  constructor(
    public network: string,
    message: string
  ) {
    super(`Network error (${network}): ${message}`);
    this.name = 'NetworkError';
  }
}

export class GasEstimationError extends Error {
  constructor(message: string) {
    super(`Gas estimation failed: ${message}`);
    this.name = 'GasEstimationError';
  }
}
