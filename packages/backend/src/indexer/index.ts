import { startDeploymentTracker } from './deployment-tracker';

export { startDeploymentTracker };
export { readCheckpoint, writeCheckpoint } from './checkpoints';

/**
 * Main indexer bootstrap
 * Starts all indexer workers (deployment tracker, event listeners, etc)
 */
export async function startIndexer() {
  await startDeploymentTracker();
}

if (require.main === module) {
  startIndexer().catch((err) => {
    console.error('Indexer failed:', err);
    process.exit(1);
  });
}
