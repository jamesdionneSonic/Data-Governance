import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { XMLParser } from 'fast-xml-parser';
import { BaseConnectorAdapter } from './baseAdapter.js';
import { CANONICAL_EVENT_TYPES, canonicalEvent, warningEvent } from './canonicalMetadata.js';
import { ConnectorConfigError, ConnectorRuntimeError } from './connectorErrors.js';
import { hasDirectSourceClient } from './sourceClients.js';
import { extractTablesFromSQL } from '../sqlServerExtractor.js';
import {
  buildSqlServerConnectionConfig,
  loadSqlServerDriver,
  runtimeProcessIdentityDetails,
  sqlServerCredentialMode,
  sqlServerConnectionRuntimeError,
} from './sqlServerConnection.js';

const execFileAsync = promisify(execFile);

const STREAM = {
  object: CANONICAL_EVENT_TYPES.OBJECT,
  column: CANONICAL_EVENT_TYPES.COLUMN,
  metric: CANONICAL_EVENT_TYPES.METRIC,
  dashboard: CANONICAL_EVENT_TYPES.DASHBOARD,
  report: CANONICAL_EVENT_TYPES.REPORT,
  dataset: CANONICAL_EVENT_TYPES.DATASET,
  semanticModel: CANONICAL_EVENT_TYPES.SEMANTIC_MODEL,
  dataSource: CANONICAL_EVENT_TYPES.DATA_SOURCE,
  lineage: CANONICAL_EVENT_TYPES.LINEAGE_EDGE,
  usage: CANONICAL_EVENT_TYPES.USAGE_EVENT,
};

function stream(name, canonicalType, endpoint, options = {}) {
  return {
    name,
    label: options.label || name.replace(/_/g, ' '),
    canonical_type: canonicalType,
    endpoint,
    method: options.method || 'GET',
    cursor: options.cursor || null,
    pagination: options.pagination || 'page',
    object_type: options.object_type || name,
    metadata: options.metadata || [],
    aliases: options.aliases || [],
  };
}

class BIConnectorAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['base_url'];
    this.requiredCredentialModes = [
      'oauth',
      'api_token_reference',
      'service_account',
      'service_principal',
      'pat',
      'secret_reference',
    ];
    this.capability = {
      ...this.capability,
      supports_usage: true,
      supports_metrics: true,
      supports_semantic_models: true,
    };
    this.streams = [
      stream('folders', STREAM.object, '/folders', {
        metadata: ['folders', 'projects', 'workspaces'],
      }),
      stream('dashboards', STREAM.dashboard, '/dashboards', {
        metadata: ['dashboards', 'tiles', 'visuals'],
      }),
      stream('reports', STREAM.report, '/reports', { metadata: ['reports', 'pages', 'visuals'] }),
      stream('datasets', STREAM.dataset, '/datasets', {
        metadata: ['datasets', 'tables', 'columns'],
      }),
      stream('semantic_models', STREAM.semanticModel, '/semantic-models', {
        metadata: ['models', 'cubes', 'perspectives'],
      }),
      stream('metrics', STREAM.metric, '/metrics', {
        metadata: ['measures', 'metrics', 'calculations'],
      }),
      stream('data_sources', STREAM.dataSource, '/datasources', {
        metadata: ['connections', 'datasources'],
      }),
      stream('lineage', STREAM.lineage, '/lineage', {
        metadata: ['report -> dataset', 'dataset -> source'],
      }),
      stream('usage', STREAM.usage, '/activity', {
        cursor: 'modified_at',
        metadata: ['views', 'subscribers', 'refreshes'],
      }),
    ];
  }
}

class PowerBiAdapter extends BIConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['tenant_id'];
    this.requiredCredentialModes = ['service_principal', 'delegated_oauth'];
    this.streams = [
      stream('workspaces', STREAM.object, 'GET /v1.0/myorg/admin/groups?$top=5000', {
        metadata: ['workspaces', 'capacities'],
      }),
      stream('dashboards', STREAM.dashboard, 'GET /v1.0/myorg/admin/dashboards', {
        metadata: ['dashboards', 'tiles'],
      }),
      stream('reports', STREAM.report, 'GET /v1.0/myorg/admin/reports', {
        metadata: ['reports', 'datasetId', 'workspaceId'],
      }),
      stream('datasets', STREAM.dataset, 'GET /v1.0/myorg/admin/datasets', {
        metadata: ['datasets', 'endorsement', 'sensitivity labels'],
      }),
      stream('dataflows', STREAM.dataset, 'GET /v1.0/myorg/admin/dataflows', {
        metadata: ['dataflows', 'datasources'],
      }),
      stream(
        'datasources',
        STREAM.dataSource,
        'GET /v1.0/myorg/admin/datasets/{datasetId}/datasources',
        { metadata: ['datasource type', 'connection details'] }
      ),
      stream(
        'scanner_metadata',
        STREAM.semanticModel,
        'POST /v1.0/myorg/admin/workspaces/getInfo',
        { method: 'POST', metadata: ['tables', 'columns', 'measures', 'expressions'] }
      ),
      stream('activity_events', STREAM.usage, 'GET /v1.0/myorg/admin/activityevents', {
        cursor: 'activityDateTime',
        metadata: ['view report', 'refresh', 'share'],
      }),
      stream(
        'lineage',
        STREAM.lineage,
        'Power BI artifact relationships and external datasource links',
        { metadata: ['dataflow -> dataset', 'dataset -> report', 'report -> dashboard'] }
      ),
    ];
  }
}

class MicroStrategyAdapter extends BIConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['base_url', 'project_id'];
    this.requiredCredentialModes = ['oauth', 'api_token_reference', 'service_account'];
    this.streams = [
      stream('projects', STREAM.object, 'GET /api/projects', { metadata: ['projects'] }),
      stream('dossiers', STREAM.dashboard, 'GET /api/dossiers', {
        metadata: ['dossiers', 'chapters', 'visualizations'],
      }),
      stream('documents', STREAM.report, 'GET /api/documents', { metadata: ['documents'] }),
      stream('reports', STREAM.report, 'GET /api/v2/reports', {
        metadata: ['reports', 'grids', 'prompts'],
      }),
      stream('cubes', STREAM.dataset, 'GET /api/cubes', {
        metadata: ['intelligent cubes', 'attributes', 'metrics'],
      }),
      stream('schema_objects', STREAM.semanticModel, 'GET /api/model/schema/objects', {
        metadata: ['facts', 'attributes', 'metrics', 'hierarchies'],
      }),
      stream('data_sources', STREAM.dataSource, 'GET /api/datasources', {
        metadata: ['datasource connections'],
      }),
      stream('lineage', STREAM.lineage, 'MicroStrategy object dependencies', {
        metadata: ['report -> cube', 'cube -> datasource', 'metric -> fact'],
      }),
    ];
  }
}

class SsasAdapter extends BIConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['server'];
    this.requiredCredentialModes = ['windows_integrated', 'service_account', 'secret_reference'];
    this.streams = [
      stream('databases', STREAM.object, 'XMLA Discover DBSCHEMA_CATALOGS', {
        metadata: ['databases'],
      }),
      stream('models', STREAM.semanticModel, 'XMLA Discover MDSCHEMA_CUBES / TMSCHEMA_MODEL', {
        metadata: ['tabular models', 'multidimensional cubes'],
      }),
      stream('dimensions', STREAM.object, 'XMLA Discover MDSCHEMA_DIMENSIONS', {
        metadata: ['dimensions', 'hierarchies'],
      }),
      stream('measures', STREAM.metric, 'XMLA Discover MDSCHEMA_MEASURES / TMSCHEMA_MEASURES', {
        metadata: ['measures', 'DAX or MDX expressions'],
      }),
      stream('partitions', STREAM.dataset, 'XMLA Discover TMSCHEMA_PARTITIONS', {
        metadata: ['partitions', 'source queries'],
      }),
      stream('data_sources', STREAM.dataSource, 'XMLA Discover TMSCHEMA_DATA_SOURCES', {
        metadata: ['datasource connection metadata'],
      }),
      stream('roles', STREAM.object, 'XMLA Discover TMSCHEMA_ROLES', {
        metadata: ['security roles'],
      }),
      stream('lineage', STREAM.lineage, 'XMLA model datasource and partition dependencies', {
        metadata: ['model -> datasource', 'measure -> table'],
      }),
    ];
  }
}

function ssrsDateWindow(options = {}, config = {}) {
  const months = Number(
    options.lookback_months ||
      options.lookbackMonths ||
      config.lookback_months ||
      config.lookbackMonths ||
      6
  );
  const safeMonths = Number.isFinite(months) && months > 0 ? Math.min(months, 60) : 6;
  return safeMonths;
}

function ssrsExternalId(prefix, value) {
  return ['ssrs', prefix, value].filter(Boolean).join('/');
}

function ssrsConnectionStrategy(options = {}, config = {}) {
  return String(
    options.connection_strategy ||
      options.connectionStrategy ||
      config.connection_strategy ||
      config.connectionStrategy ||
      ''
  )
    .trim()
    .toLowerCase();
}

function ssrsUsesSqlcmdStrategy(options = {}, config = {}) {
  return ['sqlcmd_windows_auth', 'sqlcmd', 'sqlcmd_windows_integrated'].includes(
    ssrsConnectionStrategy(options, config)
  );
}

function ssrsAllowsSqlcmdFallback(options = {}, config = {}) {
  const strategy = ssrsConnectionStrategy(options, config);
  return ['auto', 'node_then_sqlcmd', 'sqlcmd_fallback'].includes(strategy);
}

function ssrsSqlcmdServer(config = {}) {
  const server = config.server || config.host || config.data_source || config.dataSource;
  const { port } = config;
  if (server && port && !String(server).includes(',')) return `${server},${port}`;
  return server;
}

function ssrsSqlcmdDatabase(config = {}) {
  return config.database || config.catalog || 'ReportServer';
}

function sqlcmdRows(output = '', columns = []) {
  return String(output || '')
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim() && !/^\(\d+ rows affected\)$/i.test(line.trim()))
    .map((line) => {
      const values = line.split('\t');
      return Object.fromEntries(
        columns.map((column, index) => [column, (values[index] || '').trim()])
      );
    });
}

function sqlcmdJson(output = '') {
  const body = String(output || '')
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => {
      const value = line.trim();
      return (
        value &&
        !/^JSON_/i.test(value) &&
        !/^-+$/.test(value) &&
        !/^\(\d+ rows affected\)$/i.test(value)
      );
    })
    .join('');
  return body ? JSON.parse(body) : [];
}

async function runSsrsSqlcmdQuery(config = {}, query, { json = false } = {}) {
  const server = ssrsSqlcmdServer(config);
  const database = ssrsSqlcmdDatabase(config);
  if (!server) {
    throw new ConnectorConfigError(
      'SQL Server sqlcmd extraction requires config.server or config.host.',
      {
        connector_type: config.type || 'sql_server',
        required_config: ['server'],
      }
    );
  }
  const args = ['-S', server, '-E', '-C', '-d', database, '-w', '65535', '-Q', query];
  if (json) args.splice(args.length - 2, 0, '-y', '0');
  else args.splice(args.length - 2, 0, '-h', '-1');
  const { stdout } = await execFileAsync(
    config.sqlcmd_path || config.sqlcmdPath || 'sqlcmd',
    args,
    {
      windowsHide: true,
      maxBuffer: Number(config.sqlcmd_max_buffer || config.sqlcmdMaxBuffer || 128 * 1024 * 1024),
      timeout: Number(config.sqlcmd_timeout_ms || config.sqlcmdTimeoutMs || 120000),
    }
  );
  return json ? sqlcmdJson(stdout) : stdout;
}

function ssrsSqlcmdMetadataQueries(lookbackMonths) {
  const reportStart = `DATEADD(month, -${lookbackMonths}, SYSDATETIME())`;
  const prefix =
    'SET QUOTED_IDENTIFIER ON; SET ANSI_NULLS ON; SET ANSI_PADDING ON; SET ANSI_WARNINGS ON; SET CONCAT_NULL_YIELDS_NULL ON; SET ARITHABORT ON; SET NUMERIC_ROUNDABORT OFF; SET NOCOUNT ON;';
  return {
    connection: `${prefix}
SELECT CAST(CONCAT(
  @@SERVERNAME,
  CHAR(9), DB_NAME(),
  CHAR(9), SYSTEM_USER,
  CHAR(9), CASE WHEN OBJECT_ID('dbo.Catalog') IS NULL THEN 0 ELSE 1 END,
  CHAR(9), CASE WHEN OBJECT_ID('dbo.ExecutionLog3') IS NULL THEN 0 ELSE 1 END,
  CHAR(9), CASE WHEN COL_LENGTH('dbo.Catalog', 'Content') IS NULL THEN 0 ELSE 1 END,
  CHAR(9), CASE WHEN HAS_PERMS_BY_NAME('msdb.dbo.sysjobhistory', 'OBJECT', 'SELECT') = 1 THEN 1 ELSE 0 END
) AS nvarchar(1200));`,
    reports: `${prefix}
SELECT CAST(CONCAT(
  CONVERT(varchar(36), ItemID),
  CHAR(9), REPLACE(Path, CHAR(9), ' '),
  CHAR(9), REPLACE(Name, CHAR(9), ' '),
  CHAR(9), Type,
  CHAR(9), CASE Type WHEN 2 THEN 'report' WHEN 4 THEN 'linked_report' ELSE 'catalog_item' END,
  CHAR(9), CONVERT(varchar(23), CreationDate, 121),
  CHAR(9), CONVERT(varchar(23), ModifiedDate, 121)
) AS nvarchar(1200))
FROM dbo.Catalog
WHERE Type IN (2, 4)
ORDER BY Path;`,
    dataSources: `${prefix}
SELECT CAST(CONCAT(
  CONVERT(varchar(36), ds.ItemID),
  CHAR(9), COALESCE(REPLACE(c.Path, CHAR(9), ' '), ''),
  CHAR(9), COALESCE(REPLACE(c.Name, CHAR(9), ' '), ''),
  CHAR(9), COALESCE(REPLACE(ds.Name, CHAR(9), ' '), ''),
  CHAR(9), COALESCE(REPLACE(ds.Extension, CHAR(9), ' '), ''),
  CHAR(9), COALESCE(CONVERT(varchar(36), ds.Link), ''),
  CHAR(9), COALESCE(REPLACE(linked.Path, CHAR(9), ' '), '')
) AS nvarchar(1200))
FROM dbo.DataSource ds
LEFT JOIN dbo.Catalog c ON ds.ItemID = c.ItemID
LEFT JOIN dbo.Catalog linked ON ds.Link = linked.ItemID
ORDER BY c.Path, ds.Name;`,
    reportDefinitions: `${prefix}
SELECT
  CONVERT(varchar(36), ItemID) AS ItemID,
  Path,
  Name,
  TRY_CONVERT(nvarchar(max), TRY_CONVERT(xml, CONVERT(varbinary(max), Content))) AS DefinitionXml
FROM dbo.Catalog
WHERE Type IN (2, 4)
  AND Content IS NOT NULL
ORDER BY Path
FOR JSON PATH;`,
    sharedDataSourceDefinitions: `${prefix}
SELECT
  CONVERT(varchar(36), ItemID) AS ItemID,
  Path,
  Name,
  TRY_CONVERT(nvarchar(max), TRY_CONVERT(xml, CONVERT(varbinary(max), Content))) AS DefinitionXml
FROM dbo.Catalog
WHERE Type = 5
  AND Content IS NOT NULL
ORDER BY Path
FOR JSON PATH;`,
    usage: `${prefix}
SELECT CAST(CONCAT(
  REPLACE(ItemPath, CHAR(9), ' '),
  CHAR(9), REPLACE(UserName, CHAR(9), ' '),
  CHAR(9), COUNT_BIG(*),
  CHAR(9), CONVERT(varchar(23), MAX(TimeStart), 121),
  CHAR(9), SUM(CASE WHEN Status = 'rsSuccess' THEN 1 ELSE 0 END),
  CHAR(9), SUM(CASE WHEN Status <> 'rsSuccess' THEN 1 ELSE 0 END),
  CHAR(9), MAX(Status)
) AS nvarchar(1200))
FROM dbo.ExecutionLog3
WHERE TimeStart >= ${reportStart}
GROUP BY ItemPath, UserName
ORDER BY ItemPath, MAX(TimeStart) DESC, UserName;`,
    reportUsage: `${prefix}
SELECT CAST(CONCAT(
  REPLACE(ItemPath, CHAR(9), ' '),
  CHAR(9), COUNT_BIG(*),
  CHAR(9), COUNT(DISTINCT UserName),
  CHAR(9), CONVERT(varchar(23), MAX(TimeStart), 121),
  CHAR(9), SUM(CASE WHEN Status = 'rsSuccess' THEN 1 ELSE 0 END),
  CHAR(9), SUM(CASE WHEN Status <> 'rsSuccess' THEN 1 ELSE 0 END)
) AS nvarchar(1200))
FROM dbo.ExecutionLog3
WHERE TimeStart >= ${reportStart}
GROUP BY ItemPath
ORDER BY MAX(TimeStart) DESC, ItemPath;`,
    subscriptions: `${prefix}
SELECT CAST(CONCAT(
  CONVERT(varchar(36), s.SubscriptionID),
  CHAR(9), REPLACE(c.Path, CHAR(9), ' '),
  CHAR(9), REPLACE(c.Name, CHAR(9), ' '),
  CHAR(9), COALESCE(REPLACE(s.Description, CHAR(9), ' '), ''),
  CHAR(9), COALESCE(REPLACE(s.LastStatus, CHAR(9), ' '), ''),
  CHAR(9), COALESCE(CONVERT(varchar(23), s.LastRunTime, 121), ''),
  CHAR(9), COALESCE(REPLACE(s.EventType, CHAR(9), ' '), ''),
  CHAR(9), COALESCE(REPLACE(s.DeliveryExtension, CHAR(9), ' '), ''),
  CHAR(9), COALESCE(CONVERT(varchar(20), s.InactiveFlags), ''),
  CHAR(9), COALESCE(CONVERT(varchar(36), sch.ScheduleID), '')
) AS nvarchar(2000))
FROM dbo.Subscriptions s
JOIN dbo.Catalog c ON s.Report_OID = c.ItemID
LEFT JOIN dbo.ReportSchedule rs ON s.SubscriptionID = rs.SubscriptionID
LEFT JOIN dbo.Schedule sch ON rs.ScheduleID = sch.ScheduleID
ORDER BY s.LastRunTime DESC, c.Path;`,
    agentJobs: `${prefix}
WITH JobHistory AS (
  SELECT
    h.job_id,
    h.run_status,
    DATETIME2FROMPARTS(h.run_date / 10000, (h.run_date % 10000) / 100, h.run_date % 100, h.run_time / 10000, (h.run_time % 10000) / 100, h.run_time % 100, 0, 0) AS JobRunAt
  FROM msdb.dbo.sysjobhistory h
  WHERE h.step_id = 0
)
SELECT CAST(CONCAT(
  REPLACE(c.Path, CHAR(9), ' '),
  CHAR(9), CONVERT(varchar(36), sch.ScheduleID),
  CHAR(9), j.name,
  CHAR(9), j.enabled,
  CHAR(9), h.run_status,
  CHAR(9), COUNT_BIG(*),
  CHAR(9), CONVERT(varchar(23), MAX(h.JobRunAt), 121)
) AS nvarchar(1200))
FROM dbo.Subscriptions s
JOIN dbo.Catalog c ON s.Report_OID = c.ItemID
JOIN dbo.ReportSchedule rs ON s.SubscriptionID = rs.SubscriptionID
JOIN dbo.Schedule sch ON rs.ScheduleID = sch.ScheduleID
JOIN msdb.dbo.sysjobs j ON TRY_CONVERT(uniqueidentifier, j.name) = sch.ScheduleID
JOIN JobHistory h ON h.job_id = j.job_id
WHERE h.JobRunAt >= ${reportStart}
GROUP BY c.Path, sch.ScheduleID, j.name, j.enabled, h.run_status
ORDER BY c.Path, COUNT_BIG(*) DESC;`,
  };
}

