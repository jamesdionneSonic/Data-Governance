import 'dotenv/config';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import MarkdownGenerator from '../src/services/markdownFromSqlServer.js';
import SqlServerMetadataExtractor from '../src/services/sqlServerExtractor.js';
import { SsisMetadataExtractor } from '../src/services/ssisExtractor.js';
import { buildSqlServerApiConnectionContext } from '../src/services/connectorRuntime/sqlServerConnection.js';

const DEFAULT_OUTPUT_PATH = './data/markdown';
const RAW_SQL_PATH = './data/analysis/raw/sqlserver';
const RAW_SSIS_PATH = './data/analysis/raw/ssis';
const SSIS_METADATA_PATH = './data/analysis/raw/ssis/ssis-metadata.json';
const SUMMARY_PATH = './data/analysis/raw/live-domain-refresh-summary.json';
const ALIAS_CONFIG_PATH = './config/lineage-aliases.json';
const SSIS_ONLY = process.argv.includes('--ssis-only');
const SQL_ONLY = process.argv.includes('--sql-only');
const SSIS_FOLDER = valueAfter('--folder');
const SSIS_PROJECT = valueAfter('--project');
const SSIS_PACKAGE = valueAfter('--package');
const SQL_TARGET_FILTERS = valuesFor('--target')
  .concat(valuesFor('--sql-target'))
  .map((value) => value.toLowerCase());

const SQL_TARGETS = [
  {
    id: 'Sonic_DW',
    server: 'L1-5FSQL-01\\INST1',
    database: 'Sonic_DW',
  },
  {
    id: 'VendorData',
    server: 'L1-DWASQL-02',
    port: 12010,
    database: 'VendorData',
  },
  {
    id: 'StagingDB',
    server: 'L1-DWASQL-02',
    port: 12010,
    database: 'StagingDB',
  },
  {
    id: 'ETL_Staging',
    server: 'L1-5FSQL-01\\INST1',
    database: 'ETL_Staging',
  },
  {
    id: 'eLeadDW',
    server: 'L1-DWASQL-02',
    port: 12010,
    database: 'eLeadDW',
  },
  {
    id: 'DMS',
    server: 'L1-DWASQL-02',
    port: 12010,
    database: 'DMS',
  },
  {
    id: 'Speed',
    server: 'L1-DWASQL-02',
    port: 12010,
    database: 'Speed',
  },
  {
    id: 'WebV',
    server: 'L1-DWASQL-02',
    port: 12010,
    database: 'WebV',
  },
  {
    id: 'Sonic_XREF',
    server: 'L1-DWASQL-02',
    port: 12010,
    database: 'Sonic_XREF',
  },
  {
    id: 'BI_WorkDB',
    server: 'L1-DWASQL-02',
    port: 12010,
    database: 'BI_WorkDB',
  },
];

const SSIS_TARGET = {
  id: 'SSIS_UAT',
  server: 'V1-SSIS25-01',
  port: 11040,
  database: 'SSISDB',
};

function valueAfter(flag) {
  const equalsPrefix = `${flag}=`;
  const equalsArg = process.argv.find((arg) => arg.startsWith(equalsPrefix));
  if (equalsArg) return equalsArg.slice(equalsPrefix.length);
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] || '' : '';
}

function valuesFor(flag) {
  const args = process.argv.slice(2);
  const equalsPrefix = `${flag}=`;
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg.startsWith(equalsPrefix)) {
      values.push(arg.slice(equalsPrefix.length));
    } else if (arg === flag && args[index + 1]) {
      values.push(args[index + 1]);
      index += 1;
    }
  }
  return values.filter(Boolean);
}

async function loadAliasConfig() {
  try {
    return JSON.parse(await readFile(resolve(process.cwd(), ALIAS_CONFIG_PATH), 'utf8'));
  } catch (error) {
    console.warn(`[live-refresh] Alias config unavailable: ${error.message}`);
    return {};
  }
}

