import { apiClient } from './axiosClient';
import toast from 'react-hot-toast';
import type {
  DeploymentRequest,
  DeploymentResponse,
  DeploymentStatus,
  Deployment
} from '../types';

/**
 * Deploy a compiled contract
 */
export async function deployContract(request: DeploymentRequest): Promise<DeploymentResponse | null> {
  try {
    const toastId = toast.loading('Deploying contract...');
    
    const response = await apiClient.post<DeploymentResponse>('/public/deploy', request);
    
    if (response.data.success) {
      toast.success('Deployment initiated!', { id: toastId });
      return response.data;
    } else {
      const error = response.data.error || 'Deployment failed';
      toast.error(error, { id: toastId });
      return null;
    }
  } catch (error) {
    console.error('Deployment error:', error);
    toast.error('Deployment failed. Please try again.');
    return null;
  }
}

/**
 * Get list of deployments
 */
export async function getDeployments(): Promise<Deployment[]> {
  try {
    const response = await apiClient.get<Deployment[]>('/public/deployments');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch deployments:', error);
    return [];
  }
}

/**
 * Get deployment history
 */
export async function getDeploymentHistory(): Promise<Deployment[]> {
  try {
    const response = await apiClient.get<Deployment[]>('/public/deployment/history');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch deployment history:', error);
    return [];
  }
}

/**
 * Get specific deployment details
 */
export async function getDeploymentDetails(deploymentId: string): Promise<Deployment | null> {
  try {
    const response = await apiClient.get<Deployment>(`/public/deployment/${deploymentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch deployment details:', error);
    return null;
  }
}

/**
 * Get deployment status by transaction hash
 */
export async function getDeploymentStatus(txHash: string): Promise<DeploymentStatus | null> {
  try {
    const response = await apiClient.get<DeploymentStatus>(`/public/deployment/status/${txHash}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch deployment status:', error);
    return null;
  }
}

/**
 * Poll deployment status until completion
 */
export async function pollDeploymentStatus(
  txHash: string,
  maxAttempts: number = 60,
  interval: number = 1000
): Promise<DeploymentStatus | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await getDeploymentStatus(txHash);
    
    if (status && status.status !== 'pending') {
      return status;
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  return null;
}
