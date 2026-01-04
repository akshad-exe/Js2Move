import { getPrisma } from '@/config/database';
import { AptosClient } from 'aptos';
import { taggedLogger } from '@/config/logger';

const SERVER = taggedLogger('INDEXER');

const POLL_INTERVAL = 10000; // 10 seconds

// Initialize Aptos client (you can make this configurable per network)
const aptosClient = new AptosClient('https://fullnode.movement.devnet.aptos.cloud/v1');

/**
 * Poll pending deployments and check their on-chain status
 */
async function checkPendingDeployments() {
  try {
    const prisma = getPrisma();
    const pendingDeployments = await prisma.deployment.findMany({
      where: {
        status: 'pending',
      },
    });

    for (const deployment of pendingDeployments) {
      try {
        // Query the chain for this transaction
        const txStatus = await aptosClient.getTransactionByHash(deployment.txHash);

        if (!txStatus) {
          // Still pending or not found
          continue;
        }

        // Check if tx succeeded
        const success = (txStatus as any).success === true;

        // Extract contract address from tx output if available
        let contractAddress = deployment.contractAddress;
        if (success && !contractAddress) {
          // Try to extract from tx output/events
          const events = (txStatus as any).events || [];
          const publishEvent = events.find((e: any) => 
            e.type?.includes('PublishModule') || e.type?.includes('Publish')
          );
          if (publishEvent) {
            contractAddress = (publishEvent.data as any)?.address || contractAddress;
          }
        }

        // Update deployment record
        const prisma = getPrisma();
        await prisma.deployment.update({
          where: { id: deployment.id },
          data: {
            status: success ? 'success' : 'failed',
            contractAddress: contractAddress || undefined,
            updatedAt: new Date(),
          },
        });

        SERVER.info(
          `Indexed deployment ${deployment.id}: ${success ? 'success' : 'failed'}`
        );
      } catch (err) {
        SERVER.error(`Error checking deployment ${deployment.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  } catch (err) {
    SERVER.error(`Error in checkPendingDeployments: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Start the deployment tracker polling loop
 */
export async function startDeploymentTracker() {
  SERVER.info('Deployment tracker starting - tracking confirmations');

  // Poll pending deployments every 10 seconds
  const pollingInterval = setInterval(async () => {
    await checkPendingDeployments();
  }, POLL_INTERVAL);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    SERVER.info('Deployment tracker received SIGTERM, shutting down gracefully');
    clearInterval(pollingInterval);
    const prisma = getPrisma();
    await prisma.$disconnect();
    process.exit(0);
  });
}
