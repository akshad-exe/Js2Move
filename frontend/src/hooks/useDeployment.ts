import { useState, useCallback } from 'react';
import { 
  deployContract, 
  getDeployments, 
  getDeploymentDetails, 
  getDeploymentStatus 
} from '@/lib/api/deploymentClient';
import type { 
  DeploymentRequest, 
  DeploymentResponse, 
  Deployment 
} from '@/lib/types';

export function useDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(false);

  const deploy = useCallback(async (request: DeploymentRequest): Promise<DeploymentResponse | null> => {
    setIsDeploying(true);
    try {
      const result = await deployContract(request);
      return result;
    } finally {
      setIsDeploying(false);
    }
  }, []);

  const fetchDeployments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDeployments();
      // Ensure data is always an array
      const deploymentsArray = Array.isArray(data) ? data : [];
      setDeployments(deploymentsArray);
      return deploymentsArray;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDetails = useCallback(async (id: string) => {
    return await getDeploymentDetails(id);
  }, []);

  const getStatus = useCallback(async (txHash: string) => {
    return await getDeploymentStatus(txHash);
  }, []);

  return {
    deploy,
    fetchDeployments,
    getDetails,
    getStatus,
    isDeploying,
    deployments,
    loading
  };
}
