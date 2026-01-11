import express from 'express';
import router from '@/api/routes';
import { requestLogger } from '@/config/logger';
import { isDbConnected } from '@/config/database';
import logger from '@/config/logger';
import { CORS_ORIGINS_ARRAY, CORS_ALLOW_CREDENTIALS, CORS_MAX_AGE } from '@/config/envVars';
import { errorConverter, errorHandler } from '@/handlers/error.handler';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { readCheckpoint } from '@/indexer/checkpoints';
import listEndpoints from 'express-list-endpoints';

const app = express();
app.use(express.json());
app.use(helmet());

// Configure CORS using env-configured origins (production-safe)
const allowedOrigins = CORS_ORIGINS_ARRAY ?? [];

// Helper to test wildcard matches like '*.ngrok.io' or 'https://*.mydomain.com'
function originMatchesPattern(origin: string, pattern: string) {
  if (pattern === '*') return true;
  // If pattern contains '*' treat as simple wildcard suffix match
  if (pattern.includes('*')) {
    const regex = new RegExp('^' + pattern.split('*').map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
    return regex.test(origin);
  }
  return origin === pattern;
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    // allow non-browser tools (no origin header, e.g., curl or server-to-server)
    if (!origin) return cb(null, true);

    // If an explicit "allow all" marker is configured, accept all origins
    if (allowedOrigins.includes('*')) return cb(null, true);

    // In development, be slightly permissive (allow localhost and 127.0.0.1)
    if (process.env.NODE_ENV !== 'production' && /localhost|127\.0\.0\.1/.test(origin)) {
      return cb(null, true);
    }

    // Check configured allowed origins with wildcard support
    for (const pattern of allowedOrigins) {
      if (originMatchesPattern(origin, pattern)) return cb(null, true);
    }

    logger.warn('CORS denied origin', { origin, allowedOrigins });
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
  const checkpoint = (await readCheckpoint().catch(() => ({} as { lastIndexedBlock?: number })));

  res.json({
    status: dbConnected ? 'ok' : 'degraded',
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
    db: { connected: dbConnected },
    indexer: { lastIndexedBlock: checkpoint.lastIndexedBlock ?? null },
    timestamp: new Date().toISOString(),
  });
});

// Swagger UI for API docs (development only)
if (process.env.NODE_ENV === 'development') {
  try {
    const swaggerUi = require('swagger-ui-express');
    const swaggerJsdoc = require('swagger-jsdoc');
    
    // Auto-generate OpenAPI spec from JSDoc comments in routes
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Js2Move API',
          version: '1.0.0',
          description: 'Smart contract compilation and deployment API for Move language',
        },
        servers: [
          {
            url: 'http://localhost:8000',
            description: 'Development server',
          },
        ],
      },
      apis: ['./src/api/routes/**/*.ts', './src/api/controllers/**/*.ts'],
    };
    
    const spec = swaggerJsdoc(options);
    const port = process.env.PORT || 8000;
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
    logger.info(`Swagger UI available at http://localhost:${port}/api/docs`);
  } catch (err) {
    logger.warn('Swagger UI not available', err);
  }
}

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