function sqlServerSqlcmdMetadataQueries() {
  const prefix = 'SET QUOTED_IDENTIFIER ON; SET NOCOUNT ON;';
  return {
    connection: `${prefix}
SELECT CAST(CONCAT(
  @@SERVERNAME,
  CHAR(9), DB_NAME(),
  CHAR(9), SYSTEM_USER
) AS nvarchar(1200));`,
    tables: `${prefix}
SELECT
  CONCAT(DB_NAME(), '.', s.name, '.', t.name) AS id,
  DB_NAME() AS database_name,
  s.name AS schema_name,
  t.name AS object_name,
  t.name AS name,
  'table' AS object_type,
  SUM(CASE WHEN p.index_id IN (0, 1) THEN p.rows ELSE 0 END) AS row_count,
  t.create_date,
  t.modify_date
FROM sys.tables t
JOIN sys.schemas s ON t.schema_id = s.schema_id
LEFT JOIN sys.partitions p ON t.object_id = p.object_id
WHERE t.is_ms_shipped = 0
GROUP BY s.name, t.name, t.create_date, t.modify_date
ORDER BY s.name, t.name
FOR JSON PATH;`,
    views: `${prefix}
SELECT
  CONCAT(DB_NAME(), '.', s.name, '.', v.name) AS id,
  DB_NAME() AS database_name,
  s.name AS schema_name,
  v.name AS object_name,
  v.name AS name,
  'view' AS object_type,
  v.create_date,
  v.modify_date
FROM sys.views v
JOIN sys.schemas s ON v.schema_id = s.schema_id
WHERE v.is_ms_shipped = 0
ORDER BY s.name, v.name
FOR JSON PATH;`,
    columns: `${prefix}
SELECT
  CONCAT(DB_NAME(), '.', s.name, '.', o.name) AS parent_id,
  DB_NAME() AS database_name,
  s.name AS schema_name,
  o.name AS object_name,
  c.name AS column_name,
  c.name AS name,
  ty.name AS data_type,
  c.column_id AS ordinal_position,
  CASE WHEN c.is_nullable = 1 THEN 'YES' ELSE 'NO' END AS is_nullable,
  c.max_length AS character_maximum_length,
  c.precision AS numeric_precision,
  c.scale AS numeric_scale
FROM sys.objects o
JOIN sys.schemas s ON o.schema_id = s.schema_id
JOIN sys.columns c ON o.object_id = c.object_id
JOIN sys.types ty ON c.user_type_id = ty.user_type_id
WHERE o.type IN ('U', 'V')
  AND o.is_ms_shipped = 0
ORDER BY s.name, o.name, c.column_id
FOR JSON PATH;`,
  };
}

const ssrsXmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  removeNSPrefix: true,
  textNodeName: '#text',
  parseTagValue: false,
  trimValues: true,
});

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value === undefined || value === null) return [];
  return [value];
}

function xmlText(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
    return String(value).trim();
  if (typeof value === 'object') return String(value['#text'] || '').trim();
  return '';
}

function child(node, key) {
  if (!node || typeof node !== 'object') return null;
  return node[key] ?? null;
}

function parseXmlDocument(xmlTextValue) {
  const text = String(xmlTextValue || '').trim();
  if (!text) return null;
  try {
    return ssrsXmlParser.parse(text);
  } catch {
    return null;
  }
}

function parseConnectionStringValue(connectionString = '', keys = []) {
  const escaped = keys.map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const match = String(connectionString || '').match(
    new RegExp(`(?:${escaped})\\s*=\\s*([^;"]+)`, 'i')
  );
  return match ? match[1].trim() : '';
}

function parseConnectionStringServer(connectionString = '') {
  return parseConnectionStringValue(connectionString, [
    'Data Source',
    'Server',
    'Address',
    'Addr',
    'Network Address',
  ]);
}

function parseConnectionStringDatabase(connectionString = '') {
  return parseConnectionStringValue(connectionString, ['Initial Catalog', 'Database']);
}

function canonicalSqlServerName(value = '') {
  return String(value || '')
    .trim()
    .replace(/^tcp:/i, '')
    .split(',')[0]
    .split('\\')[0]
    .trim();
}

function canonicalDatabaseName(value = '') {
  const text = String(value || '').trim();
  if (/^dbsonicdw$/i.test(text) || /^sonic[_\s-]?dw$/i.test(text)) return 'Sonic_DW';
  return text;
}

function cleanSqlIdentifier(value = '') {
  const text = String(value || '')
    .trim()
    .replace(/^\[|\]$/g, '')
    .replace(/^"|"$|^'|'$/g, '')
    .trim();
  return /^(null|undefined)$/i.test(text) ? '' : text;
}

function splitSqlObjectName(value = '') {
  return String(value || '')
    .split('.')
    .map(cleanSqlIdentifier)
    .filter(Boolean);
}

function canonicalSqlObjectId({ server, database, schema, object }) {
  const cleanObject = cleanSqlIdentifier(object);
  if (!cleanObject) return '';
  const cleanServer = canonicalSqlServerName(server);
  const cleanDatabase = canonicalDatabaseName(database);
  const cleanSchema = cleanSqlIdentifier(schema || 'dbo') || 'dbo';
  return [cleanServer, cleanDatabase, cleanSchema, cleanObject].filter(Boolean).join('.');
}

