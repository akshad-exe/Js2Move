import { Request, Response } from 'express';
import catchAsync from '@/handlers/async.handler';
import { DeploymentService } from '@/services/deployment.service';

const deploymentService = new DeploymentService();

export const deploymentController = {
  /**
   * Compile MoveJS code to bytecode (for client-side transaction building and signing)
   */
  compile: catchAsync(async (req: Request, res: Response) => {
    const { source, moduleName } = req.body;
    if (!source) return res.status(400).json({ error: 'Missing source' });

    const result = await deploymentService.createUnsignedTransaction({ source, moduleName });

    // Convert BigInts to strings for JSON serialization
    const serializableResult = JSON.parse(JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    res.json(serializableResult);
  }),

  /**
   * Submit signed transaction to blockchain
   * Can handle both signed transactions and unsigned transactions (will sign server-side if private key available)
   */
  submit: catchAsync(async (req: Request, res: Response) => {
    const { signedTransaction, unsignedTransaction, moduleName, network = 'testnet' } = req.body;
    
    // Handle signed transaction (preferred decentralized flow)
    if (signedTransaction) {
      const result = await deploymentService.submitSignedTransaction({ signedTransaction, moduleName, network });
      return res.json(result);
    }
    
    // Handle unsigned transaction (fallback server-side signing)
    if (unsignedTransaction) {
      const result = await deploymentService.submitUnsignedTransaction({ unsignedTransaction, moduleName, network });
      return res.json(result);
    }
    
    return res.status(400).json({ error: 'Missing signedTransaction or unsignedTransaction' });
  }),

  deploy: catchAsync(async (req: Request, res: Response) => {
    const { source, network = 'testnet', moduleName, gasLimit, moveToml } = req.body;
    if (!source) return res.status(400).json({ error: 'Missing source' });

    const result = await deploymentService.deploy({ source, network, moduleName, gasLimit, moveToml });

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
    // Transform Prisma objects to match frontend expectations
    const transformedDeployments = deployments.map(deployment => ({
      id: deployment.id,
      txHash: deployment.txHash,
      address: deployment.contractAddress || '',
      status: deployment.status,
      timestamp: deployment.createdAt.toISOString(),
      gasUsed: deployment.gasUsed,
      error: deployment.error,
      moduleName: deployment.moduleName,
    }));
    res.json({ deployments: transformedDeployments, total: transformedDeployments.length });
  }),

  /**
   * List recent deployments
   */
  list: catchAsync(async (_req: Request, res: Response) => {
    const deployments = await deploymentService.list();
    // Transform Prisma objects to match frontend expectations
    const transformedDeployments = deployments.map(deployment => ({
      id: deployment.id,
      txHash: deployment.txHash,
      address: deployment.contractAddress || '',
      status: deployment.status,
      timestamp: deployment.createdAt.toISOString(),
      gasUsed: deployment.gasUsed,
      error: deployment.error,
      moduleName: deployment.moduleName,
    }));
    res.json({ deployments: transformedDeployments });
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