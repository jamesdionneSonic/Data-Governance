/**
 * Ingestion Routes
 * API endpoints for uploading and processing markdown files
 */

import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join, resolve, relative, isAbsolute } from 'path';
import { ZipArchive } from 'archiver';
import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  parseMarkdownFile,
  parseMarkdownContent,
  validateMarkdownCatalog,
  validateMarkdownManifest,
  validateMetadata,
} from '../services/markdownService.js';
import { resolveLineageCorpus } from '../services/lineageResolver.js';
import { loadRuntimeCatalog } from '../services/catalogRuntimeService.js';
import { indexObjects, createIndex, healthCheck } from '../services/indexService.js';
import { initializeCache } from '../utils/cacheInitializer.js';

const router = createApiRouter();
const ingestionState = {
  loadedObjectCount: 0,
  indexName: 'objects',
  lastLoadedAt: null,
  lastValidatedAt: null,
  lastDataPath: null,
  lastGeneratedPath: null,
};

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

function resolveDataBoundaryPath(inputPath, fallbackRelativePath = 'data/markdown') {
  const dataRoot = resolve(process.cwd(), 'data');
  const requestedPath = String(inputPath || fallbackRelativePath);
  const resolvedPath = resolve(process.cwd(), requestedPath);
  const boundaryCheck = relative(dataRoot, resolvedPath);

  if (!boundaryCheck || boundaryCheck.startsWith('..') || isAbsolute(boundaryCheck)) {
    throw new Error(`Invalid dataPath outside data boundary: ${requestedPath}`);
  }

  return resolvedPath;
}

async function persistGeneratedMarkdown(markdowns, database, outputPath) {
  const defaultBasePath = './data/markdown';
  const baseOutputPath = resolve(process.cwd(), outputPath || defaultBasePath);
  const analysisBasePath = resolve(process.cwd(), './data/analysis/raw/sqlserver');
  const safeDatabase = sanitizePathSegment(database);

  for (const markdown of markdowns) {
    const normalizedDirectory = String(markdown.directory || '').replace(/^[/\\]+/, '');
    const targetDirectory = resolve(baseOutputPath, normalizedDirectory);
    const analysisDirectory = resolve(analysisBasePath, normalizedDirectory);
    const fileName = sanitizePathSegment(markdown.fileName || `${safeDatabase}.md`);
    const targetPath = join(targetDirectory, fileName);
    const analysisTargetPath = join(analysisDirectory, fileName);

    await mkdir(targetDirectory, { recursive: true });
    await mkdir(analysisDirectory, { recursive: true });
    await writeFile(targetPath, markdown.content || '', 'utf-8');
    await writeFile(analysisTargetPath, markdown.content || '', 'utf-8');
  }

  return {
    baseOutputPath,
    analysisBasePath,
    filesWritten: markdowns.length,
  };
}

function normalizeBaseUrl(value) {
  return String(value || '').replace(/\/+$/, '');
}

async function fetchJson(url, { method = 'GET', headers = {}, body, timeoutMs = 30000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...headers,
      },
      body,
      signal: controller.signal,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) {
      const message = data?.error?.message || data?.message || data?.detail || response.statusText;
      throw new Error(`${response.status} ${message}`);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function getAzureAccessToken(payload) {
  if (payload.accessToken) return payload.accessToken;
  const { tenantId, clientId, clientSecret } = payload;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('tenantId, clientId, and clientSecret are required unless accessToken is provided');
  }
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'https://management.azure.com/.default',
  });
  const token = await fetchJson(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  return token.access_token;
}

function connectorMarkdownFrontmatter({ id, name, type, sourceSystem, dependsOn = [], description }) {
  return `---
id: ${JSON.stringify(id)}
name: ${JSON.stringify(name)}
database: ${JSON.stringify(sourceSystem)}
type: ${JSON.stringify(type)}
owner: data-platform
sensitivity: internal
tags: ['${sourceSystem}', 'ingestion', 'connector']
depends_on: ${JSON.stringify(dependsOn)}
description: ${JSON.stringify(description)}
---
`;
}

function connectorErrorStatus(err) {
  return /required|invalid/i.test(err?.message || '') ? 400 : 500;
}

async function persistConnectorMarkdown({ connectorKey, sourceName, markdownFiles, outputPath }) {
  const baseOutputPath = resolve(process.cwd(), outputPath || './data/markdown');
  const targetDir = join(baseOutputPath, 'connectors', sanitizePathSegment(connectorKey));
  await mkdir(targetDir, { recursive: true });
  await Promise.all(
    markdownFiles.map((file) =>
      writeFile(join(targetDir, sanitizePathSegment(file.fileName)), file.content || '', 'utf-8')
    )
  );
  ingestionState.lastGeneratedPath = baseOutputPath;
  ingestionState.lastDataPath = baseOutputPath;
  return {
    baseOutputPath,
    connectorPath: targetDir,
    filesWritten: markdownFiles.length,
    sourceName,
  };
}

