/**
 * Reporting API Routes
 * Phase 6.001 - Export and reporting
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  exportObjectCatalogCsv,
  exportObjectCatalogExcel,
  generateDependencyReportPdf,
  exportVisualization,
  createSharedVisualizationLink,
  resolveSharedVisualization,
  scheduleReport,
  listScheduledReports,
  runScheduledReport,
} from '../services/reportingService.js';
import { createTtlCache } from '../utils/ttlCache.js';

const router = createApiRouter();
let cachedObjects = new Map();
let cachedLineageGraph = new Map();
const responseCache = createTtlCache({ ttlMs: 60000, maxSize: 200 });

function getOrSetCache(key, buildValue) {
  const cached = responseCache.get(key);
  if (cached) {
    return cached;
  }

  const value = buildValue();
  responseCache.set(key, value);
  return value;
}

export function setReportingCache(objects, lineageGraph) {
  cachedObjects = objects;
  cachedLineageGraph = lineageGraph;
  responseCache.clear();
}

router.get('/share/:token', (req, res) => {
  const payload = resolveSharedVisualization(req.params.token);

  if (!payload) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Shared link is invalid or expired',
    });
  }

  const exported = getOrSetCache(
    `shared:${payload.objectId}:${payload.format}`,
    () => exportVisualization(payload.objectId, payload.format, cachedLineageGraph),
  );
  return res.type(exported.contentType).send(exported.body);
});

router.use(authenticate);

router.get('/export/catalog.csv', requireAdmin, (req, res) => {
  const csv = getOrSetCache('catalog:csv', () => exportObjectCatalogCsv(cachedObjects));
  const fileName = `object-catalog-${new Date().toISOString().slice(0, 10)}.csv`;

  return res
    .set('Content-Type', 'text/csv; charset=utf-8')
    .set('Content-Disposition', `attachment; filename="${fileName}"`)
    .send(csv);
});

router.get('/export/catalog.xlsx', requireAdmin, (req, res) => {
  const excel = getOrSetCache('catalog:xlsx', () => exportObjectCatalogExcel(cachedObjects));
  const fileName = `object-catalog-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return res
    .set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    .set('Content-Disposition', `attachment; filename="${fileName}"`)
    .send(excel);
});

router.get('/export/dependency/:objectId.pdf', requireAdmin, (req, res) => {
  const pdf = getOrSetCache(
    `dependency:${req.params.objectId}`,
    () => generateDependencyReportPdf(req.params.objectId, cachedObjects, cachedLineageGraph),
  );

  if (!pdf) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Object not found',
    });
  }

  const fileName = `dependency-report-${req.params.objectId}.pdf`;
  return res
    .set('Content-Type', 'application/pdf')
    .set('Content-Disposition', `attachment; filename="${fileName}"`)
    .send(pdf);
});

router.get('/export/visualization/:objectId', requireAdmin, (req, res) => {
  const { format = 'svg' } = req.query;
  const exported = getOrSetCache(
    `visualization:${req.params.objectId}:${String(format).toLowerCase()}`,
    () => exportVisualization(req.params.objectId, format, cachedLineageGraph),
  );

  const { extension } = exported;
  const fileName = `visualization-${req.params.objectId}.${extension}`;

  return res
    .set('Content-Type', exported.contentType)
    .set('Content-Disposition', `attachment; filename="${fileName}"`)
    .send(exported.body);
});

router.post('/share/visualization/:objectId', requireAdmin, (req, res) => {
  const { format = 'svg', ttlMinutes = 1440 } = req.body;
  const baseUrl = req.body.baseUrl || `${req.protocol}://${req.get('host')}`;

  const link = createSharedVisualizationLink(
    baseUrl,
    req.params.objectId,
    format,
    parseInt(ttlMinutes, 10),
  );

  return res.status(201).json({
    status: 'success',
    message: 'Shared link created',
    data: link,
  });
});

router.post('/schedules', requireAdmin, (req, res) => {
  const { recipient } = req.body;
  if (!recipient) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'recipient is required',
    });
  }

  const schedule = scheduleReport(req.body);

  return res.status(201).json({
    status: 'success',
    message: 'Report schedule created',
    data: schedule,
  });
});

router.get('/schedules', requireAdmin, (req, res) => {
  const schedules = listScheduledReports();
  return res.json({
    status: 'success',
    data: {
      schedules,
      count: schedules.length,
    },
  });
});

router.post('/schedules/:scheduleId/run', requireAdmin, (req, res) => {
  const result = runScheduledReport(req.params.scheduleId, cachedObjects, cachedLineageGraph);

  if (!result) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Schedule not found or inactive',
    });
  }

  return res.json({
    status: 'success',
    message: 'Scheduled report executed',
    data: result,
  });
});

export default router;
