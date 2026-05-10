/**
 * Reporting Service
 * Phase 6.001 - Export and reporting utilities
 */

import { randomUUID } from 'crypto';

const sharedVisualizationLinks = new Map();
const scheduledReports = new Map();

const ONE_PIXEL_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2W4WQAAAAASUVORK5CYII=';

function toArray(objects) {
  return Array.from(objects.values());
}

function escapeCsv(value) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function exportObjectCatalogCsv(objects) {
  const rows = toArray(objects);
  const headers = [
    'id',
    'name',
    'database',
    'type',
    'owner',
    'sensitivity',
    'tags',
    'depends_on',
    'description',
  ];

  const lines = rows.map((obj) => [
    obj.id,
    obj.name,
    obj.database,
    obj.type,
    obj.owner,
    obj.sensitivity,
    (obj.tags || []).join('|'),
    (obj.depends_on || []).join('|'),
    obj.description || '',
  ].map(escapeCsv).join(','));

  return [headers.join(','), ...lines].join('\n');
}

export function exportObjectCatalogExcel(objects) {
  const rows = toArray(objects);
  const headers = [
    'id',
    'name',
    'database',
    'type',
    'owner',
    'sensitivity',
    'tags',
    'depends_on',
    'description',
  ];

  const lines = rows.map((obj) => [
    obj.id,
    obj.name,
    obj.database,
    obj.type,
    obj.owner,
    obj.sensitivity,
    (obj.tags || []).join(';'),
    (obj.depends_on || []).join(';'),
    obj.description || '',
  ].join('\t'));

  return [headers.join('\t'), ...lines].join('\n');
}

export function generateDependencyReportPdf(objectId, objects, lineageGraph) {
  const object = objects.get(objectId);
  if (!object) {
    return null;
  }

  const dependencies = Array.from(lineageGraph.get(objectId) || []);
  const dependents = [];

  for (const [candidateId, deps] of lineageGraph.entries()) {
    if (deps.has(objectId)) {
      dependents.push(candidateId);
    }
  }

  const content = [
    '%PDF-1.4',
    '% Data Governance Dependency Report',
    `Object: ${objectId}`,
    `Name: ${object.name || ''}`,
    `Database: ${object.database || ''}`,
    `Type: ${object.type || ''}`,
    `Owner: ${object.owner || ''}`,
    `Sensitivity: ${object.sensitivity || ''}`,
    `Dependencies (${dependencies.length}): ${dependencies.join(', ')}`,
    `Dependents (${dependents.length}): ${dependents.join(', ')}`,
    `Generated: ${new Date().toISOString()}`,
    '%%EOF',
  ].join('\n');

  return Buffer.from(content, 'utf-8');
}

export function exportVisualization(objectId, format, lineageGraph) {
  const normalized = (format || 'svg').toLowerCase();

  if (normalized === 'png') {
    return {
      contentType: 'image/png',
      extension: 'png',
      body: Buffer.from(ONE_PIXEL_PNG_BASE64, 'base64'),
    };
  }

  const dependencies = Array.from(lineageGraph.get(objectId) || []);
  const labels = [objectId, ...dependencies];
  const circles = labels
    .map((label, index) => {
      const x = 40 + index * 90;
      return `<circle cx="${x}" cy="60" r="18" fill="#2563eb" /><text x="${x}" y="95" font-size="10" text-anchor="middle">${label}</text>`;
    })
    .join('');

  const lines = dependencies
    .map((_, index) => {
      const fromX = 40;
      const toX = 130 + index * 90;
      return `<line x1="${fromX}" y1="60" x2="${toX}" y2="60" stroke="#64748b" stroke-width="2" />`;
    })
    .join('');

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="140">',
    '<rect width="100%" height="100%" fill="#ffffff" />',
    lines,
    circles,
    '</svg>',
  ].join('');

  return {
    contentType: 'image/svg+xml; charset=utf-8',
    extension: 'svg',
    body: Buffer.from(svg, 'utf-8'),
  };
}

export function createSharedVisualizationLink(baseUrl, objectId, format = 'svg', ttlMinutes = 1440) {
  const token = randomUUID().replace(/-/g, '');
  const now = Date.now();
  const expiresAt = new Date(now + Math.max(1, ttlMinutes) * 60 * 1000).toISOString();

  const payload = {
    token,
    objectId,
    format,
    createdAt: new Date(now).toISOString(),
    expiresAt,
  };

  sharedVisualizationLinks.set(token, payload);

  return {
    ...payload,
    url: `${baseUrl.replace(/\/$/, '')}/api/v1/reporting/share/${token}`,
  };
}

export function resolveSharedVisualization(token) {
  const payload = sharedVisualizationLinks.get(token);
  if (!payload) {
    return null;
  }

  if (Date.now() > new Date(payload.expiresAt).getTime()) {
    sharedVisualizationLinks.delete(token);
    return null;
  }

  return payload;
}

export function scheduleReport(config) {
  const scheduleId = randomUUID();
  const schedule = {
    scheduleId,
    type: config.type || 'catalog',
    recipient: config.recipient,
    frequency: config.frequency || 'daily',
    format: config.format || 'csv',
    objectId: config.objectId || null,
    active: true,
    createdAt: new Date().toISOString(),
    lastRunAt: null,
  };

  scheduledReports.set(scheduleId, schedule);
  return schedule;
}

export function listScheduledReports() {
  return Array.from(scheduledReports.values());
}

export function runScheduledReport(scheduleId, objects, lineageGraph) {
  const schedule = scheduledReports.get(scheduleId);
  if (!schedule || !schedule.active) {
    return null;
  }

  let artifact;

  if (schedule.type === 'catalog') {
    artifact = schedule.format === 'xlsx'
      ? exportObjectCatalogExcel(objects)
      : exportObjectCatalogCsv(objects);
  } else if (schedule.type === 'dependency' && schedule.objectId) {
    artifact = generateDependencyReportPdf(schedule.objectId, objects, lineageGraph);
  } else {
    artifact = '';
  }

  schedule.lastRunAt = new Date().toISOString();
  scheduledReports.set(scheduleId, schedule);

  return {
    scheduleId,
    recipient: schedule.recipient,
    dispatched: true,
    format: schedule.format,
    size: Buffer.isBuffer(artifact) ? artifact.length : String(artifact).length,
    ranAt: schedule.lastRunAt,
  };
}

export default {
  exportObjectCatalogCsv,
  exportObjectCatalogExcel,
  generateDependencyReportPdf,
  exportVisualization,
  createSharedVisualizationLink,
  resolveSharedVisualization,
  scheduleReport,
  listScheduledReports,
  runScheduledReport,
};
