import { apiClient } from './axiosClient';
import type {
  GasEstimateRequest,
  GasEstimateResponse,
  GasPriceResponse,
} from "../types";

/**
 * Estimate gas for a deployment
 */
export async function estimateGas(request: GasEstimateRequest): Promise<GasEstimateResponse> {
  try {
    const response = await apiClient.post<GasEstimateResponse>('/public/gas/estimate', request);
    return response.data;
  } catch (error: any) {
    // Prefer server-provided error message when available
    const serverMsg = error?.response?.data?.error || error?.response?.data?.message;
    const message = serverMsg || error?.message || 'Failed to estimate gas';
    // Rethrow so callers can display appropriate UI/messages
    throw new Error(message);
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
