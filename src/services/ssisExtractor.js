/**
 * SSIS Metadata Extractor
 * -----------------------------------------------------------------------------
 * Extracts every available piece of metadata from a SQL Server SSIS 2019/2022
 * installation and maps it into the data-governance data-lineage model.
 */

import mssql from 'mssql';
import { XMLParser } from 'fast-xml-parser';
import {
  buildSqlServerConnectionConfig,
  loadSqlServerDriver,
  sqlServerCredentialMode,
} from './connectorRuntime/sqlServerConnection.js';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const COMPONENT_ROLES = {
  // Sources
  'Microsoft.OLEDBSource': 'SOURCE',
  'Microsoft.SqlServerSource': 'SOURCE',
  'Microsoft.FlatFileSource': 'SOURCE',
  'Microsoft.ExcelSource': 'SOURCE',
  'Microsoft.AccessSource': 'SOURCE',
  'Microsoft.ADONETSource': 'SOURCE',
  'Microsoft.RawSource': 'SOURCE',
  'Microsoft.XMLSource': 'SOURCE',
  'Microsoft.CdcSource': 'SOURCE',
  'Microsoft.ODBCSource': 'SOURCE',
  'Microsoft.SharePointListAdapters.SharePointListSource': 'SOURCE',
  // Destinations
  'Microsoft.OLEDBDestination': 'DESTINATION',
  'Microsoft.SqlServerDestination': 'DESTINATION',
  'Microsoft.FlatFileDestination': 'DESTINATION',
  'Microsoft.ExcelDestination': 'DESTINATION',
  'Microsoft.ADONETDestination': 'DESTINATION',
  'Microsoft.RawDestination': 'DESTINATION',
  'Microsoft.RecordsetDestination': 'DESTINATION',
  'Microsoft.ODBCDestination': 'DESTINATION',
  'Microsoft.SqlBulkInsertDestination': 'DESTINATION',
  'Microsoft.CdcSplitter': 'DESTINATION',
  'Microsoft.SharePointListAdapters.SharePointListDestination': 'DESTINATION',
  // Transformations
  'Microsoft.Lookup': 'LOOKUP',
  'Microsoft.MergeJoin': 'TRANSFORM',
  'Microsoft.Merge': 'TRANSFORM',
  'Microsoft.UnionAll': 'TRANSFORM',
  'Microsoft.ConditionalSplit': 'TRANSFORM',
  'Microsoft.DerivedColumn': 'TRANSFORM',
  'Microsoft.MulticastTransformation': 'TRANSFORM',
  'Microsoft.Aggregate': 'TRANSFORM',
  'Microsoft.Sort': 'TRANSFORM',
  'Microsoft.DataConversion': 'TRANSFORM',
  'Microsoft.CharacterMapTransformation': 'TRANSFORM',
  'Microsoft.CopyColumnTransformation': 'TRANSFORM',
  'Microsoft.RowCount': 'TRANSFORM',
  'Microsoft.FuzzyLookup': 'LOOKUP',
  'Microsoft.FuzzyGrouping': 'TRANSFORM',
  'Microsoft.SlowlyChangingDimension': 'TRANSFORM',
  'Microsoft.TermExtraction': 'TRANSFORM',
  'Microsoft.TermLookup': 'LOOKUP',
  'Microsoft.Cache': 'TRANSFORM',
  'Microsoft.PivotTransformation': 'TRANSFORM',
  'Microsoft.UnPivotTransformation': 'TRANSFORM',
  'Microsoft.ScriptComponent': 'SCRIPT',
  'Microsoft.BalancedDataDistributor': 'TRANSFORM',
};

const EXTERNAL_COMPONENT_TYPE_PATTERNS = [
  /FlatFile/i,
  /Excel/i,
  /Raw/i,
  /XML/i,
  /SharePoint/i,
  /Access/i,
  /Recordset/i,
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

async function safeQuery(pool, sql, params = {}) {
  try {
    const req = pool.request();
    for (const [k, v] of Object.entries(params)) {
      req.input(k, v);
    }
    const result = await req.query(sql);
    return { rows: result.recordset || [], error: null };
  } catch (err) {
    return { rows: [], error: err.message };
  }
}

async function ssisdbExists(pool) {
  const { rows } = await safeQuery(
    pool,
    "SELECT name FROM sys.databases WHERE name = 'SSISDB' AND state_desc = 'ONLINE'"
  );
  return rows.length > 0;
}

function parsePackageXml(buffer) {
  try {
    const xmlString = buffer.toString('utf-8');
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
      allowBooleanAttributes: true,
    });
    return parser.parse(xmlString);
  } catch (_err) {
    return null;
  }
}

function collectXmlValues(node, keys, results = []) {
  if (!node || typeof node !== 'object') return results;
  for (const key of Object.keys(node)) {
    if (keys.includes(key)) {
      const val = node[key];
      if (Array.isArray(val)) val.forEach((v) => results.push(v));
      else results.push(val);
      continue; // Do not traverse inside a matched container element
    }
    collectXmlValues(node[key], keys, results);
  }
  return results;
}

function collectXmlValuesDeep(node, keys, results = []) {
  if (!node || typeof node !== 'object') return results;
  for (const key of Object.keys(node)) {
    const val = node[key];
    if (keys.includes(key)) {
      if (Array.isArray(val)) val.forEach((v) => results.push(v));
      else results.push(val);
    }

    if (Array.isArray(val)) {
      val.forEach((item) => collectXmlValuesDeep(item, keys, results));
    } else {
      collectXmlValuesDeep(val, keys, results);
    }
  }
  return results;
}

