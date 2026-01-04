import { Request, Response } from 'express';
import catchAsync from '@/handlers/async.handler';
import { GasEstimationService } from '@/services/gas.service';

const gasService = new GasEstimationService();

export const gasController = {
  estimateGas: catchAsync(async (req: Request, res: Response) => {
    const { source, network = 'testnet' } = req.body;
    if (!source) return res.status(400).json({ error: 'Missing source' });
    const estimate = await gasService.estimateFromSource(source, network);
    res.json({ success: true, estimate });
  }),

  getGasPrice: catchAsync(async (req: Request, res: Response) => {
    const { network = 'testnet' } = req.query;
    const gasPrice = await gasService.getGasPrice(network as 'testnet' | 'mainnet');
    res.json({ network, gasUnitPrice: gasPrice, priceInAPT: gasPrice / 100_000_000 });
  })
};