function storedProcedureReference(commandText = '', defaults = {}) {
  const command = String(commandText || '').trim();
  if (!command) return null;
  const firstToken = command.split(/\s+/)[0] || '';
  const withoutExec = command.match(/^\s*exec(?:ute)?\s+([^\s(;]+)/i)?.[1] || firstToken;
  const parts = splitSqlObjectName(withoutExec);
  if (!parts.length) return null;
  const object = parts.pop();
  const schema = parts.pop() || defaults.schema || 'dbo';
  const database = parts.pop() || defaults.database;
  const server = parts.pop() || defaults.server;
  return {
    server,
    database,
    schema,
    object,
    object_id: canonicalSqlObjectId({ server, database, schema, object }),
    reference_type: 'stored_procedure',
  };
}

function sqlReferencesFromCommand(commandText = '', commandType = '', defaults = {}) {
  const command = String(commandText || '').trim();
  if (!command) return [];
  const type = String(commandType || '')
    .trim()
    .toLowerCase();
  if (type === 'storedprocedure' || type === 'stored_procedure') {
    const proc = storedProcedureReference(command, defaults);
    return proc?.object_id ? [proc] : [];
  }
  if (/^\s*exec(?:ute)?\s+/i.test(command)) {
    const proc = storedProcedureReference(command, defaults);
    return proc?.object_id ? [proc] : [];
  }
  return extractTablesFromSQL(command, defaults.server, defaults.database, defaults.schema || 'dbo')
    .map((reference) => {
      const normalized = {
        ...reference,
        database: canonicalDatabaseName(reference.database || defaults.database),
        server: canonicalSqlServerName(reference.server || defaults.server),
        schema: reference.schema || defaults.schema || 'dbo',
      };
      return {
        ...normalized,
        object_id: canonicalSqlObjectId(normalized),
        reference_type: 'table_or_view',
      };
    })
    .filter((reference) => reference.object_id);
}

class SsrsLiveAdapter extends BIConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['server', 'database'];
    this.requiredCredentialModes = ['windows_integrated', 'service_account', 'secret_reference'];
    this.capability = {
      ...this.capability,
      supports_live_read: true,
      supports_usage: true,
      supports_subscriptions: true,
      supports_sql_agent_history: true,
      captures_raw_data: false,
      existing_extractor: 'ReportServer catalog and msdb bridge',
    };
    this.streams = [
      stream('reports', STREAM.report, 'ReportServer.dbo.Catalog', {
        metadata: ['report ItemID', 'path', 'name', 'type', 'created/modified dates'],
      }),
      stream(
        'data_sources',
        STREAM.dataSource,
        'ReportServer.dbo.DataSource and shared Catalog data sources',
        {
          metadata: ['data source references', 'extensions', 'linked shared data sources'],
        }
      ),
      stream('datasets', STREAM.dataset, 'ReportServer RDL DataSets and Query definitions', {
        metadata: [
          'dataset name',
          'data source name',
          'command type',
          'command text',
          'SQL object references',
        ],
      }),
      stream('usage', STREAM.usage, 'ReportServer.dbo.ExecutionLog3', {
        cursor: 'TimeStart',
        metadata: [
          'execution counts',
          'last access',
          'distinct users',
          'status',
          'format',
          'request type',
        ],
      }),
      stream('subscriptions', STREAM.object, 'ReportServer.dbo.Subscriptions', {
        metadata: [
          'subscription status',
          'last run time',
          'delivery extension',
          'schedule relationship',
        ],
      }),
      stream(
        'agent_jobs',
        STREAM.object,
        'msdb.dbo.sysjobs/sysjobhistory joined through ReportSchedule',
        {
          metadata: ['SQL Agent job status', 'job run counts', 'last job run'],
        }
      ),
      stream(
        'lineage',
        STREAM.lineage,
        'ReportServer report-data-source and schedule-report relationships',
        {
          metadata: ['data source -> report', 'SQL Agent schedule -> report'],
        }
      ),
    ];
  }

  async testConnection(options = {}) {
    const credentialWarning = this.validateCredential();
    const warnings = credentialWarning === true ? [] : [credentialWarning];
    if (this.config.mockConnectionCheck) {
      return {
        status: this.config.mockConnectionCheck.status || 'ready',
        live_supported: true,
        live_connection_valid: this.config.mockConnectionCheck.live_connection_valid !== false,
        metadata_discovery_valid:
          this.config.mockConnectionCheck.metadata_discovery_valid !== false,
        warnings,
        details: this.config.mockConnectionCheck.details || {},
      };
    }
    if (
      options.mockMetadata ||
      options.metadata_payload ||
      options.metadataPayload ||
      this.config.seed_metadata ||
      this.config.metadata_payload ||
      this.config.metadataPayload
    ) {
      return {
        status: 'ready',
        live_supported: true,
        live_connection_valid: true,
        metadata_discovery_valid: true,
        warnings,
        details: {
          bridge_metadata_payload: true,
          source_contacted_by:
            options.metadata_payload_source ||
            this.config.metadata_payload_source ||
            'external_metadata_harvest',
        },
      };
    }
    if (!this.config.server && !this.config.host) {
      warnings.push(
        warningEvent({
          connector: this.connector,
          stream: 'connection',
          message:
            'SSRS live extraction requires config.server or config.host when dry_run is false.',
          details: { required_config: ['server', 'database'] },
        })
      );
      return {
        status: 'planned',
        live_supported: true,
        live_connection_valid: true,
        metadata_discovery_valid: true,
        warnings,
        details: { planned_only: true, required_config: ['server', 'database'] },
      };
    }
    if (ssrsUsesSqlcmdStrategy(options, this.config)) {
      return this.testSqlcmdConnection(options, warnings);
    }
    this.validateConfig();
    const credentialMode = sqlServerCredentialMode(this.connector);
    const sqlDriver = this.config.sqlDriver || (await loadSqlServerDriver(credentialMode));
    const connectionConfig =
      this.config.connectionConfig || buildSqlServerConnectionConfig(this.connector).config;
    const pool = new sqlDriver.ConnectionPool(connectionConfig);
    try {
      await pool.connect();
      const result = await pool.request().query(`
        SELECT
          @@SERVERNAME AS server_name,
          DB_NAME() AS database_name,
          SYSTEM_USER AS login_name,
          CASE WHEN OBJECT_ID('dbo.Catalog') IS NULL THEN 0 ELSE 1 END AS has_catalog,
          CASE WHEN OBJECT_ID('dbo.ExecutionLog3') IS NULL THEN 0 ELSE 1 END AS has_execution_log3,
          CASE WHEN COL_LENGTH('dbo.Catalog', 'Content') IS NULL THEN 0 ELSE 1 END AS has_catalog_content,
          CASE WHEN HAS_PERMS_BY_NAME('msdb.dbo.sysjobhistory', 'OBJECT', 'SELECT') = 1 THEN 1 ELSE 0 END AS has_msdb_jobhistory;
      `);
      const row = result.recordset?.[0] || {};
      const metadataDiscoveryValid = row.has_catalog === 1 && row.has_execution_log3 === 1;
      if (!metadataDiscoveryValid) {
        warnings.push(
          warningEvent({
            connector: this.connector,
            stream: 'connection',
            message:
              'Connected to SQL Server, but required ReportServer catalog objects were not visible.',
            details: {
              has_catalog: row.has_catalog === 1,
              has_execution_log3: row.has_execution_log3 === 1,
            },
          })
        );
      }
      if (row.has_msdb_jobhistory !== 1) {
        warnings.push(
          warningEvent({
            connector: this.connector,
            stream: 'agent_jobs',
            message: 'Connected to ReportServer, but msdb SQL Agent history is not readable.',
            details: {
              required_permission: 'SELECT on msdb.dbo.sysjobs and msdb.dbo.sysjobhistory',
            },
          })
        );
      }
      return {
        status: metadataDiscoveryValid ? 'ready' : 'partial',
        live_supported: true,
        live_connection_valid: true,
        metadata_discovery_valid: metadataDiscoveryValid,
        warnings,
        details: {
          server_name: row.server_name || connectionConfig.server || null,
          database_name: row.database_name || this.config.database || null,
          login_name: row.login_name || null,
          reportserver_catalog_visible: row.has_catalog === 1,
          execution_log3_visible: row.has_execution_log3 === 1,
          catalog_content_visible: row.has_catalog_content === 1,
          msdb_jobhistory_visible: row.has_msdb_jobhistory === 1,
          credential_mode: credentialMode,
          ...runtimeProcessIdentityDetails(),
        },
      };
    } catch (err) {
      if (ssrsAllowsSqlcmdFallback(options, this.config)) {
        warnings.push(
          warningEvent({
            connector: this.connector,
            stream: 'connection',
            message:
              'Node SQL Server integrated authentication failed; using sqlcmd Windows-auth fallback.',
            details: {
              failed_strategy: 'node_sql_driver',
              fallback_strategy: 'sqlcmd_windows_auth',
              error_message: err.message,
            },
          })
        );
        return this.testSqlcmdConnection(options, warnings);
      }
      throw sqlServerConnectionRuntimeError(err, this.connector, 'ssrs_connection_validation');
    } finally {
      await pool.close().catch(() => {});
    }
  }

  async testSqlcmdConnection(options = {}, warnings = []) {
    this.validateConfig();
    const lookbackMonths = ssrsDateWindow(options, this.config);
    const queries = ssrsSqlcmdMetadataQueries(lookbackMonths);
    try {
      const rows = sqlcmdRows(await runSsrsSqlcmdQuery(this.config, queries.connection), [
        'server_name',
        'database_name',
        'login_name',
        'has_catalog',
        'has_execution_log3',
        'has_catalog_content',
        'has_msdb_jobhistory',
      ]);
      const row = rows[0] || {};
      const metadataDiscoveryValid = row.has_catalog === '1' && row.has_execution_log3 === '1';
      if (!metadataDiscoveryValid) {
        warnings.push(
          warningEvent({
            connector: this.connector,
            stream: 'connection',
            message:
              'sqlcmd connected to SQL Server, but required ReportServer catalog objects were not visible.',
            details: {
              has_catalog: row.has_catalog === '1',
              has_execution_log3: row.has_execution_log3 === '1',
            },
          })
        );
      }
      if (row.has_msdb_jobhistory !== '1') {
        warnings.push(
          warningEvent({
            connector: this.connector,
            stream: 'agent_jobs',
            message:
              'sqlcmd connected to ReportServer, but msdb SQL Agent history is not readable.',
            details: {
              required_permission: 'SELECT on msdb.dbo.sysjobs and msdb.dbo.sysjobhistory',
            },
          })
        );
      }
      return {
        status: metadataDiscoveryValid ? 'ready' : 'partial',
        live_supported: true,
        live_connection_valid: true,
        metadata_discovery_valid: metadataDiscoveryValid,
        warnings,
        details: {
          server_name: row.server_name || ssrsSqlcmdServer(this.config) || null,
          database_name: row.database_name || ssrsSqlcmdDatabase(this.config) || null,
          login_name: row.login_name || null,
          reportserver_catalog_visible: row.has_catalog === '1',
          execution_log3_visible: row.has_execution_log3 === '1',
          catalog_content_visible: row.has_catalog_content === '1',
          msdb_jobhistory_visible: row.has_msdb_jobhistory === '1',
          credential_mode: 'windows_integrated',
          connection_strategy: 'sqlcmd_windows_auth',
          sqlcmd_path: this.config.sqlcmd_path || this.config.sqlcmdPath || 'sqlcmd',
          ...runtimeProcessIdentityDetails(),
        },
      };
    } catch (err) {
      throw sqlServerConnectionRuntimeError(
        err,
        this.connector,
        'ssrs_sqlcmd_connection_validation'
      );
    }
  }

  async loadMetadata(options = {}) {
    if (this.metadataPromise) return this.metadataPromise;
    const configuredMetadata =
      options.mockMetadata ||
      options.metadata_payload ||
      options.metadataPayload ||
      this.config.mockMetadata ||
      this.config.metadata_payload ||
      this.config.metadataPayload ||
      this.config.seed_metadata ||
      this.config.sample_metadata;
    if (configuredMetadata) {
      const metadata = configuredMetadata.lineage
        ? configuredMetadata
        : {
            ...configuredMetadata,
            lineage: this.buildSsrsLineage(configuredMetadata),
          };
      this.lastMetadata = metadata;
      return metadata;
    }
    if (options.dry_run !== false) return null;
    this.metadataPromise = this.loadLiveMetadata(options).catch((err) => {
      if (err instanceof ConnectorRuntimeError) throw err;
      throw sqlServerConnectionRuntimeError(err, this.connector, 'ssrs_metadata_extraction');
    });
    return this.metadataPromise;
  }

  async loadLiveMetadata(options = {}) {
    if (ssrsUsesSqlcmdStrategy(options, this.config)) {
      return this.loadLiveMetadataViaSqlcmd(options);
    }
    const credentialMode = sqlServerCredentialMode(this.connector);
    const sqlDriver = this.config.sqlDriver || (await loadSqlServerDriver(credentialMode));
    const connectionConfig =
      this.config.connectionConfig || buildSqlServerConnectionConfig(this.connector).config;
    const pool = new sqlDriver.ConnectionPool(connectionConfig);
    const lookbackMonths = ssrsDateWindow(options, this.config);
    try {
      await pool.connect();
      const query = async (sql) => (await pool.request().query(sql)).recordset || [];
      const reports = await query(`
        SELECT
          CONVERT(varchar(36), ItemID) AS ItemID,
          Path,
          Name,
          Type,
          CASE Type WHEN 2 THEN 'report' WHEN 4 THEN 'linked_report' ELSE 'catalog_item' END AS ItemType,
          CreationDate,
          ModifiedDate
        FROM dbo.Catalog
        WHERE Type IN (2, 4)
        ORDER BY Path;
      `);
      const dataSources = await query(`
        SELECT
          CONVERT(varchar(36), ds.ItemID) AS ItemID,
          c.Path AS ReportPath,
          c.Name AS ReportName,
          ds.Name AS DataSourceName,
          ds.Extension,
          CONVERT(varchar(36), ds.Link) AS LinkedItemID,
          linked.Path AS LinkedDataSourcePath
        FROM dbo.DataSource ds
        LEFT JOIN dbo.Catalog c ON ds.ItemID = c.ItemID
        LEFT JOIN dbo.Catalog linked ON ds.Link = linked.ItemID
        ORDER BY c.Path, ds.Name;
      `);
      const reportDefinitions = await query(`
        SELECT
          CONVERT(varchar(36), ItemID) AS ItemID,
          Path,
          Name,
          TRY_CONVERT(nvarchar(max), TRY_CONVERT(xml, CONVERT(varbinary(max), Content))) AS DefinitionXml
        FROM dbo.Catalog
        WHERE Type IN (2, 4)
          AND Content IS NOT NULL
        ORDER BY Path;
      `);
      const sharedDataSourceDefinitions = await query(`
        SELECT
          CONVERT(varchar(36), ItemID) AS ItemID,
          Path,
          Name,
          TRY_CONVERT(nvarchar(max), TRY_CONVERT(xml, CONVERT(varbinary(max), Content))) AS DefinitionXml
        FROM dbo.Catalog
        WHERE Type = 5
          AND Content IS NOT NULL
        ORDER BY Path;
      `);
      const usage = await query(`
        SELECT
          ItemPath,
          UserName,
          COUNT_BIG(*) AS Executions,
          MAX(TimeStart) AS LastAccessed,
          SUM(CASE WHEN Status = 'rsSuccess' THEN 1 ELSE 0 END) AS Successes,
          SUM(CASE WHEN Status <> 'rsSuccess' THEN 1 ELSE 0 END) AS NonSuccesses,
          MAX(Status) AS LastObservedStatus
        FROM dbo.ExecutionLog3
        WHERE TimeStart >= DATEADD(month, -${lookbackMonths}, SYSDATETIME())
        GROUP BY ItemPath, UserName
        ORDER BY ItemPath, LastAccessed DESC, UserName;
      `);
      const reportUsage = await query(`
        SELECT
          ItemPath,
          COUNT_BIG(*) AS Executions,
          COUNT(DISTINCT UserName) AS DistinctUsers,
          MAX(TimeStart) AS LastAccessed,
          SUM(CASE WHEN Status = 'rsSuccess' THEN 1 ELSE 0 END) AS Successes,
          SUM(CASE WHEN Status <> 'rsSuccess' THEN 1 ELSE 0 END) AS NonSuccesses
        FROM dbo.ExecutionLog3
        WHERE TimeStart >= DATEADD(month, -${lookbackMonths}, SYSDATETIME())
        GROUP BY ItemPath
        ORDER BY LastAccessed DESC, ItemPath;
      `);
      const subscriptions = await query(`
        SELECT
          CONVERT(varchar(36), s.SubscriptionID) AS SubscriptionID,
          c.Path AS ReportPath,
          c.Name AS ReportName,
          s.Description,
          s.LastStatus,
          s.LastRunTime,
          s.EventType,
          s.DeliveryExtension,
          s.InactiveFlags,
          CONVERT(varchar(36), sch.ScheduleID) AS ScheduleID
        FROM dbo.Subscriptions s
        JOIN dbo.Catalog c ON s.Report_OID = c.ItemID
        LEFT JOIN dbo.ReportSchedule rs ON s.SubscriptionID = rs.SubscriptionID
        LEFT JOIN dbo.Schedule sch ON rs.ScheduleID = sch.ScheduleID
        ORDER BY s.LastRunTime DESC, c.Path;
      `);
      const agentJobs = await query(`
        WITH JobHistory AS (
          SELECT
            h.job_id,
            h.run_status,
            DATETIME2FROMPARTS(
              h.run_date / 10000,
              (h.run_date % 10000) / 100,
              h.run_date % 100,
              h.run_time / 10000,
              (h.run_time % 10000) / 100,
              h.run_time % 100,
              0,
              0
            ) AS JobRunAt
          FROM msdb.dbo.sysjobhistory h
          WHERE h.step_id = 0
        )
        SELECT
          c.Path AS ReportPath,
          CONVERT(varchar(36), sch.ScheduleID) AS ScheduleID,
          j.name AS JobName,
          j.enabled AS JobEnabled,
          h.run_status AS RunStatus,
          COUNT_BIG(*) AS JobRuns,
          MAX(h.JobRunAt) AS LastJobRun
        FROM dbo.Subscriptions s
        JOIN dbo.Catalog c ON s.Report_OID = c.ItemID
        JOIN dbo.ReportSchedule rs ON s.SubscriptionID = rs.SubscriptionID
        JOIN dbo.Schedule sch ON rs.ScheduleID = sch.ScheduleID
        JOIN msdb.dbo.sysjobs j ON TRY_CONVERT(uniqueidentifier, j.name) = sch.ScheduleID
        JOIN JobHistory h ON h.job_id = j.job_id
        WHERE h.JobRunAt >= DATEADD(month, -${lookbackMonths}, SYSDATETIME())
        GROUP BY c.Path, sch.ScheduleID, j.name, j.enabled, h.run_status
        ORDER BY c.Path, JobRuns DESC;
      `);
      const metadata = {
        extractedAt: new Date().toISOString(),
        lookback_months: lookbackMonths,
        reports,
        data_sources: dataSources,
        dataSources,
        report_definitions: reportDefinitions,
        reportDefinitions,
        shared_data_source_definitions: sharedDataSourceDefinitions,
        sharedDataSourceDefinitions,
        usage,
        report_usage: reportUsage,
        reportUsage,
        subscriptions,
        agent_jobs: agentJobs,
        agentJobs,
      };
      metadata.lineage = this.buildSsrsLineage(metadata);
      metadata.datasets = this.extractSsrsDatasets(metadata);
      this.lastMetadata = metadata;
      return metadata;
    } catch (err) {
      if (ssrsAllowsSqlcmdFallback(options, this.config)) {
        return this.loadLiveMetadataViaSqlcmd(options);
      }
      throw err;
    } finally {
      await pool.close().catch(() => {});
    }
  }

  async loadLiveMetadataViaSqlcmd(options = {}) {
    const lookbackMonths = ssrsDateWindow(options, this.config);
    const queries = ssrsSqlcmdMetadataQueries(lookbackMonths);
    const reports = sqlcmdRows(await runSsrsSqlcmdQuery(this.config, queries.reports), [
      'ItemID',
      'Path',
      'Name',
      'Type',
      'ItemType',
      'CreationDate',
      'ModifiedDate',
    ]);
    const dataSources = sqlcmdRows(await runSsrsSqlcmdQuery(this.config, queries.dataSources), [
      'ItemID',
      'ReportPath',
      'ReportName',
      'DataSourceName',
      'Extension',
      'LinkedItemID',
      'LinkedDataSourcePath',
    ]);
    const reportDefinitions = await runSsrsSqlcmdQuery(this.config, queries.reportDefinitions, {
      json: true,
    });
    const sharedDataSourceDefinitions = await runSsrsSqlcmdQuery(
      this.config,
      queries.sharedDataSourceDefinitions,
      { json: true }
    );
    const usage = sqlcmdRows(await runSsrsSqlcmdQuery(this.config, queries.usage), [
      'ItemPath',
      'UserName',
      'Executions',
      'LastAccessed',
      'Successes',
      'NonSuccesses',
      'LastObservedStatus',
    ]);
    const reportUsage = sqlcmdRows(await runSsrsSqlcmdQuery(this.config, queries.reportUsage), [
      'ItemPath',
      'Executions',
      'DistinctUsers',
      'LastAccessed',
      'Successes',
      'NonSuccesses',
    ]);
    const subscriptions = sqlcmdRows(await runSsrsSqlcmdQuery(this.config, queries.subscriptions), [
      'SubscriptionID',
      'ReportPath',
      'ReportName',
      'Description',
      'LastStatus',
      'LastRunTime',
      'EventType',
      'DeliveryExtension',
      'InactiveFlags',
      'ScheduleID',
    ]);
    const agentJobs = sqlcmdRows(await runSsrsSqlcmdQuery(this.config, queries.agentJobs), [
      'ReportPath',
      'ScheduleID',
      'JobName',
      'JobEnabled',
      'RunStatus',
      'JobRuns',
      'LastJobRun',
    ]);
    const metadata = {
      extractedAt: new Date().toISOString(),
      lookback_months: lookbackMonths,
      extraction_strategy: 'sqlcmd_windows_auth',
      reports,
      data_sources: dataSources,
      dataSources,
      report_definitions: reportDefinitions,
      reportDefinitions,
      shared_data_source_definitions: sharedDataSourceDefinitions,
      sharedDataSourceDefinitions,
      usage,
      report_usage: reportUsage,
      reportUsage,
      subscriptions,
      agent_jobs: agentJobs,
      agentJobs,
    };
    metadata.lineage = this.buildSsrsLineage(metadata);
    metadata.datasets = this.extractSsrsDatasets(metadata);
    this.lastMetadata = metadata;
    return metadata;
  }

  async readStream(streamName, options = {}) {
    const streamConfig = this.streamByName(streamName);
    const metadata = await this.loadMetadata(options);
    if (!metadata) return super.readStream(streamName, options);
    const events = this.eventsForStream(streamName, metadata);
    return {
      stream: streamName,
      events,
      state: {
        cursor: options.cursor || null,
        high_watermark: metadata.extractedAt || metadata.extracted_at || new Date().toISOString(),
      },
      plan: this.streamPlan(streamConfig),
    };
  }

  buildSsrsLineage(metadata = {}) {
    const datasets = metadata.datasets || this.extractSsrsDatasets(metadata);
    const dataSourceEdges = (metadata.data_sources || metadata.dataSources || [])
      .filter((item) => item.ReportPath && (item.LinkedDataSourcePath || item.DataSourceName))
      .map((item) => ({
        id: `datasource:${item.LinkedDataSourcePath || item.DataSourceName}->report:${item.ReportPath}`,
        from: item.LinkedDataSourcePath || `${item.ReportPath}/${item.DataSourceName}`,
        to: item.ReportPath,
        type: 'feeds_report',
        confidence: item.LinkedDataSourcePath ? 0.9 : 0.72,
        evidence_type: 'ReportServer.dbo.DataSource',
        report_path: item.ReportPath,
        data_source_name: item.DataSourceName,
        linked_data_source_path: item.LinkedDataSourcePath || null,
      }));
    const scheduleEdges = (metadata.agent_jobs || metadata.agentJobs || [])
      .filter((item) => item.ReportPath && item.ScheduleID)
      .map((item) => ({
        id: `schedule:${item.ScheduleID}->report:${item.ReportPath}`,
        from: item.ScheduleID,
        to: item.ReportPath,
        type: 'scheduled_execution',
        confidence: 0.8,
        evidence_type: 'ReportSchedule + msdb.sysjobs',
        report_path: item.ReportPath,
        job_name: item.JobName,
      }));
    const datasetEdges = datasets.flatMap((dataset) =>
      (dataset.sql_references || []).map((reference) => ({
        id: `sqlobject:${reference.object_id}->report:${dataset.report_path}`,
        from: reference.object_id,
        to: dataset.report_path,
        type:
          reference.reference_type === 'stored_procedure'
            ? 'procedure_feeds_report'
            : 'source_object_feeds_report',
        confidence: reference.reference_type === 'stored_procedure' ? 0.9 : 0.82,
        evidence_type: 'RDL DataSet Query',
        report_path: dataset.report_path,
        dataset_name: dataset.dataset_name,
        data_source_name: dataset.data_source_name,
        command_type: dataset.command_type,
        canonical_match: {
          object_id: reference.object_id,
          server: reference.server,
          database: reference.database,
          schema: reference.schema,
          object: reference.object,
          match_strategy: 'canonical_sql_object_id',
        },
      }))
    );
    return [...dataSourceEdges, ...scheduleEdges, ...datasetEdges];
  }

  extractSharedDataSourceDefinitions(metadata = {}) {
    const definitions = [
      ...(metadata.shared_data_source_definitions || []),
      ...(metadata.sharedDataSourceDefinitions || []),
    ];
    const byPath = new Map();
    for (const definition of definitions) {
      const doc = parseXmlDocument(
        definition.DefinitionXml || definition.definition_xml || definition.xml
      );
      const root = doc?.RptDataSource || doc?.DataSourceDefinition || doc?.DataSource;
      const body = root?.ConnectionProperties || root;
      const connectString = xmlText(body?.ConnectString || root?.ConnectString);
      byPath.set(definition.Path || definition.path, {
        item_id: definition.ItemID || definition.item_id,
        path: definition.Path || definition.path,
        name: definition.Name || definition.name,
        extension: xmlText(body?.Extension || root?.Extension),
        connect_string: connectString,
        server: canonicalSqlServerName(parseConnectionStringServer(connectString)),
        database: canonicalDatabaseName(parseConnectionStringDatabase(connectString)),
      });
    }
    return byPath;
  }

  extractSsrsDatasets(metadata = {}) {
    if (Array.isArray(metadata.datasets) && metadata.datasets.length) return metadata.datasets;
    const sharedDefinitions = this.extractSharedDataSourceDefinitions(metadata);
    const reportDataSources = metadata.data_sources || metadata.dataSources || [];
    const definitions = [
      ...(metadata.report_definitions || []),
      ...(metadata.reportDefinitions || []),
    ];
    const datasets = [];

    for (const definition of definitions) {
      const reportPathValue = definition.Path || definition.path;
      const reportNameValue = definition.Name || definition.name || reportPathValue;
      const doc = parseXmlDocument(
        definition.DefinitionXml || definition.definition_xml || definition.xml
      );
      const report = doc?.Report || doc;
      if (!report) continue;
      const embeddedSources = new Map();
      for (const source of toArray(child(child(report, 'DataSources'), 'DataSource'))) {
        const name = source.Name || source.name;
        const properties = child(source, 'ConnectionProperties') || {};
        const reference = xmlText(child(source, 'DataSourceReference'));
        const connectString = xmlText(child(properties, 'ConnectString'));
        const shared = sharedDefinitions.get(reference);
        embeddedSources.set(name, {
          name,
          reference,
          connect_string: connectString || shared?.connect_string || '',
          server: canonicalSqlServerName(
            parseConnectionStringServer(connectString) || shared?.server || ''
          ),
          database: canonicalDatabaseName(
            parseConnectionStringDatabase(connectString) || shared?.database || ''
          ),
          extension: xmlText(child(properties, 'DataProvider')) || shared?.extension || '',
        });
      }
      const reportSourceRows = reportDataSources.filter(
        (source) => source.ReportPath === reportPathValue
      );
      for (const source of reportSourceRows) {
        if (source.DataSourceName && !embeddedSources.has(source.DataSourceName)) {
          const shared = sharedDefinitions.get(source.LinkedDataSourcePath);
          embeddedSources.set(source.DataSourceName, {
            name: source.DataSourceName,
            reference: source.LinkedDataSourcePath,
            connect_string: shared?.connect_string || '',
            server: shared?.server || '',
            database: shared?.database || '',
            extension: source.Extension || shared?.extension || '',
          });
        }
      }

      for (const dataset of toArray(child(child(report, 'DataSets'), 'DataSet'))) {
        const query = child(dataset, 'Query') || {};
        const dataSourceName = xmlText(child(query, 'DataSourceName'));
        const commandText = xmlText(child(query, 'CommandText'));
        const commandType =
          xmlText(child(query, 'CommandType')) ||
          (/^\s*exec(?:ute)?\s+/i.test(commandText) ? 'StoredProcedure' : 'Text');
        const source = embeddedSources.get(dataSourceName) || {};
        const defaults = {
          server:
            source.server ||
            canonicalSqlServerName(
              this.config.source_server || this.config.sourceServer || this.config.server || ''
            ),
          database:
            source.database ||
            canonicalDatabaseName(
              this.config.source_database || this.config.sourceDatabase || 'Sonic_DW'
            ),
          schema: this.config.source_schema || this.config.sourceSchema || 'dbo',
        };
        const sqlReferences = sqlReferencesFromCommand(commandText, commandType, defaults);
        datasets.push({
          id: ssrsExternalId('dataset', `${reportPathValue}/${dataset.Name || dataset.name}`),
          report_item_id: definition.ItemID || definition.item_id,
          report_path: reportPathValue,
          report_name: reportNameValue,
          dataset_name: dataset.Name || dataset.name,
          data_source_name: dataSourceName,
          data_source_reference: source.reference || null,
          command_type: commandType,
          command_text: commandText,
          source_server: defaults.server,
          source_database: defaults.database,
          source_schema: defaults.schema,
          sql_references: sqlReferences,
          unresolved_sql_reference: sqlReferences.length === 0 && Boolean(commandText),
        });
      }
    }
    return datasets;
  }

  eventsForStream(streamName, metadata = {}) {
    if (streamName === 'reports') {
      const usageByReport = new Map(
        (metadata.report_usage || metadata.reportUsage || []).map((item) => [item.ItemPath, item])
      );
      return (metadata.reports || []).map((item) => {
        const usage = usageByReport.get(item.Path) || {};
        return canonicalEvent({
          type: STREAM.report,
          connector: this.connector,
          stream: streamName,
          external_id: item.ItemID || item.Path,
          name: item.Name || item.Path,
          object_type: item.ItemType || 'report',
          source_url: item.Path,
          attributes: {
            path: item.Path,
            item_id: item.ItemID,
            item_type: item.ItemType,
            created_at: item.CreationDate,
            modified_at: item.ModifiedDate,
            last_accessed_at: usage.LastAccessed || null,
            execution_count: Number(usage.Executions || 0),
            distinct_user_count: Number(usage.DistinctUsers || 0),
            success_count: Number(usage.Successes || 0),
            non_success_count: Number(usage.NonSuccesses || 0),
          },
          confidence: 0.95,
          evidence: { source_table: 'ReportServer.dbo.Catalog' },
        });
      });
    }
    if (streamName === 'data_sources') {
      return (metadata.data_sources || metadata.dataSources || []).map((item) =>
        canonicalEvent({
          type: STREAM.dataSource,
          connector: this.connector,
          stream: streamName,
          external_id:
            item.LinkedDataSourcePath || `${item.ReportPath || item.ItemID}/${item.DataSourceName}`,
          name: item.LinkedDataSourcePath || item.DataSourceName || 'report data source',
          object_type: item.LinkedDataSourcePath
            ? 'shared_data_source'
            : 'embedded_report_data_source',
          parent_id: item.ReportPath || item.ItemID || null,
          source_url: item.LinkedDataSourcePath || item.ReportPath || null,
          attributes: {
            report_path: item.ReportPath,
            report_name: item.ReportName,
            data_source_name: item.DataSourceName,
            extension: item.Extension,
            linked_item_id: item.LinkedItemID,
            linked_data_source_path: item.LinkedDataSourcePath,
          },
          confidence: item.LinkedDataSourcePath ? 0.92 : 0.74,
          evidence: { source_table: 'ReportServer.dbo.DataSource' },
        })
      );
    }
    if (streamName === 'datasets') {
      const datasets = metadata.datasets || this.extractSsrsDatasets(metadata);
      return datasets.map((item) =>
        canonicalEvent({
          type: STREAM.dataset,
          connector: this.connector,
          stream: streamName,
          external_id: item.id || `${item.report_path}/${item.dataset_name}`,
          name: item.dataset_name || `${item.report_name} dataset`,
          object_type: 'ssrs_report_dataset',
          parent_id: item.report_path,
          source_url: item.report_path,
          attributes: {
            ...item,
            canonical_source_object_ids: (item.sql_references || []).map(
              (reference) => reference.object_id
            ),
            raw_report_result_rows_captured: false,
          },
          confidence: item.sql_references?.length ? 0.88 : 0.65,
          evidence: { source: 'RDL DataSet Query' },
        })
      );
    }
    if (streamName === 'usage') {
      return (metadata.usage || []).map((item) =>
        canonicalEvent({
          type: STREAM.usage,
          connector: this.connector,
          stream: streamName,
          external_id: ssrsExternalId('usage', `${item.ItemPath}/${item.UserName}`),
          name: `${item.ItemPath} used by ${item.UserName}`,
          object_type: 'report_usage',
          parent_id: item.ItemPath,
          source_url: item.ItemPath,
          attributes: {
            report_path: item.ItemPath,
            user_name: item.UserName,
            execution_count: Number(item.Executions || 0),
            last_accessed_at: item.LastAccessed,
            success_count: Number(item.Successes || 0),
            non_success_count: Number(item.NonSuccesses || 0),
            last_observed_status: item.LastObservedStatus,
            lookback_months: metadata.lookback_months || null,
          },
          confidence: 0.96,
          evidence: { source_view: 'ReportServer.dbo.ExecutionLog3' },
        })
      );
    }
    if (streamName === 'subscriptions') {
      return (metadata.subscriptions || []).map((item) =>
        canonicalEvent({
          type: STREAM.object,
          connector: this.connector,
          stream: streamName,
          external_id: item.SubscriptionID,
          name: item.Description || `${item.ReportPath} subscription`,
          object_type: 'ssrs_subscription',
          parent_id: item.ReportPath,
          source_url: item.ReportPath,
          attributes: {
            report_path: item.ReportPath,
            report_name: item.ReportName,
            last_status: item.LastStatus,
            last_run_time: item.LastRunTime,
            event_type: item.EventType,
            delivery_extension: item.DeliveryExtension,
            inactive_flags: item.InactiveFlags,
            schedule_id: item.ScheduleID,
          },
          confidence: 0.92,
          evidence: { source_table: 'ReportServer.dbo.Subscriptions' },
        })
      );
    }
    if (streamName === 'agent_jobs') {
      return (metadata.agent_jobs || metadata.agentJobs || []).map((item) =>
        canonicalEvent({
          type: STREAM.object,
          connector: this.connector,
          stream: streamName,
          external_id: item.JobName || item.ScheduleID,
          name: item.JobName || item.ScheduleID,
          object_type: 'sql_agent_job',
          parent_id: item.ReportPath,
          source_url: item.ReportPath,
          attributes: {
            report_path: item.ReportPath,
            schedule_id: item.ScheduleID,
            job_name: item.JobName,
            job_enabled: item.JobEnabled === true || item.JobEnabled === 1,
            run_status: item.RunStatus,
            job_runs: Number(item.JobRuns || 0),
            last_job_run: item.LastJobRun,
          },
          confidence: 0.9,
          evidence: {
            source_tables: [
              'ReportServer.dbo.ReportSchedule',
              'msdb.dbo.sysjobs',
              'msdb.dbo.sysjobhistory',
            ],
          },
        })
      );
    }
    if (streamName === 'lineage') {
      return (metadata.lineage || this.buildSsrsLineage(metadata)).map((edge) =>
        canonicalEvent({
          type: STREAM.lineage,
          connector: this.connector,
          stream: streamName,
          external_id: edge.id || `${edge.from}->${edge.to}`,
          name: edge.type || 'ssrs_lineage',
          object_type: 'lineage_edge',
          attributes: edge,
          lineage: [{ from: edge.from, to: edge.to, type: edge.type }],
          confidence: edge.confidence || 0.78,
          evidence: { evidence_type: edge.evidence_type || 'ssrs_metadata' },
        })
      );
    }
    return [];
  }
}