function listValue(response, keys) {
  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
  }
  return [];
}

async function discoverDataFactory(payload) {
  const { subscriptionId, resourceGroupName, factoryName } = payload;
  if (!subscriptionId || !resourceGroupName || !factoryName) {
    throw new Error('subscriptionId, resourceGroupName, and factoryName are required');
  }
  const accessToken = await getAzureAccessToken(payload);
  const root = `https://management.azure.com/subscriptions/${encodeURIComponent(
    subscriptionId
  )}/resourceGroups/${encodeURIComponent(
    resourceGroupName
  )}/providers/Microsoft.DataFactory/factories/${encodeURIComponent(factoryName)}`;
  const authHeaders = { Authorization: `Bearer ${accessToken}` };
  const apiVersion = '2018-06-01';
  const [pipelines, datasets, linkedServices, triggers] = await Promise.all([
    fetchJson(`${root}/pipelines?api-version=${apiVersion}`, { headers: authHeaders }),
    fetchJson(`${root}/datasets?api-version=${apiVersion}`, { headers: authHeaders }),
    fetchJson(`${root}/linkedservices?api-version=${apiVersion}`, { headers: authHeaders }),
    fetchJson(`${root}/triggers?api-version=${apiVersion}`, { headers: authHeaders }),
  ]);
  return {
    factoryName,
    subscriptionId,
    resourceGroupName,
    pipelines: pipelines.value || [],
    datasets: datasets.value || [],
    linkedServices: linkedServices.value || [],
    triggers: triggers.value || [],
  };
}

function buildDataFactoryMarkdown(discovery) {
  const dependencyNames = discovery.datasets.map((item) => item.name).filter(Boolean);
  const summary = connectorMarkdownFrontmatter({
    id: `datafactory.${discovery.factoryName}`,
    name: discovery.factoryName,
    type: 'data_factory',
    sourceSystem: 'datafactory',
    dependsOn: dependencyNames,
    description: `Azure Data Factory metadata extracted from ${discovery.factoryName}.`,
  });
  const pipelineRows = discovery.pipelines
    .map((item) => `- ${item.name} (${item.properties?.activities?.length || 0} activities)`)
    .join('\n');
  const linkedRows = discovery.linkedServices
    .map((item) => `- ${item.name} (${item.properties?.type || 'linkedService'})`)
    .join('\n');
  return [
    {
      fileName: `${discovery.factoryName}.md`,
      content: `${summary}
# Data Factory ${discovery.factoryName}

## Inventory
- Pipelines: ${discovery.pipelines.length}
- Datasets: ${discovery.datasets.length}
- Linked services: ${discovery.linkedServices.length}
- Triggers: ${discovery.triggers.length}

## Pipelines
${pipelineRows || '- No pipelines discovered.'}

## Linked Services
${linkedRows || '- No linked services discovered.'}
`,
    },
  ];
}

function buildAirflowHeaders(payload) {
  if (payload.token) return { Authorization: `Bearer ${payload.token}` };
  if (payload.username || payload.password) {
    return {
      Authorization: `Basic ${Buffer.from(`${payload.username || ''}:${payload.password || ''}`).toString(
        'base64'
      )}`,
    };
  }
  return {};
}

async function discoverAirflow(payload) {
  const baseUrl = normalizeBaseUrl(payload.baseUrl);
  if (!baseUrl) throw new Error('baseUrl is required');
  const apiVersion = payload.apiVersion || 'v1';
  const root = `${baseUrl}/api/${apiVersion}`;
  const headers = buildAirflowHeaders(payload);
  const [dags, connections] = await Promise.all([
    fetchJson(`${root}/dags?limit=${Number(payload.limit) || 100}`, { headers }),
    fetchJson(`${root}/connections?limit=${Number(payload.limit) || 100}`, { headers }).catch(
      (err) => ({ error: err.message, connections: [] })
    ),
  ]);
  return {
    baseUrl,
    apiVersion,
    dags: listValue(dags, ['dags']),
    connections: listValue(connections, ['connections']),
    connectionWarning: connections.error || '',
  };
}

