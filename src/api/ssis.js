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
import { SsisMetadataExtractor } from '../services/ssisExtractor.js';

const router = createApiRouter();

// ─────────────────────────────────────────────────────────────────────────────
// Connection config builder (mirrors the pattern in ingestion.js)
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
        const nativeModule = await import('mssql/msnodesqlv8.js');
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
                'Windows integrated auth requires msnodesqlv8 driver. Provide username/password for NTLM instead.',
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
      packages: result.catalog.length,
      parameters: result.parameters.length,
      executables: result.executables.length,
      environments: result.environments.environments.length,
      environmentVariables: result.environments.variables.length,
      executionHistoryRows: result.executionHistory.length,
      componentPhaseRows: result.componentPhases.length,
      dataStatisticRows: result.dataStatistics.length,
      eventMessages: result.eventMessages.length,
      validations: result.validations.length,
      xmlPackagesParsed: result.xmlMetadata.length,
      scaleOutAgents: result.scaleOut.agents.length,
      agentJobs: result.agentJobs.jobs.length,
      ssisAgentSteps: result.agentJobs.ssisSteps.length,
      legacyLogRows: result.legacyLog.length,
      msdbPackages: result.msdbPackages.length,
      performanceStatRows: result.performanceStats.length,
      lineageEdges: result.lineageEdges.length,
    },
    warningCount: result.warnings.length,
    warnings: result.warnings,
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

function buildSsisPackageMarkdown(result, packageRow) {
  const folder = packageRow.folder_name || 'unknown_folder';
  const project = packageRow.project_name || 'unknown_project';
  const pkg = packageRow.package_name || 'unknown_package';
  const objectName = `${folder}.${project}.${pkg}`;
  const packageEdges = (result.lineageEdges || []).filter(
    (edge) => String(edge.packageName || '').toLowerCase() === String(pkg).toLowerCase(),
  );
  const upstream = [
    ...new Set(
      packageEdges
        .map((edge) => edge.from)
        .filter(Boolean)
        .filter((item) => item !== 'UNKNOWN'),
    ),
  ];
  const warnings = (result.warnings || []).slice(0, 15);

  return `---
name: ${objectName}
database: ssisdb
type: package
owner: ssis-platform
sensitivity: internal
tags: ['ssis', 'catalog', 'lineage']
depends_on: ${toYamlArray(upstream)}
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
- Last validation: ${packageRow.package_last_validation || 'n/a'}

## Execution Context
- Version GUID: ${packageRow.version_guid || 'n/a'}
- Package GUID: ${packageRow.package_guid || 'n/a'}

## Extraction Notes
${warnings.length > 0 ? warnings.map((warning) => `- ${warning}`).join('\n') : '- No extraction warnings recorded.'}
`;
}

function buildSsisLineageMarkdown(result) {
  const edges = result.lineageEdges || [];
  const topEdges = edges.slice(0, 500);
  const lines = topEdges.map(
    (edge) =>
      `- ${edge.from || 'UNKNOWN'} -> ${edge.to || 'UNKNOWN'} (type=${edge.edgeType || 'ETL'}, confidence=${edge.confidence ?? 'n/a'}, via=${edge.via || 'n/a'})`,
  );
  return `---
name: ssis_catalog_lineage
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
- Event Messages: ${(result.eventMessages || []).length}
- Agent Jobs: ${(result.agentJobs?.jobs || []).length}

## Top Lineage Edges
${lines.length ? lines.join('\n') : '- No edges generated.'}
`;
}