function sqlTargetsForRun() {
  if (SQL_TARGET_FILTERS.length === 0) return SQL_TARGETS;
  const selected = SQL_TARGETS.filter((target) =>
    SQL_TARGET_FILTERS.includes(String(target.id || '').toLowerCase())
  );
  const missing = SQL_TARGET_FILTERS.filter(
    (filter) => !SQL_TARGETS.some((target) => String(target.id || '').toLowerCase() === filter)
  );
  if (missing.length > 0) {
    throw new Error(`Unknown SQL target(s): ${missing.join(', ')}`);
  }
  return selected;
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

async function persistGeneratedMarkdown(markdowns, database, outputPath = DEFAULT_OUTPUT_PATH) {
  const baseOutputPath = resolve(process.cwd(), outputPath);
  const analysisBasePath = resolve(process.cwd(), RAW_SQL_PATH);
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

async function buildConnection(target, options = {}) {
  const built = await buildSqlServerApiConnectionContext(
    {
      server: target.server,
      port: target.port,
      database: target.database,
      authentication: 'windows',
      encrypt: true,
      trustServerCertificate: true,
    },
    {
      requireDatabase: options.requireDatabase ?? true,
      defaultDatabase: target.database,
      defaultPort: 1433,
      defaultEncrypt: true,
      defaultTrustServerCertificate: true,
      connectionTimeout: 30000,
      requestTimeout: 1200000,
      pool: options.pool || { max: 20, min: 0, idleTimeoutMillis: 30000 },
      sqlAuthLabel: 'sql-server authentication',
      windowsDriverMessage: 'Windows integrated auth requires msnodesqlv8 on a Windows host.',
      windowsIntegratedCredentialMessage:
        'For NTLM Windows auth provide both username and password, or leave both blank for integrated.',
      windowsDriverInstallMessage: 'Windows integrated auth requires msnodesqlv8 on a Windows host.',
    }
  );

  if (built.error) {
    throw new Error(`${target.id}: ${built.error.message}`);
  }

  return built;
}

function summarizeSqlMetadata(metadata, persistResult) {
  return {
    server: metadata.serverName,
    database: metadata.database,
    filesWritten: persistResult.filesWritten,
    counts: {
      tables: metadata.tables?.length || 0,
      synonyms: metadata.synonyms?.length || 0,
      views: metadata.views?.length || 0,
      storedProcedures: metadata.storedProcedures?.length || 0,
      functions: metadata.functions?.length || 0,
      triggers: metadata.triggers?.length || 0,
      relationships: metadata.relationships?.length || 0,
      warnings: metadata.extractionWarnings?.length || 0,
    },
  };
}

function summarizeSsisResult(result) {
  return {
    ssisdbPresent: result.ssisdbPresent,
    counts: {
      packages: result.catalog?.length || 0,
      parameters: result.parameters?.length || 0,
      xmlPackagesParsed: result.xmlMetadata?.length || 0,
      agentJobs: result.agentJobs?.jobs?.length || 0,
      ssisAgentSteps: result.agentJobs?.ssisSteps?.length || 0,
      runtimeSupport: result.runtimeSupport?.length || 0,
      lineageEdges: result.lineageEdges?.length || 0,
      warnings: result.warnings?.length || 0,
    },
    warnings: result.warnings || [],
  };
}

function redactSensitiveMetadata(value) {
  if (Array.isArray(value)) return value.map((item) => redactSensitiveMetadata(item));
  if (value instanceof Date) return value.toISOString();
  if (!value || typeof value !== 'object') return value;

  const redacted = {};
  for (const [key, childValue] of Object.entries(value)) {
    if (/password|passwd|pwd|secret|token|credential/i.test(key)) {
      redacted[key] = '***REDACTED***';
      continue;
    }
    if (
      typeof childValue === 'string' &&
      /(password|passwd|pwd)\s*=/i.test(childValue)
    ) {
      redacted[key] = childValue.replace(
        /(password|passwd|pwd)\s*=\s*[^;]+/gi,
        '$1=***REDACTED***'
      );
      continue;
    }
    redacted[key] = redactSensitiveMetadata(childValue);
  }
  return redacted;
}

async function refreshSqlTarget(target, aliasConfig = {}) {
  console.log(`[live-refresh] SQL ${target.id}: connecting to ${target.server}/${target.database}`);
  const { connConfig, sqlDriver } = await buildConnection(target);
  const extractor = new SqlServerMetadataExtractor({ ...connConfig, ...aliasConfig }, sqlDriver);
  await extractor.connect();
  try {
    const metadata = await extractor.extractAllMetadata(target.database);
    const markdowns = new MarkdownGenerator(metadata).generateAllMarkdowns();
    const persistResult = await persistGeneratedMarkdown(markdowns, target.database);
    const summary = summarizeSqlMetadata(metadata, persistResult);
    console.log(
      `[live-refresh] SQL ${target.id}: ${summary.filesWritten} files, ${summary.counts.relationships} relationships`
    );
    return {
      id: target.id,
      type: 'sql_server',
      status: 'succeeded',
      ...summary,
    };
  } finally {
    await extractor.disconnect();
  }
}

async function refreshSsisTarget(target) {
  console.log(`[live-refresh] SSIS ${target.id}: connecting to ${target.server}/${target.database}`);
  const { connConfig, sqlDriver } = await buildConnection(target, {
    requireDatabase: false,
    pool: { max: 5, min: 0, idleTimeoutMillis: 30000 },
  });
  const extractor = new SsisMetadataExtractor(
    {
      ...connConfig,
      folderName: SSIS_FOLDER || undefined,
      projectName: SSIS_PROJECT || undefined,
      packageName: SSIS_PACKAGE || undefined,
    },
    sqlDriver
  );
  await extractor.connect();
  try {
    const result = await extractor.extractAll({ extractXml: true });
    await mkdir(resolve(process.cwd(), RAW_SSIS_PATH), { recursive: true });
    await writeFile(
      resolve(process.cwd(), SSIS_METADATA_PATH),
      `${JSON.stringify(redactSensitiveMetadata(result), null, 2)}\n`,
      'utf-8'
    );
    const summary = summarizeSsisResult(result);
    console.log(
      `[live-refresh] SSIS ${target.id}: ${summary.counts.packages} packages, ${summary.counts.lineageEdges} edges`
    );
    return {
      id: target.id,
      type: 'ssis',
      status: 'succeeded',
      server: target.server,
      database: target.database,
      ...summary,
    };
  } finally {
    await extractor.disconnect();
  }
}

async function main() {
  const startedAt = new Date().toISOString();
  const results = [];
  const aliasConfig = await loadAliasConfig();

  if (SSIS_ONLY && SQL_ONLY) {
    throw new Error('Use either --ssis-only or --sql-only, not both.');
  }

  if (!SSIS_ONLY) {
    for (const target of sqlTargetsForRun()) {
      results.push(await refreshSqlTarget(target, aliasConfig));
    }
  }

  if (!SQL_ONLY) {
    results.push(await refreshSsisTarget(SSIS_TARGET));
  }

  const summary = {
    startedAt,
    finishedAt: new Date().toISOString(),
    targets: results,
  };
  await mkdir(resolve(process.cwd(), 'data/analysis/raw'), { recursive: true });
  await writeFile(resolve(process.cwd(), SUMMARY_PATH), JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`[live-refresh] Summary written to ${SUMMARY_PATH}`);
}

main().catch(async (err) => {
  const failedAt = new Date().toISOString();
  await mkdir(resolve(process.cwd(), 'data/analysis/raw'), { recursive: true }).catch(() => {});
  await writeFile(
    resolve(process.cwd(), SUMMARY_PATH),
    JSON.stringify(
      {
        failedAt,
        status: 'failed',
        error: {
          message: err.message,
          code: err.code || null,
          stack: err.stack || null,
        },
      },
      null,
      2
    ),
    'utf-8'
  ).catch(() => {});
  console.error(`[live-refresh] Failed: ${err.message}`);
  process.exitCode = 1;
});
