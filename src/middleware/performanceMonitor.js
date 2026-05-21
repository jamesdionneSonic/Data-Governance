import { recordRequestMetric } from '../services/performanceService.js';

export default function performanceMonitor(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsedNs = process.hrtime.bigint() - start;
    const durationMs = Number(elapsedNs) / 1e6;
    const routePath = req.route?.path ? `${req.baseUrl || ''}${req.route.path}` : req.path;

    recordRequestMetric({
      method: req.method,
      route: routePath,
      statusCode: res.statusCode,
      durationMs,
    });
  });

  next();
}
