import { compile } from '@js2move/compiler';
import { getPrisma } from '@/config/database';

export interface DeployOptions {
  source: string;
  network: 'testnet' | 'mainnet';
  privateKey?: string;
  moduleName?: string;
  gasLimit?: number;
}

export class DeploymentService {
  private getPrismaInstance() {
    return getPrisma();
  }

  async deploy(opts: DeployOptions) {
    // Basic flow: compile, estimate gas, save pending deployment, submit transaction (mocked)
    const move = await compile(opts.source);
    const prisma = this.getPrismaInstance();

    // mock tx hash
    const txHash = `0x${Math.random().toString(16).slice(2, 10)}`;

    const deployment = await prisma.deployment.create({
      data: {
        source: opts.source,
        compiledCode: typeof move === 'string' ? move : JSON.stringify(move),
        txHash,
        network: opts.network,
        status: 'pending',
        moduleName: opts.moduleName,
        gasEstimate: opts.gasLimit,
      }
    });

    // In real impl: publish module, wait for confirmation, update deployment
    return {
      success: true,
      deploymentId: deployment.id,
      address: '',
      txHash,
      gasUsed: null
    };
  }

  /**
   * Get deployment history for a network or status
   */
  async getHistory(filters?: { network?: string; status?: string }) {
    const prisma = this.getPrismaInstance();
    return prisma.deployment.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { contracts: true },
    });
  }

  /**
   * List recent deployments
   */
  async list() {
    const prisma = this.getPrismaInstance();
    return prisma.deployment.findMany({ 
      orderBy: { createdAt: 'desc' }, 
      take: 50 
    });
  }

  /**
   * Get a single deployment by ID
   */
  async get(id: string) {
    const prisma = this.getPrismaInstance();
    return prisma.deployment.findUnique({ where: { id } });
  }

  /**
   * Get deployment status by tx hash
   */
  async getStatus(txHash: string, network: 'testnet' | 'mainnet') {
    const prisma = this.getPrismaInstance();
    const deployment = await prisma.deployment.findUnique({ where: { txHash } });
    if (!deployment) return { status: 'not_found' };

    return { 
      status: deployment.status, 
      deploymentId: deployment.id,
      txHash, 
      network,
      contractAddress: deployment.contractAddress,
      createdAt: deployment.createdAt,
      updatedAt: deployment.updatedAt,
    };
  }

  /**
   * Get pending deployments (for indexer polling)
   */
  async getPending() {
    const prisma = this.getPrismaInstance();
    return prisma.deployment.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Update deployment status (called by indexer)
   */
  async updateStatus(
    id: string,
    status: 'pending' | 'success' | 'failed',
    data?: { contractAddress?: string; gasUsed?: number; error?: string }
  ) {
    const prisma = this.getPrismaInstance();
    return prisma.deployment.update({
      where: { id },
      data: {
        status,
        ...data,
        updatedAt: new Date(),
      },
    });
  }
}