class TableauAdapter extends BIConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['base_url', 'site_id'];
    this.requiredCredentialModes = ['pat', 'service_account'];
    this.streams = [
      stream('projects', STREAM.object, 'REST GET /api/{version}/sites/{siteId}/projects', {
        metadata: ['projects'],
      }),
      stream('workbooks', STREAM.dashboard, 'REST GET /api/{version}/sites/{siteId}/workbooks', {
        metadata: ['workbooks', 'views'],
      }),
      stream('views', STREAM.report, 'REST GET /api/{version}/sites/{siteId}/views', {
        metadata: ['views', 'sheets'],
      }),
      stream(
        'datasources',
        STREAM.dataSource,
        'REST GET /api/{version}/sites/{siteId}/datasources',
        { metadata: ['published datasources'] }
      ),
      stream('metadata_graphql', STREAM.lineage, 'Metadata API GraphQL', {
        metadata: ['databases', 'tables', 'columns', 'workbook dependencies'],
      }),
      stream('usage', STREAM.usage, 'REST view/workbook usage stats', {
        metadata: ['view counts', 'favorites'],
      }),
    ];
  }
}

class DataWarehouseAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['database'];
    this.requiredCredentialModes = [
      'service_account',
      'secret_reference',
      'managed_identity',
      'iam_role',
      'workload_identity',
      'key_pair',
    ];
    this.capability = {
      ...this.capability,
      supports_profiling: true,
      supports_live_profile: true,
      profile_framework: 'aggregate_profile_execution',
      profile_dialect: args.connector?.type === 'aws_redshift' ? 'redshift' : args.connector?.type,
    };
    this.streams = [
      stream('schemas', STREAM.object, 'information_schema.schemata', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'information_schema.tables', {
        metadata: ['tables', 'views'],
      }),
      stream('columns', STREAM.column, 'information_schema.columns', {
        metadata: ['columns', 'types', 'nullability'],
      }),
      stream('constraints', STREAM.object, 'information_schema constraints', {
        metadata: ['primary keys', 'foreign keys'],
      }),
      stream('routines', STREAM.object, 'information_schema routines', {
        metadata: ['procedures', 'functions'],
      }),
      stream('usage', STREAM.usage, 'query history / audit views', {
        cursor: 'event_time',
        metadata: ['queries', 'access'],
      }),
      stream('lineage', STREAM.lineage, 'dependency views or parsed SQL', {
        metadata: ['object dependencies'],
      }),
    ];
  }
}

function objectName(object = {}) {
  return (
    object.name ||
    object.objectName ||
    object.object_name ||
    object.packageName ||
    object.package_name ||
    object.projectName ||
    object.project_name ||
    object.folderName ||
    object.folder_name ||
    object.id ||
    'unknown'
  );
}

function objectSchema(object = {}) {
  return object.schema || object.schema_name || object.owner_schema || 'dbo';
}

function tableName(object = {}) {
  return (
    object.table ||
    object.table_name ||
    object.name ||
    object.object_name ||
    String(object.id || '')
      .split('.')
      .pop()
  );
}

