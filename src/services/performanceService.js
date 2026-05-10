const ROUTE_HISTORY_LIMIT = 500;

const requestMetrics = [];
const routeMetrics = new Map();

function trimHistory(list, limit = ROUTE_HISTORY_LIMIT) {
  if (list.length > limit) {
    list.splice(0, list.length - limit);
  }
}

function percentile(values, target) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil((target / 100) * sorted.length) - 1;
  const index = Math.max(0, Math.min(rank, sorted.length - 1));
  return Number(sorted[index].toFixed(2));
}

export function recordRequestMetric(metric) {
  const normalized = {
    method: metric.method || 'GET',
    route: metric.route || '/',
    statusCode: metric.statusCode || 200,
    durationMs: Number(metric.durationMs || 0),
    timestamp: metric.timestamp || Date.now(),
  };

  requestMetrics.push(normalized);
  trimHistory(requestMetrics);

  const routeKey = `${normalized.method} ${normalized.route}`;
  if (!routeMetrics.has(routeKey)) {
    routeMetrics.set(routeKey, []);
  }

  const history = routeMetrics.get(routeKey);
  history.push(normalized.durationMs);
  trimHistory(history);
}

export function getPerformanceSummary() {
  const durations = requestMetrics.map((entry) => entry.durationMs);
  const totalRequests = requestMetrics.length;

  const routes = Array.from(routeMetrics.entries())
    .map(([routeKey, routeDurations]) => {
      const totalDuration = routeDurations.reduce((sum, value) => sum + value, 0);
      const averageMs = routeDurations.length > 0
        ? Number((totalDuration / routeDurations.length).toFixed(2))
        : 0;

      return {
        route: routeKey,
        requests: routeDurations.length,
        avgMs: averageMs,
        p95Ms: percentile(routeDurations, 95),
      };
    })
    .sort((a, b) => b.p95Ms - a.p95Ms)
    .slice(0, 10);

  return {
    totalRequests,
    p50Ms: percentile(durations, 50),
    p95Ms: percentile(durations, 95),
    p99Ms: percentile(durations, 99),
    routes,
    sampledAt: new Date().toISOString(),
  };
}

export function resetPerformanceMetrics() {
  requestMetrics.length = 0;
  routeMetrics.clear();
}

export default {
  recordRequestMetric,
  getPerformanceSummary,
  resetPerformanceMetrics,
};
