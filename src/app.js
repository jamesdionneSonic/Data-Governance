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
import lineageRoutes from './api/lineage.js';
import searchRoutes from './api/search.js';
import adminRoutes, { setAdminCache } from './api/admin.js';
import dashboardRoutes, { setDashboardCache } from './api/dashboard.js';
import reportingRoutes, { setReportingCache } from './api/reporting.js';
import ingestionRoutes from './api/ingestion.js';
import discoveryRoutes, { setDiscoveryCache } from './api/discovery.js';
import integrationsRoutes, { setIntegrationCache } from './api/integrations.js';
import docsRoutes from './api/docs.js';

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
  setDiscoveryCache(objects, lineageGraph);
  setAdminCache(objects);
  setDashboardCache(objects);
  setReportingCache(objects, lineageGraph);
  setIntegrationCache(objects, lineageGraph);
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
  app.use(helmet());
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