function sqlStringLiteral(value = '') {
  return String(value || '').replace(/'/g, "''");
}

function normalizeMetadataColumn(column = {}) {
  const name = column.name || column.column_name || column.COLUMN_NAME;
  return {
    name,
    column_name: name,
    data_type: column.data_type || column.dataType || column.DATA_TYPE || 'unknown',
    ordinal_position:
      column.ordinal_position ?? column.ordinalPosition ?? column.ORDINAL_POSITION ?? null,
    is_nullable: column.is_nullable ?? column.isNullable ?? column.IS_NULLABLE ?? null,
    max_length:
      column.max_length ??
      column.character_maximum_length ??
      column.CHARACTER_MAXIMUM_LENGTH ??
      null,
    numeric_precision: column.numeric_precision ?? column.NUMERIC_PRECISION ?? null,
    numeric_scale: column.numeric_scale ?? column.NUMERIC_SCALE ?? null,
    source: column.source || 'live_information_schema',
  };
}

class SqlServerLiveAdapter extends DataWarehouseAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['database'];
    this.requiredCredentialModes = [
      'service_account',
      'secret_reference',
      'managed_identity',
      'windows_integrated',
    ];
    this.capability = {
      ...this.capability,
      supports_live_read: true,
      supports_profiling: true,
      supports_live_profile: true,
      existing_extractor: 'SqlServerMetadataExtractor',
    };
    this.streams = [
      stream('schemas', STREAM.object, 'sys.schemas and inventory grouping', {
        metadata: ['schemas'],
      }),
      stream('tables', STREAM.object, 'SqlServerMetadataExtractor.extractTables', {
        metadata: ['tables', 'indexes', 'constraints'],
      }),
      stream('views', STREAM.object, 'SqlServerMetadataExtractor.extractViews', {
        metadata: ['views', 'dependencies'],
      }),
      stream('columns', STREAM.column, 'SqlServerMetadataExtractor.extractAllColumns', {
        metadata: ['columns', 'types', 'nullability'],
      }),
      stream('procedures', STREAM.object, 'SqlServerMetadataExtractor.extractStoredProcedures', {
        metadata: ['procedures', 'parameters', 'dependencies'],
      }),
      stream('functions', STREAM.object, 'SqlServerMetadataExtractor.extractFunctions', {
        metadata: ['functions', 'parameters', 'dependencies'],
      }),
      stream('triggers', STREAM.object, 'SqlServerMetadataExtractor.extractTriggers', {
        metadata: ['triggers', 'dependencies'],
      }),
      stream('relationships', STREAM.lineage, 'SqlServerMetadataExtractor.relationships', {
        metadata: ['foreign keys', 'dependency edges', 'procedure load edges'],
      }),
    ];
  }

  async testConnection(options = {}) {
    const credentialWarning = this.validateCredential();
    this.validateConfig();
    const warnings = credentialWarning === true ? [] : [credentialWarning];
    if (this.config.mockConnectionCheck) {
      return {
        status: this.config.mockConnectionCheck.status || 'ready',
        live_supported: true,
        live_connection_valid: this.config.mockConnectionCheck.live_connection_valid !== false,
        metadata_discovery_valid:
          this.config.mockConnectionCheck.metadata_discovery_valid !== false,
        warnings,
        details: this.config.mockConnectionCheck.details || {},
      };
    }
    if (ssrsUsesSqlcmdStrategy(options, this.config)) {
      return this.testSqlcmdConnection(warnings);
    }
    const credentialMode = sqlServerCredentialMode(this.connector);
    const sqlDriver = this.config.sqlDriver || (await loadSqlServerDriver(credentialMode));
    const connectionConfig =
      this.config.connectionConfig || buildSqlServerConnectionConfig(this.connector).config;
    const pool = new sqlDriver.ConnectionPool(connectionConfig);
    try {
      await pool.connect();
      const result = await pool
        .request()
        .query(
          'SELECT DB_NAME() AS database_name, @@SERVERNAME AS server_name, SYSTEM_USER AS login_name;'
        );
      const row = result.recordset?.[0] || {};
      return {
        status: 'ready',
        live_supported: true,
        live_connection_valid: true,
        metadata_discovery_valid: true,
        warnings,
        details: {
          server_name: row.server_name || connectionConfig.server || null,
          database_name: row.database_name || this.config.database || null,
          login_name: row.login_name || null,
          credential_mode: credentialMode,
          ...runtimeProcessIdentityDetails(),
        },
      };
    } catch (err) {
      throw sqlServerConnectionRuntimeError(err, this.connector, 'connection_validation');
    } finally {
      await pool.close().catch(() => {});
    }
  }

  async testSqlcmdConnection(warnings = []) {
    const queries = sqlServerSqlcmdMetadataQueries();
    try {
      const rows = sqlcmdRows(await runSsrsSqlcmdQuery(this.config, queries.connection), [
        'server_name',
        'database_name',
        'login_name',
      ]);
      const row = rows[0] || {};
      return {
        status: 'ready',
        live_supported: true,
        live_connection_valid: true,
        metadata_discovery_valid: true,
        warnings,
        details: {
          server_name: row.server_name || ssrsSqlcmdServer(this.config) || null,
          database_name: row.database_name || this.config.database || null,
          login_name: row.login_name || null,
          credential_mode: 'windows_integrated',
          connection_strategy: 'sqlcmd_windows_auth',
          sqlcmd_path: this.config.sqlcmd_path || this.config.sqlcmdPath || 'sqlcmd',
          ...runtimeProcessIdentityDetails(),
        },
      };
    } catch (err) {
      throw sqlServerConnectionRuntimeError(err, this.connector, 'sqlcmd_connection_validation');
    }
  }

  async loadMetadata(options = {}) {
    if (this.metadataPromise) return this.metadataPromise;
    if (options.mockMetadata || this.config.mockMetadata) {
      const metadata = options.mockMetadata || this.config.mockMetadata;
      this.lastMetadata = metadata;
      return metadata;
    }
    if (options.dry_run !== false) return null;
    if (ssrsUsesSqlcmdStrategy(options, this.config)) {
      this.metadataPromise = this.loadMetadataViaSqlcmd(options);
      return this.metadataPromise;
    }
    this.metadataPromise = (async () => {
      const SqlServerMetadataExtractor = (await import('../sqlServerExtractor.js')).default;
      const credentialMode = sqlServerCredentialMode(this.connector);
      const sqlDriver = this.config.sqlDriver || (await loadSqlServerDriver(credentialMode));
      const connectionConfig =
        this.config.connectionConfig || buildSqlServerConnectionConfig(this.connector).config;
      const extractor = new SqlServerMetadataExtractor(connectionConfig, sqlDriver);
      await extractor.connect();
      try {
        const metadata = await extractor.extractAllMetadata(this.config.database, {
          schemas: this.config.selectedSchemas || this.config.schemas || [],
          tables: this.config.selectedTables || this.config.tables || [],
          excludeSchemas: this.config.excludeSchemas || [],
          excludeTables: this.config.excludeTables || [],
        });
        this.lastMetadata = metadata;
        return metadata;
      } finally {
        await extractor.disconnect().catch(() => {});
      }
    })().catch((err) => {
      if (err instanceof ConnectorRuntimeError) throw err;
      throw sqlServerConnectionRuntimeError(err, this.connector, 'metadata_connection');
    });
    return this.metadataPromise;
  }

  async loadMetadataViaSqlcmd() {
    const queries = sqlServerSqlcmdMetadataQueries();
    const tables = await runSsrsSqlcmdQuery(this.config, queries.tables, { json: true });
    const views = await runSsrsSqlcmdQuery(this.config, queries.views, { json: true });
    const columns = await runSsrsSqlcmdQuery(this.config, queries.columns, { json: true });
    const columnsByParent = new Map();
    for (const column of columns) {
      const parentId =
        column.parent_id ||
        [column.database_name, column.schema_name, column.object_name].filter(Boolean).join('.');
      if (!columnsByParent.has(parentId)) columnsByParent.set(parentId, []);
      columnsByParent.get(parentId).push(normalizeMetadataColumn(column));
    }
    const attachColumns = (item) => {
      const id =
        item.id ||
        [item.database_name, item.schema_name, item.object_name || item.name]
          .filter(Boolean)
          .join('.');
      return {
        ...item,
        database: item.database_name || this.config.database,
        schema: item.schema_name,
        object_name: item.object_name || item.name,
        name: item.name || item.object_name,
        row_count: Number(item.row_count || 0),
        columns: columnsByParent.get(id) || [],
      };
    };
    const metadata = {
      extractedAt: new Date().toISOString(),
      database: this.config.database,
      extraction_strategy: 'sqlcmd_windows_auth',
      tables: tables.map(attachColumns),
      views: views.map(attachColumns),
      storedProcedures: [],
      functions: [],
      triggers: [],
      relationships: [],
    };
    metadata.allObjects = [...metadata.tables, ...metadata.views];
    this.lastMetadata = metadata;
    return metadata;
  }

  async enrichProfileAssetColumns(assets = [], options = {}) {
    if (options.mockColumnMetadata || this.config.mockColumnMetadata) {
      const metadata = options.mockColumnMetadata || this.config.mockColumnMetadata;
      const enriched = assets.map((asset) => {
        const keys = [
          asset.id,
          asset.object_id,
          asset.qualified_name,
          asset.qualifiedName,
          [asset.database || this.config.database, objectSchema(asset), tableName(asset)]
            .filter(Boolean)
            .join('.'),
          [objectSchema(asset), tableName(asset)].filter(Boolean).join('.'),
          tableName(asset),
        ].filter(Boolean);
        const columns = keys.reduce((found, key) => found || metadata[key], null) || [];
        return {
          ...asset,
          columns: columns.map(normalizeMetadataColumn).filter((column) => column.name),
        };
      });
      return {
        status: enriched.some((asset) => asset.columns.length) ? 'succeeded' : 'failed',
        phase: 'metadata_enrichment',
        affected_assets: assets.map((asset) => asset.id || objectName(asset)),
        enriched_assets: enriched
          .filter((asset) => asset.columns.length)
          .map((asset) => asset.id || objectName(asset)),
        assets: enriched,
      };
    }

    if (ssrsUsesSqlcmdStrategy(options, this.config)) {
      try {
        const queries = sqlServerSqlcmdMetadataQueries();
        const allColumns = await runSsrsSqlcmdQuery(this.config, queries.columns, { json: true });
        const byObject = new Map();
        for (const column of allColumns) {
          const key = `${column.schema_name}.${column.object_name}`.toLowerCase();
          if (!byObject.has(key)) byObject.set(key, []);
          byObject.get(key).push(normalizeMetadataColumn(column));
        }
        const enriched = assets.map((asset) => {
          const schema = objectSchema(asset);
          const table = tableName(asset);
          return {
            ...asset,
            columns: byObject.get(`${schema}.${table}`.toLowerCase()) || [],
          };
        });
        return {
          status: enriched.some((asset) => asset.columns.length) ? 'succeeded' : 'failed',
          phase: 'metadata_enrichment',
          affected_assets: assets.map((asset) => asset.id || objectName(asset)),
          enriched_assets: enriched
            .filter((asset) => asset.columns.length)
            .map((asset) => asset.id || objectName(asset)),
          assets: enriched,
        };
      } catch (err) {
        throw sqlServerConnectionRuntimeError(err, this.connector, 'sqlcmd_metadata_enrichment');
      }
    }

    const credentialMode = sqlServerCredentialMode(this.connector);
    const sqlDriver = this.config.sqlDriver || (await loadSqlServerDriver(credentialMode));
    const connectionConfig =
      this.config.connectionConfig || buildSqlServerConnectionConfig(this.connector).config;
    const pool = new sqlDriver.ConnectionPool(connectionConfig);
    try {
      await pool.connect();
      const enriched = [];
      for (const asset of assets) {
        const schema = objectSchema(asset);
        const table = tableName(asset);
        const result = await pool.request().query(`
          SELECT
            COLUMN_NAME AS column_name,
            DATA_TYPE AS data_type,
            ORDINAL_POSITION AS ordinal_position,
            IS_NULLABLE AS is_nullable,
            CHARACTER_MAXIMUM_LENGTH AS character_maximum_length,
            NUMERIC_PRECISION AS numeric_precision,
            NUMERIC_SCALE AS numeric_scale
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = '${sqlStringLiteral(schema)}'
            AND TABLE_NAME = '${sqlStringLiteral(table)}'
          ORDER BY ORDINAL_POSITION;
        `);
        enriched.push({
          ...asset,
          columns: (result.recordset || [])
            .map(normalizeMetadataColumn)
            .filter((column) => column.name),
        });
      }
      return {
        status: enriched.some((asset) => asset.columns.length) ? 'succeeded' : 'failed',
        phase: 'metadata_enrichment',
        affected_assets: assets.map((asset) => asset.id || objectName(asset)),
        enriched_assets: enriched
          .filter((asset) => asset.columns.length)
          .map((asset) => asset.id || objectName(asset)),
        assets: enriched,
      };
    } catch (err) {
      throw sqlServerConnectionRuntimeError(err, this.connector, 'metadata_enrichment');
    } finally {
      await pool.close().catch(() => {});
    }
  }

  async readStream(streamName, options = {}) {
    const streamConfig = this.streamByName(streamName);
    const metadata = await this.loadMetadata(options);
    if (!metadata) return super.readStream(streamName, options);
    const events = this.eventsForStream(streamName, metadata);
    return {
      stream: streamName,
      events,
      state: { high_watermark: metadata.extractedAt || new Date().toISOString() },
      plan: this.streamPlan(streamConfig),
    };
  }

  eventsForStream(streamName, metadata = {}) {
    const eventBase = (item, type, objectType, extra = {}) =>
      canonicalEvent({
        type,
        connector: this.connector,
        stream: streamName,
        external_id: item.id || item.external_id || `${objectType}/${objectName(item)}`,
        name: objectName(item),
        object_type: objectType,
        attributes: { ...item, ...extra },
        confidence: item.confidence || 0.9,
      });

    if (streamName === 'schemas') {
      const schemas = new Set(
        (metadata.allObjects || []).map((item) => item.schema).filter(Boolean)
      );
      return [...schemas].map((schema) =>
        eventBase(
          { id: `${metadata.database || this.config.database}.${schema}`, name: schema },
          STREAM.object,
          'schema'
        )
      );
    }
    if (streamName === 'tables')
      return (metadata.tables || []).map((item) => eventBase(item, STREAM.object, 'table'));
    if (streamName === 'views')
      return (metadata.views || []).map((item) => eventBase(item, STREAM.object, 'view'));
    if (streamName === 'procedures')
      return (metadata.storedProcedures || []).map((item) =>
        eventBase(item, STREAM.object, 'stored_procedure')
      );
    if (streamName === 'functions')
      return (metadata.functions || []).map((item) => eventBase(item, STREAM.object, 'function'));
    if (streamName === 'triggers')
      return (metadata.triggers || []).map((item) => eventBase(item, STREAM.object, 'trigger'));
    if (streamName === 'columns') {
      return [...(metadata.tables || []), ...(metadata.views || [])].flatMap((object) =>
        (object.columns || []).map((column) =>
          canonicalEvent({
            type: STREAM.column,
            connector: this.connector,
            stream: streamName,
            external_id: `${object.id || object.name}/${column.name || column.column_name}`,
            name: column.name || column.column_name,
            object_type: 'column',
            parent_id: object.id || object.name,
            attributes: column,
            confidence: 0.9,
          })
        )
      );
    }
    if (streamName === 'relationships') {
      return (metadata.relationships || []).map((edge) =>
        canonicalEvent({
          type: STREAM.lineage,
          connector: this.connector,
          stream: streamName,
          external_id: edge.id || `${edge.fromTable || edge.from}->${edge.toTable || edge.to}`,
          name: edge.type || edge.edgeType || 'sql_dependency',
          object_type: 'lineage_edge',
          attributes: edge,
          lineage: [
            {
              from: edge.fromTable || edge.from,
              to: edge.toTable || edge.to,
              type: edge.type || edge.edgeType,
            },
          ],
          confidence: edge.confidence || 0.75,
        })
      );
    }
    return [];
  }
}

class CloudStorageAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['account'];
    this.requiredCredentialModes = [
      'managed_identity',
      'service_principal',
      'iam_role',
      'workload_identity',
      'access_key_reference',
      'sas_reference',
    ];
    this.streams = [
      stream('containers', STREAM.object, 'list buckets/containers', {
        metadata: ['buckets', 'containers'],
      }),
      stream('objects', STREAM.object, 'list object metadata', {
        cursor: 'last_modified',
        metadata: ['paths', 'size', 'etag', 'last modified'],
      }),
      stream('schemas', STREAM.dataset, 'infer schema from safe samples or manifests', {
        metadata: ['file formats', 'schemas'],
      }),
      stream('classifications', STREAM.object, 'classification tags and labels', {
        metadata: ['sensitivity', 'policy labels'],
      }),
      stream('lineage', STREAM.lineage, 'storage path dependencies', {
        metadata: ['path -> dataset'],
      }),
    ];
  }
}

class CloudPlatformAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['account'];
    this.requiredCredentialModes = [
      'managed_identity',
      'service_principal',
      'iam_role',
      'workload_identity',
      'service_account',
    ];
    this.streams = [
      stream('assets', STREAM.object, 'catalog/datamap assets', {
        metadata: ['registered assets'],
      }),
      stream('schemas', STREAM.dataset, 'catalog schemas', {
        metadata: ['schemas', 'tables', 'columns'],
      }),
      stream('classifications', STREAM.object, 'catalog classifications', {
        metadata: ['tags', 'sensitivity'],
      }),
      stream('glossary', STREAM.object, 'catalog glossary', {
        metadata: ['terms', 'relationships'],
      }),
      stream('lineage', STREAM.lineage, 'catalog lineage APIs', {
        metadata: ['upstream', 'downstream'],
      }),
    ];
  }
}

class PipelineAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['base_url'];
    this.requiredCredentialModes = [
      'managed_identity',
      'service_principal',
      'basic_auth',
      'bearer_token_reference',
      'api_token_reference',
      'repo_reference',
    ];
    this.streams = [
      stream('pipelines', STREAM.object, 'pipelines/dags/jobs endpoint', {
        metadata: ['pipelines', 'jobs', 'dags'],
      }),
      stream('tasks', STREAM.object, 'tasks/activities endpoint', {
        metadata: ['tasks', 'activities', 'operators'],
      }),
      stream('datasets', STREAM.dataset, 'datasets endpoint', { metadata: ['pipeline datasets'] }),
      stream('connections', STREAM.dataSource, 'connections/linked services endpoint', {
        metadata: ['source and target connections'],
      }),
      stream('schedules', STREAM.object, 'triggers/schedules endpoint', {
        metadata: ['schedules', 'triggers'],
      }),
      stream('lineage', STREAM.lineage, 'pipeline dependency graph', {
        metadata: ['task -> dataset', 'dataset -> task'],
      }),
    ];
  }
}

