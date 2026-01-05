import { apiClient } from './axiosClient';
import toast from 'react-hot-toast';
import type {
  GasEstimateRequest,
  GasEstimateResponse,
  GasPriceResponse,
} from "../types";

/**
 * Estimate gas for a deployment
 */
export async function estimateGas(request: GasEstimateRequest): Promise<GasEstimateResponse | null> {
  try {
    const response = await apiClient.post<GasEstimateResponse>('/public/gas/estimate', request);
    return response.data;
  } catch (error) {
    console.error('Failed to estimate gas:', error);
    toast.error('Failed to estimate gas');
    return null;
  }
}

/**
 * Get current gas price
 */
export async function getGasPrice(): Promise<GasPriceResponse | null> {
  try {
    const response = await apiClient.get<GasPriceResponse>('/public/gas/price');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch gas price:', error);
    return null;
  }
}

/**
 * Format gas cost for display
 */
export function formatGasCost(gasPrice: number, gasUsed: number): string {
  const totalCost = gasPrice * gasUsed;
  return `${totalCost.toFixed(6)} APT`;
}
