import express from 'express';
import router from '@/api/routes';
import requestLogger, { log } from '@/utils/logger';
import logger from '@/config/logger';
import { errorConverter, errorHandler } from '@/handlers/error.handler';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { isDbConnected } from '@/config/database';
import { readCheckpoint } from '@/indexer/checkpoints';
import listEndpoints from 'express-list-endpoints';
import { CORS_ORIGINS, CORS_ALLOW_CREDENTIALS, CORS_MAX_AGE } from '@/config/envVars';

const app = express();
app.use(express.json());
app.use(helmet());

// Configure CORS using env-configured origins (production-safe)
const allowedOrigins = CORS_ORIGINS ?? [] as string[];
const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    // allow non-browser tools (no origin)
    if (!origin) return cb(null, true);

    if (allowedOrigins.length === 0) {
      // In production prefer explicit list; in non-prod allow unspecified origins
      if (process.env.NODE_ENV === 'production') return cb(new Error('Not allowed by CORS'), false);
      return cb(null, true);
    }

    if (allowedOrigins.includes(origin)) return cb(null, true);

    logger.warn('CORS denied origin', { origin });
    return cb(new Error('Not allowed by CORS'), false);
  },
  credentials: CORS_ALLOW_CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
  maxAge: CORS_MAX_AGE,
};

app.use(cors(corsOptions));
// ensure caches vary by origin
app.use((req, res, next) => {
  res.header('Vary', 'Origin');
  next();
});
// keep morgan for a short while but silence its own console noise in prod
app.use(morgan('tiny'));
app.use(requestLogger);

// mount versioned router under /api
app.use('/api', router);

// Detailed health endpoint ✅
app.get('/health', async (_req, res) => {
  const dbConnected = isDbConnected();
  const checkpoint = await readCheckpoint().catch(() => ({}));

  res.json({
    status: dbConnected ? 'ok' : 'degraded',
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
    db: { connected: dbConnected },
    indexer: { lastIndexedBlock: checkpoint.lastIndexedBlock ?? null },
    timestamp: new Date().toISOString(),
  });
});

// Replace custom endpoint lister with express-list-endpoints in development only
if (process.env.NODE_ENV === 'development') {
  app.get('/api/endpoints', (_req, res) => {
    try {
      const endpoints = listEndpoints(app);
      res.json({ endpoints });
    } catch (err) {
      logger.warn('Failed to list endpoints', err);
      res.status(500).json({ error: 'Could not list endpoints' });
    }
  });
}

// Global error handlers (must be added after routes)
app.use(errorConverter);
app.use(errorHandler);

export default app;
