import { apiClient } from './axiosClient';
import { 
  NetworkStatus, 
  Transaction, 
  AccountInfo 
} from '../types';

/**
 * Get network status
 */
export async function getNetworkStatus(): Promise<NetworkStatus | null> {
  try {
    const response = await apiClient.get<NetworkStatus>('/network/status');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch network status:', error);
    return null;
  }
}

/**
 * Get transaction details
 */
export async function getTransaction(hash: string): Promise<Transaction | null> {
  try {
    const response = await apiClient.get<Transaction>(`/transaction/${hash}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return null;
  }
}

/**
 * Get account information
 */
export async function getAccountInfo(address: string): Promise<AccountInfo | null> {
  try {
    const response = await apiClient.get<AccountInfo>(`/account/${address}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch account info:', error);
    return null;
  }
}

/**
 * Check if network is healthy
 */
export async function isNetworkHealthy(): Promise<boolean> {
  try {
    const status = await getNetworkStatus();
    return status?.status === 'ok';
  } catch {
    return false;
  }
}

/**
 * Format address for display
 */
export function formatAddress(address: string, chars: number = 6): string {
  if (address.length <= chars * 2) return address;
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

/**
 * Format balance for display
 */
export function formatBalance(balance: string): string {
  try {
    const num = parseFloat(balance);
    if (num < 0.01) return `${num.toFixed(6)} APT`;
    if (num < 100) return `${num.toFixed(2)} APT`;
    return `${num.toFixed(0)} APT`;
  } catch {
    return balance;
  }
}