class SsisLiveAdapter extends PipelineAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['server'];
    this.requiredCredentialModes = ['windows_integrated', 'service_account', 'secret_reference'];
    this.capability = {
      ...this.capability,
      supports_live_read: true,
      existing_extractor: 'SsisMetadataExtractor',
    };
    this.streams = [
      stream('catalog', STREAM.object, 'SsisMetadataExtractor.extractCatalogInventory', {
        metadata: ['folders', 'projects', 'packages'],
      }),
      stream('packages', STREAM.object, 'SsisMetadataExtractor.extractPackageXmlMetadata', {
        metadata: ['packages', 'control flow', 'data flow'],
      }),
      stream('tasks', STREAM.object, 'SsisMetadataExtractor XML task parsing', {
        metadata: ['executables', 'components', 'SQL tasks'],
      }),
      stream('connections', STREAM.dataSource, 'SSIS connection managers', {
        metadata: ['connection managers', 'resolved dynamic connections'],
      }),
      stream('parameters', STREAM.object, 'SsisMetadataExtractor.extractParameters', {
        metadata: ['project and package parameters'],
      }),
      stream('environments', STREAM.object, 'SsisMetadataExtractor.extractEnvironments', {
        metadata: ['environment variables'],
      }),
      stream('agent_jobs', STREAM.object, 'SsisMetadataExtractor.extractAgentJobs', {
        metadata: ['SQL Agent jobs', 'SSIS job steps'],
      }),
      stream('lineage', STREAM.lineage, 'SsisMetadataExtractor.buildLineageEdges', {
        metadata: ['package calls', 'source-target edges', 'SQL task edges'],
      }),
    ];
  }

  async testConnection() {
    const credentialWarning = this.validateCredential();
    this.validateConfig();
    const warnings = credentialWarning === true ? [] : [credentialWarning];
    if (this.config.mockConnectionCheck) {
      return {
        status: this.config.mockConnectionCheck.status || 'ready',
        live_supported: true,
        live_connection_valid: this.config.mockConnectionCheck.live_connection_valid !== false,
        metadata_discovery_valid:
          this.config.mockConnectionCheck.metadata_discovery_valid !== false,
        warnings,
        details: this.config.mockConnectionCheck.details || {},
      };
    }
    const credentialMode = sqlServerCredentialMode(this.connector);
    const sqlDriver = this.config.sqlDriver || (await loadSqlServerDriver(credentialMode));
    const connectionConfig =
      this.config.connectionConfig || buildSqlServerConnectionConfig(this.connector).config;
    const pool = new sqlDriver.ConnectionPool(connectionConfig);
    try {
      await pool.connect();
      const presentResult = await pool
        .request()
        .query("SELECT name FROM sys.databases WHERE name = 'SSISDB' AND state_desc = 'ONLINE';");
      const ssisdbPresent = Boolean(presentResult.recordset?.[0]?.name);
      let metadataDiscoveryValid = false;
      if (ssisdbPresent) {
        try {
          await pool.request().query('USE SSISDB; SELECT TOP 1 folder_id FROM catalog.folders;');
          metadataDiscoveryValid = true;
        } catch (err) {
          warnings.push(
            warningEvent({
              connector: this.connector,
              stream: 'connection',
              message: `Connected to SQL Server, but SSIS catalog discovery failed: ${err.message}`,
              details: { phase: 'catalog_probe' },
            })
          );
        }
      } else {
        warnings.push(
          warningEvent({
            connector: this.connector,
            stream: 'connection',
            message:
              'Connected to SQL Server, but SSISDB is not online or not visible to this runtime.',
            details: { phase: 'catalog_probe' },
          })
        );
      }
      return {
        status: metadataDiscoveryValid ? 'ready' : 'degraded',
        live_supported: true,
        live_connection_valid: true,
        metadata_discovery_valid: metadataDiscoveryValid,
        warnings,
        details: {
          server_name: connectionConfig.server || this.config.server || null,
          database_name: connectionConfig.database || this.config.database || null,
          credential_mode: credentialMode,
          ssisdb_present: ssisdbPresent,
          ...runtimeProcessIdentityDetails(),
        },
      };
    } catch (err) {
      throw sqlServerConnectionRuntimeError(err, this.connector, 'connection_validation');
    } finally {
      await pool.close().catch(() => {});
    }
  }

  async loadMetadata(options = {}) {
    if (this.metadataPromise) return this.metadataPromise;
    if (options.mockMetadata || this.config.mockMetadata) {
      const metadata = options.mockMetadata || this.config.mockMetadata;
      this.lastMetadata = metadata;
      return metadata;
    }
    if (options.dry_run !== false) return null;
    this.metadataPromise = (async () => {
      const { SsisMetadataExtractor } = await import('../ssisExtractor.js');
      const credentialMode = sqlServerCredentialMode(this.connector);
      const sqlDriver = this.config.sqlDriver || (await loadSqlServerDriver(credentialMode));
      const connectionConfig =
        this.config.connectionConfig || buildSqlServerConnectionConfig(this.connector).config;
      const extractor = new SsisMetadataExtractor(connectionConfig, sqlDriver);
      await extractor.connect();
      try {
        const selectedStreamNames = this.selectedStreams(options).map((item) => item.name);
        const catalogOnly =
          selectedStreamNames.every((name) => name === 'catalog') && options.extractXml === false;
        let metadata;
        if (catalogOnly) {
          const warnings = [];
          const ssisdbPresent = await extractor.checkSsisdb(warnings);
          metadata = {
            extractedAt: new Date().toISOString(),
            ssisdbPresent,
            catalog: ssisdbPresent
              ? await extractor.extractCatalogInventory(warnings, options)
              : [],
            parameters: [],
            executables: [],
            environments: { variables: [] },
            executionHistory: [],
            componentPhases: [],
            dataStatistics: [],
            executionParameterValues: [],
            eventMessages: [],
            validations: [],
            xmlMetadata: [],
            scaleOut: { workers: [], tasks: [] },
            agentJobs: { jobs: [], ssisSteps: [] },
            legacyLog: [],
            msdbPackages: [],
            performanceStats: [],
            projectVersionHistory: [],
            lineageEdges: [],
            warnings,
          };
        } else {
          metadata = await extractor.extractAll({
            extractXml: options.extractXml !== false,
            folderName: options.folderName || options.folder_name,
            folder: options.folder,
            projectName: options.projectName || options.project_name,
            project: options.project,
            packageName: options.packageName || options.package_name,
            package: options.package,
            packages: options.packages,
            selectedPackages: options.selectedPackages,
          });
        }
        this.lastMetadata = metadata;
        return metadata;
      } finally {
        await extractor.disconnect().catch(() => {});
      }
    })().catch((err) => {
      throw new ConnectorRuntimeError(`SSIS extraction failed: ${err.message}`, {
        connector_id: this.id,
        connector_type: this.type,
        details: { original_error: err.message },
      });
    });
    return this.metadataPromise;
  }

  async readStream(streamName, options = {}) {
    const streamConfig = this.streamByName(streamName);
    const metadata = await this.loadMetadata(options);
    if (!metadata) return super.readStream(streamName, options);
    const events = this.eventsForStream(streamName, metadata);
    return {
      stream: streamName,
      events,
      state: { high_watermark: metadata.extractedAt || new Date().toISOString() },
      plan: this.streamPlan(streamConfig),
    };
  }

  eventsForStream(streamName, metadata = {}) {
    const event = (item, type, objectType, extra = {}) =>
      canonicalEvent({
        type,
        connector: this.connector,
        stream: streamName,
        external_id:
          item.id ||
          item.packageId ||
          item.packageName ||
          item.project_id ||
          item.project_name ||
          objectName(item),
        name: objectName(item),
        object_type: objectType,
        attributes: { ...item, ...extra },
        confidence: item.confidence || 0.85,
      });

    if (streamName === 'catalog')
      return (metadata.catalog || []).map((item) =>
        event(item, STREAM.object, 'ssis_catalog_object')
      );
    if (streamName === 'packages')
      return (metadata.xmlMetadata || []).map((item) => event(item, STREAM.object, 'ssis_package'));
    if (streamName === 'tasks') {
      return (metadata.xmlMetadata || []).flatMap((pkg) =>
        [
          ...(pkg.sqlTasks || []),
          ...(pkg.packageTasks || []),
          ...(pkg.dataFlowComponents || []),
        ].map((task) =>
          event(
            {
              ...task,
              id: `${pkg.packageId || pkg.packageName}/${task.taskName || task.componentName || objectName(task)}`,
            },
            STREAM.object,
            'ssis_task',
            { package_id: pkg.packageId || pkg.packageName }
          )
        )
      );
    }
    if (streamName === 'connections') {
      return (metadata.xmlMetadata || []).flatMap((pkg) =>
        (pkg.connectionManagers || []).map((connection) =>
          event(connection, STREAM.dataSource, 'ssis_connection', {
            package_id: pkg.packageId || pkg.packageName,
          })
        )
      );
    }
    if (streamName === 'parameters')
      return (metadata.parameters || []).map((item) =>
        event(item, STREAM.object, 'ssis_parameter')
      );
    if (streamName === 'environments')
      return (metadata.environments?.variables || []).map((item) =>
        event(item, STREAM.object, 'ssis_environment_variable')
      );
    if (streamName === 'agent_jobs')
      return [...(metadata.agentJobs?.jobs || []), ...(metadata.agentJobs?.ssisSteps || [])].map(
        (item) => event(item, STREAM.object, 'sql_agent_job')
      );
    if (streamName === 'lineage') {
      return (metadata.lineageEdges || []).map((edge) =>
        canonicalEvent({
          type: STREAM.lineage,
          connector: this.connector,
          stream: streamName,
          external_id: edge.id || `${edge.from}->${edge.to}`,
          name: edge.edgeType || 'ssis_lineage',
          object_type: 'lineage_edge',
          attributes: edge,
          lineage: [{ from: edge.from, to: edge.to, type: edge.edgeType }],
          confidence: edge.confidence || 0.8,
        })
      );
    }
    return [];
  }
}

class RepositoryAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['repo_url'];
    this.requiredCredentialModes = ['oauth_app', 'pat_reference', 'ssh_key_reference'];
    this.streams = [
      stream('repositories', STREAM.object, 'provider repository API', {
        metadata: ['repos', 'branches'],
      }),
      stream('python_scripts', STREAM.object, 'repository tree *.py', {
        metadata: ['python ETL scripts', 'DAG files'],
      }),
      stream('sql_files', STREAM.object, 'repository tree *.sql', {
        metadata: ['SQL transformations'],
      }),
      stream('dbt_artifacts', STREAM.semanticModel, 'manifest.json/catalog.json/sources.json', {
        metadata: ['dbt models', 'sources', 'tests'],
      }),
      stream('notebooks', STREAM.object, 'repository tree *.ipynb', { metadata: ['notebooks'] }),
      stream('lineage', STREAM.lineage, 'parsed code dependencies', {
        metadata: ['code -> table', 'model -> source'],
      }),
    ];
  }
}

class ApiAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['spec_url'];
    this.requiredCredentialModes = ['none', 'api_token_reference', 'oauth'];
    this.streams = [
      stream('openapi_spec', STREAM.object, 'OpenAPI document', {
        metadata: ['paths', 'components', 'schemas'],
      }),
      stream('endpoints', STREAM.object, 'OpenAPI paths', { metadata: ['operations', 'methods'] }),
      stream('schemas', STREAM.dataset, 'OpenAPI components.schemas', {
        metadata: ['request and response schemas'],
      }),
      stream('lineage', STREAM.lineage, 'API schema to data product links', {
        metadata: ['endpoint -> schema'],
      }),
    ];
  }
}

class StreamingAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['cluster'];
    this.requiredCredentialModes = ['service_account', 'api_key_reference', 'secret_reference'];
    this.streams = [
      stream('clusters', STREAM.object, 'cluster metadata endpoint', {
        metadata: ['clusters', 'brokers'],
      }),
      stream('topics', STREAM.dataset, 'topic listing endpoint', {
        metadata: ['topics', 'partitions', 'retention'],
      }),
      stream('schemas', STREAM.dataset, 'schema registry endpoint', {
        metadata: ['subjects', 'versions', 'fields'],
      }),
      stream('consumers', STREAM.object, 'consumer groups endpoint', {
        metadata: ['consumer groups', 'offsets'],
      }),
      stream('lineage', STREAM.lineage, 'producer and consumer topic relationships', {
        metadata: ['producer -> topic', 'topic -> consumer'],
      }),
    ];
  }
}

class ErpCrmAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['base_url'];
    this.requiredCredentialModes = [
      'connected_app',
      'oauth',
      'service_account',
      'secret_reference',
    ];
    this.streams = [
      stream('objects', STREAM.object, 'object metadata endpoint', {
        metadata: ['business objects', 'entities'],
      }),
      stream('fields', STREAM.column, 'field metadata endpoint', {
        metadata: ['fields', 'types', 'relationships'],
      }),
      stream('relationships', STREAM.lineage, 'relationship metadata endpoint', {
        metadata: ['parent-child relationships'],
      }),
      stream('reports', STREAM.report, 'report metadata endpoint', {
        metadata: ['reports', 'folders'],
      }),
      stream('dashboards', STREAM.dashboard, 'dashboard metadata endpoint', {
        metadata: ['dashboards', 'components'],
      }),
      stream('lineage', STREAM.lineage, 'object/report dependency endpoint', {
        metadata: ['report -> object', 'object -> object'],
      }),
    ];
  }
}

class MlFeatureAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['workspace'];
    this.requiredCredentialModes = ['service_account', 'api_token_reference', 'oauth'];
    this.streams = [
      stream('feature_sets', STREAM.dataset, 'feature registry endpoint', {
        metadata: ['feature sets', 'entities'],
      }),
      stream('features', STREAM.column, 'feature metadata endpoint', {
        metadata: ['features', 'types', 'owners'],
      }),
      stream('models', STREAM.object, 'model registry endpoint', {
        metadata: ['models', 'versions'],
      }),
      stream('lineage', STREAM.lineage, 'feature/model lineage endpoint', {
        metadata: ['source -> feature', 'feature -> model'],
      }),
    ];
  }
}

function documentedBridge({
  requiredConfig,
  docs = [],
  kind = 'documented_metadata_bridge',
  streams = [],
}) {
  return { requiredConfig, docs, kind, streams };
}