function persistSsisMarkdown(result, outputPath) {
  const defaultBasePath = './docs/generated/ssis';
  const baseOutputPath = resolve(process.cwd(), outputPath || defaultBasePath);
  const packageDir = join(baseOutputPath, 'packages');
  const summaryDir = join(baseOutputPath, 'summaries');
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
    writeFileSync(filePath, buildSsisPackageMarkdown(result, packageRow), 'utf-8');
    filesWritten += 1;
  });

  writeFileSync(
    join(summaryDir, 'ssis_catalog_lineage.md'),
    buildSsisLineageMarkdown(result),
    'utf-8',
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
          historyDays: {
            type: 'number',
            default: 30,
            description: 'How many days of execution history to retrieve',
          },
          phaseDays: {
            type: 'number',
            default: 7,
            description: 'How many days of component-phase / row-count statistics',
          },
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
      'The caller_initial_job_step_uid column in catalog.executions links SSISDB runs back to the Agent job step that launched them.',
    ],
    minimumSqlPermissions: [
      'CONNECT to the target SQL Server',
      'VIEW DATABASE STATE (SSISDB) – for catalog views',
      'READ on catalog.* (SSISDB) – for all catalog sections',
      'VIEW DEFINITION on SSISDB – for package XML in object_versions',
      'EXECUTE on catalog.get_project – optional, alternative XML source',
      'VIEW DATABASE STATE (msdb) – for Agent job history',
      'SELECT on msdb.dbo.sysjobs, sysjobsteps, sysjobhistory, sysschedules',
      'SELECT on msdb.dbo.sysssislog – for legacy SSIS logging (optional)',
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

  const extractor = new SsisMetadataExtractor(connConfig, sqlDriver);
  let result;
  try {
    await extractor.connect();
    result = await extractor.extractAll({
      historyDays: opts.historyDays ?? 30,
      phaseDays: opts.phaseDays ?? 7,
      extractXml: opts.extractXml !== false,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SSIS_EXTRACTION_FAILED',
      details:
        'Check server connectivity and permissions. See GET /api/v1/ssis/schema for required permissions.',
    });
  } finally {
    await extractor.disconnect().catch(() => {});
  }

  let markdownOutput = null;
  if (opts.generateMarkdownOutput !== false) {
    markdownOutput = persistSsisMarkdown(result, opts.markdownOutputPath);
  }

  return res.json({
    summary: summariseResult(result),
    data: result,
    markdownOutputPath: markdownOutput?.baseOutputPath || null,
    markdownFilesWritten: markdownOutput?.filesWritten || 0,
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

  const extractor = new SsisMetadataExtractor(connConfig, sqlDriver);
  let result;
  try {
    await extractor.connect();
    result = await extractor.extractAll({
      historyDays: opts.historyDays ?? 30,
      phaseDays: opts.phaseDays ?? 7,
      extractXml: opts.extractXml !== false,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SSIS_LINEAGE_EXTRACTION_FAILED',
    });
  } finally {
    await extractor.disconnect().catch(() => {});
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
  const warnings = [];
  const extractor = new SsisMetadataExtractor(connConfig, sqlDriver);

  let catalog = [];
  let parameters = [];
  let executables = [];
  let ssisdbPresent = false;

  try {
    await extractor.connect();

    ssisdbPresent = await extractor.checkSsisdb(warnings);

    if (ssisdbPresent) {
      catalog = await extractor.extractCatalogInventory(warnings);
      parameters = await extractor.extractParameters(warnings);
      executables = await extractor.extractExecutables(warnings);
    }
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SSIS_CATALOG_EXTRACTION_FAILED',
    });
  } finally {
    await extractor.disconnect().catch(() => {});
  }

  return res.json({
    extractedAt: new Date().toISOString(),
    ssisdbPresent,
    packageCount: catalog.length,
    catalog,
    parameters,
    executables,
    warnings,
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
  const warnings = [];
  const extractor = new SsisMetadataExtractor(connConfig, sqlDriver);

  let agentJobs;
  try {
    await extractor.connect();
    agentJobs = await extractor.extractAgentJobs(warnings);
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SSIS_AGENT_JOB_EXTRACTION_FAILED',
    });
  } finally {
    await extractor.disconnect().catch(() => {});
  }

  return res.json({
    extractedAt: new Date().toISOString(),
    jobCount: agentJobs.jobs.length,
    ssisStepCount: agentJobs.ssisSteps.length,
    ...agentJobs,
    warnings,
  });
});

export default router;