function normalizeSsisReference(value) {
  return String(value || '')
    .trim()
    .replace(/\[|\]/g, '')
    .replace(/^dbo\./i, '')
    .replace(/^SSIS\//i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function splitSsisObjectReference(reference) {
  const cleaned = normalizeSsisReference(reference);
  if (!cleaned) {
    return { databaseName: '', schemaName: '', objectName: '', fullName: '' };
  }

  const parts = cleaned.split('.').filter(Boolean);
  if (parts.length === 1) {
    return {
      databaseName: '',
      schemaName: '',
      objectName: parts[0],
      fullName: parts[0],
    };
  }

  if (parts.length === 2) {
    return {
      databaseName: '',
      schemaName: parts[0],
      objectName: parts[1],
      fullName: cleaned,
    };
  }

  if (parts.length === 3) {
    return {
      databaseName: parts[0],
      schemaName: parts[1],
      objectName: parts[2],
      fullName: cleaned,
    };
  }

  return {
    databaseName: parts[0],
    schemaName: parts[parts.length - 2],
    objectName: parts[parts.length - 1],
    fullName: cleaned,
  };
}

function extractBinaryPayload(recordsetRow) {
  if (!recordsetRow || typeof recordsetRow !== 'object') return null;

  for (const value of Object.values(recordsetRow)) {
    if (Buffer.isBuffer(value)) return value;
    if (value instanceof Uint8Array) return Buffer.from(value);
    if (typeof value === 'string' && value.length > 0) return Buffer.from(value, 'utf-8');
  }

  return null;
}

function parseConnectionStringDatabase(connectionString = '') {
  const match = String(connectionString).match(/(?:Initial Catalog|Database)\s*=\s*([^;"]+)/i);
  return match ? match[1].trim() : '';
}

function parseConnectionStringServer(connectionString = '') {
  const match = String(connectionString).match(/(?:Data Source|Server)\s*=\s*([^;"]+)/i);
  return match ? match[1].trim() : '';
}

function parseConnectionStringSchema(connectionString = '') {
  const match = String(connectionString).match(/(?:Schema)\s*=\s*([^;"]+)/i);
  return match ? match[1].trim() : '';
}

function cleanSsisSegment(value) {
  return String(value || '')
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/^'+|'+$/g, '')
    .replace(/\]\.\[/g, '.')
    .replace(/\[|\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isIpv4Segment(value) {
  if (!/^\d{1,3}$/.test(String(value || ''))) return false;
  const number = Number(value);
  return number >= 0 && number <= 255;
}

function startsWithIpv4Parts(parts) {
  return parts.length >= 4 && parts.slice(0, 4).every(isIpv4Segment);
}

function buildCanonicalSqlId(serverName, databaseName, schemaName, objectName) {
  const server = cleanSsisSegment(serverName);
  const db = cleanSsisSegment(databaseName);
  const schema = cleanSsisSegment(schemaName || 'dbo');
  const obj = cleanSsisSegment(objectName);

  if (!server || !db || !schema || !obj) return '';
  return `${server}.${db}.${schema}.${obj}`;
}

function buildCanonicalPackageId(serverName, folderName, projectName, packageName) {
  const server = cleanSsisSegment(serverName);
  const folder = cleanSsisSegment(folderName);
  const project = cleanSsisSegment(projectName);
  const pkg = cleanSsisSegment(packageName);

  if (!server || !folder || !project || !pkg) return '';
  return `${server}.SSISDB.${folder}.${project}.${pkg}`;
}

function getSsisScopeFilters(config = {}) {
  const folder = cleanSsisSegment(
    config.folderName || config.folder_name || config.folder || config.selectedFolder || ''
  );
  const project = cleanSsisSegment(
    config.projectName || config.project_name || config.project || config.selectedProject || ''
  );
  const packages = [
    config.packageName,
    config.package_name,
    config.package,
    config.selectedPackage,
    ...(Array.isArray(config.packages) ? config.packages : []),
    ...(Array.isArray(config.selectedPackages) ? config.selectedPackages : []),
  ]
    .filter(Boolean)
    .map((item) => cleanSsisSegment(item).toLowerCase());

  return { folder, project, packages };
}

function hasSsisScopeFilters(scope = {}) {
  return Boolean(scope.folder || scope.project || scope.packages?.length);
}

function filterAgentJobsToSsisScope(agentJobs = {}, scope = {}) {
  if (!hasSsisScopeFilters(scope)) return agentJobs;

  const folder = String(scope.folder || '').toLowerCase();
  const project = String(scope.project || '').toLowerCase();
  const packages = new Set((scope.packages || []).map((item) => String(item || '').toLowerCase()));
  const matchedJobIds = new Set();
  const ssisSteps = (agentJobs.ssisSteps || []).filter((step) => {
    const command = String(step.command || '');
    const commandLower = command.toLowerCase();
    const catalogPathMatch = command.match(/\\SSISDB\\([^\\]+)\\([^\\]+)\\([^\\"]+\.dtsx)/i);
    const matchedFolder = catalogPathMatch
      ? cleanSsisSegment(catalogPathMatch[1]).toLowerCase()
      : '';
    const matchedProject = catalogPathMatch
      ? cleanSsisSegment(catalogPathMatch[2]).toLowerCase()
      : '';
    const matchedPackage = catalogPathMatch
      ? cleanSsisSegment(catalogPathMatch[3]).toLowerCase()
      : '';

    const folderMatches =
      !folder || matchedFolder === folder || commandLower.includes(`\\${folder}\\`);
    const projectMatches =
      !project || matchedProject === project || commandLower.includes(`\\${project}\\`);
    const packageMatches =
      packages.size === 0 ||
      packages.has(matchedPackage) ||
      [...packages].some((pkg) => commandLower.includes(pkg));

    const matches = folderMatches && projectMatches && packageMatches;
    if (matches && step.job_id) matchedJobIds.add(step.job_id);
    return matches;
  });

  return {
    jobs: (agentJobs.jobs || []).filter((job) => matchedJobIds.has(job.job_id)),
    ssisSteps,
  };
}

function sanitizeSsisIdSegment(value, fallback = 'unknown') {
  const cleaned = cleanSsisSegment(value || fallback)
    .replace(/\.dtsx$/i, '')
    .replace(/[^A-Za-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || fallback;
}

export function buildSsisExternalObjectId({
  serverName = '',
  folderName = '',
  projectName = '',
  packageName = '',
  componentName = '',
  role = '',
  reference = '',
} = {}) {
  return [
    cleanSsisSegment(serverName) || 'unknown_server',
    'SSISDB',
    'external_sources',
    sanitizeSsisIdSegment(folderName, 'unknown_folder'),
    sanitizeSsisIdSegment(projectName, 'unknown_project'),
    sanitizeSsisIdSegment(packageName, 'unknown_package'),
    sanitizeSsisIdSegment(componentName || reference || role, 'unknown_component'),
  ].join('.');
}

function isExternalSsisComponent(component = {}) {
  const type = String(component.componentType || '');
  return EXTERNAL_COMPONENT_TYPE_PATTERNS.some((pattern) => pattern.test(type));
}

function splitSsisTableReference(reference) {
  const cleaned = cleanSsisSegment(reference);
  const parts = cleaned.split('.').filter(Boolean);

  if (parts.length >= 7 && startsWithIpv4Parts(parts)) {
    return {
      serverName: parts.slice(0, 4).join('.'),
      databaseName: parts[4],
      schemaName: parts[5],
      objectName: parts.slice(6).join('.'),
    };
  }

  if (parts.length >= 4) {
    return {
      serverName: parts[0],
      databaseName: parts[1],
      schemaName: parts[2],
      objectName: parts.slice(3).join('.'),
    };
  }

  if (parts.length === 3) {
    return {
      serverName: '',
      databaseName: parts[0],
      schemaName: parts[1],
      objectName: parts[2],
    };
  }

  if (parts.length === 2) {
    return {
      serverName: '',
      databaseName: '',
      schemaName: parts[0],
      objectName: parts[1],
    };
  }

  return {
    serverName: '',
    databaseName: '',
    schemaName: '',
    objectName: parts[0] || '',
  };
}

function looksLikeSqlCommand(value) {
  return /\b(SELECT|INSERT|UPDATE|DELETE|MERGE|EXEC(?:UTE)?|WITH)\b/i.test(String(value || ''));
}

function extractSsisSqlTableReferences(sql = '', clauses = ['FROM', 'JOIN']) {
  const text = String(sql || '');
  const clausePattern = clauses.join('|');
  const pattern = new RegExp(
    `\\b(?:${clausePattern})\\b\\s+((?:\\[[^\\]]+\\]|[A-Za-z0-9_.$#-]+)(?:\\s*\\.\\s*(?:\\[[^\\]]+\\]|[A-Za-z0-9_.$#-]+)){0,3})`,
    'gi'
  );
  const refs = [];
  let match = pattern.exec(text);
  while (match) {
    const ref = cleanSsisSegment(match[1]).replace(/\s*\.\s*/g, '.');
    if (ref && !/^(SELECT|VALUES|OPENQUERY|OPENDATASOURCE)$/i.test(ref)) {
      refs.push(ref);
    }
    match = pattern.exec(text);
  }
  return Array.from(new Set(refs));
}

function qualifyTableReference(serverName, databaseName, schemaName, objectName) {
  return buildCanonicalSqlId(serverName, databaseName, schemaName, objectName);
}

function combineConnectionAndTable(connection, tableReference, fallbackServer = '') {
  const parsed = splitSsisTableReference(tableReference);
  const rawConnectionString = connection?.rawConnectionString || connection?.filePath || '';
  const server =
    parsed.serverName ||
    connection?.serverName ||
    parseConnectionStringServer(rawConnectionString) ||
    fallbackServer;
  const database =
    parsed.databaseName ||
    connection?.databaseName ||
    parseConnectionStringDatabase(rawConnectionString);
  const schema = parsed.schemaName || connection?.schemaName || 'dbo';
  const object = parsed.objectName || connection?.tableName || '';
  return buildCanonicalSqlId(server, database, schema, object);
}

function buildSsisReference(connection, schemaName, objectName, fallbackServer = '') {
  const parsed = splitSsisTableReference(objectName);
  const rawConnectionString = connection?.rawConnectionString || connection?.filePath || '';
  return buildCanonicalSqlId(
    parsed.serverName ||
      connection?.serverName ||
      parseConnectionStringServer(rawConnectionString) ||
      fallbackServer,
    parsed.databaseName ||
      connection?.databaseName ||
      parseConnectionStringDatabase(rawConnectionString),
    parsed.schemaName || schemaName || 'dbo',
    parsed.objectName || objectName
  );
}

function decodeXmlEntities(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_match, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function xmlAttr(node, names = []) {
  if (!node || typeof node !== 'object') return '';
  for (const name of names) {
    if (node[name] !== undefined && node[name] !== null) return String(node[name]);
  }
  return '';
}

function columnNameFromSsisRef(value) {
  const text = String(value || '');
  const match = text.match(/\.(?:Columns|ExternalColumns)\[([^\]]+)\]/i);
  return match ? cleanSsisSegment(match[1]) : '';
}

function componentNameFromSsisRef(value) {
  const text = String(value || '');
  const match = text.match(/\\([^\\]+)\.(?:Inputs|Outputs)\[/i);
  return match ? cleanSsisSegment(match[1]) : '';
}

function compactEvidence(value, maxLength = 300) {
  const text = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function compactSsisRecord(record) {
  const compact = {};
  for (const [key, value] of Object.entries(record || {})) {
    if (value === null || value === undefined || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    compact[key] = value;
  }
  return compact;
}

function collectColumnNodes(container, nodeNames) {
  return collectXmlValues(container, nodeNames).filter(
    (value) => value && typeof value === 'object'
  );
}

function extractColumnProperties(columnNode) {
  const props = {};
  const propNodes = collectXmlValues(columnNode, ['property', 'DTS:property']);
  for (const p of propNodes) {
    const pName = p?.['@_name'] || p?.['@_DTS:Name'] || p?.['@_Name'] || '';
    const pVal = p?.['#text'] !== undefined ? String(p['#text']) : '';
    if (pName) props[pName] = pVal;
  }
  return props;
}

function valueFromXmlNode(node) {
  if (node === null || node === undefined) return '';
  if (typeof node !== 'object') return String(node);
  if (node['#text'] !== undefined) return String(node['#text']);
  const child = node['DTS:VariableValue'] || node.VariableValue;
  if (Array.isArray(child)) return valueFromXmlNode(child[0]);
  if (child !== undefined) return valueFromXmlNode(child);
  return '';
}

function extractPackageVariables(packageXml) {
  const variables = [];
  for (const node of collectXmlValuesDeep(packageXml, ['DTS:Variable', 'Variable'])) {
    if (!node || typeof node !== 'object') continue;
    const name = xmlAttr(node, ['@_DTS:ObjectName', '@_ObjectName', '@_name']);
    const namespace = xmlAttr(node, ['@_DTS:Namespace', '@_Namespace']) || 'User';
    if (!name) continue;
    variables.push({
      name: cleanSsisSegment(name),
      namespace: cleanSsisSegment(namespace),
      value: valueFromXmlNode(node),
      expression: xmlAttr(node, ['@_DTS:Expression', '@_Expression']),
    });
  }
  return variables;
}

function normalizeSsisVariableKey(value) {
  return cleanSsisSegment(value)
    .replace(/^@\[\$?/, '')
    .replace(/\]$/, '')
    .replace(/^\$/, '')
    .toLowerCase();
}

function addSsisValue(map, key, value, { force = false } = {}) {
  const cleanedKey = normalizeSsisVariableKey(key);
  const cleanedValue = String(value ?? '').trim();
  if (!cleanedKey || cleanedValue === '' || cleanedValue === '***SENSITIVE***') return;
  if (force || !map.has(cleanedKey)) map.set(cleanedKey, cleanedValue);
}

function ssisScopeKey(...parts) {
  return parts
    .map((part) => cleanSsisSegment(part))
    .filter(Boolean)
    .join('.');
}

function packageStem(packageName = '') {
  return cleanSsisSegment(packageName).replace(/\.dtsx$/i, '');
}

function buildSsisScopeCandidates(context = {}) {
  const folder = context.folderName || '';
  const project = context.projectName || '';
  const pkg = context.packageName || '';
  const pkgStem = packageStem(pkg);
  return [
    ssisScopeKey(folder, project, pkg),
    ssisScopeKey(folder, project, pkgStem),
    ssisScopeKey(folder, project),
    ssisScopeKey(project, pkg),
    ssisScopeKey(project, pkgStem),
    ssisScopeKey(project),
    '*',
  ].filter(Boolean);
}

function applySsisParameterOverrideValue(values, parameterName, value) {
  addSsisValue(values, parameterName, value, { force: true });
  addSsisValue(values, `Project::${parameterName}`, value, { force: true });
  addSsisValue(values, `Package::${parameterName}`, value, { force: true });
  addSsisValue(values, `User::${parameterName}`, value, { force: true });
}

function applySsisParameterOverrides(values, parameterOverrides = {}, context = {}) {
  if (!parameterOverrides || typeof parameterOverrides !== 'object') return;

  const scopeCandidates = buildSsisScopeCandidates(context);
  const scopeCandidateKeys = new Set(scopeCandidates.map((scope) => scope.toLowerCase()));

  for (const [scope, scopedOverrides] of Object.entries(parameterOverrides)) {
    if (
      scopedOverrides &&
      typeof scopedOverrides === 'object' &&
      !Array.isArray(scopedOverrides) &&
      scopeCandidateKeys.has(scope.toLowerCase())
    ) {
      for (const [parameterName, value] of Object.entries(scopedOverrides)) {
        applySsisParameterOverrideValue(values, parameterName, value);
      }
    }
  }

  for (const [flatKey, value] of Object.entries(parameterOverrides)) {
    if (value && typeof value === 'object') continue;
    const matchedScope = scopeCandidates
      .sort((left, right) => right.length - left.length)
      .find((scope) => flatKey.toLowerCase().startsWith(`${scope.toLowerCase()}.`));
    if (!matchedScope) continue;
    const parameterName = flatKey.slice(matchedScope.length + 1);
    if (parameterName) applySsisParameterOverrideValue(values, parameterName, value);
  }
}

function mergeScopedSsisConfig(scopedConfig = {}, context = {}) {
  if (!scopedConfig || typeof scopedConfig !== 'object') return {};

  const scopeCandidates = buildSsisScopeCandidates(context);
  const merged = {};

  for (const scope of [...scopeCandidates].reverse()) {
    const match = Object.entries(scopedConfig).find(
      ([candidate]) => cleanSsisSegment(candidate).toLowerCase() === scope.toLowerCase()
    );
    if (match && match[1] && typeof match[1] === 'object' && !Array.isArray(match[1])) {
      Object.assign(merged, match[1]);
    }
  }

  return merged;
}

function connectionManagerNameFromRef(value = '') {
  const raw = cleanSsisSegment(value);
  const bracketMatch = raw.match(/ConnectionManagers\[([^\]]+)\]/i);
  if (bracketMatch) return cleanSsisSegment(bracketMatch[1]);

  const normalized = normalizeSsisReference(value);
  const collapsedMatch = normalized.match(/connectionmanagers([a-z0-9_.-]+)$/i);
  if (collapsedMatch) return cleanSsisSegment(collapsedMatch[1]);

  return cleanSsisSegment(raw.replace(/:external$/i, ''));
}

function getCaseInsensitiveProperty(object = {}, key = '') {
  const match = Object.entries(object || {}).find(
    ([candidate]) =>
      cleanSsisSegment(candidate).toLowerCase() === cleanSsisSegment(key).toLowerCase()
  );
  return match ? match[1] : undefined;
}

function connectionOverrideForRef(connId = '', overrides = {}, context = {}) {
  const connectionName = connectionManagerNameFromRef(connId);
  if (!connectionName || !overrides || typeof overrides !== 'object') return null;

  const scoped = mergeScopedSsisConfig(overrides, context);
  const nested =
    getCaseInsensitiveProperty(scoped.connectionManagers || {}, connectionName) ||
    getCaseInsensitiveProperty(scoped.ConnectionManagers || {}, connectionName) ||
    getCaseInsensitiveProperty(scoped, connectionName);

  let override = {};
  if (typeof nested === 'string') {
    override.connectionString = nested;
  } else if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    override = { ...nested };
  }

  const prefix = `${connectionName}.`;
  for (const [key, value] of Object.entries(scoped)) {
    if (!key.toLowerCase().startsWith(prefix.toLowerCase())) continue;
    override[key.slice(prefix.length)] = value;
  }

  if (Object.keys(override).length === 0) return null;

  const connectionString =
    override.connectionString ||
    override.ConnectionString ||
    override.rawConnectionString ||
    override.RawConnectionString ||
    '';
  const serverName =
    override.serverName ||
    override.ServerName ||
    override.dataSource ||
    override.DataSource ||
    parseConnectionStringServer(connectionString) ||
    '';
  const databaseName =
    override.databaseName ||
    override.DatabaseName ||
    override.initialCatalog ||
    override.InitialCatalog ||
    parseConnectionStringDatabase(connectionString) ||
    '';
  const schemaName =
    override.schemaName ||
    override.SchemaName ||
    parseConnectionStringSchema(connectionString) ||
    '';

  return compactSsisRecord({
    id: connId,
    refId: connId,
    connName: connectionName,
    connType: 'configured_connection_manager',
    serverName,
    databaseName,
    schemaName,
    rawConnectionString: connectionString,
    filePath: connectionString,
    dynamicResolved: true,
    dynamicResolutionEvidence: 'configured_ssis_connection_override',
  });
}

function sameSsisText(left, right) {
  return cleanSsisSegment(left).toLowerCase() === cleanSsisSegment(right).toLowerCase();
}

function environmentValueForParameter(row, environments = {}, context = {}) {
  const variableName = row.referenced_variable_name || row.referencedVariableName || '';
  if (!variableName) return '';

  const variables = (environments.variables || []).filter((variable) =>
    sameSsisText(variable.variable_name || variable.variableName || variable.name, variableName)
  );
  if (variables.length === 0) return '';

  const rowProject = row.project_name || row.projectName || context.projectName || '';
  const rowFolder = row.folder_name || row.folderName || context.folderName || '';
  const references = (environments.references || []).filter((reference) => {
    const projectMatches =
      !rowProject || sameSsisText(reference.project_name || reference.projectName, rowProject);
    const folderMatches =
      !rowFolder || sameSsisText(reference.folder_name || reference.folderName, rowFolder);
    return projectMatches && folderMatches;
  });

  if (references.length > 0) {
    const scoped = variables.filter((variable) =>
      references.some((reference) => {
        const envNameMatches = sameSsisText(
          variable.environment_name || variable.environmentName,
          reference.environment_name || reference.environmentName
        );
        const envFolder =
          reference.environment_folder_name ||
          reference.environmentFolderName ||
          reference.folder_name ||
          reference.folderName;
        const envFolderMatches =
          !envFolder ||
          !variable.folder_name ||
          sameSsisText(variable.folder_name || variable.folderName, envFolder);
        return envNameMatches && envFolderMatches;
      })
    );
    if (scoped.length > 0) {
      return scoped[0].variable_value ?? scoped[0].variableValue ?? scoped[0].value ?? '';
    }
  }

  if (variables.length === 1) {
    return variables[0].variable_value ?? variables[0].variableValue ?? variables[0].value ?? '';
  }

  return '';
}

function buildSsisValueMap({
  parameters = [],
  environments = {},
  packageVariables = [],
  parameterOverrides = {},
  folderName = '',
  projectName = '',
  packageName = '',
  hostServer = '',
} = {}) {
  const values = new Map();

  for (const variable of packageVariables || []) {
    const ns = variable.namespace || 'User';
    addSsisValue(values, `${ns}::${variable.name}`, variable.value);
    addSsisValue(values, variable.name, variable.value);
  }

  for (const row of parameters || []) {
    const rowFolder = cleanSsisSegment(row.folder_name || row.folderName || '');
    const rowProject = cleanSsisSegment(row.project_name || row.projectName || '');
    const rowPackage = cleanSsisSegment(row.package_name || row.packageName || '');
    if (
      rowFolder &&
      folderName &&
      rowFolder.toLowerCase() !== cleanSsisSegment(folderName).toLowerCase()
    ) {
      continue;
    }
    if (
      rowProject &&
      projectName &&
      rowProject.toLowerCase() !== cleanSsisSegment(projectName).toLowerCase()
    ) {
      continue;
    }
    if (
      rowPackage &&
      packageName &&
      rowPackage.toLowerCase() !== cleanSsisSegment(packageName).toLowerCase()
    ) {
      continue;
    }
    const parameterName = row.parameter_name || row.parameterName || row.referenced_variable_name;
    const environmentValue = environmentValueForParameter(row, environments, {
      folderName,
      projectName,
      packageName,
    });
    const value =
      environmentValue || (row.default_value ?? row.design_default_value ?? row.value ?? '');
    addSsisValue(values, parameterName, value);
    addSsisValue(values, `Project::${parameterName}`, value);
    addSsisValue(values, `Package::${parameterName}`, value);
    addSsisValue(values, `User::${parameterName}`, value);
  }

  for (const row of environments?.variables || []) {
    const variableName = row.variable_name || row.variableName || row.name;
    const value = row.variable_value ?? row.variableValue ?? row.value ?? '';
    addSsisValue(values, variableName, value);
    addSsisValue(values, `Project::${variableName}`, value);
    addSsisValue(values, `Package::${variableName}`, value);
    addSsisValue(values, `User::${variableName}`, value);
  }

  addSsisValue(values, 'System::MachineName', hostServer);
  addSsisValue(values, 'MachineName', hostServer);
  applySsisParameterOverrides(values, parameterOverrides, { folderName, projectName, packageName });
  return values;
}

function resolveSsisExpressionValue(expression, valueMap) {
  const text = decodeXmlEntities(expression || '').trim();
  if (!text) return '';
  if (parseConnectionStringDatabase(text) || parseConnectionStringServer(text)) return text;

  const direct = valueMap.get(normalizeSsisVariableKey(text));
  if (direct) return direct;

  const normalizedExpression = text.replace(/\(DT_[A-Z0-9_]+,\s*\d+\)\s*/gi, '');
  const tokenPattern = /"([^"]*)"|'([^']*)'|@\[\$?([A-Za-z0-9_]+)::([A-Za-z0-9_]+)\]/g;
  let output = '';
  let tokenCount = 0;
  let unresolved = false;
  let match = tokenPattern.exec(normalizedExpression);

  while (match) {
    tokenCount += 1;
    if (match[1] !== undefined || match[2] !== undefined) {
      output += match[1] ?? match[2] ?? '';
    } else {
      const namespace = match[3];
      const name = match[4];
      const value =
        valueMap.get(normalizeSsisVariableKey(`${namespace}::${name}`)) ||
        valueMap.get(normalizeSsisVariableKey(name));
      if (value === undefined) {
        unresolved = true;
      } else {
        output += value;
      }
    }
    match = tokenPattern.exec(normalizedExpression);
  }

  if (!tokenCount || unresolved) return '';
  return output.trim();
}

function looksLikeFileOrExternalConnection(cm = {}) {
  const connType = cleanSsisSegment(cm.connType || '');
  const isExplicitFileConnection =
    /(flat\s*file|flatfile|excel|file|raw|xml|ftp|sftp|sharepoint|access)/i.test(connType);
  const valueText = [
    cm.rawConnectionString,
    cm.resolvedConnectionString,
    cm.filePath,
    cm.expressionConnectionString,
  ]
    .filter(Boolean)
    .join(' ');

  if (
    !isExplicitFileConnection &&
    /(?:^|;)\s*(?:Data Source|Server|Initial Catalog|Database)\s*=/i.test(valueText)
  ) {
    return false;
  }

  const typeAndName = [cm.connName, connType].filter(Boolean).join(' ');
  if (
    isExplicitFileConnection ||
    /(flat\s*file|flatfile|excel|raw|xml|ftp|sftp|sharepoint|access)/i.test(typeAndName)
  ) {
    return true;
  }

  const dynamicExpressions = cm.dynamicExpressions || {};
  if (
    Object.keys(dynamicExpressions).some((key) =>
      /filename|file(name|path)?|excel(filepath)?|directory|folder|path|ftp|sftp/i.test(key)
    )
  ) {
    return true;
  }

  if (parseConnectionStringServer(valueText) || parseConnectionStringDatabase(valueText)) {
    return false;
  }

  return /(?:[A-Za-z]:\\|\\\\|\/|sftp:\/\/|ftp:\/\/).+\.(?:csv|txt|xlsx|xls|dat|json|xml|pgp|zip)|\.(?:csv|txt|xlsx|xls|dat|json|xml|pgp|zip)\b/i.test(
    valueText
  );
}

function fileNameFromPath(value = '') {
  const text = cleanSsisSegment(value);
  if (!text) return '';
  const parts = text.split(/[\\/]/).filter(Boolean);
  return parts.at(-1) || text;
}

function buildSsisFileReferences(connectionManagers = [], context = {}) {
  return (connectionManagers || [])
    .filter((cm) => looksLikeFileOrExternalConnection(cm))
    .map((cm) => {
      const configuredValue =
        cm.filePath ||
        cm.resolvedConnectionString ||
        cm.rawConnectionString ||
        cm.expressionConnectionString ||
        '';
      const dynamicExpressions = cm.dynamicExpressions || {};
      const expressionText =
        dynamicExpressions.ConnectionString ||
        dynamicExpressions.FileName ||
        dynamicExpressions.FilePath ||
        dynamicExpressions.ExcelFilePath ||
        cm.expressionConnectionString ||
        '';
      const resolved = Boolean(
        configuredValue &&
        (!cm.hasDynamicExpression || cm.dynamicResolved || configuredValue !== expressionText)
      );

      return compactSsisRecord({
        connection_name: cm.connName || '',
        connection_type: cm.connType || '',
        file_path: configuredValue,
        file_name: fileNameFromPath(configuredValue),
        raw_connection_string: cm.rawConnectionString || '',
        resolved_connection_string: cm.resolvedConnectionString || '',
        expression: expressionText,
        dynamic_variables: cm.dynamicVariables || [],
        dynamic_resolved: cm.dynamicResolved === true,
        resolution_status: resolved ? 'resolved' : 'unresolved',
        evidence_source: cm.dynamicResolved
          ? 'connection_manager_expression_resolved'
          : cm.rawConnectionString || cm.filePath
            ? 'connection_manager'
            : 'connection_manager_expression',
        folder_name: context.folderName || '',
        project_name: context.projectName || '',
        package_name: context.packageName || '',
      });
    });
}

function resolveConnectionManagers(connectionManagers = [], context = {}) {
  const valueMap = buildSsisValueMap(context);
  return connectionManagers.map((cm) => {
    const dynamicExpressions = cm.dynamicExpressions || {};
    const expressionConnectionString =
      dynamicExpressions.ConnectionString || cm.expressionConnectionString || '';
    const resolvedConnectionString = resolveSsisExpressionValue(
      expressionConnectionString,
      valueMap
    );
    const resolvedServerName =
      parseConnectionStringServer(resolvedConnectionString) ||
      resolveSsisExpressionValue(
        dynamicExpressions.ServerName || dynamicExpressions.DataSource,
        valueMap
      );
    const resolvedDatabaseName =
      parseConnectionStringDatabase(resolvedConnectionString) ||
      resolveSsisExpressionValue(
        dynamicExpressions.InitialCatalog ||
          dynamicExpressions.DatabaseName ||
          dynamicExpressions.Database,
        valueMap
      );
    const resolvedSchemaName =
      parseConnectionStringSchema(resolvedConnectionString) ||
      resolveSsisExpressionValue(dynamicExpressions.SchemaName, valueMap);
    const resolvedFilePath =
      resolvedConnectionString ||
      resolveSsisExpressionValue(
        dynamicExpressions.ConnectionString ||
          dynamicExpressions.FileName ||
          dynamicExpressions.ExcelFilePath ||
          dynamicExpressions.FilePath ||
          dynamicExpressions.ServerName ||
          '',
        valueMap
      );

    const dynamicResolved = Boolean(
      cm.dynamicResolved ||
      (cm.hasDynamicExpression &&
        (resolvedConnectionString ||
          resolvedServerName ||
          resolvedDatabaseName ||
          resolvedFilePath))
    );

    return {
      ...cm,
      serverName: resolvedServerName || cm.serverName,
      databaseName: resolvedDatabaseName || cm.databaseName,
      schemaName: resolvedSchemaName || cm.schemaName,
      rawConnectionString: resolvedConnectionString || cm.rawConnectionString,
      resolvedConnectionString,
      filePath: resolvedFilePath || cm.filePath,
      dynamicResolved,
      dynamicResolutionEvidence: dynamicResolved
        ? compactEvidence(
            expressionConnectionString ||
              cm.dynamicResolutionEvidence ||
              JSON.stringify(dynamicExpressions)
          )
        : cm.dynamicResolutionEvidence,
    };
  });
}

function shouldQuarantineDynamicConnection(cm = {}) {
  if (!cm.hasDynamicExpression || cm.dynamicResolved) return false;
  const dynamicExpressions = cm.dynamicExpressions || {};
  const keys = Object.keys(dynamicExpressions).map((key) => key.toLowerCase());
  const evidence = `${cm.connName || ''} ${cm.connType || ''} ${JSON.stringify(dynamicExpressions)} ${
    cm.expressionConnectionString || ''
  }`;

  if (
    keys.length > 0 &&
    keys.every((key) => /password|user(name)?|token|secret|credential/.test(key))
  ) {
    return false;
  }

  if (
    !parseConnectionStringServer(cm.expressionConnectionString) &&
    !parseConnectionStringDatabase(cm.expressionConnectionString) &&
    /(file|flat|excel|ftp|sftp|csv|xlsx|xls|txt|path|directory|folder)/i.test(evidence)
  ) {
    return false;
  }

  return true;
}

function normalizeSsisColumnNode(columnNode, direction) {
  const name = xmlAttr(columnNode, ['@_name', '@_DTS:Name', '@_cachedName', '@_DTS:cachedName']);
  const cachedName = xmlAttr(columnNode, ['@_cachedName', '@_DTS:cachedName']);
  const refId = xmlAttr(columnNode, ['@_refId', '@_DTS:refId']);
  const lineageId = xmlAttr(columnNode, ['@_lineageId', '@_DTS:lineageId']);
  const externalMetadataColumnId = xmlAttr(columnNode, [
    '@_externalMetadataColumnId',
    '@_DTS:externalMetadataColumnId',
  ]);
  const props = extractColumnProperties(columnNode);

  return {
    name: cleanSsisSegment(name || cachedName || columnNameFromSsisRef(refId)),
    cachedName: cleanSsisSegment(cachedName),
    refId,
    lineageId,
    externalMetadataColumnId,
    dataType: xmlAttr(columnNode, ['@_dataType', '@_DTS:dataType', '@_cachedDataType']),
    length: xmlAttr(columnNode, ['@_length', '@_DTS:length', '@_cachedLength']),
    direction,
    expression: props.Expression || props.FriendlyExpression || '',
    friendlyExpression: props.FriendlyExpression || '',
  };
}

function mapExternalColumns(componentNode) {
  const columns = new Map();
  for (const node of collectColumnNodes(componentNode, [
    'externalMetadataColumn',
    'DTS:externalMetadataColumn',
  ])) {
    const refId = xmlAttr(node, ['@_refId', '@_DTS:refId']);
    const name = cleanSsisSegment(
      xmlAttr(node, ['@_name', '@_DTS:Name']) || columnNameFromSsisRef(refId)
    );
    if (!refId && !name) continue;
    const record = {
      refId,
      name,
      dataType: xmlAttr(node, ['@_dataType', '@_DTS:dataType']),
      length: xmlAttr(node, ['@_length', '@_DTS:length']),
    };
    if (refId) columns.set(refId.toLowerCase(), record);
    if (name) columns.set(name.toLowerCase(), record);
  }
  return columns;
}

function findExpressionColumnReferences(expression) {
  const refs = [];
  const pattern = /\[([^\]]+)\]/g;
  let match = pattern.exec(String(expression || ''));
  while (match) {
    const name = cleanSsisSegment(match[1]);
    if (name && !/^(User|System|Project)::/i.test(name) && !refs.includes(name)) {
      refs.push(name);
    }
    match = pattern.exec(String(expression || ''));
  }
  return refs;
}

function extractConnectionManagers(packageXml) {
  const managers = [];
  if (!packageXml) return managers;

  const cmNodes = collectXmlValues(packageXml, [
    'DTS:ConnectionManager',
    'connectionManager',
    'ConnectionManager',
  ]);

  for (const cm of cmNodes) {
    try {
      const raw = typeof cm === 'object' ? cm : {};
      const objectData = raw['DTS:ObjectData'] || raw.ObjectData || {};
      const inner =
        collectXmlValues(objectData, [
          'DTS:ConnectionManager',
          'connectionManager',
          'ConnectionManager',
        ]).find((value) => value && typeof value === 'object') || {};
      const refId =
        raw['@_DTS:refId'] || raw['@_refId'] || inner['@_DTS:refId'] || inner['@_refId'] || '';
      const id =
        raw['@_DTS:DTSID'] || raw['@_DTSID'] || inner['@_DTS:DTSID'] || inner['@_DTSID'] || '';
      const refName = String(refId || '').match(/ConnectionManagers\[([^\]]+)\]/i)?.[1] || '';
      const connType =
        raw['@_DTS:CreationName'] ||
        raw['@_CreationName'] ||
        inner['@_DTS:CreationName'] ||
        inner['@_CreationName'] ||
        '';
      const connName =
        raw['@_DTS:ObjectName'] ||
        raw['@_ObjectName'] ||
        inner['@_DTS:ObjectName'] ||
        inner['@_ObjectName'] ||
        refName ||
        '';

      const props = {};
      const propNodes = [
        ...collectXmlValues(raw, ['DTS:Property', 'property']),
        ...collectXmlValues(inner, ['DTS:Property', 'property']),
      ];
      for (const p of propNodes) {
        const pName = p?.['@_DTS:Name'] || p?.['@_Name'] || '';
        const pVal =
          p && typeof p === 'object' && p['#text'] !== undefined
            ? String(p['#text'])
            : typeof p !== 'object'
              ? String(p)
              : '';
        if (pName) props[pName] = String(pVal);
      }

      const inferred = splitSsisObjectReference(
        props.OpenRowset || props.TableName || props.SqlCommand || ''
      );

      // Extract Project Parameter References (e.g. @[$Project::MyDbConn])
      const expressions = [
        ...collectXmlValues(raw, ['DTS:PropertyExpression', 'propertyExpression']),
        ...collectXmlValues(inner, ['DTS:PropertyExpression', 'propertyExpression']),
      ];
      const dynamicProps = {};
      for (const exp of expressions) {
        const expName = exp?.['@_DTS:Name'] || exp?.['@_Name'] || '';
        const expVal = exp?.['#text'] || exp || '';
        if (expName) dynamicProps[expName] = String(expVal);
      }

      const expressionConnectionString = dynamicProps.ConnectionString || '';
      const rawConnectionString =
        props.ConnectionString ||
        inner['@_DTS:ConnectionString'] ||
        inner['@_ConnectionString'] ||
        raw['@_DTS:ConnectionString'] ||
        raw['@_ConnectionString'] ||
        '';
      const expressionDatabaseName = parseConnectionStringDatabase(expressionConnectionString);
      const rawDatabaseName = parseConnectionStringDatabase(rawConnectionString);
      const expressionServerName = parseConnectionStringServer(expressionConnectionString);
      const rawServerName = parseConnectionStringServer(rawConnectionString);

      managers.push({
        id,
        refId,
        connName,
        connType,
        hasDynamicExpression: Object.keys(dynamicProps).length > 0,
        dynamicVariables: Object.entries(dynamicProps).flatMap(([, expr]) => {
          const matches = String(expr || '').match(/@\[\$?[A-Za-z0-9_]+::([A-Za-z0-9_]+)\]/g) || [];
          return matches.map((m) => m.replace(/^@\[\$?[A-Za-z0-9_]+::/, '').replace(/\]$/, ''));
        }),
        serverName:
          props.ServerName || props.DataSource || expressionServerName || rawServerName || '',
        databaseName:
          props.DatabaseName ||
          props.InitialCatalog ||
          expressionDatabaseName ||
          rawDatabaseName ||
          inferred.databaseName ||
          '',
        schemaName: inferred.schemaName || '',
        tableName: inferred.objectName || '',
        fullName: inferred.fullName || '',
        filePath: rawConnectionString || props.FileName || '',
        rawConnectionString,
        expressionConnectionString,
        dynamicExpressions: dynamicProps,
      });
    } catch (_e) {
      // skip
    }
  }
  return managers;
}

function extractDataFlowComponents(packageXml) {
  const components = [];
  if (!packageXml) return components;

  const compNodes = collectXmlValues(packageXml, ['component', 'DTS:component']);

  for (const c of compNodes) {
    try {
      const compType = c?.['@_componentClassID'] || c?.['@_DTS:componentClassID'] || '';
      const compName = c?.['@_name'] || c?.['@_DTS:ObjectName'] || '';
      const role = COMPONENT_ROLES[compType] || 'UNKNOWN';

      if (role === 'UNKNOWN') continue;

      const props = {};
      const propNodes = collectXmlValues(c, ['property', 'DTS:property']);
      for (const p of propNodes) {
        const pName = p?.['@_name'] || p?.['@_DTS:Name'] || '';
        const pVal = p?.['#text'] !== undefined ? String(p['#text']) : '';
        if (pName) props[pName] = pVal;
      }

      const tableRefCandidate = cleanSsisSegment(props.OpenRowset || props.TableName || '');
      const tableRef = looksLikeSqlCommand(tableRefCandidate) ? '' : tableRefCandidate;
      const splitTable = splitSsisTableReference(tableRef);
      const externalColumnMap = mapExternalColumns(c);
      const inputColumns = collectColumnNodes(c, ['inputColumn', 'DTS:inputColumn']).map((node) =>
        normalizeSsisColumnNode(node, 'input')
      );
      const outputColumns = collectColumnNodes(c, ['outputColumn', 'DTS:outputColumn']).map(
        (node) => normalizeSsisColumnNode(node, 'output')
      );
      const externalMetadataColumns = Array.from(
        new Map(
          Array.from(externalColumnMap.values()).map((column) => [
            String(column.refId || column.name || '').toLowerCase(),
            column,
          ])
        ).values()
      );
      const connectionNodes = collectXmlValues(c, ['connection', 'DTS:connection']).filter(
        (value) => value && typeof value === 'object'
      );
      const primaryConnection =
        connectionNodes.find(
          (conn) =>
            conn['@_connectionManagerID'] ||
            conn['@_DTS:connectionManagerID'] ||
            conn['@_connectionManagerRefId'] ||
            conn['@_DTS:connectionManagerRefId']
        ) || {};
      const connRef = normalizeSsisReference(
        props.ConnectionManagerID ||
          props.ConnectionManagerId ||
          primaryConnection['@_connectionManagerRefId'] ||
          primaryConnection['@_DTS:connectionManagerRefId'] ||
          primaryConnection['@_connectionManagerID'] ||
          primaryConnection['@_DTS:connectionManagerID'] ||
          ''
      );

      components.push({
        componentType: compType,
        componentName: compName,
        role,
        sqlCommand:
          props.SqlCommand ||
          props.SqlCommandParam ||
          props.ReferenceMetadataSqlCommand ||
          (looksLikeSqlCommand(props.OpenRowset) ? props.OpenRowset : ''),
        sqlCommandVariable: props.SqlCommandVariable || '',
        tableName: tableRef,
        tableDatabaseName: splitTable.databaseName || '',
        tableSchemaName: splitTable.schemaName || '',
        tableObjectName: splitTable.objectName || '',
        connectionManagerId: connRef,
        lookupConnectionManagerId: normalizeSsisReference(
          props.ReferenceMetadataConnectionManagerID || ''
        ),
        lookupTable: cleanSsisSegment(
          looksLikeSqlCommand(props.SqlCommandParam || props.ReferenceMetadataSqlCommand)
            ? extractSsisSqlTableReferences(
                props.SqlCommandParam || props.ReferenceMetadataSqlCommand,
                ['FROM', 'JOIN']
              )[0] || ''
            : props.SqlCommandParam || props.ReferenceMetadataSqlCommand || ''
        ),
        inputColumns,
        outputColumns,
        externalMetadataColumns,
        derivedColumns: outputColumns
          .filter((column) => column.expression)
          .map((column) => ({
            output_column: column.name,
            expression: column.expression,
            source_columns: findExpressionColumnReferences(column.expression),
          })),
      });
    } catch (_e) {
      // skip
    }
  }
  return components;
}

function componentTableName(component) {
  const explicitRef = [
    component?.tableDatabaseName,
    component?.tableSchemaName,
    component?.tableObjectName,
  ]
    .filter(Boolean)
    .join('.');
  const sqlRefs = extractSsisSqlTableReferences(component?.sqlCommand || '', ['FROM', 'JOIN']);
  return cleanSsisSegment(
    component?.tableName || component?.lookupTable || explicitRef || sqlRefs[0] || ''
  );
}

function transformTypeForMapping(inputColumn, externalColumn) {
  const input = cleanSsisSegment(inputColumn || '').toLowerCase();
  const external = cleanSsisSegment(externalColumn || '').toLowerCase();
  if (!input || !external) return 'dynamic_or_unresolved';
  return input === external ? 'direct' : 'rename';
}

function extractSsisColumnMappingsFromComponents(components = [], options = {}) {
  const mappings = [];
  const unresolved = [];
  const componentByName = new Map();
  const packageId = options.packageId || '';

  for (const component of components) {
    if (component?.componentName) {
      componentByName.set(component.componentName.toLowerCase(), component);
    }
  }

  const addMapping = (record) => {
    const key = [
      record.component_name,
      record.source_component || '',
      record.destination_component || '',
      record.input_column || '',
      record.output_column || '',
      record.external_metadata_column || '',
      record.expression || '',
    ]
      .map((value) => String(value || '').toLowerCase())
      .join('|');
    if (mappings.some((existing) => existing._key === key)) return;
    mappings.push({ ...compactSsisRecord(record), _key: key });
  };

  const addUnresolved = (record) => {
    const key = [
      record.component_name,
      record.reason,
      record.evidence_text,
      record.input_column || '',
      record.output_column || '',
    ]
      .map((value) => String(value || '').toLowerCase())
      .join('|');
    if (unresolved.some((existing) => existing._key === key)) return;
    unresolved.push({ ...compactSsisRecord(record), _key: key });
  };

  for (const component of components) {
    if (component.role === 'DESTINATION') {
      for (const inputColumn of component.inputColumns || []) {
        const externalName =
          columnNameFromSsisRef(inputColumn.externalMetadataColumnId) || inputColumn.name;
        const sourceComponentName = componentNameFromSsisRef(inputColumn.lineageId);
        const sourceComponent = componentByName.get(sourceComponentName.toLowerCase());
        const sourceColumn =
          columnNameFromSsisRef(inputColumn.lineageId) ||
          inputColumn.cachedName ||
          inputColumn.name;

        if (!externalName || !sourceColumn) {
          addUnresolved({
            package_id: packageId,
            component_name: component.componentName,
            component_type: component.componentType,
            reason: 'destination_column_mapping_incomplete',
            input_column: inputColumn.name,
            output_column: externalName,
            evidence_type: 'ssis_dataflow_column_mapping',
            evidence_text: compactEvidence(
              `${inputColumn.lineageId || ''} -> ${inputColumn.externalMetadataColumnId || ''}`
            ),
            validation_status: 'unresolved',
          });
          continue;
        }

        addMapping({
          package_id: packageId,
          data_flow_name: '',
          component_name: component.componentName,
          component_type: component.componentType,
          source_component: sourceComponentName || null,
          destination_component: component.componentName,
          source_object: componentTableName(sourceComponent) || sourceComponentName || null,
          destination_object: componentTableName(component) || null,
          input_column: sourceColumn,
          output_column: externalName,
          external_metadata_column: externalName,
          transform_type: transformTypeForMapping(sourceColumn, externalName),
          expression: inputColumn.cachedName || sourceColumn,
          evidence_type: 'ssis_dataflow_column_mapping',
          evidence_text: compactEvidence(
            `InputColumn=${inputColumn.cachedName || inputColumn.name}; Lineage=${inputColumn.lineageId}; ExternalColumn=${externalName}`
          ),
          validation_status: 'validated',
        });
      }
    }

    if (component.role === 'LOOKUP') {
      for (const outputColumn of component.outputColumns || []) {
        addMapping({
          package_id: packageId,
          data_flow_name: '',
          component_name: component.componentName,
          component_type: component.componentType,
          source_component: component.componentName,
          destination_component: null,
          source_object: component.lookupTable || componentTableName(component) || null,
          destination_object: null,
          input_column: null,
          output_column: outputColumn.name,
          external_metadata_column:
            columnNameFromSsisRef(outputColumn.externalMetadataColumnId) || null,
          transform_type: 'lookup',
          expression: outputColumn.expression || outputColumn.name,
          evidence_type: 'ssis_lookup_output',
          evidence_text: compactEvidence(
            outputColumn.lineageId || outputColumn.refId || outputColumn.name
          ),
          validation_status: 'validated',
        });
      }
    }

    for (const derivedColumn of component.derivedColumns || []) {
      addMapping({
        package_id: packageId,
        data_flow_name: '',
        component_name: component.componentName,
        component_type: component.componentType,
        source_component: component.componentName,
        destination_component: null,
        source_object: componentTableName(component) || null,
        destination_object: null,
        input_column: derivedColumn.source_columns?.[0] || null,
        output_column: derivedColumn.output_column,
        external_metadata_column: null,
        transform_type: derivedColumn.source_columns?.length ? 'derived' : 'constant',
        expression: derivedColumn.expression,
        evidence_type: 'ssis_derived_column_expression',
        evidence_text: compactEvidence(
          `DerivedColumn=${derivedColumn.output_column}; Expression=${derivedColumn.expression}`
        ),
        validation_status: 'validated',
      });
    }
  }

  return {
    ssisColumnMappings: mappings.map(({ _key, ...record }) => record),
    unresolvedSsisColumnMappings: unresolved.map(({ _key, ...record }) => record),
  };
}

function buildUnresolvedSsisMappings(connectionManagers = [], packageId = '') {
  return (connectionManagers || [])
    .filter((cm) => shouldQuarantineDynamicConnection(cm))
    .map((cm) => ({
      package_id: packageId,
      component_name: cm.connName || cm.connType || 'unknown_connection_manager',
      component_type: 'connection_manager',
      reason: 'dynamic_connection_manager',
      evidence_type: 'ssis_dynamic_connection',
      evidence_text: compactEvidence(
        cm.expressionConnectionString || JSON.stringify(cm.dynamicExpressions || {})
      ),
      variable_names: cm.dynamicVariables || [],
      validation_status: 'unresolved',
    }));
}

function extractExecuteSqlTasks(packageXml) {
  const tasks = [];
  if (!packageXml) return tasks;

  const execNodes = collectXmlValuesDeep(packageXml, ['DTS:Executable', 'Executable']);

  for (const exec of execNodes) {
    try {
      const raw = typeof exec === 'object' ? exec : {};
      const execType = raw['@_DTS:ExecutableType'] || raw['@_ExecutableType'] || '';

      if (String(execType).includes('ExecuteSQLTask')) {
        const taskName = raw['@_DTS:ObjectName'] || raw['@_ObjectName'] || 'ExecuteSQLTask';
        const objectData = raw['DTS:ObjectData'] || raw.ObjectData || {};
        const sqlTaskData = objectData['SQLTask:SqlTaskData'] || objectData.SqlTaskData || {};

        const sqlStatement =
          sqlTaskData['@_SQLTask:SqlStatementSource'] ||
          sqlTaskData['@_SqlStatementSource'] ||
          sqlTaskData['@_DTS:SqlStatementSource'] ||
          '';
        const connId =
          sqlTaskData['@_SQLTask:Connection'] ||
          sqlTaskData['@_Connection'] ||
          sqlTaskData['@_DTS:Connection'] ||
          '';

        if (sqlStatement) {
          tasks.push({
            taskName,
            sqlStatement,
            connectionManagerId: connId,
          });
        }
      }
    } catch (_e) {
      // skip
    }
  }
  return tasks;
}

function extractExecutePackageTasks(packageXml) {
  const tasks = [];
  if (!packageXml) return tasks;

  const execNodes = collectXmlValuesDeep(packageXml, ['DTS:Executable', 'Executable']);

  for (const exec of execNodes) {
    try {
      const raw = typeof exec === 'object' ? exec : {};
      const execType = raw['@_DTS:ExecutableType'] || raw['@_ExecutableType'] || '';
      if (!String(execType).includes('ExecutePackageTask')) continue;

      const taskName = raw['@_DTS:ObjectName'] || raw['@_ObjectName'] || 'ExecutePackageTask';
      const objectData = raw['DTS:ObjectData'] || raw.ObjectData || {};
      const taskData =
        objectData.ExecutePackageTask ||
        collectXmlValues(objectData, ['ExecutePackageTask']).find(
          (value) => value && typeof value === 'object'
        ) ||
        {};
      const packageNameNode =
        taskData['@_PackageName'] ||
        taskData['@_DTS:PackageName'] ||
        taskData.PackageName ||
        taskData['DTS:PackageName'] ||
        collectXmlValues(taskData, ['PackageName', 'DTS:PackageName'])[0] ||
        collectXmlValues(objectData, ['PackageName', 'DTS:PackageName'])[0] ||
        '';
      const packageNameText =
        packageNameNode && typeof packageNameNode === 'object'
          ? packageNameNode['#text'] || packageNameNode['@_PackageName'] || ''
          : packageNameNode;
      const packageName = normalizePackageTaskName(packageNameText);

      if (packageName) {
        tasks.push({
          taskName,
          packageName,
        });
      }
    } catch (_e) {
      // skip
    }
  }

  return tasks;
}

function normalizePackageTaskName(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const parts = raw.replace(/\\/g, '/').split('/').filter(Boolean);
  const packageName = parts[parts.length - 1] || raw;
  return packageName.toLowerCase().endsWith('.dtsx') ? packageName : `${packageName}.dtsx`;
}

// -----------------------------------------------------------------------------
// Main Extractor Class
// -----------------------------------------------------------------------------

class SsisMetadataExtractor {
  constructor(connectionConfig, sqlDriver = mssql) {
    this.config = connectionConfig || {};
    this.sql = sqlDriver;
    this.pool = null;
  }

  async connect() {
    this.pool = new this.sql.ConnectionPool(this.config);
    await this.pool.connect();
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }

  async checkSsisdb(warnings) {
    const present = await ssisdbExists(this.pool);
    if (!present) warnings.push('SSISDB: catalog extraction skipped');
    return present;
  }

  async extractCatalogInventory(warnings, options = {}) {
    const limit = Number(options.limit || options.catalogLimit);
    const topClause =
      Number.isFinite(limit) && limit > 0 ? `TOP (${Math.min(Math.trunc(limit), 1000)})` : '';
    const { rows, error } = await safeQuery(
      this.pool,
      `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
      USE SSISDB;
       SELECT
         ${topClause}
         f.name                     AS folder_name,
         p.project_id,
         p.name                     AS project_name,
         pkg.package_id,
         pkg.name                   AS package_name,
         pkg.entry_point,
         pkg.last_validation_time   AS package_last_validation
       FROM catalog.folders f
       JOIN catalog.projects p  ON f.folder_id = p.folder_id
       JOIN catalog.packages pkg ON p.project_id = pkg.project_id`
    );
    if (error) warnings.push(`catalog_inventory: ${error}`);
    return rows;
  }

  async extractParameters(warnings) {
    const { rows, error } = await safeQuery(
      this.pool,
      `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
      USE SSISDB;
       SELECT
         f.name          AS folder_name,
         p.project_id,
         p.name          AS project_name,
         pkg.name        AS package_name,
         par.object_name,
         par.object_type,
         par.parameter_name,
         par.design_default_value,
         par.default_value,
         par.value_type,
         par.referenced_variable_name
       FROM catalog.object_parameters par
       JOIN catalog.projects  p   ON par.project_id = p.project_id
       JOIN catalog.folders   f   ON p.folder_id = f.folder_id
       LEFT JOIN catalog.packages pkg
         ON par.project_id = pkg.project_id
        AND par.object_name = pkg.name`
    );
    if (error) warnings.push(`parameters: ${error}`);
    return rows;
  }

  async extractEnvironments(warnings) {
    const { rows: varRows, error: varErr } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         f.name               AS folder_name,
         e.environment_id,
         e.name               AS environment_name,
         v.name               AS variable_name,
         CASE WHEN v.sensitive = 1 THEN '***SENSITIVE***' ELSE CAST(v.value AS nvarchar(max)) END AS variable_value
       FROM catalog.environment_variables v
       JOIN catalog.environments  e ON v.environment_id = e.environment_id
       JOIN catalog.folders       f ON e.folder_id = f.folder_id`
    );
    if (varErr) warnings.push(`environment_variables: ${varErr}`);

    const { rows: refRows, error: refErr } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         f.name AS folder_name,
         p.name AS project_name,
         r.reference_id,
         r.reference_type,
         r.environment_folder_name,
         r.environment_name
       FROM catalog.environment_references r
       JOIN catalog.projects p ON r.project_id = p.project_id
       JOIN catalog.folders f ON p.folder_id = f.folder_id`
    );
    if (refErr) warnings.push(`environment_references: ${refErr}`);
    return { variables: varRows, references: refRows };
  }

  async extractPackageXmlMetadata(warnings, parameters = [], environments = {}) {
    const xmlResults = [];
    const dumpRawXml = true;
    let rawXmlDumpDir = null;
    let rawXmlAnalysisDir = null;
    let dumpCounter = 0;
    let fsModule = null;
    let pathModule = null;

    let AdmZip;
    try {
      const admZipModule = await import('adm-zip');
      AdmZip = admZipModule.default || admZipModule;
    } catch (err) {
      warnings.push('adm-zip is missing. Run: npm install adm-zip');
      return xmlResults;
    }

    this.extractionDiagnostics = [];
    this.extractionDiagnostics.push(
      `=== SSIS EXTRACTION DIAGNOSTICS LOG - ${new Date().toISOString()} ===`
    );

    if (dumpRawXml) {
      try {
        const [fsImport, pathImport] = await Promise.all([import('fs'), import('path')]);
        fsModule = fsImport;
        pathModule = pathImport;
        const fs = fsModule.default || fsModule;
        const path = pathModule.default || pathModule;
        rawXmlDumpDir = path.resolve(process.cwd(), 'data/markdown/ssis_raw_xml');
        rawXmlAnalysisDir = path.resolve(process.cwd(), 'data/analysis/raw/ssis/xml');
        if (!fs.existsSync(rawXmlDumpDir)) {
          fs.mkdirSync(rawXmlDumpDir, { recursive: true });
        }
        if (!fs.existsSync(rawXmlAnalysisDir)) {
          fs.mkdirSync(rawXmlAnalysisDir, { recursive: true });
        }
        this.extractionDiagnostics.push(`Raw XML dump enabled: ${rawXmlDumpDir}`);
      } catch (err) {
        warnings.push(`ssis_raw_xml_dump: ${err.message}`);
        rawXmlDumpDir = null;
        rawXmlAnalysisDir = null;
      }
    }

    // 1. Get SSISDB Overrides (Parameters)
    const { rows: connRows } = await safeQuery(
      this.pool,
      `SELECT p.name AS project_name, op.parameter_name, CAST(COALESCE(op.default_value, op.design_default_value) AS NVARCHAR(MAX)) AS connection_string
       FROM SSISDB.catalog.object_parameters op
       JOIN SSISDB.catalog.projects p ON op.project_id = p.project_id
       WHERE op.parameter_name LIKE 'CM.%.ConnectionString'`
    );

    const catalogOverrides = new Map();
    if (connRows) {
      this.extractionDiagnostics.push(
        `Found ${connRows.length} potential connection parameter overrides in SSISDB.catalog.object_parameters.`
      );
      for (const row of connRows) {
        if (!row.connection_string) continue;
        const dbMatch = row.connection_string.match(/(?:Initial Catalog|Database)\s*=\s*([^;"]+)/i);
        if (dbMatch) {
          const cmName = row.parameter_name.replace('CM.', '').replace('.ConnectionString', '');
          const key = `${row.project_name}_${cmName}`.toLowerCase();
          catalogOverrides.set(key, dbMatch[1].trim());
          this.extractionDiagnostics.push(
            `  [Catalog Override Mapped] Project: ${row.project_name} | CM: ${cmName} -> Target DB: ${dbMatch[1].trim()}`
          );
        }
      }
    }

    const scopeFilters = getSsisScopeFilters(this.config);
    const configuredFolder = scopeFilters.folder;
    const configuredProject = scopeFilters.project;
    const configuredPackages = scopeFilters.packages;

    // 2. Get Projects
    const { rows: projects, error: projErr } = await safeQuery(
      this.pool,
      `SELECT f.name AS folder_name, p.name AS project_name
       FROM SSISDB.catalog.projects p
       JOIN SSISDB.catalog.folders f ON p.folder_id = f.folder_id`
    );

    if (projErr) return xmlResults;
    const filteredProjects = (projects || []).filter((project) => {
      const folderMatches =
        !configuredFolder ||
        cleanSsisSegment(project.folder_name || '').toLowerCase() ===
          configuredFolder.toLowerCase();
      const projectMatches =
        !configuredProject ||
        cleanSsisSegment(project.project_name || '').toLowerCase() ===
          configuredProject.toLowerCase();
      return folderMatches && projectMatches;
    });
    if ((projects || []).length && filteredProjects.length === 0) {
      warnings.push(
        `ssis_project_filter: no projects matched folder='${configuredFolder || '*'}' project='${configuredProject || '*'}'`
      );
    }

    // eslint-disable-next-line no-await-in-loop
    for (const proj of filteredProjects) {
      this.extractionDiagnostics.push(
        `\nProcessing Project: ${proj.project_name} (Folder: ${proj.folder_name})`
      );
      try {
        const req = this.pool.request();
        req.input('folder_name', this.sql.NVarChar, proj.folder_name);
        req.input('project_name', this.sql.NVarChar, proj.project_name);

        // eslint-disable-next-line no-await-in-loop
        const result = await req.execute('SSISDB.catalog.get_project');

        if (!result.recordset || result.recordset.length === 0) continue;
        const ispacBuffer = extractBinaryPayload(result.recordset[0]);
        if (!ispacBuffer) continue;

        this.extractionDiagnostics.push(
          `  Project binary payload detected for ${proj.project_name}: ${ispacBuffer.length} bytes`
        );

        const zip = new AdmZip(ispacBuffer);
        const zipEntries = zip.getEntries();

        // 3. Extract Project Connection Managers (.conmgr)
        const projectConnections = [];
        for (const zipEntry of zipEntries) {
          if (zipEntry.entryName.toLowerCase().endsWith('.conmgr')) {
            const conmgrXml = zipEntry.getData().toString('utf-8');
            const idMatch = conmgrXml.match(/DTS:DTSID="([^"]+)"/i);
            const nameMatch = conmgrXml.match(/DTS:ObjectName="([^"]+)"/i);
            const connStrMatch = conmgrXml.match(/DTS:ConnectionString="([^"]+)"/i);

            if (idMatch || nameMatch) {
              const connName = nameMatch ? nameMatch[1] : null;
              let dbName = null;
              let choiceReason = '';

              if (connName) {
                const overrideKey = `${proj.project_name}_${connName}`.toLowerCase();
                if (catalogOverrides.has(overrideKey)) {
                  dbName = catalogOverrides.get(overrideKey);
                  choiceReason = 'Matched explicit SSISDB Catalog Parameter override';
                }
              }

              if (!dbName && connStrMatch) {
                const dbMatch = connStrMatch[1].match(
                  /(?:Initial Catalog|Database)\s*=\s*([^;"]+)/i
                );
                if (dbMatch) {
                  dbName = dbMatch[1].trim();
                  choiceReason =
                    'Extracted directly from .conmgr file raw connection string XML attribute';
                }
              }

              this.extractionDiagnostics.push(
                `  Found Project Connection (.conmgr): Name="${connName}" | ID="${idMatch ? idMatch[1] : 'N/A'}" -> Derived DB: "${dbName || 'unknown'}" (Reason: ${choiceReason || 'None found yet'})`
              );

              projectConnections.push({
                id: idMatch ? idMatch[1] : null,
                connName,
                refId: connName ? `Project.ConnectionManagers[${connName}]` : null,
                databaseName: dbName || connName || 'unknown_db',
              });
            }
          }
        }

        // 4. Extract Packages (.dtsx)
        for (const zipEntry of zipEntries) {
          if (zipEntry.entryName.toLowerCase().endsWith('.dtsx')) {
            const cleanedPackageName = cleanSsisSegment(zipEntry.entryName).toLowerCase();
            const packageMatches =
              configuredPackages.length === 0 ||
              configuredPackages.some(
                (candidate) =>
                  candidate === cleanedPackageName ||
                  `${candidate}.dtsx` === cleanedPackageName ||
                  candidate === cleanedPackageName.replace(/\.dtsx$/i, '')
              );
            if (!packageMatches) continue;
            const xmlBuffer = zipEntry.getData();
            if (dumpRawXml && rawXmlDumpDir) {
              try {
                dumpCounter += 1;
                const safeProject = String(proj.project_name || 'project')
                  .replace(/[<>:"/\\|?*]/g, '_')
                  .replace(/\s+/g, '_');
                const safePackage = String(zipEntry.entryName)
                  .replace(/[<>:"/\\|?*]/g, '_')
                  .replace(/\s+/g, '_');
                const dumpName = `${String(dumpCounter).padStart(4, '0')}_${safeProject}_${safePackage}.xml`;
                const fs = fsModule.default || fsModule;
                const path = pathModule.default || pathModule;
                fs.writeFileSync(path.join(rawXmlDumpDir, dumpName), xmlBuffer, 'utf-8');
                if (rawXmlAnalysisDir) {
                  fs.writeFileSync(path.join(rawXmlAnalysisDir, dumpName), xmlBuffer, 'utf-8');
                }
              } catch (dumpErr) {
                warnings.push(`ssis_raw_xml_dump_write: ${dumpErr.message}`);
              }
            }
            const xmlDoc = parsePackageXml(xmlBuffer);

            if (xmlDoc) {
              const packageVariables = extractPackageVariables(xmlDoc);
              const pkgConnections = extractConnectionManagers(xmlDoc) || [];

              for (const cm of pkgConnections) {
                let dbName = null;
                let choiceReason = '';

                if (cm.connName) {
                  const overrideKey = `${proj.project_name}_${cm.connName}`.toLowerCase();
                  if (catalogOverrides.has(overrideKey)) {
                    dbName = catalogOverrides.get(overrideKey);
                    choiceReason =
                      'Matched explicit SSISDB Catalog Parameter override inside Package loop';
                  }
                }
                if (!dbName && cm.rawConnectionString) {
                  const dbMatch = cm.rawConnectionString.match(
                    /(?:Initial Catalog|Database)\s*=\s*([^;"]+)/i
                  );
                  if (dbMatch) {
                    dbName = dbMatch[1].trim();
                    choiceReason =
                      'Extracted directly from package-level ConnectionManager ConnectionString property';
                  }
                }
                cm.databaseName = dbName || cm.databaseName || cm.connName || 'unknown_db';
                cm.serverName =
                  cm.serverName ||
                  parseConnectionStringServer(cm.rawConnectionString) ||
                  parseConnectionStringServer(cm.expressionConnectionString);
                this.extractionDiagnostics.push(
                  `    Package level connection in [${zipEntry.entryName}]: Name="${cm.connName}" -> Derived DB: "${cm.databaseName}" (${choiceReason || 'Defaulted to Connection Name / Unknown'})`
                );
              }

              const dataFlowComponents = extractDataFlowComponents(xmlDoc) || [];
              const livePackageId = buildCanonicalPackageId(
                this.config.server || '',
                proj.folder_name,
                proj.project_name,
                zipEntry.entryName
              );
              const resolvedConnectionManagers = resolveConnectionManagers(
                [...pkgConnections, ...projectConnections],
                {
                  parameters,
                  environments,
                  parameterOverrides: this.config.ssisProjectParameterOverrides || {},
                  packageVariables,
                  folderName: proj.folder_name,
                  projectName: proj.project_name,
                  packageName: zipEntry.entryName,
                  hostServer: this.config.server || '',
                }
              );
              const columnMappingResult =
                extractSsisColumnMappingsFromComponents(dataFlowComponents, {
                  packageId: livePackageId,
                }) || {};
              const ssisFileReferences = buildSsisFileReferences(resolvedConnectionManagers, {
                folderName: proj.folder_name,
                projectName: proj.project_name,
                packageName: zipEntry.entryName,
              });

              // --- ADVANCED STRUCTURAL ANALYSIS FALLBACK LAYER ---
              // If we have data flow components that maps to an unknown connection object name,
              // we analyze the physical table schema structure to trace context boundaries.
              for (const comp of dataFlowComponents) {
                if (
                  !comp.connectionManagerId ||
                  comp.connectionManagerId === 'unknown_db' ||
                  comp.connectionManagerId.includes('unknown_db')
                ) {
                  // Trace table names using structural schema dot splitting
                  const targetTable = comp.tableName || '';
                  if (targetTable.includes('.')) {
                    const schemaParts = targetTable.split('.');
                    if (schemaParts.length > 0 && schemaParts[0]) {
                      const derivedContextName = schemaParts[0].replace(/\[|\]/g, '').trim();

                      // Inject the structured schema definition directly as the database connection layer fallback context
                      comp.connectionManagerId = derivedContextName;
                      this.extractionDiagnostics.push(
                        `    [STRUCTURAL LAYOUT FIX] Component "${comp.componentName}" has an anonymous lineage container. Inferred boundary context name via schema prefix: "${derivedContextName}"`
                      );
                    }
                  }
                }
              }

              xmlResults.push({
                objectName: zipEntry.entryName,
                packageName: zipEntry.entryName,
                folderName: proj.folder_name,
                projectName: proj.project_name,
                packageVariables,
                connectionManagers: resolvedConnectionManagers,
                ssisFileReferences,
                dataFlowComponents,
                ssisColumnMappings: columnMappingResult.ssisColumnMappings || [],
                unresolvedSsisColumnMappings: [
                  ...(columnMappingResult.unresolvedSsisColumnMappings || []),
                  ...buildUnresolvedSsisMappings(resolvedConnectionManagers, livePackageId),
                ],
                sqlTasks: extractExecuteSqlTasks(xmlDoc),
                packageTasks: extractExecutePackageTasks(xmlDoc),
              });
            } else {
              warnings.push(`package_xml_parse_failed: ${proj.project_name}/${zipEntry.entryName}`);
              this.extractionDiagnostics.push(
                `  XML parse failed for package ${zipEntry.entryName} in project ${proj.project_name}; raw package bytes length=${xmlBuffer.length}`
              );
            }
          }
        }
      } catch (err) {
        warnings.push(`Failed to extract project ${proj.project_name}: ${err.message}`);
        this.extractionDiagnostics.push(
          `  CRITICAL EXCEPTION processing project ${proj.project_name}: ${err.message}`
        );
      }
    }

    try {
      const fs = await import('fs');
      const path = await import('path');
      const logDir = path.resolve(process.cwd(), 'data/markdown');
      if (fs.existsSync(logDir)) {
        fs.writeFileSync(
          path.join(logDir, 'ssis_lineage_troubleshoot.txt'),
          this.extractionDiagnostics.join('\n'),
          'utf-8'
        );
      }
    } catch (logWriteErr) {
      // skip
    }

    return xmlResults;
  }

  async extractAgentJobs(warnings) {
    const { rows: jobRows, error: jobErr } = await safeQuery(
      this.pool,
      `SELECT job_id, name AS job_name, enabled FROM msdb.dbo.sysjobs`
    );
    if (jobErr) warnings.push(`agent_jobs: ${jobErr}`);

    const { rows: stepRows, error: stepErr } = await safeQuery(
      this.pool,
      `SELECT js.job_id, js.step_name, js.subsystem, js.command
       FROM msdb.dbo.sysjobsteps js
       WHERE js.subsystem IN ('SSIS') OR (js.subsystem IN ('CmdExec','PowerShell') AND js.command LIKE '%dtexec%')`
    );
    if (stepErr) warnings.push(`agent_job_steps: ${stepErr}`);

    return { jobs: jobRows, ssisSteps: stepRows };
  }

  // ---------------------------------------------------------------------------
  // Lineage Edge Builder (Contains Priorities 1, 2, and 5)
  // ---------------------------------------------------------------------------

  // eslint-disable-next-line class-methods-use-this
  buildLineageEdges(catalog = [], xmlMeta = [], agentData = {}, _parameters, _environments) {
    const edges = [];
    const hostServer = cleanSsisSegment(
      this.config.server ||
        this.config.serverName ||
        parseConnectionStringServer(this.config.connectionString) ||
        'unknown_server'
    );
    const catalogByPackage = new Map();
    const catalogByProjectPackage = new Map();

    for (const row of catalog || []) {
      const packageName = cleanSsisSegment(row.package_name || '');
      const projectName = cleanSsisSegment(row.project_name || '');
      if (!packageName) continue;
      catalogByPackage.set(packageName.toLowerCase(), row);
      if (projectName) {
        catalogByProjectPackage.set(`${projectName}.${packageName}`.toLowerCase(), row);
      }
    }

    const packageIdFromCatalogRow = (row, fallbackProject = '', fallbackPackage = '') =>
      buildCanonicalPackageId(
        hostServer,
        row?.folder_name || 'unknown_folder',
        row?.project_name || fallbackProject || 'unknown_project',
        row?.package_name || fallbackPackage
      );

    const resolvePackageId = (packageName, projectName = '') => {
      const cleanedPackage = cleanSsisSegment(packageName);
      const cleanedProject = cleanSsisSegment(projectName);
      const row =
        catalogByProjectPackage.get(`${cleanedProject}.${cleanedPackage}`.toLowerCase()) ||
        catalogByPackage.get(cleanedPackage.toLowerCase());
      return packageIdFromCatalogRow(row, cleanedProject, cleanedPackage);
    };

    // --- Priority 1: SQL Agent Job Mapping ---
    const jobEdges = [];
    const jobsById = new Map((agentData.jobs || []).map((j) => [j.job_id, j]));

    for (const step of agentData.ssisSteps || []) {
      const job = jobsById.get(step.job_id);
      if (!job || !job.enabled) continue;

      const command = String(step.command || '');
      const catalogPathMatch = command.match(/\\SSISDB\\([^\\]+)\\([^\\]+)\\([^\\"]+\.dtsx)/i);
      const legacyMatch = command.match(/\\(?:Projects|Packages)\\.*?\\([^\\]+\.dtsx)/i);
      const match = catalogPathMatch || legacyMatch;
      if (match) {
        const pkgName = catalogPathMatch ? match[3] : match[1];
        const targetPackageId = catalogPathMatch
          ? buildCanonicalPackageId(hostServer, match[1], match[2], match[3])
          : resolvePackageId(pkgName);
        jobEdges.push({
          from: `AGENT_JOB/${job.job_name}`,
          to: targetPackageId,
          via: `AgentStep/${step.step_name}`,
          edgeType: 'TRIGGERS',
          validation_status: targetPackageId ? 'validated' : 'unresolved',
          evidence_type: 'sql_agent_job_step',
          evidence_text: command,
          confidence: 1.0,
        });
      }
    }
    edges.push(...jobEdges);

    // --- Priority 2: Smart T-SQL Tokenizer ---
    const parseSqlEntities = (sql) => {
      const calls = [];
      const writes = [];
      const reads = [];
      if (!sql) return { calls, writes, reads };

      const normalized = decodeXmlEntities(sql).replace(/[\r\n\t]/g, ' ');

      const execMatches = normalized.matchAll(/\bEXEC(?:UTE)?\s+([a-zA-Z0-9_[\].]+)/gi);
      for (const m of execMatches) {
        const [, execMatch] = m;
        const cleanName = execMatch
          .replace(/\[|\]/g, '')
          .replace(/^dbo\./i, '')
          .trim();
        if (cleanName && cleanName.toLowerCase() !== 'sp_executesql') calls.push(cleanName);
      }

      const writeMatches = normalized.matchAll(
        /\b(?:INSERT\s+INTO|UPDATE|MERGE\s+INTO)\s+([a-zA-Z0-9_[\].]+)/gi
      );
      for (const m of writeMatches) {
        const [, writeMatch] = m;
        const cleanName = writeMatch
          .replace(/\[|\]/g, '')
          .replace(/^dbo\./i, '')
          .trim();
        if (cleanName) writes.push(cleanName);
      }

      const readMatches = normalized.matchAll(/\b(?:FROM|JOIN)\s+([a-zA-Z0-9_[\].]+)/gi);
      for (const m of readMatches) {
        const [, readMatch] = m;
        const cleanName = readMatch
          .replace(/\[|\]/g, '')
          .replace(/^dbo\./i, '')
          .trim();
        if (cleanName) reads.push(cleanName);
      }

      return { calls, writes, reads };
    };

    // --- Process XML Packages ---
    for (const xmlPkg of xmlMeta || []) {
      const {
        connectionManagers: rawConnectionManagers,
        dataFlowComponents,
        objectName,
        sqlTasks,
        packageTasks,
      } = xmlPkg;
      const connectionManagers = resolveConnectionManagers(rawConnectionManagers || [], {
        parameters: _parameters || [],
        environments: _environments || {},
        parameterOverrides: this.config.ssisProjectParameterOverrides || {},
        packageVariables: xmlPkg.packageVariables || [],
        folderName: xmlPkg.folderName || '',
        projectName: xmlPkg.projectName || '',
        packageName: xmlPkg.packageName || objectName || '',
        hostServer,
      });
      const packageId = resolvePackageId(objectName, xmlPkg.projectName);
      const catalogRow =
        catalogByProjectPackage.get(
          `${cleanSsisSegment(xmlPkg.projectName)}.${cleanSsisSegment(objectName)}`.toLowerCase()
        ) ||
        catalogByPackage.get(cleanSsisSegment(objectName).toLowerCase()) ||
        {};
      const packageContext = {
        folderName: xmlPkg.folderName || catalogRow.folder_name || '',
        projectName: xmlPkg.projectName || catalogRow.project_name || '',
        packageName: xmlPkg.packageName || objectName || catalogRow.package_name || '',
      };
      const valueMap = buildSsisValueMap({
        parameters: _parameters || [],
        environments: _environments || {},
        packageVariables: xmlPkg.packageVariables || [],
        parameterOverrides: this.config.ssisProjectParameterOverrides || {},
        folderName: packageContext.folderName,
        projectName: packageContext.projectName,
        packageName: packageContext.packageName,
        hostServer,
      });

      const connMap = new Map();
      const connArray = [];
      const addConnAlias = (alias, cm) => {
        const normalizedAlias = normalizeSsisReference(alias);
        if (normalizedAlias) connMap.set(normalizedAlias, cm);
      };

      for (const cm of connectionManagers || []) {
        addConnAlias(cm.connName, cm);
        addConnAlias(cm.id, cm);
        addConnAlias(cm.refId, cm);
        addConnAlias(`Project.ConnectionManagers[${cm.connName}]`, cm);
        connArray.push(cm);
      }

      const resolveConnection = (connId) => {
        if (!connId) return null;
        const normalizedConnId = normalizeSsisReference(connId);
        let cm =
          connMap.get(normalizedConnId) ||
          connArray.find(
            (c) =>
              normalizeSsisReference(c.id) === normalizedConnId ||
              normalizeSsisReference(c.refId) === normalizedConnId ||
              normalizeSsisReference(c.connName) === normalizedConnId
          );

        if (!cm) {
          const bracketMatch = String(connId || '').match(/ConnectionManagers\[([^\]]+)\]/i);
          if (bracketMatch) {
            cm = connMap.get(normalizeSsisReference(bracketMatch[1])) || null;
          }
        }

        return (
          cm ||
          connectionOverrideForRef(
            connId,
            this.config.ssisProjectConnectionOverrides || {},
            packageContext
          ) ||
          null
        );
      };
      const resolveComponentSqlCommand = (component = {}) => {
        if (component.sqlCommand) {
          return {
            sql: component.sqlCommand,
            evidenceType: 'ssis_source_sql_command',
          };
        }
        if (!component.sqlCommandVariable) {
          return {
            sql: '',
            evidenceType: '',
          };
        }
        const resolved =
          valueMap.get(normalizeSsisVariableKey(component.sqlCommandVariable)) ||
          valueMap.get(
            normalizeSsisVariableKey(
              String(component.sqlCommandVariable).replace(/^(?:User|Project|Package)::/i, '')
            )
          ) ||
          '';
        return {
          sql: resolved,
          evidenceType: resolved
            ? 'ssis_source_sql_command_variable'
            : 'ssis_source_sql_command_variable_unresolved',
        };
      };

      const sources = dataFlowComponents.filter((c) => c.role === 'SOURCE');
      const destinations = dataFlowComponents.filter((c) => c.role === 'DESTINATION');

      for (const cm of connectionManagers || []) {
        if (!shouldQuarantineDynamicConnection(cm)) continue;
        const variableName = (cm.dynamicVariables || [])[0] || 'UNKNOWN_VARIABLE';
        edges.push({
          from: packageId,
          to: 'UNRESOLVED_DYNAMIC_EDGE',
          via: `ConnectionManager/${cm.connName || cm.connType || 'unknown'}`,
          edgeType: 'UNRESOLVED_DYNAMIC_EDGE',
          validation_status: 'unresolved',
          evidence_type: 'ssis_dynamic_connection',
          evidence_text:
            cm.expressionConnectionString || JSON.stringify(cm.dynamicExpressions || {}),
          confidence: 0.0,
          packageName: objectName,
          variableName,
        });
      }

      for (const src of sources) {
        const srcConnection = resolveConnection(src.connectionManagerId);
        const sourceSql = resolveComponentSqlCommand(src);
        const parsedSourceSql = sourceSql.sql
          ? parseSqlEntities(sourceSql.sql)
          : { calls: [], writes: [], reads: [] };
        const srcExternalId = isExternalSsisComponent(src)
          ? buildSsisExternalObjectId({
              serverName: hostServer,
              folderName: xmlPkg.folderName || catalogRow.folder_name,
              projectName: xmlPkg.projectName || catalogRow.project_name,
              packageName: xmlPkg.packageName || objectName,
              componentName: src.componentName,
              role: 'source',
              reference: srcConnection?.filePath || src.tableName || sourceSql.sql,
            })
          : '';

        const sourceTables = [];
        if (srcExternalId) {
          sourceTables.push(srcExternalId);
        } else if (src.tableName) {
          sourceTables.push(combineConnectionAndTable(srcConnection, src.tableName, hostServer));
        } else if (src.tableDatabaseName && src.tableObjectName) {
          sourceTables.push(
            qualifyTableReference(
              srcConnection?.serverName || hostServer,
              src.tableDatabaseName || srcConnection?.databaseName,
              src.tableSchemaName,
              src.tableObjectName
            )
          );
        } else if (src.tableSchemaName && src.tableObjectName) {
          sourceTables.push(
            qualifyTableReference(
              srcConnection?.serverName || hostServer,
              srcConnection?.databaseName,
              src.tableSchemaName,
              src.tableObjectName
            )
          );
        } else if (sourceSql.sql) {
          sourceTables.push(
            ...parsedSourceSql.reads.map((ref) =>
              combineConnectionAndTable(srcConnection, ref, hostServer)
            )
          );
        }
        if (
          sourceTables.length === 0 &&
          parsedSourceSql.calls.length === 0 &&
          parsedSourceSql.writes.length === 0
        ) {
          edges.push({
            from: packageId,
            to: 'UNRESOLVED_DYNAMIC_EDGE',
            via: `${packageId}/Source/${src.componentName}`,
            edgeType: 'UNRESOLVED_DYNAMIC_EDGE',
            validation_status: 'unresolved',
            evidence_type: sourceSql.evidenceType || 'ssis_source_unresolved',
            evidence_text: sourceSql.sql || src.sqlCommandVariable || src.tableName || '',
            confidence: 0.0,
            packageName: objectName,
          });
        }

        for (const sTable of sourceTables.filter(Boolean)) {
          const externalEdge = srcExternalId && sTable === srcExternalId;
          edges.push({
            from: packageId,
            to: sTable,
            via: `${packageId}/Source/${src.componentName}`,
            edgeType: 'READS_FROM',
            validation_status: 'validated',
            evidence_type: externalEdge ? 'ssis_external_source_component' : 'ssis_dataflow_source',
            evidence_text: sourceSql.sql || src.tableName || '',
            confidence: externalEdge ? 0.85 : 0.9,
            packageName: objectName,
            target_external_source: Boolean(externalEdge),
            componentName: src.componentName,
            componentType: src.componentType,
          });
        }

        if (sourceSql.sql) {
          for (const sp of parsedSourceSql.calls) {
            edges.push({
              from: packageId,
              to: buildSsisReference(srcConnection, 'dbo', sp, hostServer),
              via: `${packageId}/Source/${src.componentName}`,
              edgeType: 'CALLS',
              validation_status: 'validated',
              evidence_type:
                sourceSql.evidenceType === 'ssis_source_sql_command_variable'
                  ? 'ssis_source_sql_command_variable_call'
                  : 'ssis_source_sql_command_call',
              evidence_text: sourceSql.sql,
              confidence: 0.95,
              packageName: objectName,
            });
          }
          for (const target of parsedSourceSql.writes) {
            edges.push({
              from: packageId,
              to: buildSsisReference(srcConnection, 'dbo', target, hostServer),
              via: `${packageId}/Source/${src.componentName}`,
              edgeType: 'WRITES_TO',
              validation_status: 'validated',
              evidence_type:
                sourceSql.evidenceType === 'ssis_source_sql_command_variable'
                  ? 'ssis_source_sql_command_variable_write'
                  : 'ssis_source_sql_command_write',
              evidence_text: sourceSql.sql,
              confidence: 0.9,
              packageName: objectName,
            });
          }
        }
      }

      for (const dst of destinations) {
        const dstConnection = resolveConnection(dst.connectionManagerId);
        const dstExternalId = isExternalSsisComponent(dst)
          ? buildSsisExternalObjectId({
              serverName: hostServer,
              folderName: xmlPkg.folderName || catalogRow.folder_name,
              projectName: xmlPkg.projectName || catalogRow.project_name,
              packageName: xmlPkg.packageName || objectName,
              componentName: dst.componentName,
              role: 'destination',
              reference: dstConnection?.filePath || dst.tableName || dst.sqlCommand,
            })
          : '';
        let dstTable = 'unknown_table';
        if (dstExternalId) {
          dstTable = dstExternalId;
        } else if (dst.tableName) {
          dstTable = combineConnectionAndTable(dstConnection, dst.tableName, hostServer);
        } else if (dst.tableDatabaseName && dst.tableObjectName) {
          dstTable = qualifyTableReference(
            dstConnection?.serverName || hostServer,
            dst.tableDatabaseName || dstConnection?.databaseName,
            dst.tableSchemaName,
            dst.tableObjectName
          );
        } else if (dst.tableSchemaName && dst.tableObjectName) {
          dstTable = qualifyTableReference(
            dstConnection?.serverName || hostServer,
            dstConnection?.databaseName,
            dst.tableSchemaName,
            dst.tableObjectName
          );
        }

        if (!dstTable || dstTable === 'unknown_table') {
          edges.push({
            from: packageId,
            to: 'UNRESOLVED_DYNAMIC_EDGE',
            via: `${packageId}/Destination/${dst.componentName}`,
            edgeType: 'UNRESOLVED_DYNAMIC_EDGE',
            validation_status: 'unresolved',
            evidence_type: 'ssis_destination_unresolved',
            evidence_text: dst.sqlCommand || dst.tableName || '',
            confidence: 0.0,
            packageName: objectName,
          });
          continue;
        }

        edges.push({
          from: packageId,
          to: dstTable,
          via: `${packageId}/Destination/${dst.componentName}`,
          edgeType: 'WRITES_TO',
          validation_status: 'validated',
          evidence_type: dstExternalId
            ? 'ssis_external_destination_component'
            : 'ssis_dataflow_destination',
          evidence_text: dst.sqlCommand || dst.tableName || '',
          confidence: dstExternalId ? 0.85 : 0.95,
          packageName: objectName,
          target_external_source: Boolean(dstExternalId),
          componentName: dst.componentName,
          componentType: dst.componentType,
        });
      }

      for (const task of sqlTasks || []) {
        const taskConnection = resolveConnection(task.connectionManagerId);
        if (!taskConnection || String(task.connectionManagerId || '').includes('@')) {
          edges.push({
            from: packageId,
            to: 'UNRESOLVED_DYNAMIC_EDGE',
            via: `${packageId}/Task/${task.taskName}`,
            edgeType: 'UNRESOLVED_DYNAMIC_EDGE',
            validation_status: 'unresolved',
            evidence_type: 'ssis_execute_sql_dynamic_connection',
            evidence_text: task.sqlStatement || '',
            confidence: 0.0,
            packageName: objectName,
            variableName:
              String(task.connectionManagerId || '').match(
                /@\[\$[A-Za-z0-9_]+::([A-Za-z0-9_]+)\]/
              )?.[1] || 'UNKNOWN_VARIABLE',
          });
          continue;
        }

        const { calls, writes } = parseSqlEntities(task.sqlStatement);

        for (const sp of calls) {
          edges.push({
            from: packageId,
            to: buildSsisReference(taskConnection, 'dbo', sp, hostServer),
            via: `${packageId}/Task/${task.taskName}`,
            edgeType: 'CALLS',
            validation_status: 'validated',
            evidence_type: 'ssis_execute_sql_call',
            evidence_text: task.sqlStatement,
            confidence: 0.95,
            packageName: objectName,
          });
        }

        for (const target of writes) {
          edges.push({
            from: packageId,
            to: buildSsisReference(taskConnection, 'dbo', target, hostServer),
            via: `${packageId}/Task/${task.taskName}`,
            edgeType: 'WRITES_TO',
            validation_status: 'validated',
            evidence_type: 'ssis_execute_sql_write',
            evidence_text: task.sqlStatement,
            confidence: 0.9,
            packageName: objectName,
          });
        }
      }

      for (const task of packageTasks || []) {
        const targetPackageId = resolvePackageId(task.packageName, xmlPkg.projectName);
        edges.push({
          from: packageId,
          to: targetPackageId,
          via: `${packageId}/Task/${task.taskName}`,
          edgeType: 'CALLS',
          validation_status: targetPackageId ? 'validated' : 'unresolved',
          evidence_type: 'ssis_execute_package_task',
          evidence_text: task.packageName,
          confidence: 0.95,
          packageName: objectName,
        });
      }
    }

    return edges;
  }

  async extractAll(opts = {}) {
    const warnings = [];
    const previousConfig = this.config;
    this.config = {
      ...(this.config || {}),
      folderName: opts.folderName ?? this.config?.folderName,
      folder_name: opts.folder_name ?? this.config?.folder_name,
      folder: opts.folder ?? this.config?.folder,
      projectName: opts.projectName ?? this.config?.projectName,
      project_name: opts.project_name ?? this.config?.project_name,
      project: opts.project ?? this.config?.project,
      packageName: opts.packageName ?? this.config?.packageName,
      package_name: opts.package_name ?? this.config?.package_name,
      package: opts.package ?? this.config?.package,
      packages: opts.packages ?? this.config?.packages,
      selectedPackages: opts.selectedPackages ?? this.config?.selectedPackages,
    };
    const result = {
      extractedAt: new Date().toISOString(),
      ssisdbPresent: false,
      catalog: [],
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

    try {
      const ssisPresent = await this.checkSsisdb(warnings);
      result.ssisdbPresent = ssisPresent;

      if (ssisPresent) {
        result.catalog = await this.extractCatalogInventory(warnings, opts);
        result.parameters = await this.extractParameters(warnings);
        result.environments = await this.extractEnvironments(warnings);
        if (opts.extractXml !== false) {
          result.xmlMetadata = await this.extractPackageXmlMetadata(
            warnings,
            result.parameters,
            result.environments
          );
        }
      }

      result.agentJobs = filterAgentJobsToSsisScope(
        await this.extractAgentJobs(warnings),
        getSsisScopeFilters(this.config)
      );

      result.lineageEdges = this.buildLineageEdges(
        result.catalog,
        result.xmlMetadata,
        result.agentJobs,
        result.parameters,
        result.environments
      );

      return result;
    } finally {
      this.config = previousConfig;
    }
  }
}

export async function extractSsisMetadata(connectionConfig, opts = {}) {
  let resolvedConfig = connectionConfig || {};
  let sqlDriver = opts.sqlDriver || mssql;
  const looksLikeConnector =
    resolvedConfig &&
    typeof resolvedConfig === 'object' &&
    (resolvedConfig.type === 'ssis' ||
      resolvedConfig.type === 'sql_server' ||
      resolvedConfig.credential);

  if (looksLikeConnector) {
    const credentialMode = sqlServerCredentialMode(resolvedConfig);
    resolvedConfig = buildSqlServerConnectionConfig(resolvedConfig).config;
    sqlDriver = opts.sqlDriver || (await loadSqlServerDriver(credentialMode));
  }

  const extractor = new SsisMetadataExtractor(resolvedConfig, sqlDriver);
  await extractor.connect();
  try {
    return await extractor.extractAll(opts);
  } finally {
    await extractor.disconnect();
  }
}

export function parseSsisPackageXmlForLineage(xmlText, options = {}) {
  const xmlDoc = parsePackageXml(Buffer.from(String(xmlText || ''), 'utf-8'));
  if (!xmlDoc) return null;
  const packageVariables = extractPackageVariables(xmlDoc);
  const connectionManagers = resolveConnectionManagers(extractConnectionManagers(xmlDoc), {
    parameters: options.parameters || [],
    environments: options.environments || {},
    parameterOverrides: options.parameterOverrides || options.ssisProjectParameterOverrides || {},
    packageVariables,
    folderName: options.folderName || '',
    projectName: options.projectName || '',
    packageName: options.packageName || options.objectName || '',
    hostServer: options.serverName || '',
  });
  const dataFlowComponents = extractDataFlowComponents(xmlDoc);
  const packageId =
    options.packageId ||
    buildCanonicalPackageId(
      options.serverName || '',
      options.folderName || '',
      options.projectName || '',
      options.packageName || options.objectName || ''
    );
  const columnMappingResult = extractSsisColumnMappingsFromComponents(dataFlowComponents, {
    packageId,
  });
  const ssisFileReferences = buildSsisFileReferences(connectionManagers, {
    folderName: options.folderName || '',
    projectName: options.projectName || '',
    packageName: options.packageName || options.objectName || '',
  });

  return {
    objectName: options.objectName || options.packageName || 'unknown_package.dtsx',
    packageName: options.packageName || options.objectName || 'unknown_package.dtsx',
    folderName: options.folderName || 'unknown_folder',
    projectName: options.projectName || 'unknown_project',
    packageVariables,
    connectionManagers,
    ssisFileReferences,
    dataFlowComponents,
    ssisColumnMappings: columnMappingResult.ssisColumnMappings || [],
    unresolvedSsisColumnMappings: [
      ...(columnMappingResult.unresolvedSsisColumnMappings || []),
      ...buildUnresolvedSsisMappings(connectionManagers, packageId),
    ],
    sqlTasks: extractExecuteSqlTasks(xmlDoc),
    packageTasks: extractExecutePackageTasks(xmlDoc),
  };
}

export { SsisMetadataExtractor };
export default extractSsisMetadata;
