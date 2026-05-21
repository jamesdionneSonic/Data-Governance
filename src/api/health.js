import { createApiRouter } from '../utils/apiRouter.js';
import { getPerformanceSummary } from '../services/performanceService.js';

const router = createApiRouter();

/**
 * GET /health
 * Health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

router.get('/performance', (req, res) => {
  res.json({
    status: 'ok',
    metrics: getPerformanceSummary(),
  });
});

export default router;
