import { readCheckpoint, writeCheckpoint } from './checkpoints';

export async function startIndexer() {
  console.log('Indexer starting (stub)');

  // Example loop: read checkpoint, pretend to process next block, write checkpoint.
  const checkpoint = await readCheckpoint();
  let block = checkpoint.lastIndexedBlock ?? 0;
  console.log('Starting from block', block);

  // simple example: advance block number every 5 seconds (demo only)
  setInterval(async () => {
    block += 1;
    console.log('Processed block', block);
    await writeCheckpoint({ lastIndexedBlock: block });
  }, 5000);
}

if (require.main === module) {
  startIndexer().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
