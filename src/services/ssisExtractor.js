/**
 * SSIS Metadata Extractor
 * -----------------------------------------------------------------------------
 * Extracts every available piece of metadata from a SQL Server SSIS 2019/2022
 * installation and maps it into the data-governance data-lineage model.
 */

import mssql from 'mssql';
import { XMLParser } from 'fast-xml-parser';

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

function splitSchemaObjectReference(reference) {
  const cleaned = normalizeSsisReference(reference);
  const parts = cleaned.split('.').filter(Boolean);

  if (parts.length === 1) {
    return {
      schemaName: '',
      objectName: cleaned,
    };
  }

  if (parts.length === 2) {
    return {
      schemaName: parts[0],
      objectName: parts[1],
    };
  }

  if (parts.length >= 3) {
    return {
      schemaName: parts[parts.length - 2],
      objectName: parts[parts.length - 1],
    };
  }

  return {
    schemaName: '',
    objectName: cleaned,
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

function splitSsisTableReference(reference) {
  const cleaned = cleanSsisSegment(reference);
  const parts = cleaned.split('.').filter(Boolean);

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
    parsed.serverName || connection?.serverName || parseConnectionStringServer(rawConnectionString) || fallbackServer,
    parsed.databaseName || connection?.databaseName || parseConnectionStringDatabase(rawConnectionString),
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
      const dtsProps = raw['DTS:ConnectionManager'] || raw;
      const connType = dtsProps['@_DTS:CreationName'] || dtsProps['@_CreationName'] || '';
      const connName = dtsProps['@_DTS:ObjectName'] || dtsProps['@_ObjectName'] || '';

      const props = {};
      const propNodes = collectXmlValues(dtsProps, ['DTS:Property', 'property']);
      for (const p of propNodes) {
        const pName = p?.['@_DTS:Name'] || p?.['@_Name'] || '';
        const pVal = (p && typeof p === 'object' && p['#text'] !== undefined) ? String(p['#text']) : (typeof p !== 'object' ? String(p) : '');
        if (pName) props[pName] = String(pVal);
      }

      const inferred = splitSsisObjectReference(
        props.OpenRowset || props.TableName || props.SqlCommand || ''
      );

      // Extract Project Parameter References (e.g. @[$Project::MyDbConn])
      const expressions = collectXmlValues(dtsProps, [
        'DTS:PropertyExpression',
        'propertyExpression',
      ]);
      const dynamicProps = {};
      for (const exp of expressions) {
        const expName = exp?.['@_DTS:Name'] || exp?.['@_Name'] || '';
        const expVal = exp?.['#text'] || exp || '';
        if (expName) dynamicProps[expName] = String(expVal);
      }

      const expressionConnectionString = dynamicProps.ConnectionString || '';
      const rawConnectionString = props.ConnectionString || '';
      const expressionDatabaseName = parseConnectionStringDatabase(expressionConnectionString);
      const rawDatabaseName = parseConnectionStringDatabase(rawConnectionString);
      const expressionServerName = parseConnectionStringServer(expressionConnectionString);
      const rawServerName = parseConnectionStringServer(rawConnectionString);

      managers.push({
        connName,
        connType,
        hasDynamicExpression: Object.keys(dynamicProps).length > 0,
        dynamicVariables: Object.entries(dynamicProps)
          .flatMap(([, expr]) => {
            const matches = String(expr || '').match(/@\[\$[A-Za-z0-9_]+::([A-Za-z0-9_]+)\]/g) || [];
            return matches.map((m) => m.replace(/^@\[\$[A-Za-z0-9_]+::/, '').replace(/\]$/, ''));
          }),
        serverName: props.ServerName || props.DataSource || expressionServerName || rawServerName || '',
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

      const tableRef = normalizeSsisReference(
        props.OpenRowset || props.SqlCommandParam || props.ReferenceMetadataSqlCommand || ''
      );
      const splitTable = splitSsisObjectReference(tableRef);
      const connRef = normalizeSsisReference(props.ConnectionManagerID || '');

      components.push({
        componentType: compType,
        componentName: compName,
        role,
        sqlCommand: props.SqlCommand || props.OpenRowset || '',
        tableName: tableRef,
        tableDatabaseName: splitTable.databaseName || '',
        tableSchemaName: splitTable.schemaName || '',
        tableObjectName: splitTable.objectName || '',
        connectionManagerId: connRef,
        lookupConnectionManagerId: normalizeSsisReference(
          props.ReferenceMetadataConnectionManagerID || ''
        ),
        lookupTable: normalizeSsisReference(
          props.SqlCommandParam || props.ReferenceMetadataSqlCommand || ''
        ),
      });
    } catch (_e) {
      // skip
    }
  }
  return components;
}

function extractExecuteSqlTasks(packageXml) {
  const tasks = [];
  if (!packageXml) return tasks;

  const execNodes = collectXmlValues(packageXml, ['DTS:Executable', 'Executable']);

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

  const execNodes = collectXmlValues(packageXml, ['DTS:Executable', 'Executable']);

  for (const exec of execNodes) {
    try {
      const raw = typeof exec === 'object' ? exec : {};
      const execType = raw['@_DTS:ExecutableType'] || raw['@_ExecutableType'] || '';
      if (!String(execType).includes('ExecutePackageTask')) continue;

      const taskName = raw['@_DTS:ObjectName'] || raw['@_ObjectName'] || 'ExecutePackageTask';
      const objectData = raw['DTS:ObjectData'] || raw.ObjectData || {};
      const taskData = objectData.ExecutePackageTask || {};
      const packageName = normalizePackageTaskName(
        taskData['@_PackageName'] ||
          taskData['@_DTS:PackageName'] ||
          taskData.PackageName ||
          ''
      );

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
    this.config = connectionConfig;
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

  async extractCatalogInventory(warnings) {
    const { rows, error } = await safeQuery(
      this.pool,
      `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
      USE SSISDB;
       SELECT
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
         p.name          AS project_name,
         pkg.name        AS package_name,
         par.object_type,
         par.parameter_name,
         par.design_default_value,
         par.default_value,
         par.value_type,
         par.referenced_variable_name
       FROM catalog.object_parameters par
       JOIN catalog.packages pkg ON par.project_id = pkg.project_id AND (par.object_name = pkg.name OR par.object_type = 20)
       JOIN catalog.projects  p   ON pkg.project_id = p.project_id`
    );
    if (error) warnings.push(`parameters: ${error}`);
    return rows;
  }

  async extractEnvironments(warnings) {
    const { rows: varRows, error: varErr } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         e.name               AS environment_name,
         v.name               AS variable_name,
         CASE WHEN v.sensitive = 1 THEN '***SENSITIVE***' ELSE CAST(v.value AS nvarchar(max)) END AS variable_value
       FROM catalog.environment_variables v
       JOIN catalog.environments  e ON v.environment_id = e.environment_id`
    );
    if (varErr) warnings.push(`environment_variables: ${varErr}`);
    return { variables: varRows };
  }

  async extractPackageXmlMetadata(warnings) {
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

    // 2. Get Projects
    const { rows: projects, error: projErr } = await safeQuery(
      this.pool,
      `SELECT f.name AS folder_name, p.name AS project_name
       FROM SSISDB.catalog.projects p
       JOIN SSISDB.catalog.folders f ON p.folder_id = f.folder_id`
    );

    if (projErr) return xmlResults;

    // eslint-disable-next-line no-await-in-loop
    for (const proj of projects) {
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
                projectName: proj.project_name,
                connectionManagers: [...pkgConnections, ...projectConnections],
                dataFlowComponents,
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
      const { connectionManagers, dataFlowComponents, objectName, sqlTasks, packageTasks } = xmlPkg;
      const packageId = resolvePackageId(objectName, xmlPkg.projectName);

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

        return cm || null;
      };

      const sources = dataFlowComponents.filter((c) => c.role === 'SOURCE');
      const destinations = dataFlowComponents.filter((c) => c.role === 'DESTINATION');

      for (const cm of connectionManagers || []) {
        if (!cm.hasDynamicExpression) continue;
        const variableName = (cm.dynamicVariables || [])[0] || 'UNKNOWN_VARIABLE';
        edges.push({
          from: packageId,
          to: 'UNRESOLVED_DYNAMIC_EDGE',
          via: `ConnectionManager/${cm.connName || cm.connType || 'unknown'}`,
          edgeType: 'UNRESOLVED_DYNAMIC_EDGE',
          validation_status: 'unresolved',
          evidence_type: 'ssis_dynamic_connection',
          evidence_text: cm.expressionConnectionString || JSON.stringify(cm.dynamicExpressions || {}),
          confidence: 0.0,
          packageName: objectName,
          variableName,
        });
      }

      for (const src of sources) {
        const srcConnection = resolveConnection(src.connectionManagerId);

        const sourceTables = [];
        if (src.tableName) {
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
        } else if (src.sqlCommand) {
          const { reads } = parseSqlEntities(src.sqlCommand);
          sourceTables.push(...reads.map((ref) => combineConnectionAndTable(srcConnection, ref, hostServer)));
        }
        if (sourceTables.length === 0) {
          edges.push({
            from: packageId,
            to: 'UNRESOLVED_DYNAMIC_EDGE',
            via: `${packageId}/Source/${src.componentName}`,
            edgeType: 'UNRESOLVED_DYNAMIC_EDGE',
            validation_status: 'unresolved',
            evidence_type: 'ssis_source_unresolved',
            evidence_text: src.sqlCommand || src.tableName || '',
            confidence: 0.0,
            packageName: objectName,
          });
        }

        for (const sTable of sourceTables.filter(Boolean)) {
          edges.push({
            from: packageId,
            to: sTable,
            via: `${packageId}/Source/${src.componentName}`,
            edgeType: 'READS_FROM',
            validation_status: 'validated',
            evidence_type: 'ssis_dataflow_source',
            evidence_text: src.sqlCommand || src.tableName || '',
            confidence: 0.9,
            packageName: objectName,
          });
        }

        for (const dst of destinations) {
          const dstConnection = resolveConnection(dst.connectionManagerId);
          let dstTable = 'unknown_table';
          if (dst.tableName) {
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
            evidence_type: 'ssis_dataflow_destination',
            evidence_text: dst.sqlCommand || dst.tableName || '',
            confidence: 0.95,
            packageName: objectName,
          });
        }

        if (src.sqlCommand) {
          const { calls, writes } = parseSqlEntities(src.sqlCommand);
          for (const sp of calls) {
            edges.push({
              from: packageId,
              to: buildSsisReference(srcConnection, 'dbo', sp, hostServer),
              via: `${packageId}/Source/${src.componentName}`,
              edgeType: 'CALLS',
              validation_status: 'validated',
              evidence_type: 'ssis_source_sql_command_call',
              evidence_text: src.sqlCommand,
              confidence: 0.95,
              packageName: objectName,
            });
          }
          for (const target of writes) {
            edges.push({
              from: packageId,
              to: buildSsisReference(srcConnection, 'dbo', target, hostServer),
              via: `${packageId}/Source/${src.componentName}`,
              edgeType: 'WRITES_TO',
              validation_status: 'validated',
              evidence_type: 'ssis_source_sql_command_write',
              evidence_text: src.sqlCommand,
              confidence: 0.9,
              packageName: objectName,
            });
          }
        }
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
            variableName: String(task.connectionManagerId || '').match(/@\[\$[A-Za-z0-9_]+::([A-Za-z0-9_]+)\]/)?.[1] || 'UNKNOWN_VARIABLE',
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

    const ssisPresent = await this.checkSsisdb(warnings);
    result.ssisdbPresent = ssisPresent;

    if (ssisPresent) {
      result.catalog = await this.extractCatalogInventory(warnings);
      result.parameters = await this.extractParameters(warnings);
      result.environments = await this.extractEnvironments(warnings);
      if (opts.extractXml !== false) {
        result.xmlMetadata = await this.extractPackageXmlMetadata(warnings);
      }
    }

    result.agentJobs = await this.extractAgentJobs(warnings);

    result.lineageEdges = this.buildLineageEdges(
      result.catalog,
      result.xmlMetadata,
      result.agentJobs,
      result.parameters,
      result.environments
    );

    return result;
  }
}

export async function extractSsisMetadata(connectionConfig, opts = {}) {
  const extractor = new SsisMetadataExtractor(connectionConfig);
  await extractor.connect();
  try {
    return await extractor.extractAll(opts);
  } finally {
    await extractor.disconnect();
  }
}

export { SsisMetadataExtractor };
export default extractSsisMetadata;
