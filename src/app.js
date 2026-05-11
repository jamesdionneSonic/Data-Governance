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
import objectsRoutes, { setObjectsCache } from './api/objects.js';
import lineageRoutes from './api/lineage.js';
import searchRoutes, { setSearchCache } from './api/search.js';
import adminRoutes, { setAdminCache } from './api/admin.js';
import dashboardRoutes, { setDashboardCache } from './api/dashboard.js';
import reportingRoutes, { setReportingCache } from './api/reporting.js';
import ingestionRoutes from './api/ingestion.js';
import discoveryRoutes, { setDiscoveryCache } from './api/discovery.js';
import integrationsRoutes, { setIntegrationCache } from './api/integrations.js';
import docsRoutes from './api/docs.js';
import ssisRoutes from './api/ssis.js';
import marketplaceRoutes, { setMarketplaceCache } from './api/marketplace.js';
import dataProductsRoutes from './api/dataProducts.js';
import glossaryRoutes from './api/glossary.js';
import classificationRoutes, { setClassificationCache } from './api/classification.js';
import governanceRoutes, { setGovernanceCache } from './api/governance.js';
import productsRoutes from './api/products.js';

// Import utilities and config
import { validateEntraConfig } from './utils/entraConfig.js';

/**
 * Initialize caches with loaded data
 * Called by index.js after loading markdown
 * @param {express.Application} app - Express app instance
 * @param {Map} objects - Object metadata map
 * @param {Map} lineageGraph - Lineage graph
 */
export function initializeCache(app, objects, lineageGraph) {
  setObjectsCache(objects);
  setSearchCache(objects);
  setDiscoveryCache(objects, lineageGraph);
  setAdminCache(objects);
  setDashboardCache(objects);
  setReportingCache(objects, lineageGraph);
  setIntegrationCache(objects, lineageGraph);
  setMarketplaceCache(objects);
  setClassificationCache(objects);
  setGovernanceCache(objects, lineageGraph);
}

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
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
  apiRouter.use('/lineage', lineageRoutes);
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
