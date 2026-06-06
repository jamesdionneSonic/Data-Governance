/**
 * SSIS Metadata Ingestion API
 * ─────────────────────────────────────────────────────────────────────────────
 * Endpoints for connecting to a SQL Server instance and extracting all
 * available SSIS metadata to populate the data-lineage graph.
 *
 * POST /api/v1/ssis/extract       – Full extraction (returns JSON result)
 * POST /api/v1/ssis/lineage       – Extract and return lineage edges only
 * POST /api/v1/ssis/catalog       – Catalog inventory only (fast)
 * POST /api/v1/ssis/agent-jobs    – SQL Agent SSIS jobs only
 * GET  /api/v1/ssis/schema        – Request body schema documentation
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { loadRuntimeCatalog } from '../services/catalogRuntimeService.js';
import { initializeCache } from '../utils/cacheInitializer.js';
import { runConnectorExtractionForConfig } from '../services/connectorService.js';

const router = createApiRouter();

// ─────────────────────────────────────────────────────────────────────────────
// Connection config builder
// ─────────────────────────────────────────────────────────────────────────────

async function buildConnectionConfig(payload) {
  const {
    server,
    port = 1433,
    database = 'master', // SSIS queries switch to SSISDB internally; master is fine as initial db
    username,
    password,
    domain,
    authentication = 'sql-server',
    encrypt = true,
    trustServerCertificate = false,
  } = payload;

  if (!server) {
    return {
      error: {
        status: 400,
        body: { error: 'Bad Request', message: 'server is required' },
      },
    };
  }

  const connConfig = {
    server,
    port: Number(port) || 1433,
    database,
    options: {
      encrypt: encrypt === true || encrypt === 'true',
      trustServerCertificate: trustServerCertificate === true || trustServerCertificate === 'true',
      enableArithAbort: true,
    },
    pool: { max: 5, min: 0, idleTimeoutMillis: 30000 },
    connectionTimeout: 20000,
    requestTimeout: 600000, // 10 min – SSIS XML can be large
  };

  let sqlDriver;
  try {
    const mssqlModule = await import('mssql');
    sqlDriver = mssqlModule.default;
  } catch (_err) {
    return {
      error: {
        status: 500,
        body: {
          error: 'Driver Missing',
          message: 'mssql npm package is not installed. Run: npm install mssql',
        },
      },
    };
  }

  if (authentication === 'sql-server') {
    if (!username || !password) {
      return {
        error: {
          status: 400,
          body: {
            error: 'Bad Request',
            message: 'username and password are required for sql-server authentication',
          },
        },
      };
    }
    connConfig.authentication = {
      type: 'default',
      options: { userName: username, password },
    };
  } else if (authentication === 'windows') {
    if (!username && !password) {
      try {
        let nativeModule;
        try {
          nativeModule = await import('mssql/msnodesqlv8.js');
        } catch (_driverLoadErr) {
          throw new Error(
            'Windows integrated auth requires msnodesqlv8 on a Windows host. Use SQL auth or NTLM in Linux/Docker.'
          );
        }
        sqlDriver = nativeModule.default;
        connConfig.options.trustedConnection = true;
        connConfig.driver = 'msnodesqlv8';
        connConfig.connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${server};Database=${database};Trusted_Connection=Yes;`;
        delete connConfig.authentication;
        delete connConfig.port;
      } catch (_driverErr) {
        return {
          error: {
            status: 400,
            body: {
              error: 'Bad Request',
              message:
                'Windows integrated auth requires msnodesqlv8 on a Windows host. Provide username/password for NTLM instead.',
            },
          },
        };
      }
    } else {
      if (!username || !password) {
        return {
          error: {
            status: 400,
            body: {
              error: 'Bad Request',
              message:
                'For NTLM Windows auth provide both username and password, or leave both blank for integrated.',
            },
          },
        };
      }
      let resolvedDomain = domain || '';
      let resolvedUsername = username;
      if (!resolvedDomain && String(username).includes('\\')) {
        const [pd, pu] = String(username).split('\\');
        if (pd && pu) {
          resolvedDomain = pd;
          resolvedUsername = pu;
        }
      }
      connConfig.authentication = {
        type: 'ntlm',
        options: { userName: resolvedUsername, password, domain: resolvedDomain },
      };
    }
  } else if (authentication === 'azure-active-directory-service-principal-secret') {
    const { clientId, clientSecret, tenantId } = payload;
    if (!clientId || !clientSecret || !tenantId) {
      return {
        error: {
          status: 400,
          body: {
            error: 'Bad Request',
            message: 'clientId, clientSecret, and tenantId are required for service-principal auth',
          },
        },
      };
    }
    connConfig.authentication = {
      type: 'azure-active-directory-service-principal-secret',
      options: { clientId, clientSecret, tenantId },
    };
  } else if (authentication === 'azure-active-directory-msi-app-service') {
    connConfig.authentication = { type: 'azure-active-directory-msi-app-service', options: {} };
  } else {
    return {
      error: {
        status: 400,
        body: {
          error: 'Bad Request',
          message: `Unsupported authentication type: ${authentication}. Supported: sql-server, windows, azure-active-directory-service-principal-secret, azure-active-directory-msi-app-service`,
        },
      },
    };
  }

  return { connConfig, sqlDriver };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function summariseResult(result) {
  return {
    extractedAt: result.extractedAt,
    ssisdbPresent: result.ssisdbPresent,
    counts: {
      packages: result.catalog?.length || 0,
      parameters: result.parameters?.length || 0,
      executables: result.executables?.length || 0,
      xmlPackagesParsed: result.xmlMetadata?.length || 0,
      agentJobs: result.agentJobs?.jobs?.length || 0,
      ssisAgentSteps: result.agentJobs?.ssisSteps?.length || 0,
      lineageEdges: result.lineageEdges?.length || 0,
    },
    warningCount: result.warnings?.length || 0,
    warnings: result.warnings || [],
  };
}

function sanitizePathSegment(value) {
  const input = String(value || '');
  const withoutControlChars = Array.from(input)
    .filter((char) => char.charCodeAt(0) >= 32)
    .join('');

  return withoutControlChars
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 128);
}

function toYamlArray(values = []) {
  if (!Array.isArray(values) || values.length === 0) {
    return '[]';
  }
  const quoted = values.map((item) => `'${String(item).replace(/'/g, "''")}'`);
  return `[${quoted.join(', ')}]`;
}

function normalizeSsisReference(value) {
  const cleaned = String(value || '')
    .trim()
    .replace(/\[|\]/g, '')
    .replace(/^dbo\./i, '')
    .replace(/^SSIS\//i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return '';

  const parts = cleaned.split('.').filter(Boolean);
  if (parts[0] && /^unknown_db$/i.test(parts[0])) {
    return parts.slice(1).join('.') || parts[parts.length - 1] || cleaned;
  }

  return cleaned;
}

function cleanSsisSegment(value) {
  return String(value || '')
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/^'+|'+$/g, '')
    .replace(/\[|\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalizeServerName(value) {
  const text = cleanSsisSegment(value)
    .replace(/^tcp:/i, '')
    .replace(/^np:/i, '')
    .replace(/^lpc:/i, '')
    .trim();

  if (!text) return 'unknown_server';

  const [hostName] = text.split('\\');
  return String(hostName || text).trim();
}

function parseConnectionStringServer(connectionString = '') {
  const match = String(connectionString).match(/(?:Data Source|Server)\s*=\s*([^;"]+)/i);
  return match ? match[1].trim() : '';
}

function extractServerNameFromConfig(config = {}) {
  return canonicalizeServerName(
    config.server ||
      config.serverName ||
      config.dataSource ||
      parseConnectionStringServer(config.connectionString) ||
      'unknown_server'
  );
}

function buildCanonicalPackageId(serverName, folderName, projectName, packageName) {
  return [
    cleanSsisSegment(serverName),
    'SSISDB',
    cleanSsisSegment(folderName),
    cleanSsisSegment(projectName),
    cleanSsisSegment(packageName),
  ]
    .filter(Boolean)
    .join('.');
}

function collectResolvedReferences(packageEdges, predicate, mapper) {
  return [
    ...new Set(
      packageEdges
        .filter(predicate)
        .map(mapper)
        .map(normalizeSsisReference)
        .filter(Boolean)
        .filter((item) => item !== 'UNKNOWN')
    ),
  ];
}

function buildSsisPackageMarkdown(result, packageRow, serverName) {
  const folder = packageRow.folder_name || 'unknown_folder';
  const project = packageRow.project_name || 'unknown_project';
  const pkg = packageRow.package_name || 'unknown_package';
  const objectName = `${folder}.${project}.${pkg}`;
  const packageId = buildCanonicalPackageId(serverName, folder, project, pkg);
  const packageKeys = new Set(
    [pkg, objectName, packageId, `${project}.${pkg}`, `${folder}.${project}.${pkg}`]
      .map((value) => String(value || '').toLowerCase())
      .filter(Boolean)
  );
  const packageEdges = (result.lineageEdges || []).filter((edge) => {
    const edgeKeys = [
      edge.packageName,
      edge.from,
      edge.packageId,
      edge.packagePath,
      edge.objectName,
    ].map((value) => String(value || '').toLowerCase());
    return edgeKeys.some((key) => packageKeys.has(key));
  });
  
  // Separate Data Flow Sources (Upstream)
  const upstream = collectResolvedReferences(
    packageEdges,
    (edge) =>
      edge.edgeType === 'READS_FROM' ||
      edge.edgeType === 'LOOKUP' ||
      edge.edgeType === 'USES_LOOKUP' ||
      edge.edgeType === 'EXTRACTS',
    (edge) => edge.to
  );

  // Map Stored Procedure Calls from Control Flow
  const calls = collectResolvedReferences(
    packageEdges,
    (edge) => edge.edgeType === 'CALLS',
    (edge) => edge.to
  );

  // Map Data Flow Targets + Direct SQL Writes from Control Flow
  const writesTo = collectResolvedReferences(
    packageEdges,
    (edge) => edge.edgeType === 'WRITES_TO',
    (edge) => edge.to
  );

  const warnings = (result.warnings || []).slice(0, 15);

return `---
id: ${packageId}
name: ${objectName}
server: ${serverName}
folder_name: ${folder}
project_name: ${project}
package_name: ${pkg}
package_path: ${folder}.${project}.${pkg}
database: ssisdb
type: package
owner: ssis-platform
sensitivity: internal
tags: ['ssis', 'catalog', 'lineage']
depends_on: ${toYamlArray(upstream)}
reads_from: ${toYamlArray(upstream)}
writes_to: ${toYamlArray(writesTo)}
calls: ${toYamlArray(calls)}
lineage_quality:
  validated_edges: ${packageEdges.filter((edge) => edge.validation_status === 'validated').length}
  probable_edges: ${packageEdges.filter((edge) => edge.validation_status === 'probable').length}
  unresolved_facts: ${packageEdges.filter((edge) => edge.validation_status === 'unresolved' || edge.edgeType === 'UNRESOLVED_DYNAMIC_EDGE').length}
description: SSIS package metadata extracted from folder ${folder}, project ${project}, package ${pkg}.
---

# SSIS Package ${objectName}

## Identity
- Folder: ${folder}
- Project: ${project}
- Package: ${pkg}
- Entry Point: ${packageRow.entry_point ? 'Yes' : 'No'}

## Runtime Summary
- Detected lineage edges: ${packageEdges.length}
- Upstream entities: ${upstream.length}
- SPs Called: ${calls.length}
- Target entities: ${writesTo.length}
- Last validation: ${packageRow.package_last_validation || 'n/a'}

## Extraction Notes
${warnings.length > 0 ? warnings.map((warning) => `- ${warning}`).join('\n') : '- No extraction warnings recorded.'}
`;
}

function buildSsisLineageMarkdown(result, serverName) {
  const edges = result.lineageEdges || [];
  const topEdges = edges.slice(0, 500);
  const lines = topEdges.map(
    (edge) =>
      `- ${edge.from || 'UNKNOWN'} -> ${edge.to || 'UNKNOWN'} (type=${edge.edgeType || 'ETL'}, confidence=${edge.confidence ?? 'n/a'}, via=${edge.via || 'n/a'})`
  );
  return `---
name: ssis_catalog_lineage
server: ${serverName}
database: ssisdb
type: dataset
owner: ssis-platform
sensitivity: internal
tags: ['ssis', 'lineage', 'operational']
depends_on: []
description: Consolidated SSIS lineage edges and execution context exported from SSISDB.
---

# SSIS Catalog Lineage Summary

## Overview
- Extracted At: ${result.extractedAt}
- SSISDB Present: ${result.ssisdbPresent ? 'Yes' : 'No'}
- Total Edges: ${edges.length}
- Agent Jobs: ${(result.agentJobs?.jobs || []).length}

## Top Lineage Edges
${lines.length ? lines.join('\n') : '- No edges generated.'}
`;
}

function persistSsisMarkdown(result, outputPath) {
  // FIX: Output directly to the live production folder alongside SQL Server tables
  const defaultBasePath = './data/markdown';
  const baseOutputPath = resolve(process.cwd(), outputPath || defaultBasePath);
  const serverName = extractServerNameFromConfig(result.connectionConfig || {});
  
  // Group by server so package IDs cannot collide across SSIS hosts.
  const serverDir = join(baseOutputPath, 'servers', sanitizePathSegment(serverName));
  const packageDir = join(serverDir, 'ssis_packages');
  const summaryDir = join(serverDir, 'ssis_summaries');
  
  mkdirSync(packageDir, { recursive: true });
  mkdirSync(summaryDir, { recursive: true });

  let filesWritten = 0;
  const packageRows = result.catalog || [];
  packageRows.forEach((packageRow) => {
    const folder = sanitizePathSegment(packageRow.folder_name || 'folder');
    const project = sanitizePathSegment(packageRow.project_name || 'project');
    const pkg = sanitizePathSegment(packageRow.package_name || 'package');
    const folderPath = join(packageDir, folder, project);
    mkdirSync(folderPath, { recursive: true });
    const filePath = join(folderPath, `${pkg}.md`);
    writeFileSync(filePath, buildSsisPackageMarkdown(result, packageRow, serverName), 'utf-8');
    filesWritten += 1;
  });

  writeFileSync(
    join(summaryDir, 'ssis_catalog_lineage.md'),
    buildSsisLineageMarkdown(result, serverName),
    'utf-8'
  );
  filesWritten += 1;

  return {
    baseOutputPath,
    filesWritten,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema documentation endpoint (no auth required – informational)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/schema', (_req, res) => {
  res.json({
    description: 'SSIS Metadata Extraction – Request Body Schema',
    endpoints: {
      'POST /api/v1/ssis/extract': 'Full extraction (all sections)',
      'POST /api/v1/ssis/lineage': 'Lineage edges only',
      'POST /api/v1/ssis/catalog': 'Catalog inventory only (packages + projects)',
      'POST /api/v1/ssis/agent-jobs': 'SQL Agent SSIS-related jobs only',
    },
    requestBody: {
      server: { type: 'string', required: true, description: 'SQL Server hostname or IP' },
      port: { type: 'number', required: false, default: 1433 },
      database: {
        type: 'string',
        required: false,
        default: 'master',
        description: 'Initial database; SSIS queries switch to SSISDB internally',
      },
      authentication: {
        type: 'string',
        required: false,
        default: 'sql-server',
        enum: [
          'sql-server',
          'windows',
          'azure-active-directory-service-principal-secret',
          'azure-active-directory-msi-app-service',
        ],
      },
      username: { type: 'string', required: 'for sql-server and windows NTLM authentication' },
      password: { type: 'string', required: 'for sql-server and windows NTLM authentication' },
      domain: {
        type: 'string',
        required: false,
        description: 'Windows domain for NTLM; also accepted as DOMAIN\\user in username',
      },
      clientId: { type: 'string', required: 'for service-principal auth' },
      clientSecret: { type: 'string', required: 'for service-principal auth' },
      tenantId: { type: 'string', required: 'for service-principal auth' },
      encrypt: { type: 'boolean', required: false, default: true },
      trustServerCertificate: { type: 'boolean', required: false, default: false },
      options: {
        type: 'object',
        description: 'Extraction options (only used by /extract and /lineage)',
        properties: {
          extractXml: {
            type: 'boolean',
            default: true,
            description: 'Parse package XML to derive connection manager and data-flow lineage',
          },
          generateMarkdownOutput: {
            type: 'boolean',
            default: true,
            description:
              'Write extracted SSIS metadata to markdown files for repository validation and index load',
          },
          markdownOutputPath: {
            type: 'string',
            default: './docs/generated/ssis',
            description: 'Output path for generated SSIS markdown files',
          },
        },
      },
    },
    notes: [
      'All sections are extracted with graceful failure – if a section is inaccessible (permission, feature not installed) it returns empty and adds a warning.',
      'Sensitive environment variables and parameters are automatically masked.',
      'Package XML parsing requires VIEW DEFINITION permission on the SSISDB catalog.',
      'SQL Agent extraction requires VIEW DATABASE STATE on msdb.',
    ],
    minimumSqlPermissions: [
      'CONNECT to the target SQL Server',
      'VIEW DATABASE STATE (SSISDB) – for catalog views',
      'READ on catalog.* (SSISDB) – for all catalog sections',
      'VIEW DEFINITION on SSISDB – for package XML in object_versions',
      'VIEW DATABASE STATE (msdb) – for Agent job history',
      'SELECT on msdb.dbo.sysjobs, sysjobsteps',
    ],
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/ssis/extract  –  Full extraction
// ─────────────────────────────────────────────────────────────────────────────

router.post('/extract', authenticate, requireAdmin, async (req, res) => {
  const built = await buildConnectionConfig(req.body);
  if (built.error) {
    return sendErrorResponse(res, req, built.error.status, built.error.body.message, {
      code: 'BAD_REQUEST',
    });
  }

  const { connConfig, sqlDriver } = built;
  const opts = req.body.options || {};

  let result;
  let connectorExtraction;
  try {
    connectorExtraction = await runConnectorExtractionForConfig({
      id: `legacy-ssis-${req.body.server || 'server'}`,
      type: 'ssis',
      label: `Legacy SSIS extraction - ${req.body.server || 'server'}`,
      config: {
        server: req.body.server,
        connectionConfig: connConfig,
        sqlDriver,
      },
      credential: {
        mode: req.body.authentication === 'windows' ? 'windows_integrated' : 'service_account',
        secret_ref: 'legacy-request-body',
      },
      options: {
        dry_run: false,
        include_metadata: true,
        fail_fast: false,
        extractXml: opts.extractXml !== false,
      },
    });
    if (connectorExtraction.status === 'failed' || !connectorExtraction.metadata) {
      const firstError = connectorExtraction.errors?.[0];
      throw new Error(firstError?.message || 'SSIS connector extraction failed before metadata was returned.');
    }
    result = connectorExtraction.metadata;
    result.connectionConfig = connConfig;
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SSIS_EXTRACTION_FAILED',
      details:
        'Check server connectivity and permissions. See GET /api/v1/ssis/schema for required permissions.',
    });
  }

  let markdownOutput = null;
  if (opts.generateMarkdownOutput !== false) {
    markdownOutput = persistSsisMarkdown(result, opts.markdownOutputPath);
    const runtimeCatalog = await loadRuntimeCatalog(markdownOutput.baseOutputPath, { rebuild: true });
    initializeCache(runtimeCatalog.objects, runtimeCatalog.lineageGraph, runtimeCatalog);
  }

  return res.json({
    summary: summariseResult(result),
    data: result,
    connectorExtraction: {
      status: connectorExtraction?.status,
      adapter: connectorExtraction?.adapter,
      summary: connectorExtraction?.summary,
      streamResults: connectorExtraction?.stream_results,
      errors: connectorExtraction?.errors,
    },
    markdownOutputPath: markdownOutput?.baseOutputPath || null,
    markdownFilesWritten: markdownOutput?.filesWritten || 0,
    debugDumpXmlRequested: true,
    debugDumpXmlNote: 'Raw XML dump is always enabled for SSIS extraction.',
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/ssis/lineage  –  Lineage edges only (lighter payload)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/lineage', authenticate, async (req, res) => {
  const built = await buildConnectionConfig(req.body);
  if (built.error) {
    return sendErrorResponse(res, req, built.error.status, built.error.body.message, {
      code: 'BAD_REQUEST',
    });
  }

  const { connConfig, sqlDriver } = built;
  const opts = req.body.options || {};

  let result;
  try {
    const connectorExtraction = await runConnectorExtractionForConfig({
      id: `legacy-ssis-lineage-${req.body.server || 'server'}`,
      type: 'ssis',
      label: `Legacy SSIS lineage - ${req.body.server || 'server'}`,
      config: {
        server: req.body.server,
        connectionConfig: connConfig,
        sqlDriver,
      },
      credential: {
        mode: req.body.authentication === 'windows' ? 'windows_integrated' : 'service_account',
        secret_ref: 'legacy-request-body',
      },
      options: {
        dry_run: false,
        include_metadata: true,
        fail_fast: false,
        extractXml: opts.extractXml !== false,
        streams: ['lineage'],
      },
    });
    if (connectorExtraction.status === 'failed' || !connectorExtraction.metadata) {
      const firstError = connectorExtraction.errors?.[0];
      throw new Error(firstError?.message || 'SSIS connector lineage extraction failed before metadata was returned.');
    }
    result = connectorExtraction.metadata;
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SSIS_LINEAGE_EXTRACTION_FAILED',
    });
  }

  return res.json({
    extractedAt: result.extractedAt,
    ssisdbPresent: result.ssisdbPresent,
    edgeCount: result.lineageEdges.length,
    edges: result.lineageEdges,
    warnings: result.warnings,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/ssis/catalog  –  Inventory only (fastest)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/catalog', authenticate, async (req, res) => {
  const built = await buildConnectionConfig(req.body);
  if (built.error) {
    return sendErrorResponse(res, req, built.error.status, built.error.body.message, {
      code: 'BAD_REQUEST',
    });
  }

  const { connConfig, sqlDriver } = built;
  let result;

  try {
    const connectorExtraction = await runConnectorExtractionForConfig({
      id: `legacy-ssis-catalog-${req.body.server || 'server'}`,
      type: 'ssis',
      label: `Legacy SSIS catalog - ${req.body.server || 'server'}`,
      config: {
        server: req.body.server,
        connectionConfig: connConfig,
        sqlDriver,
      },
      credential: {
        mode: req.body.authentication === 'windows' ? 'windows_integrated' : 'service_account',
        secret_ref: 'legacy-request-body',
      },
      options: {
        dry_run: false,
        include_metadata: true,
        fail_fast: false,
        extractXml: false,
        streams: ['catalog', 'parameters'],
      },
    });
    if (connectorExtraction.status === 'failed' || !connectorExtraction.metadata) {
      const firstError = connectorExtraction.errors?.[0];
      throw new Error(firstError?.message || 'SSIS connector catalog extraction failed before metadata was returned.');
    }
    result = connectorExtraction.metadata;
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SSIS_CATALOG_EXTRACTION_FAILED',
    });
  }

  return res.json({
    extractedAt: result.extractedAt,
    ssisdbPresent: result.ssisdbPresent,
    packageCount: result.catalog.length,
    catalog: result.catalog,
    parameters: result.parameters,
    warnings: result.warnings,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/ssis/agent-jobs  –  SQL Agent SSIS jobs only
// ─────────────────────────────────────────────────────────────────────────────

router.post('/agent-jobs', authenticate, async (req, res) => {
  const built = await buildConnectionConfig(req.body);
  if (built.error) {
    return sendErrorResponse(res, req, built.error.status, built.error.body.message, {
      code: 'BAD_REQUEST',
    });
  }

  const { connConfig, sqlDriver } = built;
  let result;
  try {
    const connectorExtraction = await runConnectorExtractionForConfig({
      id: `legacy-ssis-agent-${req.body.server || 'server'}`,
      type: 'ssis',
      label: `Legacy SSIS agent jobs - ${req.body.server || 'server'}`,
      config: {
        server: req.body.server,
        connectionConfig: connConfig,
        sqlDriver,
      },
      credential: {
        mode: req.body.authentication === 'windows' ? 'windows_integrated' : 'service_account',
        secret_ref: 'legacy-request-body',
      },
      options: {
        dry_run: false,
        include_metadata: true,
        fail_fast: false,
        extractXml: false,
        streams: ['agent_jobs'],
      },
    });
    if (connectorExtraction.status === 'failed' || !connectorExtraction.metadata) {
      const firstError = connectorExtraction.errors?.[0];
      throw new Error(firstError?.message || 'SSIS connector agent job extraction failed before metadata was returned.');
    }
    result = connectorExtraction.metadata;
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SSIS_AGENT_JOB_EXTRACTION_FAILED',
    });
  }

  return res.json({
    extractedAt: result.extractedAt,
    jobCount: result.agentJobs.jobs.length,
    ssisStepCount: result.agentJobs.ssisSteps.length,
    ...result.agentJobs,
    warnings: result.warnings,
  });
});

export default router;
