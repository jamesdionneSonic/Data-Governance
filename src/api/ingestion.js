/**
 * Ingestion Routes
 * API endpoints for uploading and processing markdown files
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { ZipArchive } from 'archiver';
import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  parseMarkdownFile,
  parseMarkdownContent,
  loadAllMarkdown,
  validateMetadata,
} from '../services/markdownService.js';
import { buildLineageGraph } from '../services/lineageService.js';
import { indexObjects, createIndex, healthCheck } from '../services/indexService.js';

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

function persistGeneratedMarkdown(markdowns, database, outputPath) {
  const defaultBasePath = './docs/generated/sqlserver';
  const baseOutputPath = resolve(process.cwd(), outputPath || defaultBasePath);
  const safeDatabase = sanitizePathSegment(database);

  markdowns.forEach((markdown) => {
    const normalizedDirectory = String(markdown.directory || '').replace(/^[/\\]+/, '');
    const targetDirectory = resolve(baseOutputPath, normalizedDirectory);
    const fileName = sanitizePathSegment(markdown.fileName || `${safeDatabase}.md`);
    const targetPath = join(targetDirectory, fileName);

    mkdirSync(targetDirectory, { recursive: true });
    writeFileSync(targetPath, markdown.content || '', 'utf-8');
  });

  return {
    baseOutputPath,
    filesWritten: markdowns.length,
  };
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
        const nativeDriverModule = await import('mssql/msnodesqlv8.js');
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
router.post('/parse', authenticate, (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return sendErrorResponse(res, req, 400, 'filePath is required', {
        code: 'BAD_REQUEST',
      });
    }

    const metadata = parseMarkdownFile(filePath);
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
    const indexName = 'objects';

    // Load markdown files
    const objects = loadAllMarkdown(dataPath);

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

    // Build lineage graph
    buildLineageGraph(objects);

    ingestionState.loadedObjectCount = objects.size;
    ingestionState.indexName = indexName;
    ingestionState.lastLoadedAt = new Date().toISOString();
    ingestionState.lastDataPath = dataPath;

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
    if (lowerMessage.includes('fetch failed') || lowerMessage.includes('connect')) {
      return sendErrorResponse(
        res,
        req,
        503,
        'Load to Index requires Meilisearch on http://localhost:7700. Start Meilisearch and retry.',
        {
          code: 'INGESTION_DEPENDENCY_ERROR',
          details: {
            meilisearchUrl:
              process.env.MEILISEARCH_URL ||
              process.env.MEILISEARCH_HOST ||
              'http://localhost:7700',
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
router.post('/validate', authenticate, requireAdmin, (req, res) => {
  try {
    const { dataPath = './data/markdown' } = req.body;

    const objects = loadAllMarkdown(dataPath);
    const results = {
      valid: 0,
      invalid: 0,
      errors: [],
    };

    for (const metadata of objects.values()) {
      const errors = validateMetadata(metadata);

      if (errors.length === 0) {
        results.valid += 1;
      } else {
        results.invalid += 1;
        results.errors.push({
          id: metadata.id,
          errors,
        });
      }
    }

    ingestionState.lastValidatedAt = new Date().toISOString();
    ingestionState.lastDataPath = dataPath;

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
    const { database, selectedSchemas = [], selectedTables = [], outputPath } = req.body;
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

    // Build scope: if selectedTables provided, use that; otherwise use selectedSchemas
    const scope = {
      schemas: Array.isArray(selectedSchemas) ? selectedSchemas : [],
      tables: Array.isArray(selectedTables) ? selectedTables : [],
    };

    const metadata = await extractor.extractAllMetadata(database, scope);
    await extractor.disconnect();

    // Generate markdown files
    const generator = new MarkdownGenerator(metadata);
    const markdowns = generator.generateAllMarkdowns();
    const persisted = persistGeneratedMarkdown(markdowns, database, outputPath);
    ingestionState.lastGeneratedPath = persisted.baseOutputPath;

    return res.json({
      status: 'success',
      message: `Extracted metadata from ${metadata.database}`,
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
        markdownFiles: markdowns.length,
        markdownFilesWritten: persisted.filesWritten,
        markdownOutputPath: persisted.baseOutputPath,
        markdownPreview: markdowns.slice(0, 3).map((m) => ({
          fileName: m.fileName,
          directory: m.directory,
          contentPreview: m.content.substring(0, 300),
        })),
        ready: 'Use the Markdown Importer to process these files',
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SQL_SERVER_CONNECTION_ERROR',
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

    // Get lightweight discovery (no DMV scans for large schemas)
    const [discovery, objectTypeCounts] = await Promise.all([
      extractor.listSchemasAndTables(),
      extractor.listAllObjectsByType(),
    ]);

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

/**
 * GET /api/v1/ingestion/export-zip
 * Export generated markdown directory as a zip archive
 * Requires admin role
 */
router.get('/export-zip', authenticate, requireAdmin, (req, res) => {
  try {
    const requestedPath = String(req.query.dataPath || './docs/generated/sqlserver');
    const resolvedPath = resolve(process.cwd(), requestedPath);

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
  const meilisearchHealthy = await healthCheck();
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
      meilisearchHealthy,
      meilisearchUrl:
        process.env.MEILISEARCH_URL || process.env.MEILISEARCH_HOST || 'http://localhost:7700',
      lastUpdated: new Date().toISOString(),
    },
  });
});

export default router;
