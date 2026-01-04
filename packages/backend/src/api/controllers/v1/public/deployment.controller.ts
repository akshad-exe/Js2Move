import { Request, Response } from 'express';
import catchAsync from '@/handlers/async.handler';
import { DeploymentService } from '@/services/deployment.service';

const deploymentService = new DeploymentService();

export const deploymentController = {
  deploy: catchAsync(async (req: Request, res: Response) => {
    const { source, network = 'testnet', moduleName, gasLimit } = req.body;
    if (!source) return res.status(400).json({ error: 'Missing source' });

    const result = await deploymentService.deploy({ source, network, moduleName, gasLimit });

    res.json(result);
  }),

  /**
   * Get deployment history with optional filters (user, network, status)
   */
  history: catchAsync(async (req: Request, res: Response) => {
    const { network, status } = req.query;
    const deployments = await deploymentService.getHistory({
      network: network as string,
      status: status as string,
    });
    res.json({ deployments, total: deployments.length });
  }),

  /**
   * List recent deployments
   */
  list: catchAsync(async (_req: Request, res: Response) => {
    const deployments = await deploymentService.list();
    res.json({ deployments });
  }),

  /**
   * Get a single deployment by ID
   */
  get: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deployment = await deploymentService.get(id);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }
    res.json(deployment);
  }),

  /**
   * Get deployment status by txHash
   * Useful for polling confirmation status
   */
  status: catchAsync(async (req: Request, res: Response) => {
    const { txHash } = req.params;
    const { network = 'testnet' } = req.query;
    const status = await deploymentService.getStatus(txHash, network as 'testnet' | 'mainnet');
    res.json(status);
  })
};