function buildAirflowMarkdown(discovery) {
  const dagRows = discovery.dags
    .map((dag) => `- ${dag.dag_id || dag.dagId} (${dag.is_paused ? 'paused' : 'active'})`)
    .join('\n');
  const connectionRows = discovery.connections
    .map((conn) => `- ${conn.connection_id || conn.conn_id || conn.id} (${conn.conn_type || 'connection'})`)
    .join('\n');
  return [
    {
      fileName: 'airflow_catalog.md',
      content: `${connectorMarkdownFrontmatter({
        id: `airflow.${discovery.baseUrl.replace(/^https?:\/\//, '')}`,
        name: 'airflow_catalog',
        type: 'airflow_catalog',
        sourceSystem: 'airflow',
        description: `Airflow metadata extracted from ${discovery.baseUrl}.`,
      })}
# Airflow Catalog

## Inventory
- DAGs: ${discovery.dags.length}
- Connections: ${discovery.connections.length}
- API version: ${discovery.apiVersion}

## DAGs
${dagRows || '- No DAGs discovered.'}

## Connections
${connectionRows || '- No connections discovered or permissions unavailable.'}
${discovery.connectionWarning ? `\n## Warnings\n- ${discovery.connectionWarning}\n` : ''}
`,
    },
  ];
}

async function discoverDatabricks(payload) {
  const workspaceUrl = normalizeBaseUrl(payload.workspaceUrl);
  if (!workspaceUrl || !payload.token) throw new Error('workspaceUrl and token are required');
  const headers = { Authorization: `Bearer ${payload.token}` };
  const [jobs, clusters, catalogs] = await Promise.all([
    fetchJson(`${workspaceUrl}/api/2.1/jobs/list?limit=${Number(payload.limit) || 100}`, {
      headers,
    }),
    fetchJson(`${workspaceUrl}/api/2.0/clusters/list`, { headers }).catch((err) => ({
      error: err.message,
      clusters: [],
    })),
    fetchJson(`${workspaceUrl}/api/2.1/unity-catalog/catalogs`, { headers }).catch((err) => ({
      error: err.message,
      catalogs: [],
    })),
  ]);
  return {
    workspaceUrl,
    jobs: jobs.jobs || [],
    clusters: clusters.clusters || [],
    catalogs: catalogs.catalogs || [],
    clusterWarning: clusters.error || '',
    catalogWarning: catalogs.error || '',
  };
}

function buildDatabricksMarkdown(discovery) {
  const jobRows = discovery.jobs
    .map((job) => `- ${job.settings?.name || job.job_id} (${(job.settings?.tasks || []).length} tasks)`)
    .join('\n');
  const catalogRows = discovery.catalogs.map((catalog) => `- ${catalog.name}`).join('\n');
  return [
    {
      fileName: 'databricks_workspace.md',
      content: `${connectorMarkdownFrontmatter({
        id: `databricks.${discovery.workspaceUrl.replace(/^https?:\/\//, '')}`,
        name: 'databricks_workspace',
        type: 'databricks_workspace',
        sourceSystem: 'databricks',
        dependsOn: discovery.catalogs.map((catalog) => catalog.name).filter(Boolean),
        description: `Databricks metadata extracted from ${discovery.workspaceUrl}.`,
      })}
# Databricks Workspace

## Inventory
- Jobs: ${discovery.jobs.length}
- Clusters: ${discovery.clusters.length}
- Unity Catalog catalogs: ${discovery.catalogs.length}

## Jobs
${jobRows || '- No jobs discovered.'}

## Catalogs
${catalogRows || '- No catalogs discovered or Unity Catalog permissions unavailable.'}
${discovery.clusterWarning || discovery.catalogWarning ? `\n## Warnings\n${[discovery.clusterWarning, discovery.catalogWarning]
  .filter(Boolean)
  .map((warning) => `- ${warning}`)
  .join('\n')}\n` : ''}
`,
    },
  ];
}

async function buildSqlConnectionContext(payload) {
  const mssqlDriver = await import('mssql');
  const {
    server,
    port = 1433,
    database,
    username,
    password,
    domain,
    clientId,
    clientSecret,
    tenantId,
    authentication = 'sql-server',
    encrypt = true,
    trustServerCertificate = false,
  } = payload;

  if (!server || !database) {
    return {
      error: {
        status: 400,
        code: 'BAD_REQUEST',
        message: 'server and database are required',
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
    pool: {
      max: 20,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    connectionTimeout: 15000,
    requestTimeout: 300000, // 5 minutes for large extractions
  };

  let sqlDriver = mssqlDriver.default;

  if (authentication === 'sql-server') {
    if (!username || !password) {
      return {
        error: {
          status: 400,
          code: 'BAD_REQUEST',
          message: 'username and password are required for SQL Server authentication',
        },
      };
    }

    connConfig.authentication = {
      type: 'default',
      options: {
        userName: username,
        password,
      },
    };
  } else if (authentication === 'windows') {
    if (!username && !password) {
      try {
        let nativeDriverModule;
        try {
          nativeDriverModule = await import('mssql/msnodesqlv8.js');
        } catch (_driverLoadErr) {
          throw new Error(
            'Windows integrated auth requires msnodesqlv8 on a Windows host. Use SQL Server auth or NTLM on Linux/Docker.'
          );
        }
        sqlDriver = nativeDriverModule.default;

        connConfig.options.trustedConnection = true;
        connConfig.driver = 'msnodesqlv8';
        connConfig.connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${server};Database=${database};Trusted_Connection=Yes;`;
        delete connConfig.authentication;
        delete connConfig.port;
      } catch (_driverErr) {
        return {
          error: {
            status: 400,
            code: 'BAD_REQUEST',
            message:
              'Windows integrated auth requires msnodesqlv8. Install with `npm i msnodesqlv8`, or provide username/password for NTLM.',
          },
        };
      }
    } else {
      if (!username || !password) {
        return {
          error: {
            status: 400,
            code: 'BAD_REQUEST',
            message:
              'For NTLM Windows auth, provide both username and password. For integrated auth, leave both blank.',
          },
        };
      }

      let resolvedDomain = domain || '';
      let resolvedUsername = username;
      if (!resolvedDomain && String(username).includes('\\')) {
        const [parsedDomain, parsedUser] = String(username).split('\\');
        if (parsedDomain && parsedUser) {
          resolvedDomain = parsedDomain;
          resolvedUsername = parsedUser;
        }
      }

      connConfig.authentication = {
        type: 'ntlm',
        options: {
          userName: resolvedUsername,
          password,
          domain: resolvedDomain,
        },
      };
    }
  } else if (authentication === 'azure-ad') {
    if (!clientId || !clientSecret || !tenantId) {
      return {
        error: {
          status: 400,
          code: 'BAD_REQUEST',
          message: 'clientId, clientSecret, and tenantId are required for Azure AD authentication',
        },
      };
    }

    connConfig.authentication = {
      type: 'azure-active-directory-service-principal-secret',
      options: {
        clientId,
        clientSecret,
        tenantId,
      },
    };
  } else {
    return {
      error: {
        status: 400,
        code: 'BAD_REQUEST',
        message: `Unsupported authentication method: ${authentication}`,
      },
    };
  }

  return {
    connConfig,
    sqlDriver,
  };
}

