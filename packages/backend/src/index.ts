
import { PORT, START_INDEXER, DATABASE_URL, NODE_ENV } from '@/config/envVars';
import app from '@/api/app';
import { connectWithRetry } from '@/config/database';
import { startIndexer } from '@/indexer';
import logger, { taggedLogger } from '@/config/logger';

const port = PORT || 8000;
const SYSTEM = taggedLogger('SYSTEM');
const SERVER = taggedLogger('SERVER');
const PRISMA = taggedLogger('PRISMA');

function maskDb(url?: string) {
  if (!url) return 'unset';
  if (url.startsWith('file:')) return 'sqlite (file)';
  try {
    // remove credentials
    const cleaned = url.replace(/:\/\/.*?:.*?@/, '://***:***@');
    const host = cleaned.match(/:\/\/(.*?)\//)?.[1] || cleaned.match(/:\/\/(.*)$/)?.[1];
    return host || 'masked';
  } catch {
    return 'masked';
  }
}

export function startServer(listenPort = port) {
  const server = app.listen(listenPort, () => {
    const dbInfo = maskDb(DATABASE_URL);
    SERVER.info(`backend is live on http://localhost:${listenPort}`);
    SERVER.info(`@js2move/backend listening on ${listenPort} (env=${NODE_ENV}, db=${dbInfo}, startIndexer=${START_INDEXER})`);
  });

  // connect to database (best-effort)
  connectWithRetry()
    .then(() => PRISMA.info('connected to database'))
    .catch((err) => PRISMA.error(`DB connection failed: ${err?.message || String(err)}`));

  // optionally start the indexer in this process (or run it separately)
  if (START_INDEXER) {
    startIndexer().catch((err) => {
      console.error('Indexer failed', err);
      process.exit(1);
    });
  }

  // graceful shutdown
  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });

  return server;
}

// Only start server when this file is executed directly (not when imported by tests)
if (require.main === module) {
  startServer();
}

export default app;
