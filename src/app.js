import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

// Import middleware
import errorHandler, { ApiError } from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import performanceMonitor from './middleware/performanceMonitor.js';

// Import routes
import healthRoutes from './api/health.js';
import authRoutes from './api/auth.js';
import objectsRoutes from './api/objects.js';
import searchRoutes from './api/search.js';
import adminRoutes from './api/admin.js';
import dashboardRoutes from './api/dashboard.js';
import reportingRoutes from './api/reporting.js';
import ingestionRoutes from './api/ingestion.js';
import discoveryRoutes from './api/discovery.js';
import integrationsRoutes from './api/integrations.js';
import docsRoutes from './api/docs.js';
import ssisRoutes from './api/ssis.js';
import marketplaceRoutes from './api/marketplace.js';
import dataProductsRoutes from './api/dataProducts.js';
import glossaryRoutes from './api/glossary.js';
import classificationRoutes from './api/classification.js';
import governanceRoutes from './api/governance.js';
import productsRoutes from './api/products.js';
import qualityRoutes from './api/quality.js';
import connectorsRoutes from './api/connectors.js';
import dictionaryRoutes from './api/dictionary.js';
import governanceOpsRoutes from './api/governanceOps.js';
import metricsRoutes from './api/metrics.js';

// Import utilities and config
import { validateEntraConfig } from './utils/entraConfig.js';

export { initializeCache } from './utils/cacheInitializer.js';

/**
 * Create and configure Express application
 * @returns {express.Application} Configured Express app
 */
export default function createApp() {
  const fileName = fileURLToPath(import.meta.url);
  const dirName = path.dirname(fileName);
  const frontendPath = path.resolve(dirName, '../docker/frontend');

  // Validate Entra ID configuration
  validateEntraConfig();

  const app = express();

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://cdn.jsdelivr.net',
            'https://unpkg.com',
          ],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          fontSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
          connectSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(cors());

  // Body parsing
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Logging
  app.use(morgan('combined'));
  app.use((req, res, next) => {
    req.requestId = req.headers['x-request-id'] || randomUUID();
    res.setHeader('x-request-id', req.requestId);
    next();
  });
  app.use(requestLogger);
  app.use(performanceMonitor);

  // Health check (should be first, no auth required)
  app.use('/health', healthRoutes);

  // API v1 routes
  const apiRouter = express.Router();

  // Auth routes (public)
  apiRouter.use('/auth', authRoutes);

  // Protected routes
  apiRouter.use('/search', searchRoutes);
  apiRouter.use('/objects', objectsRoutes);
  apiRouter.use('/admin', adminRoutes);
  apiRouter.use('/dashboard', dashboardRoutes);
  apiRouter.use('/reporting', reportingRoutes);
  apiRouter.use('/ingestion', ingestionRoutes);
  apiRouter.use('/discovery', discoveryRoutes);
  apiRouter.use('/integrations', integrationsRoutes);
  apiRouter.use('/docs', docsRoutes);
  apiRouter.use('/ssis', ssisRoutes);
  apiRouter.use('/marketplace', marketplaceRoutes);
  apiRouter.use('/data-products', dataProductsRoutes);
  apiRouter.use('/glossary', glossaryRoutes);
  apiRouter.use('/classification', classificationRoutes);
  apiRouter.use('/governance', governanceRoutes);
  apiRouter.use('/products', productsRoutes);
  apiRouter.use('/quality', qualityRoutes);
  apiRouter.use('/connectors', connectorsRoutes);
  apiRouter.use('/dictionary', dictionaryRoutes);
  apiRouter.use('/governance-ops', governanceOpsRoutes);
  apiRouter.use('/metrics', metricsRoutes);
  apiRouter.use('/discovery', discoveryRoutes);
  apiRouter.use('/lineage', discoveryRoutes);

  // API info endpoint
  apiRouter.get('/', (req, res) => {
    res.json({
      message: 'Data Governance API v1',
      status: 'operational',
      routes: {
        health: 'GET /health',
        performance: 'GET /health/performance',
        auth: {
          login: 'POST /auth/login',
          me: 'GET /auth/me (requires auth)',
          logout: 'POST /auth/logout (requires auth)',
          callback: 'POST /auth/callback',
          refresh: 'POST /auth/refresh',
        },
        objects: 'GET|POST /objects (requires auth)',
        lineage: 'GET /lineage/:id/* (requires auth)',
        search: 'GET /search (requires auth)',
        discovery: 'GET /discovery/* (requires auth)',
        admin: 'GET|POST /admin/* (requires auth + admin role)',
        dashboard: 'GET /dashboard/* (requires auth + admin role)',
        reporting: 'GET|POST /reporting/* (export/reporting endpoints)',
        integrations: 'GET|POST|PUT|DELETE /integrations/* (requires auth, admin for mutations)',
        docs: 'GET /docs/library and /docs/library/:key (requires auth)',
        ssis: 'POST /ssis/extract|lineage|catalog|agent-jobs – SSIS metadata ingestion (requires auth)',
        marketplace:
          'GET|POST /marketplace/requests* – access request workflow (requires auth, admin for export/fulfillment)',
        dataProducts:
          'GET|POST /data-products/products* – data product contracts, state transitions, SLA violations (requires auth)',
        glossary: 'GET|POST|PUT /glossary* – business glossary backed by markdown (requires auth)',
        classification:
          'GET /classification/* – taxonomy and asset classifications (requires auth)',
        governance: 'GET /governance/* – governance context and health summaries (requires auth)',
        products:
          'GET|POST|PUT /products* – markdown-backed data products marketplace (requires auth)',
      },
    });
  });

  app.use('/api/v1', apiRouter);

  // Frontend static assets and root page
  app.get('/favicon.ico', (_req, res) => {
    return res.status(204).end();
  });
  app.use((req, res, next) => {
    if (req.path === '/' || req.path.endsWith('.js') || req.path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  });
  app.use(express.static(frontendPath));

  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  // 404 handler
  app.use((req, _res, next) => {
    next(new ApiError(404, `Route ${req.method} ${req.path} not found`, { code: 'NOT_FOUND' }));
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
