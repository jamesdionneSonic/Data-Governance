#!/usr/bin/env node

import axios from 'axios';

const baseUrl = process.env.PERF_BASE_URL || 'http://localhost:3000';
const totalRequests = parseInt(process.env.PERF_REQUESTS || '300', 10);
const concurrency = parseInt(process.env.PERF_CONCURRENCY || '20', 10);
const loginEmail = process.env.PERF_LOGIN_EMAIL || 'perf-tester@example.com';

const targets = [
  { method: 'get', path: '/health', auth: false },
  { method: 'get', path: '/api/v1', auth: false },
  { method: 'get', path: '/health/performance', auth: false },
  { method: 'get', path: '/api/v1/search?q=customer&limit=20&offset=0', auth: true },
  { method: 'get', path: '/api/v1/search/facets', auth: true },
  { method: 'get', path: '/api/v1/discovery/dashboard', auth: true },
  { method: 'get', path: '/api/v1/discovery/graph/sales.customers?format=cytoscape&depth=2', auth: true },
  { method: 'get', path: '/api/v1/reporting/export/catalog.csv', auth: true },
];

function percentile(values, p) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length) - 1;
  const index = Math.max(0, Math.min(rank, sorted.length - 1));
  return Number(sorted[index].toFixed(2));
}

function formatMs(value) {
  return `${value.toFixed(2)}ms`;
}

async function getAuthToken() {
  const response = await axios.post(
    `${baseUrl}/api/v1/auth/login`,
    { email: loginEmail },
    { timeout: 15000 },
  );

  if (!response.data?.token) {
    throw new Error('No auth token returned from login endpoint');
  }

  return response.data.token;
}

async function run() {
  console.log(`\nPerformance load test`);
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Requests: ${totalRequests}`);
  console.log(`Concurrency: ${concurrency}`);

  const token = await getAuthToken();
  const durations = [];
  const failures = [];
  const byRoute = new Map();

  let cursor = 0;

  async function worker() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const index = cursor;
      cursor += 1;

      if (index >= totalRequests) {
        return;
      }

      const target = targets[index % targets.length];
      const routeKey = `${target.method.toUpperCase()} ${target.path}`;
      const start = process.hrtime.bigint();

      try {
        const headers = target.auth
          ? { Authorization: `Bearer ${token}` }
          : undefined;

        await axios({
          method: target.method,
          url: `${baseUrl}${target.path}`,
          headers,
          timeout: 20000,
          validateStatus: () => true,
        });
      } catch (err) {
        failures.push({ route: routeKey, message: err.message });
      } finally {
        const elapsedNs = process.hrtime.bigint() - start;
        const elapsedMs = Number(elapsedNs) / 1e6;

        durations.push(elapsedMs);

        if (!byRoute.has(routeKey)) {
          byRoute.set(routeKey, []);
        }

        byRoute.get(routeKey).push(elapsedMs);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const p50 = percentile(durations, 50);
  const p95 = percentile(durations, 95);
  const p99 = percentile(durations, 99);

  console.log('\nSummary');
  console.log(`- total requests: ${durations.length}`);
  console.log(`- failed requests: ${failures.length}`);
  console.log(`- p50: ${formatMs(p50)}`);
  console.log(`- p95: ${formatMs(p95)}`);
  console.log(`- p99: ${formatMs(p99)}`);

  console.log('\nRoutes');
  for (const [route, values] of byRoute.entries()) {
    const routeP95 = percentile(values, 95);
    const avg = values.reduce((sum, current) => sum + current, 0) / values.length;
    console.log(`- ${route} | calls=${values.length} | avg=${formatMs(avg)} | p95=${formatMs(routeP95)}`);
  }

  const targetSatisfied = p95 < 200;
  console.log(`\nAPI p95 target (<200ms): ${targetSatisfied ? 'PASS' : 'FAIL'}`);

  if (failures.length > 0) {
    const sample = failures.slice(0, 5);
    console.log('\nFailure samples:');
    sample.forEach((failure) => {
      console.log(`- ${failure.route}: ${failure.message}`);
    });
  }

  if (!targetSatisfied) {
    process.exitCode = 1;
  }
}

run().catch((err) => {
  console.error(`Load test failed: ${err.message}`);
  process.exitCode = 1;
});