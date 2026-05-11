/**
 * Phase 6 Tests - Reporting & Export
 */

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
} from '../../src/services/reportingService.js';

const objects = new Map();
objects.set('sales.customers', {
  id: 'sales.customers',
  name: 'customers',
  database: 'sales',
  type: 'table',
  owner: 'data-team',
  sensitivity: 'PII',
  tags: ['master-data'],
  depends_on: ['sales.regions'],
  description: 'Customer data',
});
objects.set('sales.orders', {
  id: 'sales.orders',
  name: 'orders',
  database: 'sales',
  type: 'table',
  owner: 'analytics',
  sensitivity: 'internal',
  tags: ['transactions'],
  depends_on: [],
  description: 'Order data',
});

const lineageGraph = new Map();
lineageGraph.set('sales.customers', new Set(['sales.regions']));
lineageGraph.set('sales.orders', new Set(['sales.customers']));
lineageGraph.set('sales.regions', new Set());

describe('Phase 6 - Reporting Service', () => {
  test('REP-001: Exports object catalog as CSV', () => {
    const csv = exportObjectCatalogCsv(objects);

    expect(csv).toContain('id,name,database,type,owner,sensitivity,tags,depends_on,description');
    expect(csv).toContain('sales.customers');
    expect(csv).toContain('sales.orders');
  });

  test('REP-002: Exports object catalog as Excel-compatible text', () => {
    const excel = exportObjectCatalogExcel(objects);

    expect(
      excel.startsWith(
        'id\tname\tdatabase\ttype\towner\tsensitivity\ttags\tdepends_on\tdescription'
      )
    ).toBe(true);
    expect(excel).toContain('sales.customers');
    expect(excel).toContain('sales.orders');
  });

  test('REP-003: Generates dependency report PDF bytes', () => {
    const pdf = generateDependencyReportPdf('sales.customers', objects, lineageGraph);

    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.toString('utf-8')).toContain('%PDF-1.4');
    expect(pdf.toString('utf-8')).toContain('Object: sales.customers');
  });

  test('REP-004: Returns null PDF when object is missing', () => {
    const pdf = generateDependencyReportPdf('missing.object', objects, lineageGraph);
    expect(pdf).toBeNull();
  });

  test('REP-005: Exports visualization as SVG', () => {
    const svg = exportVisualization('sales.customers', 'svg', lineageGraph);

    expect(svg.contentType).toContain('image/svg+xml');
    expect(svg.extension).toBe('svg');
    expect(svg.body.toString('utf-8')).toContain('<svg');
  });

  test('REP-006: Exports visualization as PNG', () => {
    const png = exportVisualization('sales.customers', 'png', lineageGraph);

    expect(png.contentType).toBe('image/png');
    expect(png.extension).toBe('png');
    expect(Buffer.isBuffer(png.body)).toBe(true);
    expect(png.body.length).toBeGreaterThan(0);
  });

  test('REP-007: Creates shareable visualization link', () => {
    const link = createSharedVisualizationLink(
      'http://localhost:3000',
      'sales.customers',
      'svg',
      60
    );

    expect(link.token).toBeDefined();
    expect(link.url).toContain('/api/v1/reporting/share/');
    expect(link.objectId).toBe('sales.customers');
  });

  test('REP-008: Resolves valid shared visualization token', () => {
    const link = createSharedVisualizationLink('http://localhost:3000', 'sales.orders', 'svg', 60);

    const payload = resolveSharedVisualization(link.token);
    expect(payload).toBeDefined();
    expect(payload.objectId).toBe('sales.orders');
  });

  test('REP-009: Returns null for invalid shared token', () => {
    const payload = resolveSharedVisualization('missing-token');
    expect(payload).toBeNull();
  });

  test('REP-010: Schedules and lists report jobs', () => {
    const created = scheduleReport({
      type: 'catalog',
      recipient: 'ops@example.com',
      frequency: 'daily',
      format: 'csv',
    });

    const schedules = listScheduledReports();

    expect(created.scheduleId).toBeDefined();
    expect(schedules.some((s) => s.scheduleId === created.scheduleId)).toBe(true);
  });

  test('REP-011: Runs scheduled catalog report', () => {
    const created = scheduleReport({
      type: 'catalog',
      recipient: 'ops2@example.com',
      frequency: 'daily',
      format: 'csv',
    });

    const result = runScheduledReport(created.scheduleId, objects, lineageGraph);

    expect(result).toBeDefined();
    expect(result.dispatched).toBe(true);
    expect(result.size).toBeGreaterThan(0);
  });

  test('REP-012: Runs scheduled dependency report', () => {
    const created = scheduleReport({
      type: 'dependency',
      recipient: 'owner@example.com',
      frequency: 'weekly',
      format: 'pdf',
      objectId: 'sales.customers',
    });

    const result = runScheduledReport(created.scheduleId, objects, lineageGraph);

    expect(result).toBeDefined();
    expect(result.dispatched).toBe(true);
    expect(result.size).toBeGreaterThan(0);
  });

  test('REP-013: Returns null when running unknown schedule', () => {
    const result = runScheduledReport('unknown-schedule', objects, lineageGraph);
    expect(result).toBeNull();
  });
});
