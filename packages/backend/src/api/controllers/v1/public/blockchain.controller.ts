import { Request, Response } from 'express';
import catchAsync from '@/handlers/async.handler';
import { BlockchainService } from '@/services/blockchain.service';

const blockchainService = new BlockchainService();

export const blockchainController = {
  /**
   * Get network status and health
   */
  getNetworkStatus: catchAsync(async (req: Request, res: Response) => {
    const { network = 'testnet' } = req.query;
    const status = await blockchainService.getNetworkStatus(network as 'testnet' | 'mainnet');
    res.json(status);
  }),

  /**
   * Get transaction details by hash
   */
  getTransaction: catchAsync(async (req: Request, res: Response) => {
    const { hash } = req.params;
    const { network = 'testnet' } = req.query;

    if (!hash) {
      return res.status(400).json({ error: 'Missing transaction hash' });
    }

    const transaction = await blockchainService.getTransaction(hash, network as 'testnet' | 'mainnet');
    res.json(transaction);
  }),

  /**
   * Get account information
   */
  getAccount: catchAsync(async (req: Request, res: Response) => {
    const { address } = req.params;
    const { network = 'testnet' } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Missing account address' });
    }

    const account = await blockchainService.getAccount(address, network as 'testnet' | 'mainnet');
    res.json(account);
  }),
};