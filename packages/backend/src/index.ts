
import '@/config/moduleAlias';
import envVars from '@/config/envVars';
import app from '@/api/app';
import { connectWithRetry } from '@/config/database';
import { startIndexer } from '@/indexer';
import logger, { taggedLogger } from '@/config/logger';

const port = envVars.PORT || 8000;
const SYSTEM = taggedLogger('SYSTEM');
const SERVER = taggedLogger('SERVER');
const PRISMA = taggedLogger('PRISMA');

function maskDb(url?: string) {
  if (!url) return 'unset';
  if (url.startsWith('file:')) return 'sqlite';
  if (url.includes('neon')) return 'postgres (neon)';
  if (url.startsWith('postgresql://')) return 'postgres';
  return 'database';
}

export function startServer(listenPort = port) {
  const server = app.listen(listenPort, () => {
    const dbInfo = maskDb(envVars.DATABASE_URL);
    SERVER.info(`backend is live on http://localhost:${listenPort}`);
    SERVER.info(`@js2move/backend listening on ${listenPort} (env=${envVars.NODE_ENV}, db=${dbInfo}, startIndexer=${envVars.START_INDEXER})`);
  });

  // connect to database (best-effort)
  connectWithRetry()
    .then(async () => {
      PRISMA.info('connected to database');

      // Refresh DB-backed examples if possible
      try {
        const { ExamplesService } = await import('@/services/examples.service');
        const svc = new ExamplesService();
        const refreshed = await svc.refreshFromDb();
        if (refreshed) PRISMA.info('examples loaded from database');
      } catch (err) {
        PRISMA.warn('examples not loaded from database');
      }
    })
    .catch((err) => PRISMA.error(`DB connection failed: ${err?.message || String(err)}`));

  // optionally start the indexer as a separate process (via start:indexer script)
  // do NOT start in the main server process for stability
  if (false && envVars.START_INDEXER) {
    startIndexer().catch((err) => {
      SYSTEM.error(`Indexer failed: ${err?.message || String(err)}`);
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