/**
 * POST /api/v1/ingestion/parse
 * Parse and validate a markdown file
 * Requires authentication
 */
router.post('/parse', authenticate, async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return sendErrorResponse(res, req, 400, 'filePath is required', {
        code: 'BAD_REQUEST',
      });
    }

    const metadata = await parseMarkdownFile(filePath);
    const errors = validateMetadata(metadata);

    if (errors.length > 0) {
      return sendErrorResponse(res, req, 400, 'Metadata validation failed', {
        code: 'VALIDATION_ERROR',
        details: { errors },
      });
    }

    return res.json({
      status: 'success',
      message: 'File parsed successfully',
      data: metadata,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, {
      code: 'PARSE_ERROR',
    });
  }
});

/**
 * POST /api/v1/ingestion/parse-content
 * Parse and validate markdown content from browser uploads
 * Requires authentication
 */
router.post('/parse-content', authenticate, (req, res) => {
  try {
    const { content, fileName = 'uploaded-file.md' } = req.body;

    if (!content || typeof content !== 'string') {
      return sendErrorResponse(res, req, 400, 'content is required and must be a string', {
        code: 'BAD_REQUEST',
      });
    }

    const metadata = parseMarkdownContent(content, fileName);
    const errors = validateMetadata(metadata);

    if (errors.length > 0) {
      return sendErrorResponse(res, req, 400, 'Metadata validation failed', {
        code: 'VALIDATION_ERROR',
        details: { errors },
      });
    }

    return res.json({
      status: 'success',
      message: 'Content parsed successfully',
      data: metadata,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 400, err.message, {
      code: 'PARSE_ERROR',
    });
  }
});

/**
 * POST /api/v1/ingestion/load
 * Load all markdown files and index them
 * Requires admin role
 */
router.post('/load', authenticate, requireAdmin, async (req, res) => {
  try {
    const { dataPath = './data/markdown' } = req.body;
    const safeDataPath = resolveDataBoundaryPath(dataPath);
    const indexName = 'objects';

    if (!existsSync(safeDataPath)) {
      return sendErrorResponse(res, req, 400, 'No markdown files found', {
        code: 'NO_DATA',
        errorLabel: 'No Data',
      });
    }

    if (req.body.resolveLineage === true) {
      await resolveLineageCorpus(safeDataPath);
    }

    // Load compact runtime indexes instead of full column-level markdown.
    const runtimeCatalog = await loadRuntimeCatalog(safeDataPath, { rebuild: true });
    const objects = runtimeCatalog.objects;

    if (objects.size === 0) {
      return sendErrorResponse(res, req, 400, 'No markdown files found', {
        code: 'NO_DATA',
        errorLabel: 'No Data',
      });
    }

    // Create index
    await createIndex(indexName);

    // Index objects
    const objectsArray = Array.from(objects.values());
    await indexObjects(indexName, objectsArray);

    // FIX: Hot-reload all live memory caches without restarting the server!
    initializeCache(objects, runtimeCatalog.lineageGraph, runtimeCatalog);

    ingestionState.loadedObjectCount = objects.size;
    ingestionState.indexName = indexName;
    ingestionState.lastLoadedAt = new Date().toISOString();
    ingestionState.lastDataPath = safeDataPath;

    return res.json({
      status: 'success',
      message: 'Data loaded and indexed successfully',
      stats: {
        totalObjects: objects.size,
        totalIndexed: objectsArray.length,
        indexName,
      },
    });
  } catch (err) {
    const lowerMessage = String(err?.message || '').toLowerCase();
    if (lowerMessage.includes('invalid datapath')) {
      return sendErrorResponse(res, req, 400, 'No markdown files found', {
        code: 'NO_DATA',
        errorLabel: 'No Data',
      });
    }

    if (lowerMessage.includes('fetch failed') || lowerMessage.includes('connect')) {
      return sendErrorResponse(
        res,
        req,
        503,
        'Load to Index requires Elasticsearch on https://localhost:9200. Ensure the engine is running and retry.',
        {
          code: 'INGESTION_DEPENDENCY_ERROR',
          details: {
            engineUrl: process.env.ELASTICSEARCH_URL || 'https://localhost:9200',
          },
        }
      );
    }

    return sendErrorResponse(res, req, 500, err.message, {
      code: 'INGESTION_ERROR',
    });
  }
});

/**
 * POST /api/v1/ingestion/validate
 * Validate markdown files without indexing
 * Requires admin role
 */
router.post('/validate', authenticate, requireAdmin, async (req, res) => {
  try {
    const { dataPath = './data/markdown' } = req.body;
    const safeDataPath = resolveDataBoundaryPath(dataPath);

    if (req.body.resolveLineage === true) {
      await resolveLineageCorpus(safeDataPath).catch((err) => {
        console.error('Lineage resolver failed during validation:', err.message);
      });
    }

    const quickManifestResults =
      req.body.deep === true ? null : await validateMarkdownManifest(safeDataPath);
    const results = quickManifestResults || (await validateMarkdownCatalog(safeDataPath));

    ingestionState.lastValidatedAt = new Date().toISOString();
    ingestionState.lastDataPath = safeDataPath;

    return res.json({
      status: 'success',
      message: 'Validation complete',
      data: results,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'VALIDATION_ERROR',
    });
  }
});

/**
 * POST /api/v1/ingestion/connect-sql-server
 * Connect to SQL Server and extract metadata
 * Generates markdown files with confidence-scored relationships
 * Requires admin role
 */
router.post('/connect-sql-server', authenticate, requireAdmin, async (req, res) => {
  let extractor;
  try {
    const SqlServerMetadataExtractor = (await import('../services/sqlServerExtractor.js')).default;
    const MarkdownGenerator = (await import('../services/markdownFromSqlServer.js')).default;

    // --> CHANGED: We now destructure excludeSchemas and excludeTables out of the request body
    const {
      database,
      selectedSchemas = [],
      selectedTables = [],
      excludeSchemas = [],
      excludeTables = [],
      outputPath,
    } = req.body;

    const connectionContext = await buildSqlConnectionContext(req.body);
    if (connectionContext.error) {
      return sendErrorResponse(
        res,
        req,
        connectionContext.error.status,
        connectionContext.error.message,
        {
          code: connectionContext.error.code || 'BAD_REQUEST',
        }
      );
    }

    const { connConfig, sqlDriver } = connectionContext;

    // Extract metadata with all object types
    extractor = new SqlServerMetadataExtractor(connConfig, sqlDriver);
    await extractor.connect();

    // Build scope: now tracking inclusions AND exclusions
    // --> CHANGED: Added exclusions to the scope object being sent to the extractor
    const scope = {
      schemas: Array.isArray(selectedSchemas) ? selectedSchemas : [],
      tables: Array.isArray(selectedTables) ? selectedTables : [],
      excludeSchemas: Array.isArray(excludeSchemas) ? excludeSchemas : [],
      excludeTables: Array.isArray(excludeTables) ? excludeTables : [],
    };

    const metadata = await extractor.extractAllMetadata(database, scope);
    await extractor.disconnect();

    // 1. DETERMINE OUTPUT PATH
    const defaultBasePath = './data/markdown';
    const baseOutputPath = resolve(process.cwd(), outputPath || defaultBasePath);
    let filesWrittenCount = 0;

    // 2. Generate and persist markdown before responding so the disk I/O
    // completes deterministically for downstream validation/indexing.
    try {
      console.log(`\n[Markdown] Starting generation for ${metadata.allObjects.length} objects...`);
      const generator = new MarkdownGenerator(metadata);
      const markdowns = generator.generateAllMarkdowns();
      const persisted = await persistGeneratedMarkdown(markdowns, database, outputPath);
      filesWrittenCount = persisted.filesWritten || 0;
      ingestionState.lastGeneratedPath = persisted.baseOutputPath;
      console.log(`[Markdown] SUCCESS! Wrote ${filesWrittenCount} files to disk.\n`);

      const runtimeCatalog = await loadRuntimeCatalog(persisted.baseOutputPath, { rebuild: true });
      initializeCache(runtimeCatalog.objects, runtimeCatalog.lineageGraph, runtimeCatalog);
      ingestionState.loadedObjectCount = runtimeCatalog.objects.size;
      ingestionState.lastLoadedAt = new Date().toISOString();
      ingestionState.lastDataPath = persisted.baseOutputPath;
    } catch (markdownErr) {
      console.error('[Markdown] Generation failed:', markdownErr);
      throw markdownErr;
    }

    // 3. SEND RESPONSE TO UI AFTER MARKDOWN IS WRITTEN
    return res.json({
      status: 'success',
      message: `Extracted metadata from ${metadata.database}. Markdown generation completed.`,
      data: {
        tablesExtracted: metadata.tables.length,
        viewsExtracted: metadata.views.length,
        proceduresExtracted: metadata.storedProcedures.length,
        functionsExtracted: metadata.functions.length,
        triggersExtracted: metadata.triggers.length,
        totalObjectsExtracted: metadata.allObjects.length,
        objectInventory: metadata.objectInventory || null,
        researchReport: metadata.researchReport || null,
        relationshipsDetected: metadata.relationships.length,
        confidentRelationships: metadata.relationships.filter((r) => r.confidence >= 0.75).length,
        extractionWarnings: metadata.extractionWarnings || [],
        selectedSchemas,
        selectedTables,
        markdownFiles: metadata.allObjects.length,
        markdownFilesWritten: filesWrittenCount,
        markdownOutputPath: baseOutputPath,
        catalogObjectsLoaded: ingestionState.loadedObjectCount,
        markdownPreview: [],
        ready: 'Files have been generated and written to disk.',
      },
    });
  } catch (err) {
    const message = String(err?.message || '');
    const lowerMessage = message.toLowerCase();
    const isConnectionError =
      lowerMessage.includes('login failed') ||
      lowerMessage.includes('failed to connect') ||
      lowerMessage.includes('connection') ||
      lowerMessage.includes('network') ||
      lowerMessage.includes('timeout');

    return sendErrorResponse(res, req, 500, err.message, {
      code: isConnectionError ? 'SQL_SERVER_CONNECTION_ERROR' : 'SQL_SERVER_EXTRACTION_ERROR',
    });
  } finally {
    if (extractor) {
      try {
        await extractor.disconnect();
      } catch (_disconnectErr) {
        // no-op
      }
    }
  }
});

router.post('/connect-sql-server/databases', authenticate, requireAdmin, async (req, res) => {
  let connection;
  try {
    // 1. Prepare payload and force 'master' database for discovery
    const payload = { ...req.body, database: 'master' };

    // 2. Strip credentials if Integrated Auth is checked so the context builder knows to use msnodesqlv8
    if (payload.authentication === 'windows' && payload.useIntegratedAuth) {
      payload.username = '';
      payload.password = '';
      payload.domain = '';
    }

    // 3. Use your existing helper to safely build the connection
    const connectionContext = await buildSqlConnectionContext(payload);

    if (connectionContext.error) {
      return sendErrorResponse(
        res,
        req,
        connectionContext.error.status,
        connectionContext.error.message,
        { code: connectionContext.error.code || 'BAD_REQUEST' }
      );
    }

    const { connConfig, sqlDriver } = connectionContext;

    // 4. Connect and query for databases using the correctly resolved driver
    connection = new sqlDriver.ConnectionPool(connConfig);
    await connection.connect();

    const result = await connection
      .request()
      .query(
        'SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;SELECT name FROM sys.databases WHERE state = 0 AND database_id > 4 ORDER BY name'
      );

    const databases = result.recordset.map((row) => row.name);

    return res.json({
      status: 'success',
      message: `Discovered ${databases.length} database(s)`,
      data: {
        databases,
        count: databases.length,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SQL_SERVER_DATABASE_DISCOVERY_ERROR',
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (_closeErr) {
        // no-op
      }
    }
  }
});

router.post('/connect-sql-server/discover', authenticate, requireAdmin, async (req, res) => {
  let extractor;
  try {
    const SqlServerMetadataExtractor = (await import('../services/sqlServerExtractor.js')).default;
    const connectionContext = await buildSqlConnectionContext(req.body);
    if (connectionContext.error) {
      return sendErrorResponse(
        res,
        req,
        connectionContext.error.status,
        connectionContext.error.message,
        {
          code: connectionContext.error.code || 'BAD_REQUEST',
        }
      );
    }

    const { connConfig, sqlDriver } = connectionContext;
    extractor = new SqlServerMetadataExtractor(connConfig, sqlDriver);
    await extractor.connect();

    // Get lightweight discovery sequentially to prevent Windows Auth driver hangs
    const discovery = await extractor.listSchemasAndTables();
    const objectTypeCounts = await extractor.listAllObjectsByType();

    // Enrich schemas with all object type counts
    const enrichedSchemas = discovery.schemas.map((schema) => {
      const typeCount = objectTypeCounts[schema.name] || {};
      return {
        schemaName: schema.name,
        tableCount: typeCount.table || 0,
        viewCount: typeCount.view || 0,
        procedureCount: typeCount.stored_procedure || 0,
        functionCount: typeCount.function || typeCount.table_function || 0,
        triggerCount: typeCount.trigger || 0,
        totalObjectCount:
          (typeCount.table || 0) +
          (typeCount.view || 0) +
          (typeCount.stored_procedure || 0) +
          (typeCount.function || 0) +
          (typeCount.table_function || 0) +
          (typeCount.trigger || 0),
      };
    });

    return res.json({
      status: 'success',
      message: `Discovered ${discovery.tables.length} objects across ${discovery.schemas.length} schemas`,
      data: {
        schemaCount: discovery.schemas.length,
        totalObjectCount: discovery.tables.length,
        schemas: enrichedSchemas,
        tables: discovery.tables,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SQL_SERVER_DISCOVERY_ERROR',
    });
  } finally {
    if (extractor) {
      try {
        await extractor.disconnect();
      } catch (_disconnectErr) {
        // no-op
      }
    }
  }
});

router.post('/connect-data-factory/discover', authenticate, requireAdmin, async (req, res) => {
  try {
    const discovery = await discoverDataFactory(req.body);
    return res.json({
      status: 'success',
      message: `Discovered ${discovery.pipelines.length} Data Factory pipeline(s)`,
      data: discovery,
    });
  } catch (err) {
    return sendErrorResponse(res, req, connectorErrorStatus(err), err.message, {
      code: 'DATA_FACTORY_DISCOVERY_ERROR',
    });
  }
});

router.post('/connect-data-factory', authenticate, requireAdmin, async (req, res) => {
  try {
    const discovery = await discoverDataFactory(req.body);
    const markdownFiles = buildDataFactoryMarkdown(discovery);
    const persisted = await persistConnectorMarkdown({
      connectorKey: 'data-factory',
      sourceName: discovery.factoryName,
      markdownFiles,
      outputPath: req.body.outputPath,
    });
    return res.json({
      status: 'success',
      message: `Extracted Data Factory metadata from ${discovery.factoryName}`,
      data: {
        ...discovery,
        markdownFilesWritten: persisted.filesWritten,
        markdownOutputPath: persisted.baseOutputPath,
        connectorPath: persisted.connectorPath,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, connectorErrorStatus(err), err.message, {
      code: 'DATA_FACTORY_EXTRACTION_ERROR',
    });
  }
});

router.post('/connect-airflow/discover', authenticate, requireAdmin, async (req, res) => {
  try {
    const discovery = await discoverAirflow(req.body);
    return res.json({
      status: 'success',
      message: `Discovered ${discovery.dags.length} Airflow DAG(s)`,
      data: discovery,
    });
  } catch (err) {
    return sendErrorResponse(res, req, connectorErrorStatus(err), err.message, {
      code: 'AIRFLOW_DISCOVERY_ERROR',
    });
  }
});

router.post('/connect-airflow', authenticate, requireAdmin, async (req, res) => {
  try {
    const discovery = await discoverAirflow(req.body);
    const markdownFiles = buildAirflowMarkdown(discovery);
    const persisted = await persistConnectorMarkdown({
      connectorKey: 'airflow',
      sourceName: discovery.baseUrl,
      markdownFiles,
      outputPath: req.body.outputPath,
    });
    return res.json({
      status: 'success',
      message: `Extracted Airflow metadata from ${discovery.baseUrl}`,
      data: {
        ...discovery,
        markdownFilesWritten: persisted.filesWritten,
        markdownOutputPath: persisted.baseOutputPath,
        connectorPath: persisted.connectorPath,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, connectorErrorStatus(err), err.message, {
      code: 'AIRFLOW_EXTRACTION_ERROR',
    });
  }
});

router.post('/connect-databricks/discover', authenticate, requireAdmin, async (req, res) => {
  try {
    const discovery = await discoverDatabricks(req.body);
    return res.json({
      status: 'success',
      message: `Discovered ${discovery.jobs.length} Databricks job(s)`,
      data: discovery,
    });
  } catch (err) {
    return sendErrorResponse(res, req, connectorErrorStatus(err), err.message, {
      code: 'DATABRICKS_DISCOVERY_ERROR',
    });
  }
});

router.post('/connect-databricks', authenticate, requireAdmin, async (req, res) => {
  try {
    const discovery = await discoverDatabricks(req.body);
    const markdownFiles = buildDatabricksMarkdown(discovery);
    const persisted = await persistConnectorMarkdown({
      connectorKey: 'databricks',
      sourceName: discovery.workspaceUrl,
      markdownFiles,
      outputPath: req.body.outputPath,
    });
    return res.json({
      status: 'success',
      message: `Extracted Databricks metadata from ${discovery.workspaceUrl}`,
      data: {
        ...discovery,
        markdownFilesWritten: persisted.filesWritten,
        markdownOutputPath: persisted.baseOutputPath,
        connectorPath: persisted.connectorPath,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, connectorErrorStatus(err), err.message, {
      code: 'DATABRICKS_EXTRACTION_ERROR',
    });
  }
});

/**
 * GET /api/v1/ingestion/export-zip
 * Export generated markdown directory as a zip archive
 * Requires admin role
 */
router.get('/export-zip', authenticate, requireAdmin, (req, res) => {
  try {
    const requestedPath = String(req.query.dataPath || './data/markdown');
    const resolvedPath = resolveDataBoundaryPath(requestedPath);

    if (!existsSync(resolvedPath)) {
      return sendErrorResponse(res, req, 404, `Directory not found: ${resolvedPath}`, {
        code: 'NOT_FOUND',
      });
    }

    const archiveName = `sqlserver-markdown-${Date.now()}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${archiveName}"`);

    const archive = new ZipArchive({ zlib: { level: 9 } });
    archive.on('error', (err) => {
      if (!res.headersSent) {
        sendErrorResponse(res, req, 500, err.message, {
          code: 'ZIP_EXPORT_ERROR',
        });
      } else {
        res.end();
      }
    });

    archive.pipe(res);
    archive.directory(resolvedPath, false);
    archive.finalize();

    return undefined;
  } catch (err) {
    if (String(err?.message || '').toLowerCase().includes('invalid datapath')) {
      return sendErrorResponse(res, req, 404, 'Directory not found', {
        code: 'NOT_FOUND',
      });
    }

    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ZIP_EXPORT_ERROR',
    });
  }
});

/**
 * GET /api/v1/ingestion/status
 * Get ingestion status and statistics
 * Requires authentication
 */
router.get('/status', authenticate, async (req, res) => {
  const engineHealthy = await healthCheck();
  res.json({
    status: 'success',
    message: 'Ingestion service status',
    data: {
      indexName: ingestionState.indexName,
      status: ingestionState.loadedObjectCount > 0 ? 'loaded' : 'ready',
      loadedObjectCount: ingestionState.loadedObjectCount,
      lastLoadedAt: ingestionState.lastLoadedAt,
      lastValidatedAt: ingestionState.lastValidatedAt,
      lastDataPath: ingestionState.lastDataPath,
      lastGeneratedPath: ingestionState.lastGeneratedPath,
      // Pass the Elasticsearch health status!
      elasticsearchHealthy: engineHealthy,
      elasticsearchUrl: process.env.ELASTICSEARCH_URL || 'https://localhost:9200',
      lastUpdated: new Date().toISOString(),
    },
  });
});

export default router;