const DOCUMENTED_BRIDGES = {
  sql_server: documentedBridge({
    kind: 'existing_extractor_bridge',
    docs: [
      'https://learn.microsoft.com/sql/relational-databases/system-information-schema-views/system-information-schema-views-transact-sql',
    ],
  }),
  ssis: documentedBridge({
    kind: 'existing_extractor_bridge',
    docs: [
      'https://learn.microsoft.com/sql/integration-services/catalog/integration-services-ssis-catalog',
    ],
  }),
  postgresql: documentedBridge({
    requiredConfig: ['host', 'database'],
    docs: ['https://www.postgresql.org/docs/current/infoschema.html'],
    streams: [
      stream('schemas', STREAM.object, 'information_schema.schemata', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'information_schema.tables', {
        aliases: ['tables', 'views'],
        metadata: ['tables', 'views'],
      }),
      stream('columns', STREAM.column, 'information_schema.columns', {
        aliases: ['columns', 'fields'],
        metadata: ['columns', 'data types'],
      }),
      stream('constraints', STREAM.object, 'information_schema.table_constraints', {
        metadata: ['primary keys', 'foreign keys'],
      }),
      stream('routines', STREAM.object, 'information_schema.routines', {
        metadata: ['functions', 'procedures'],
      }),
      stream('lineage', STREAM.lineage, 'pg_depend / parsed SQL dependencies', {
        metadata: ['dependencies'],
      }),
    ],
  }),
  snowflake: documentedBridge({
    requiredConfig: ['account', 'database'],
    docs: [
      'https://docs.snowflake.com/en/sql-reference/info-schema',
      'https://docs.snowflake.com/en/sql-reference/account-usage',
    ],
    streams: [
      stream('databases', STREAM.object, 'SHOW DATABASES / ACCOUNT_USAGE.DATABASES', {
        metadata: ['databases'],
      }),
      stream('schemas', STREAM.object, 'INFORMATION_SCHEMA.SCHEMATA', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'INFORMATION_SCHEMA.TABLES', {
        metadata: ['tables', 'views'],
      }),
      stream('columns', STREAM.column, 'INFORMATION_SCHEMA.COLUMNS', {
        metadata: ['columns', 'data types'],
      }),
      stream('tags', STREAM.object, 'ACCOUNT_USAGE.TAG_REFERENCES', {
        metadata: ['tags', 'classifications'],
      }),
      stream('usage', STREAM.usage, 'ACCOUNT_USAGE.QUERY_HISTORY', { metadata: ['query usage'] }),
      stream('lineage', STREAM.lineage, 'ACCESS_HISTORY / OBJECT_DEPENDENCIES', {
        metadata: ['object dependencies'],
      }),
    ],
  }),
  bigquery: documentedBridge({
    requiredConfig: ['project_id'],
    docs: ['https://cloud.google.com/bigquery/docs/information-schema-intro'],
    streams: [
      stream('datasets', STREAM.object, 'BigQuery datasets.list / INFORMATION_SCHEMA.SCHEMATA', {
        metadata: ['datasets'],
      }),
      stream('tables', STREAM.object, 'INFORMATION_SCHEMA.TABLES', {
        metadata: ['tables', 'views'],
      }),
      stream('columns', STREAM.column, 'INFORMATION_SCHEMA.COLUMNS', {
        metadata: ['columns', 'policy tags'],
      }),
      stream('jobs', STREAM.usage, 'INFORMATION_SCHEMA.JOBS_BY_PROJECT', {
        metadata: ['query jobs'],
      }),
      stream('lineage', STREAM.lineage, 'Data Lineage API / parsed query jobs', {
        metadata: ['job lineage'],
      }),
    ],
  }),
  databricks: documentedBridge({
    requiredConfig: ['workspace_url'],
    docs: [
      'https://docs.databricks.com/api/workspace/catalogs',
      'https://docs.databricks.com/api/workspace/tables',
    ],
    streams: [
      stream('catalogs', STREAM.object, 'Unity Catalog GET /api/2.1/unity-catalog/catalogs', {
        metadata: ['catalogs'],
      }),
      stream('schemas', STREAM.object, 'Unity Catalog schemas endpoint', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'Unity Catalog tables endpoint', {
        metadata: ['tables', 'views'],
      }),
      stream('columns', STREAM.column, 'Unity Catalog table schema', { metadata: ['columns'] }),
      stream('jobs', STREAM.object, 'Jobs API list jobs', { metadata: ['jobs'] }),
      stream('notebooks', STREAM.object, 'Workspace API list/export metadata', {
        metadata: ['notebooks'],
      }),
      stream('lineage', STREAM.lineage, 'Unity Catalog lineage API', { metadata: ['lineage'] }),
    ],
  }),
  azure_purview: documentedBridge({
    requiredConfig: ['account'],
    docs: [
      'https://learn.microsoft.com/purview/data-map-search-apis',
      'https://learn.microsoft.com/purview/catalog-lineage-user-guide',
    ],
    streams: [
      stream('assets', STREAM.object, 'Purview Data Map search/query APIs', {
        metadata: ['assets'],
      }),
      stream('schemas', STREAM.dataset, 'Purview entity relationships', { metadata: ['schemas'] }),
      stream('classifications', STREAM.object, 'Purview classifications', {
        metadata: ['classifications'],
      }),
      stream('glossary', STREAM.object, 'Purview glossary APIs', { metadata: ['terms'] }),
      stream('lineage', STREAM.lineage, 'Purview lineage APIs', { metadata: ['process lineage'] }),
    ],
  }),
  azure_storage: documentedBridge({
    requiredConfig: ['account'],
    docs: [
      'https://learn.microsoft.com/rest/api/storageservices/list-containers2',
      'https://learn.microsoft.com/rest/api/storageservices/list-blobs',
    ],
    streams: [
      stream('containers', STREAM.object, 'Blob service List Containers', {
        metadata: ['containers'],
      }),
      stream('objects', STREAM.object, 'Blob service List Blobs', {
        metadata: ['paths', 'last modified'],
      }),
      stream('schemas', STREAM.dataset, 'safe file manifest/schema inference', {
        metadata: ['schemas'],
      }),
      stream('classifications', STREAM.object, 'tags / index tags / policy labels', {
        metadata: ['classifications'],
      }),
      stream('lineage', STREAM.lineage, 'path-to-dataset mappings', {
        metadata: ['storage lineage'],
      }),
    ],
  }),
  azure_data_factory: documentedBridge({
    requiredConfig: ['subscription_id', 'resource_group', 'factory_name'],
    docs: [
      'https://learn.microsoft.com/rest/api/datafactory/factories/get',
      'https://learn.microsoft.com/rest/api/datafactory/pipelines/list-by-factory',
      'https://learn.microsoft.com/rest/api/datafactory/datasets/list-by-factory',
      'https://learn.microsoft.com/rest/api/datafactory/linked-services/list-by-factory',
      'https://learn.microsoft.com/rest/api/datafactory/triggers/list-by-factory',
      'https://learn.microsoft.com/rest/api/datafactory/data-flows/list-by-factory',
      'https://learn.microsoft.com/rest/api/datafactory/integration-runtimes/list-by-factory',
      'https://learn.microsoft.com/rest/api/datafactory/managed-virtual-networks/list-by-factory',
      'https://learn.microsoft.com/rest/api/datafactory/managed-private-endpoints/list-by-factory',
      'https://learn.microsoft.com/rest/api/datafactory/pipeline-runs/query-by-factory',
      'https://learn.microsoft.com/rest/api/datafactory/trigger-runs/query-by-factory',
      'https://learn.microsoft.com/rest/api/datafactory/activity-runs/query-by-pipeline-run',
    ],
    streams: [
      stream('factory', STREAM.object, 'ADF Factories_Get', {
        metadata: ['factory identity', 'location', 'tags', 'repo configuration'],
      }),
      stream('pipelines', STREAM.object, 'ADF Pipelines_ListByFactory', {
        metadata: ['pipelines', 'parameters', 'activities'],
      }),
      stream('tasks', STREAM.object, 'ADF pipeline activities', {
        aliases: ['activities', 'tasks'],
        metadata: ['activities', 'dependencies', 'input/output dataset references'],
      }),
      stream('datasets', STREAM.dataset, 'ADF Datasets_ListByFactory', { metadata: ['datasets'] }),
      stream('connections', STREAM.dataSource, 'ADF LinkedServices_ListByFactory', {
        aliases: ['linked_services', 'connections'],
        metadata: ['linked services'],
      }),
      stream('schedules', STREAM.object, 'ADF Triggers_ListByFactory', {
        aliases: ['triggers'],
        metadata: ['triggers'],
      }),
      stream('dataflows', STREAM.object, 'ADF DataFlows_ListByFactory', {
        metadata: ['mapping data flows', 'sources', 'sinks', 'script'],
      }),
      stream('integration_runtimes', STREAM.object, 'ADF IntegrationRuntimes_ListByFactory', {
        metadata: ['integration runtimes', 'compute/connectivity runtime'],
      }),
      stream(
        'managed_virtual_networks',
        STREAM.object,
        'ADF ManagedVirtualNetworks_ListByFactory',
        {
          metadata: ['managed virtual networks'],
        }
      ),
      stream(
        'managed_private_endpoints',
        STREAM.dataSource,
        'ADF ManagedPrivateEndpoints_ListByFactory',
        { metadata: ['private endpoints', 'private link targets', 'connection state'] }
      ),
      stream('pipeline_runs', STREAM.usage, 'ADF PipelineRuns_QueryByFactory', {
        method: 'POST',
        cursor: 'lastUpdated',
        metadata: ['bounded run history', 'status', 'duration', 'run group'],
      }),
      stream('trigger_runs', STREAM.usage, 'ADF TriggerRuns_QueryByFactory', {
        method: 'POST',
        cursor: 'triggerRunTimestamp',
        metadata: ['bounded trigger run history', 'status'],
      }),
      stream('activity_runs', STREAM.usage, 'ADF ActivityRuns_QueryByPipelineRun', {
        method: 'POST',
        cursor: 'activityRunStart',
        metadata: ['bounded activity run history', 'status', 'duration', 'error/output summary'],
      }),
      stream('lineage', STREAM.lineage, 'pipeline activity input/output dependencies', {
        metadata: ['pipeline lineage', 'activity dependencies', 'dataset links', 'dataflow links'],
      }),
    ],
  }),
  aws_glue: documentedBridge({
    requiredConfig: ['region'],
    docs: [
      'https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-databases.html',
      'https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-tables.html',
    ],
    streams: [
      stream('databases', STREAM.object, 'Glue GetDatabases', { metadata: ['databases'] }),
      stream('tables', STREAM.object, 'Glue GetTables', { metadata: ['tables'] }),
      stream('columns', STREAM.column, 'Glue table StorageDescriptor.Columns', {
        metadata: ['columns'],
      }),
      stream('partitions', STREAM.object, 'Glue GetPartitions', { metadata: ['partitions'] }),
      stream('jobs', STREAM.object, 'Glue GetJobs', { metadata: ['jobs'] }),
      stream('lineage', STREAM.lineage, 'Glue job/catalog dependencies', { metadata: ['lineage'] }),
    ],
  }),
  aws_s3: documentedBridge({
    requiredConfig: ['region'],
    docs: [
      'https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListBuckets.html',
      'https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html',
    ],
    streams: [
      stream('buckets', STREAM.object, 'S3 ListBuckets', { metadata: ['buckets'] }),
      stream('objects', STREAM.object, 'S3 ListObjectsV2', { metadata: ['objects', 'prefixes'] }),
      stream('schemas', STREAM.dataset, 'manifest/schema inference', { metadata: ['schemas'] }),
      stream('classifications', STREAM.object, 'object tags / Macie findings', {
        metadata: ['classifications'],
      }),
      stream('lineage', STREAM.lineage, 'bucket/prefix dataset links', { metadata: ['lineage'] }),
    ],
  }),
  aws_athena: documentedBridge({
    requiredConfig: ['region'],
    docs: [
      'https://docs.aws.amazon.com/athena/latest/APIReference/Welcome.html',
      'https://docs.aws.amazon.com/athena/latest/ug/querying-glue-catalog.html',
    ],
    streams: [
      stream('workgroups', STREAM.object, 'Athena ListWorkGroups', {
        metadata: ['workgroups'],
      }),
      stream('data_catalogs', STREAM.dataSource, 'Athena ListDataCatalogs', {
        metadata: ['data catalogs'],
      }),
      stream('databases', STREAM.object, 'Athena ListDatabases', { metadata: ['databases'] }),
      stream('tables', STREAM.dataset, 'Athena ListTableMetadata', { metadata: ['tables'] }),
      stream('named_queries', STREAM.object, 'Athena ListNamedQueries', {
        metadata: ['saved queries'],
      }),
      stream('query_executions', STREAM.usage, 'Athena ListQueryExecutions', {
        metadata: ['query execution ids'],
      }),
      stream('lineage', STREAM.lineage, 'Athena query/catalog dependencies', {
        metadata: ['query-to-catalog dependencies'],
      }),
    ],
  }),
  aws_redshift: documentedBridge({
    requiredConfig: ['cluster', 'database'],
    docs: ['https://docs.aws.amazon.com/redshift/latest/dg/c_intro_catalog_views.html'],
    streams: [
      stream('schemas', STREAM.object, 'SVV_ALL_SCHEMAS', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'SVV_ALL_TABLES / SVV_VIEWS', {
        metadata: ['tables', 'views'],
      }),
      stream('columns', STREAM.column, 'SVV_ALL_COLUMNS', { metadata: ['columns'] }),
      stream('usage', STREAM.usage, 'SYS_QUERY_HISTORY', { metadata: ['query history'] }),
      stream('lineage', STREAM.lineage, 'SVV_TABLE_INFO / parsed SQL dependencies', {
        metadata: ['dependencies'],
      }),
    ],
  }),
  gcp_dataplex: documentedBridge({
    requiredConfig: ['project_id'],
    docs: [
      'https://cloud.google.com/dataplex/docs/reference/rest',
      'https://cloud.google.com/data-catalog/docs/reference/rest',
    ],
    streams: [
      stream('lakes', STREAM.object, 'Dataplex projects.locations.lakes.list', {
        metadata: ['lakes'],
      }),
      stream('zones', STREAM.object, 'Dataplex zones.list', { metadata: ['zones'] }),
      stream('entries', STREAM.object, 'Data Catalog entries.search', {
        aliases: ['assets', 'entries'],
        metadata: ['entries'],
      }),
      stream('schemas', STREAM.dataset, 'Entry schema metadata', { metadata: ['schemas'] }),
      stream('classifications', STREAM.object, 'policy tags / aspects', {
        metadata: ['policy tags'],
      }),
      stream('lineage', STREAM.lineage, 'Data Lineage API processes/runs/events', {
        metadata: ['lineage'],
      }),
    ],
  }),
  gcs: documentedBridge({
    requiredConfig: ['project_id'],
    docs: [
      'https://cloud.google.com/storage/docs/json_api/v1/buckets/list',
      'https://cloud.google.com/storage/docs/json_api/v1/objects/list',
    ],
    streams: [
      stream('buckets', STREAM.object, 'GCS buckets.list', { metadata: ['buckets'] }),
      stream('objects', STREAM.object, 'GCS objects.list', { metadata: ['objects'] }),
      stream('schemas', STREAM.dataset, 'manifest/schema inference', { metadata: ['schemas'] }),
      stream('classifications', STREAM.object, 'object metadata / policy tags', {
        metadata: ['classifications'],
      }),
      stream('lineage', STREAM.lineage, 'bucket/object dataset links', { metadata: ['lineage'] }),
    ],
  }),
  power_bi: documentedBridge({
    requiredConfig: ['tenant_id'],
    docs: [
      'https://learn.microsoft.com/rest/api/power-bi/admin/workspace-info-post-workspace-info',
    ],
    streams: [
      stream('workspaces', STREAM.object, 'GET /v1.0/myorg/admin/groups?$top=5000', {
        metadata: ['workspaces'],
      }),
      stream('dashboards', STREAM.dashboard, 'GET /v1.0/myorg/admin/dashboards', {
        metadata: ['dashboards'],
      }),
      stream('reports', STREAM.report, 'GET /v1.0/myorg/admin/reports', { metadata: ['reports'] }),
      stream('datasets', STREAM.dataset, 'GET /v1.0/myorg/admin/datasets', {
        metadata: ['datasets'],
      }),
      stream(
        'scanner_metadata',
        STREAM.semanticModel,
        'POST /v1.0/myorg/admin/workspaces/getInfo',
        {
          aliases: ['semantic_models', 'models'],
          method: 'POST',
          metadata: ['tables', 'columns', 'measures'],
        }
      ),
      stream('datasources', STREAM.dataSource, 'GET dataset datasources', {
        metadata: ['datasources'],
      }),
      stream('activity_events', STREAM.usage, 'GET /v1.0/myorg/admin/activityevents', {
        metadata: ['activity events'],
      }),
      stream('lineage', STREAM.lineage, 'Power BI artifact relationships', {
        metadata: ['dataset-report-dashboard lineage'],
      }),
    ],
  }),
  microstrategy_cloud: documentedBridge({
    requiredConfig: ['base_url', 'project_id'],
    docs: ['https://microstrategy.github.io/rest-api-docs/getting-started/rest-api-families/'],
    streams: [
      stream('projects', STREAM.object, 'GET /api/projects', { metadata: ['projects'] }),
      stream('dossiers', STREAM.dashboard, 'GET /api/dossiers', { metadata: ['dossiers'] }),
      stream('documents', STREAM.report, 'GET /api/documents', { metadata: ['documents'] }),
      stream('reports', STREAM.report, 'GET /api/v2/reports', { metadata: ['reports'] }),
      stream('cubes', STREAM.dataset, 'GET /api/cubes', { metadata: ['cubes'] }),
      stream('schema_objects', STREAM.semanticModel, 'GET /api/model/schema/objects', {
        metadata: ['schema objects'],
      }),
      stream('data_sources', STREAM.dataSource, 'GET /api/datasources', {
        metadata: ['data sources'],
      }),
      stream('lineage', STREAM.lineage, 'object dependency metadata', {
        metadata: ['dependencies'],
      }),
    ],
  }),
  ssas_on_prem: documentedBridge({
    requiredConfig: ['server'],
    docs: [
      'https://learn.microsoft.com/analysis-services/xmla/xml-elements-methods-discover',
      'https://learn.microsoft.com/analysis-services/instances/use-dynamic-management-views-dmvs-to-monitor-analysis-services',
    ],
    streams: [
      stream('databases', STREAM.object, 'XMLA Discover DBSCHEMA_CATALOGS', {
        metadata: ['databases'],
      }),
      stream('models', STREAM.semanticModel, 'XMLA Discover MDSCHEMA_CUBES / TMSCHEMA_MODEL', {
        metadata: ['models'],
      }),
      stream('dimensions', STREAM.object, 'XMLA Discover MDSCHEMA_DIMENSIONS', {
        metadata: ['dimensions'],
      }),
      stream('measures', STREAM.metric, 'XMLA Discover MDSCHEMA_MEASURES / TMSCHEMA_MEASURES', {
        metadata: ['measures'],
      }),
      stream('partitions', STREAM.dataset, 'XMLA Discover TMSCHEMA_PARTITIONS', {
        metadata: ['partitions'],
      }),
      stream('data_sources', STREAM.dataSource, 'XMLA Discover TMSCHEMA_DATA_SOURCES', {
        metadata: ['data sources'],
      }),
      stream('roles', STREAM.object, 'XMLA Discover TMSCHEMA_ROLES', { metadata: ['roles'] }),
      stream('lineage', STREAM.lineage, 'model datasource/partition dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  power_bi_report_server: documentedBridge({
    requiredConfig: ['base_url'],
    docs: [
      'https://learn.microsoft.com/sql/reporting-services/developer/rest-api/report-server-rest-api',
    ],
    streams: [
      stream('folders', STREAM.object, 'GET /api/v2.0/Folders', { metadata: ['folders'] }),
      stream('reports', STREAM.report, 'GET /api/v2.0/PowerBIReports / Reports', {
        metadata: ['reports'],
      }),
      stream('datasets', STREAM.dataset, 'GET /api/v2.0/Datasets', { metadata: ['datasets'] }),
      stream('data_sources', STREAM.dataSource, 'GET item data sources', {
        metadata: ['data sources'],
      }),
      stream('subscriptions', STREAM.object, 'GET /api/v2.0/Subscriptions', {
        metadata: ['subscriptions'],
      }),
      stream('lineage', STREAM.lineage, 'report-dataset-datasource links', {
        metadata: ['lineage'],
      }),
    ],
  }),
  ssrs: documentedBridge({
    requiredConfig: ['base_url'],
    docs: [
      'https://learn.microsoft.com/sql/reporting-services/developer/rest-api/report-server-rest-api',
    ],
    streams: [
      stream('folders', STREAM.object, 'GET /api/v2.0/Folders', { metadata: ['folders'] }),
      stream('reports', STREAM.report, 'GET /api/v2.0/Reports', { metadata: ['RDL reports'] }),
      stream('datasets', STREAM.dataset, 'GET /api/v2.0/Datasets', {
        metadata: ['shared datasets'],
      }),
      stream('data_sources', STREAM.dataSource, 'GET /api/v2.0/DataSources', {
        metadata: ['shared data sources'],
      }),
      stream('subscriptions', STREAM.object, 'GET /api/v2.0/Subscriptions', {
        metadata: ['subscriptions'],
      }),
      stream('lineage', STREAM.lineage, 'report-dataset-datasource links', {
        metadata: ['lineage'],
      }),
    ],
  }),
  tableau: documentedBridge({
    requiredConfig: ['base_url', 'site_id'],
    docs: [
      'https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api.htm',
      'https://help.tableau.com/current/api/metadata_api/en-us/index.html',
    ],
    streams: [
      stream('projects', STREAM.object, 'REST projects endpoint', { metadata: ['projects'] }),
      stream('workbooks', STREAM.dashboard, 'REST workbooks endpoint', { metadata: ['workbooks'] }),
      stream('views', STREAM.report, 'REST views endpoint', { metadata: ['views'] }),
      stream('datasources', STREAM.dataSource, 'REST datasources endpoint', {
        metadata: ['datasources'],
      }),
      stream('metadata_graphql', STREAM.lineage, 'Metadata API GraphQL', {
        aliases: ['lineage'],
        metadata: ['metadata graph'],
      }),
      stream('usage', STREAM.usage, 'REST usage/statistics metadata', { metadata: ['usage'] }),
    ],
  }),
  looker: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://cloud.google.com/looker/docs/reference/looker-api/latest'],
    streams: [
      stream('models', STREAM.semanticModel, 'Looker API lookml_models', { metadata: ['models'] }),
      stream('explores', STREAM.dataset, 'Looker API explores', { metadata: ['explores'] }),
      stream('dashboards', STREAM.dashboard, 'Looker API dashboards', { metadata: ['dashboards'] }),
      stream('looks', STREAM.report, 'Looker API looks', { metadata: ['looks'] }),
      stream('fields', STREAM.column, 'Looker explore fields', { metadata: ['fields'] }),
      stream('metrics', STREAM.metric, 'LookML measures', { metadata: ['measures'] }),
      stream('lineage', STREAM.lineage, 'model/explore/dashboard dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  qlik_cloud: documentedBridge({
    requiredConfig: ['tenant_url'],
    docs: ['https://qlik.dev/apis/rest/'],
    streams: [
      stream('spaces', STREAM.object, 'Qlik spaces API', { metadata: ['spaces'] }),
      stream('apps', STREAM.dashboard, 'Qlik items/apps APIs', { metadata: ['apps'] }),
      stream('sheets', STREAM.report, 'Qlik app object metadata', { metadata: ['sheets'] }),
      stream('datasets', STREAM.dataset, 'Qlik data lineage/dataset metadata', {
        metadata: ['datasets'],
      }),
      stream('fields', STREAM.column, 'Qlik app fields', { metadata: ['fields'] }),
      stream('metrics', STREAM.metric, 'Qlik measures', { metadata: ['measures'] }),
      stream('lineage', STREAM.lineage, 'Qlik lineage APIs', { metadata: ['lineage'] }),
    ],
  }),
  qlik_sense: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://help.qlik.com/en-US/sense-developer/'],
    streams: [
      stream('streams', STREAM.object, 'QRS streams endpoint', { metadata: ['streams'] }),
      stream('apps', STREAM.dashboard, 'QRS apps endpoint', { metadata: ['apps'] }),
      stream('sheets', STREAM.report, 'Engine app object metadata', { metadata: ['sheets'] }),
      stream('connections', STREAM.dataSource, 'QRS data connections endpoint', {
        metadata: ['connections'],
      }),
      stream('fields', STREAM.column, 'Engine field metadata', { metadata: ['fields'] }),
      stream('metrics', STREAM.metric, 'Engine measure metadata', { metadata: ['measures'] }),
      stream('lineage', STREAM.lineage, 'reload script/data connection dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  domo: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://developer.domo.com/portal'],
    streams: [
      stream('datasets', STREAM.dataset, 'Domo DataSet API', { metadata: ['datasets'] }),
      stream('cards', STREAM.report, 'Domo Cards API', { metadata: ['cards'] }),
      stream('dashboards', STREAM.dashboard, 'Domo Pages/Dashboards APIs', {
        metadata: ['dashboards'],
      }),
      stream('dataflows', STREAM.object, 'Domo DataFlow API', { metadata: ['dataflows'] }),
      stream('metrics', STREAM.metric, 'Beast Mode/calculation metadata', {
        metadata: ['calculations'],
      }),
      stream('lineage', STREAM.lineage, 'dataset-card-dataflow dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  sigma: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://help.sigmacomputing.com/reference'],
    streams: [
      stream('workbooks', STREAM.dashboard, 'Sigma workbooks API', { metadata: ['workbooks'] }),
      stream('pages', STREAM.report, 'Workbook pages', { metadata: ['pages'] }),
      stream('elements', STREAM.report, 'Workbook elements', { metadata: ['elements'] }),
      stream('datasets', STREAM.dataset, 'Sigma datasets API', { metadata: ['datasets'] }),
      stream('connections', STREAM.dataSource, 'Sigma connections API', {
        metadata: ['connections'],
      }),
      stream('metrics', STREAM.metric, 'calculations/formulas', { metadata: ['calculations'] }),
      stream('lineage', STREAM.lineage, 'workbook-dataset-connection dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  mode: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://mode.com/developer/api-reference/'],
    streams: [
      stream('spaces', STREAM.object, 'Mode spaces API', { metadata: ['spaces'] }),
      stream('reports', STREAM.report, 'Mode reports API', { metadata: ['reports'] }),
      stream('queries', STREAM.dataset, 'Mode queries API', { metadata: ['queries'] }),
      stream('charts', STREAM.dashboard, 'Mode charts metadata', { metadata: ['charts'] }),
      stream('lineage', STREAM.lineage, 'query-report-datasource dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  metabase: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://www.metabase.com/docs/latest/api-documentation'],
    streams: [
      stream('collections', STREAM.object, 'Metabase collections API', {
        metadata: ['collections'],
      }),
      stream('dashboards', STREAM.dashboard, 'Metabase dashboards API', {
        metadata: ['dashboards'],
      }),
      stream('cards', STREAM.report, 'Metabase cards/questions API', { metadata: ['cards'] }),
      stream('datasets', STREAM.dataset, 'Metabase models/databases metadata', {
        metadata: ['models'],
      }),
      stream('data_sources', STREAM.dataSource, 'Metabase database API', {
        metadata: ['databases'],
      }),
      stream('lineage', STREAM.lineage, 'card-dashboard-database dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  superset: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://superset.apache.org/docs/api/'],
    streams: [
      stream('databases', STREAM.dataSource, 'Superset databases API', { metadata: ['databases'] }),
      stream('datasets', STREAM.dataset, 'Superset datasets API', { metadata: ['datasets'] }),
      stream('charts', STREAM.report, 'Superset charts API', { metadata: ['charts'] }),
      stream('dashboards', STREAM.dashboard, 'Superset dashboards API', {
        metadata: ['dashboards'],
      }),
      stream('metrics', STREAM.metric, 'dataset metrics/calculated columns', {
        metadata: ['metrics'],
      }),
      stream('lineage', STREAM.lineage, 'chart-dashboard-dataset dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  redash: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://redash.io/help/user-guide/integrations-and-api/api/'],
    streams: [
      stream('data_sources', STREAM.dataSource, 'Redash data sources API', {
        metadata: ['data sources'],
      }),
      stream('queries', STREAM.dataset, 'Redash queries API', { metadata: ['queries'] }),
      stream('visualizations', STREAM.report, 'Redash visualizations API', {
        metadata: ['visualizations'],
      }),
      stream('dashboards', STREAM.dashboard, 'Redash dashboards API', { metadata: ['dashboards'] }),
      stream('alerts', STREAM.object, 'Redash alerts API', { metadata: ['alerts'] }),
      stream('lineage', STREAM.lineage, 'query-visualization-dashboard dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  quicksight: documentedBridge({
    requiredConfig: ['aws_account_id', 'region'],
    docs: ['https://docs.aws.amazon.com/quicksight/latest/APIReference/Welcome.html'],
    streams: [
      stream('analyses', STREAM.report, 'QuickSight ListAnalyses', { metadata: ['analyses'] }),
      stream('dashboards', STREAM.dashboard, 'QuickSight ListDashboards', {
        metadata: ['dashboards'],
      }),
      stream('datasets', STREAM.dataset, 'QuickSight ListDataSets', { metadata: ['datasets'] }),
      stream('data_sources', STREAM.dataSource, 'QuickSight ListDataSources', {
        metadata: ['data sources'],
      }),
      stream('metrics', STREAM.metric, 'calculated fields in definitions', {
        metadata: ['calculated fields'],
      }),
      stream('lineage', STREAM.lineage, 'analysis-dashboard-dataset-datasource dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  grafana: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://grafana.com/docs/grafana/latest/developers/http_api/'],
    streams: [
      stream('folders', STREAM.object, 'Grafana folders API', { metadata: ['folders'] }),
      stream('dashboards', STREAM.dashboard, 'Grafana dashboards API', {
        metadata: ['dashboards'],
      }),
      stream('panels', STREAM.report, 'Dashboard panel JSON', { metadata: ['panels'] }),
      stream('data_sources', STREAM.dataSource, 'Grafana data sources API', {
        metadata: ['data sources'],
      }),
      stream('alerts', STREAM.object, 'Grafana alerting API', { metadata: ['alerts'] }),
      stream('lineage', STREAM.lineage, 'dashboard-panel-datasource dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  cognos: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://www.ibm.com/docs/en/cognos-analytics'],
    streams: [
      stream('packages', STREAM.semanticModel, 'Cognos content/package metadata', {
        metadata: ['packages'],
      }),
      stream('reports', STREAM.report, 'Cognos reports metadata', { metadata: ['reports'] }),
      stream('dashboards', STREAM.dashboard, 'Cognos dashboards metadata', {
        metadata: ['dashboards'],
      }),
      stream('data_modules', STREAM.dataset, 'Cognos data modules', { metadata: ['data modules'] }),
      stream('metrics', STREAM.metric, 'dimensions/measures metadata', { metadata: ['measures'] }),
      stream('lineage', STREAM.lineage, 'package-report-datasource dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  sap_businessobjects: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://help.sap.com/docs/SAP_BUSINESSOBJECTS_BUSINESS_INTELLIGENCE_PLATFORM'],
    streams: [
      stream('universes', STREAM.semanticModel, 'BI platform universes metadata', {
        metadata: ['universes'],
      }),
      stream('reports', STREAM.report, 'Web Intelligence / Crystal reports metadata', {
        metadata: ['reports'],
      }),
      stream('folders', STREAM.object, 'BI platform folders metadata', { metadata: ['folders'] }),
      stream('data_foundations', STREAM.dataset, 'universe data foundations', {
        metadata: ['data foundations'],
      }),
      stream('data_sources', STREAM.dataSource, 'connections metadata', {
        metadata: ['connections'],
      }),
      stream('lineage', STREAM.lineage, 'universe-report-connection dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  oracle_analytics: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://docs.oracle.com/en/cloud/paas/analytics-cloud/'],
    streams: [
      stream('workbooks', STREAM.dashboard, 'Oracle Analytics workbook metadata', {
        metadata: ['workbooks'],
      }),
      stream('analyses', STREAM.report, 'analyses metadata', { metadata: ['analyses'] }),
      stream('dashboards', STREAM.dashboard, 'dashboards metadata', { metadata: ['dashboards'] }),
      stream('datasets', STREAM.dataset, 'datasets metadata', { metadata: ['datasets'] }),
      stream('semantic_models', STREAM.semanticModel, 'semantic model metadata', {
        metadata: ['semantic models'],
      }),
      stream('lineage', STREAM.lineage, 'workbook-dataset-semantic model dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  thoughtspot: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://developers.thoughtspot.com/docs/rest-apiv2-reference'],
    streams: [
      stream('answers', STREAM.report, 'ThoughtSpot answers metadata', { metadata: ['answers'] }),
      stream('liveboards', STREAM.dashboard, 'ThoughtSpot liveboards metadata', {
        metadata: ['liveboards'],
      }),
      stream('worksheets', STREAM.semanticModel, 'worksheets metadata', {
        metadata: ['worksheets'],
      }),
      stream('tables', STREAM.dataset, 'tables metadata', { metadata: ['tables'] }),
      stream('columns', STREAM.column, 'columns metadata', { metadata: ['columns'] }),
      stream('metrics', STREAM.metric, 'formulas metadata', { metadata: ['formulas'] }),
      stream('lineage', STREAM.lineage, 'answer-liveboard-worksheet dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  sisense: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://developer.sisense.com/'],
    streams: [
      stream('dashboards', STREAM.dashboard, 'Sisense dashboards API', {
        metadata: ['dashboards'],
      }),
      stream('widgets', STREAM.report, 'dashboard widgets metadata', { metadata: ['widgets'] }),
      stream('data_models', STREAM.semanticModel, 'data models / ElastiCubes', {
        metadata: ['data models'],
      }),
      stream('datasets', STREAM.dataset, 'datasets metadata', { metadata: ['datasets'] }),
      stream('metrics', STREAM.metric, 'formulas metadata', { metadata: ['formulas'] }),
      stream('lineage', STREAM.lineage, 'widget-dashboard-datamodel dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  airflow: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html'],
    streams: [
      stream('pipelines', STREAM.object, 'GET /api/v1/dags', {
        aliases: ['dags', 'pipelines'],
        metadata: ['DAGs'],
      }),
      stream('tasks', STREAM.object, 'GET /api/v1/dags/{dag_id}/tasks', { metadata: ['tasks'] }),
      stream('datasets', STREAM.dataset, 'GET /api/v1/datasets', { metadata: ['datasets'] }),
      stream('connections', STREAM.dataSource, 'connections metadata endpoint', {
        metadata: ['connections'],
      }),
      stream('schedules', STREAM.object, 'DAG schedules/timetables', { metadata: ['schedules'] }),
      stream('lineage', STREAM.lineage, 'DAG task inlets/outlets and dataset dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
  dbt: documentedBridge({
    requiredConfig: ['repo_url'],
    docs: [
      'https://docs.getdbt.com/reference/artifacts/manifest-json',
      'https://docs.getdbt.com/reference/artifacts/catalog-json',
    ],
    streams: [
      stream('models', STREAM.semanticModel, 'manifest.json nodes', {
        aliases: ['dbt_artifacts', 'models'],
        metadata: ['models'],
      }),
      stream('sources', STREAM.dataSource, 'manifest.json sources', { metadata: ['sources'] }),
      stream('columns', STREAM.column, 'catalog.json columns', { metadata: ['columns'] }),
      stream('tests', STREAM.object, 'manifest.json tests', { metadata: ['tests'] }),
      stream('metrics', STREAM.metric, 'manifest.json metrics', { metadata: ['metrics'] }),
      stream('lineage', STREAM.lineage, 'manifest parent_map/child_map', { metadata: ['lineage'] }),
    ],
  }),
  openapi: documentedBridge({
    requiredConfig: ['spec_url'],
    docs: ['https://spec.openapis.org/oas/latest.html'],
    streams: [
      stream('openapi_spec', STREAM.object, 'OpenAPI document', { metadata: ['spec'] }),
      stream('endpoints', STREAM.object, 'paths operations', { metadata: ['paths', 'operations'] }),
      stream('schemas', STREAM.dataset, 'components.schemas', { metadata: ['schemas'] }),
      stream('lineage', STREAM.lineage, 'endpoint-schema relationships', { metadata: ['lineage'] }),
    ],
  }),
  git_repository: documentedBridge({
    requiredConfig: ['repo_url'],
    docs: [
      'https://docs.github.com/rest/repos/contents',
      'https://learn.microsoft.com/rest/api/azure/devops/git/items/list',
    ],
    streams: [
      stream('repositories', STREAM.object, 'repository provider API', {
        metadata: ['repositories'],
      }),
      stream('python_scripts', STREAM.object, 'repository tree *.py', {
        metadata: ['python ETL scripts'],
      }),
      stream('sql_files', STREAM.object, 'repository tree *.sql', { metadata: ['SQL files'] }),
      stream('dbt_artifacts', STREAM.semanticModel, 'dbt manifest/catalog/sources artifacts', {
        metadata: ['dbt artifacts'],
      }),
      stream('notebooks', STREAM.object, 'repository tree *.ipynb', { metadata: ['notebooks'] }),
      stream('lineage', STREAM.lineage, 'parsed code dependency facts', { metadata: ['lineage'] }),
    ],
  }),
  kafka: documentedBridge({
    requiredConfig: ['cluster'],
    docs: [
      'https://docs.confluent.io/platform/current/kafka-rest/api.html',
      'https://docs.confluent.io/platform/current/schema-registry/develop/api.html',
    ],
    streams: [
      stream('clusters', STREAM.object, 'Kafka cluster metadata', { metadata: ['clusters'] }),
      stream('topics', STREAM.dataset, 'Kafka topics metadata', { metadata: ['topics'] }),
      stream('schemas', STREAM.dataset, 'Schema Registry subjects/versions', {
        metadata: ['schemas'],
      }),
      stream('consumers', STREAM.object, 'consumer groups metadata', { metadata: ['consumers'] }),
      stream('lineage', STREAM.lineage, 'producer-topic-consumer relationships', {
        metadata: ['lineage'],
      }),
    ],
  }),
  salesforce: documentedBridge({
    requiredConfig: ['base_url'],
    docs: [
      'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_describe.htm',
    ],
    streams: [
      stream('objects', STREAM.object, 'Salesforce sObject describe/list', {
        metadata: ['objects'],
      }),
      stream('fields', STREAM.column, 'sObject fields describe', { metadata: ['fields'] }),
      stream('relationships', STREAM.lineage, 'childRelationships / referenceTo', {
        metadata: ['relationships'],
      }),
      stream('reports', STREAM.report, 'Analytics reports metadata', { metadata: ['reports'] }),
      stream('dashboards', STREAM.dashboard, 'Analytics dashboards metadata', {
        metadata: ['dashboards'],
      }),
      stream('lineage', STREAM.lineage, 'report-object dependency facts', {
        metadata: ['lineage'],
      }),
    ],
  }),
  sap: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://help.sap.com/docs/ABAP_PLATFORM', 'https://help.sap.com/docs/SAP_NETWEAVER'],
    streams: [
      stream('objects', STREAM.object, 'SAP business objects / OData services', {
        aliases: ['tables', 'objects'],
        metadata: ['objects'],
      }),
      stream('fields', STREAM.column, 'DDIC table/view fields', { metadata: ['fields'] }),
      stream('relationships', STREAM.lineage, 'DDIC foreign keys / CDS associations', {
        metadata: ['relationships'],
      }),
      stream('extractors', STREAM.object, 'BW extractors / ODP metadata', {
        metadata: ['extractors'],
      }),
      stream('lineage', STREAM.lineage, 'table-view-CDS-extractor dependencies', {
        metadata: ['lineage'],
      }),
    ],
  }),
};

const TYPE_ADAPTERS = {
  sql_server: SqlServerLiveAdapter,
  ssis: SsisLiveAdapter,
  power_bi: PowerBiAdapter,
  power_bi_report_server: BIConnectorAdapter,
  microstrategy_cloud: MicroStrategyAdapter,
  ssas_on_prem: SsasAdapter,
  tableau: TableauAdapter,
  looker: BIConnectorAdapter,
  qlik_cloud: BIConnectorAdapter,
  qlik_sense: BIConnectorAdapter,
  domo: BIConnectorAdapter,
  sigma: BIConnectorAdapter,
  mode: BIConnectorAdapter,
  metabase: BIConnectorAdapter,
  superset: BIConnectorAdapter,
  redash: BIConnectorAdapter,
  quicksight: BIConnectorAdapter,
  grafana: BIConnectorAdapter,
  cognos: BIConnectorAdapter,
  sap_businessobjects: BIConnectorAdapter,
  oracle_analytics: BIConnectorAdapter,
  thoughtspot: BIConnectorAdapter,
  sisense: BIConnectorAdapter,
  ssrs: SsrsLiveAdapter,
  git_repository: RepositoryAdapter,
  openapi: ApiAdapter,
  azure_data_factory: PipelineAdapter,
  airflow: PipelineAdapter,
  databricks: DataWarehouseAdapter,
  dbt: RepositoryAdapter,
};

const CATEGORY_ADAPTERS = {
  database: DataWarehouseAdapter,
  warehouse: DataWarehouseAdapter,
  cloud_storage: CloudStorageAdapter,
  cloud_platform: CloudPlatformAdapter,
  pipeline: PipelineAdapter,
  repository: RepositoryAdapter,
  api: ApiAdapter,
  business_intelligence: BIConnectorAdapter,
  streaming: StreamingAdapter,
  erp_crm: ErpCrmAdapter,
  ml_feature_platform: MlFeatureAdapter,
};

export function createConnectorAdapter({ connector, definition }) {
  if (!connector?.type) {
    throw new ConnectorConfigError('Connector type is required to create an extraction adapter.');
  }
  const Adapter = TYPE_ADAPTERS[connector.type] || CATEGORY_ADAPTERS[definition?.category];
  if (!Adapter) {
    throw new ConnectorConfigError(
      `No extraction adapter registered for connector type '${connector.type}'.`,
      {
        connector_id: connector.id,
        connector_type: connector.type,
        details: { category: definition?.category || null },
      }
    );
  }
  const adapter = new Adapter({ connector, definition });
  const bridge = DOCUMENTED_BRIDGES[connector.type];
  const usesLiveAdapterContract =
    Adapter === SqlServerLiveAdapter || Adapter === SsisLiveAdapter || Adapter === SsrsLiveAdapter;
  if (bridge && !usesLiveAdapterContract) {
    adapter.configureBridge({
      ...bridge,
      requiredCredentialModes:
        bridge.requiredCredentialModes ||
        definition?.credentialKinds ||
        adapter.requiredCredentialModes,
    });
  }
  return adapter;
}

export function adapterCoverageReport(definitions = []) {
  return definitions.map((definition) => ({
    type: definition.type,
    label: definition.label,
    category: definition.category,
    adapter:
      (TYPE_ADAPTERS[definition.type] || CATEGORY_ADAPTERS[definition.category])?.name || null,
    bridge: DOCUMENTED_BRIDGES[definition.type]?.kind || null,
    docs: DOCUMENTED_BRIDGES[definition.type]?.docs || [],
    plumbed: Boolean(TYPE_ADAPTERS[definition.type] || CATEGORY_ADAPTERS[definition.category]),
    bridge_plumbed: Boolean(DOCUMENTED_BRIDGES[definition.type]),
    direct_source_client: hasDirectSourceClient(definition.type),
  }));
}
