import { Request, Response } from 'express';
import catchAsync from '@/handlers/async.handler';
import { GasEstimationService } from '@/services/gas.service';

const gasService = new GasEstimationService();

export const gasController = {
  estimateGas: catchAsync(async (req: Request, res: Response) => {
    const { source, network = 'testnet', mode = 'fast', moveToml } = req.body;
    if (!source) return res.status(400).json({ error: 'Missing source' });

    // Validate mode
    if (mode !== 'fast' && mode !== 'accurate') {
      return res.status(400).json({ error: 'Invalid mode. Use "fast" or "accurate".' });
    }

    if (moveToml && typeof moveToml !== 'string') {
      return res.status(400).json({ error: 'moveToml must be a string' });
    }

    try {
      const estimate = await gasService.estimateFromSource(source, network, { mode, moveToml });
      // Return the estimate directly as GasEstimateResponse
      res.json(estimate);
    } catch (err: any) {
      const msg = String(err?.message || '').toLowerCase();
      if (msg.includes('rpc') || msg.includes('generate') || err?.original) {
        // Log details for debugging
        console.error('Gas estimation RPC failure:', err?.original || err);
        // Surface a clear error so frontend can show "RPC failed !!"
        return res.status(502).json({ error: 'RPC failed !!' });
      }
      if (msg.includes('compile')) {
        return res.status(500).json({ error: 'Compilation failed for accurate estimation' });
      }
      throw err;
    }
  }),

  getGasPrice: catchAsync(async (req: Request, res: Response) => {
    const { network = 'testnet' } = req.query;
    try {
      const gasPriceAtomic = await gasService.getGasPrice(network as 'testnet' | 'mainnet');

      // gasPriceAtomic is expected to be in atomic units (e.g., 1e-8 APT). Convert to APT
      const gasPriceAPT = Number(gasPriceAtomic) / 100_000_000;

      const response = {
        gasPrice: gasPriceAPT,
        unit: 'APT',
        lastUpdated: new Date().toISOString(),
      };

      res.json(response);
    } catch (err: any) {
      if (err?.message === 'RPC failed') {
        return res.status(502).json({ error: 'RPC failed !!' });
      }
      throw err;
    }
  })
};