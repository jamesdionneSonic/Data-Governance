/**
 * SSIS Metadata Extractor
 * ─────────────────────────────────────────────────────────────────────────────
 * Extracts every available piece of metadata from a SQL Server SSIS 2019/2022
 * installation and maps it into the data-governance data-lineage model.
 *
 * SOURCES COVERED
 * ───────────────
 * 1.  SSISDB catalog – folders, projects, packages, parameters, executables
 * 2.  SSISDB execution history – executions, component phases, data statistics,
 *     parameter values used, event messages / errors
 * 3.  SSISDB environments – variables, project-to-environment references
 * 4.  SSISDB package XML – connection managers, data-flow sources &
 *     destinations, lookup targets → column-level lineage where parseable
 * 5.  SSISDB scale-out – worker agents, agent tasks
 * 6.  SQL Server Agent – jobs, steps (SSIS subsystem + dtexec command lines),
 *     schedules, recent history; correlated back to SSISDB executions via
 *     reference_id / correlation_id
 * 7.  SSIS legacy logging – msdb.dbo.sysssislog (if table exists)
 * 8.  MSDB SSIS packages – packages deployed in msdb (pre-catalog model)
 *
 * DESIGN PRINCIPLES
 * ─────────────────
 * • Every individual query is wrapped in a resilient try/catch block; if a
 *   section fails (missing permission, feature not installed, incompatible
 *   version) it is skipped and a warning is appended to `result.warnings`.
 * • The final result object is always returned – never thrown – so callers
 *   can persist whatever was collected even on partial failure.
 * • The extractor intentionally avoids raising errors for missing SSISDB;
 *   it records the absence and returns gracefully.
 *
 * LINEAGE MODEL OUTPUT
 * ────────────────────
 * Each package produces lineage edges of the form:
 *   { from: "server.database.schema.table", to: "server.database.schema.table",
 *     via: "SSIS/<folder>/<project>/<package>",
 *     edgeType: "ETL", confidence: 0.9,
 *     jobName, scheduleCron, lastExecuted, avgDurationSeconds }
 */

import mssql from 'mssql';
import { XMLParser } from 'fast-xml-parser';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SSIS data-flow component type classification
 * Used when parsing package XML to identify lineage sources & destinations.
 */
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
  // Transformations that carry lineage through
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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Safe query helper – returns { rows, error } instead of throwing.
 * @param {mssql.ConnectionPool} pool
 * @param {string} sql
 * @param {Record<string,*>} [params] - named param map { name: value }
 */
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

/**
 * Test whether SSISDB database exists and is accessible.
 */
async function ssisdbExists(pool) {
  const { rows } = await safeQuery(
    pool,
    "SELECT name FROM sys.databases WHERE name = 'SSISDB' AND state_desc = 'ONLINE'",
  );
  return rows.length > 0;
}

/**
 * Test whether a table/view exists in a given database.
 */
async function objectExists(pool, db, schema, name) {
  const { rows } = await safeQuery(
    pool,
    `SELECT 1 FROM [${db}].sys.objects
     WHERE SCHEMA_NAME(schema_id) = @schema AND name = @name`,
    { schema, name },
  );
  return rows.length > 0;
}

/**
 * Parse SSIS package XML (binary from object_versions) into a JS object.
 * The package XML is stored as varbinary; we receive it as a Buffer.
 */
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

/**
 * Recursively walk a parsed XML tree collecting values at a given key path.
 */
function collectXmlValues(node, keys, results = []) {
  if (!node || typeof node !== 'object') return results;
  for (const key of Object.keys(node)) {
    if (keys.includes(key)) {
      const val = node[key];
      if (Array.isArray(val)) val.forEach((v) => results.push(v));
      else results.push(val);
    }
    collectXmlValues(node[key], keys, results);
  }
  return results;
}

/**
 * Extract connection-manager "connection string" style properties from XML.
 * Returns array of { connName, connType, serverName, databaseName, filePath }
 */
function extractConnectionManagers(packageXml) {
  const managers = [];
  if (!packageXml) return managers;

  // Look for ConnectionManager elements anywhere in the tree
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

      // Pull property bag
      const props = {};
      const propNodes = collectXmlValues(dtsProps, ['DTS:Property', 'property']);
      for (const p of propNodes) {
        const pName = p?.['@_DTS:Name'] || p?.['@_Name'] || '';
        const pVal = p?.['#text'] || p || '';
        if (pName) props[pName] = String(pVal);
      }

      managers.push({
        connName,
        connType,
        serverName: props.ServerName || props.DataSource || '',
        databaseName: props.DatabaseName || props.InitialCatalog || '',
        filePath: props.ConnectionString || props.FileName || '',
        rawConnectionString: props.ConnectionString || '',
      });
    } catch (_e) {
      // skip malformed node
    }
  }

  return managers;
}

/**
 * Extract data-flow components (sources, destinations, lookups) from XML.
 */
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

      // Pull custom properties (SqlCommand, OpenRowset, etc.)
      const props = {};
      const propNodes = collectXmlValues(c, ['property', 'DTS:property']);
      for (const p of propNodes) {
        const pName = p?.['@_name'] || p?.['@_DTS:Name'] || '';
        const pVal = p?.['#text'] !== undefined ? String(p['#text']) : '';
        if (pName) props[pName] = pVal;
      }

      // Column metadata
      const columns = [];
      const colNodes = collectXmlValues(c?.inputs || c, ['column', 'DTS:column']);
      for (const col of colNodes) {
        const colName = col?.['@_name'] || col?.['@_DTS:Name'] || '';
        const colType = col?.['@_dataType'] || col?.['@_DTS:dataType'] || '';
        if (colName) columns.push({ name: colName, dataType: colType });
      }

      components.push({
        componentType: compType,
        componentName: compName,
        role,
        sqlCommand: props.SqlCommand || props.OpenRowset || '',
        tableName: props.OpenRowset || '',
        accessMode: props.AccessMode || '',
        connectionManagerId: props.ConnectionManagerID || '',
        lookupConnectionManagerId: props.ReferenceMetadataConnectionManagerID || '',
        lookupTable: props.SqlCommandParam || props.ReferenceMetadataSqlCommand || '',
        columns,
      });
    } catch (_e) {
      // skip
    }
  }

  return components;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Extractor Class
// ─────────────────────────────────────────────────────────────────────────────

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

  /** Check whether SSISDB is present and accessible. */
  async checkSsisdb(warnings) {
    const present = await ssisdbExists(this.pool);
    if (!present) warnings.push('SSISDB: catalog extraction skipped');
    return present;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 1. SSISDB Catalog Core Inventory
  // ───────────────────────────────────────────────────────────────────────────

  async extractCatalogInventory(warnings) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         f.folder_id,
         f.name                     AS folder_name,
         f.description              AS folder_description,
         f.created_by_name          AS folder_created_by,
         f.created_time             AS folder_created_time,
         p.project_id,
         p.name                     AS project_name,
         p.description              AS project_description,
         p.project_format_version,
         p.deployed_by_name,
         p.deployed_at,
         p.last_deployed_time,
         p.object_version_lsn       AS project_version_lsn,
         p.validation_status,
         p.last_validation_time     AS project_last_validation,
         pkg.package_id,
         pkg.name                   AS package_name,
         pkg.description            AS package_description,
         pkg.package_format_version,
         pkg.version_major,
         pkg.version_minor,
         pkg.version_build,
         pkg.version_comments,
         pkg.version_guid,
         pkg.entry_point,
         pkg.package_guid,
         pkg.last_validation_time   AS package_last_validation
       FROM catalog.folders f
       JOIN catalog.projects p  ON f.folder_id = p.folder_id
       JOIN catalog.packages pkg ON p.project_id = pkg.project_id
       ORDER BY f.name, p.name, pkg.name`,
    );
    if (error) {
      warnings.push(`catalog_inventory: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Package / Project Parameters
  // ───────────────────────────────────────────────────────────────────────────

  async extractParameters(warnings) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         f.name          AS folder_name,
         p.name          AS project_name,
         pkg.name        AS package_name,
         par.parameter_id,
         par.object_type,            -- 20=project, 30=package
         par.object_name,
         par.parameter_name,
         par.parameter_data_type,
         par.required,
         par.sensitive,
         par.description,
         par.design_default_value,   -- default from designer
         par.default_value,          -- overridden default
         par.value_type,             -- V=literal, R=reference
         par.value_set,
         par.referenced_variable_name
       FROM catalog.object_parameters par
       JOIN catalog.packages pkg ON par.project_id = pkg.project_id
                                 AND (par.object_name = pkg.name OR par.object_type = 20)
       JOIN catalog.projects  p   ON pkg.project_id = p.project_id
       JOIN catalog.folders   f   ON p.folder_id    = f.folder_id
       ORDER BY f.name, p.name, pkg.name, par.object_type, par.parameter_name`,
    );
    if (error) {
      warnings.push(`parameters: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Control-Flow Executables (tasks & containers)
  // ───────────────────────────────────────────────────────────────────────────

  async extractExecutables(warnings) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         e.executable_id,
         e.package_id,
         pkg.name           AS package_name,
         p.name             AS project_name,
         f.name             AS folder_name,
         e.executable_name,
         e.executable_type,
         e.package_path,
         e.execution_path
       FROM catalog.executables e
       JOIN catalog.packages pkg ON e.package_id = pkg.package_id
       JOIN catalog.projects  p   ON pkg.project_id = p.project_id
       JOIN catalog.folders   f   ON p.folder_id    = f.folder_id
       ORDER BY f.name, p.name, pkg.name, e.execution_path`,
    );
    if (error) {
      warnings.push(`executables: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Environments & Variables
  // ───────────────────────────────────────────────────────────────────────────

  async extractEnvironments(warnings) {
    const { rows: envRows, error: envErr } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         f.name               AS folder_name,
         e.environment_id,
         e.environment_name,
         e.description        AS env_description,
         e.created_by_name,
         e.created_time
       FROM catalog.environments e
       JOIN catalog.folders f ON e.folder_id = f.folder_id
       ORDER BY f.name, e.environment_name`,
    );
    if (envErr) warnings.push(`environments: ${envErr}`);

    const { rows: varRows, error: varErr } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         f.name               AS folder_name,
         e.environment_name,
         v.variable_id,
         v.name               AS variable_name,
         v.description        AS variable_description,
         v.type               AS variable_type,
         v.sensitive,
         -- Do NOT expose sensitive values; mask them
         CASE WHEN v.sensitive = 1 THEN '***SENSITIVE***'
              ELSE CAST(v.value AS nvarchar(max))
         END                  AS variable_value
       FROM catalog.environment_variables v
       JOIN catalog.environments  e ON v.environment_id = e.environment_id
       JOIN catalog.folders       f ON e.folder_id      = f.folder_id
       ORDER BY f.name, e.environment_name, v.name`,
    );
    if (varErr) warnings.push(`environment_variables: ${varErr}`);

    const { rows: refRows, error: refErr } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         f.name               AS folder_name,
         p.name               AS project_name,
         er.reference_id,
         er.reference_type,   -- A=absolute  R=relative
         er.environment_folder_name,
         er.environment_name
       FROM catalog.environment_references er
       JOIN catalog.projects p ON er.project_id = p.project_id
       JOIN catalog.folders  f ON p.folder_id   = f.folder_id
       ORDER BY f.name, p.name`,
    );
    if (refErr) warnings.push(`environment_references: ${refErr}`);

    return {
      environments: envRows,
      variables: varRows,
      projectReferences: refRows,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Execution History (last N days / N executions)
  // ───────────────────────────────────────────────────────────────────────────

  async extractExecutionHistory(warnings, { days = 30, maxRows = 5000 } = {}) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT TOP (@maxRows)
         e.execution_id,
         e.folder_name,
         e.project_name,
         e.package_name,
         e.project_lsn,
         e.reference_id,              -- environment reference used
         e.reference_location,
         e.status,
         -- 1=created,2=running,3=canceled,4=failed,5=pending,6=unexpected,7=succeeded,9=stopping
         CASE e.status
           WHEN 1 THEN 'Created'   WHEN 2 THEN 'Running'  WHEN 3 THEN 'Canceled'
           WHEN 4 THEN 'Failed'    WHEN 5 THEN 'Pending'  WHEN 6 THEN 'UnexpectedTermination'
           WHEN 7 THEN 'Succeeded' WHEN 9 THEN 'Stopping'
           ELSE 'Unknown'
         END                          AS status_label,
         e.start_time,
         e.end_time,
         DATEDIFF(SECOND, e.start_time, e.end_time) AS duration_seconds,
         e.executed_as_name,
         e.environment_name,
         e.use32bitruntime,
         e.caller_name,
         e.caller_app_id,
         e.caller_initial_job_step_uid  -- links to SQL Agent job step
       FROM catalog.executions e
       WHERE e.start_time >= DATEADD(DAY, -@days, GETUTCDATE())
       ORDER BY e.start_time DESC`,
      { maxRows, days },
    );
    if (error) {
      warnings.push(`execution_history: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Execution Component Phases (per-task timing)
  // ───────────────────────────────────────────────────────────────────────────

  async extractComponentPhases(warnings, { days = 7, maxRows = 10000 } = {}) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT TOP (@maxRows)
         ecp.execution_id,
         ecp.package_name,
         ecp.task_name,
         ecp.subcomponent_name,
         ecp.phase,
         -- 10=Validate, 20=Pre-Execute, 30=Execute, 40=Post-Execute, 50=Cleanup, 60=Validate-End
         ecp.start_time,
         ecp.end_time,
         DATEDIFF(MILLISECOND, ecp.start_time, ecp.end_time) AS duration_ms,
         ecp.execution_path
       FROM catalog.execution_component_phases ecp
       JOIN catalog.executions e ON ecp.execution_id = e.execution_id
       WHERE e.start_time >= DATEADD(DAY, -@days, GETUTCDATE())
       ORDER BY ecp.execution_id DESC, ecp.start_time`,
      { days, maxRows },
    );
    if (error) {
      warnings.push(`component_phases: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Execution Data Statistics (row counts through each component)
  // ───────────────────────────────────────────────────────────────────────────

  async extractDataStatistics(warnings, { days = 7, maxRows = 10000 } = {}) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT TOP (@maxRows)
         eds.execution_id,
         eds.package_name,
         eds.task_name,
         eds.dataflow_path_id_string  AS dataflow_path,
         eds.source_component_name,
         eds.destination_component_name,
         eds.rows_sent,
         eds.start_time,
         eds.end_time,
         DATEDIFF(MILLISECOND, eds.start_time, eds.end_time) AS duration_ms
       FROM catalog.execution_data_statistics eds
       JOIN catalog.executions e ON eds.execution_id = e.execution_id
       WHERE e.start_time >= DATEADD(DAY, -@days, GETUTCDATE())
       ORDER BY eds.execution_id DESC, eds.rows_sent DESC`,
      { days, maxRows },
    );
    if (error) {
      warnings.push(`data_statistics: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Execution Parameter Values (runtime overrides)
  // ───────────────────────────────────────────────────────────────────────────

  async extractExecutionParameterValues(warnings, { days = 7, maxRows = 5000 } = {}) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT TOP (@maxRows)
         epv.execution_id,
         epv.object_type,
         epv.parameter_name,
         epv.parameter_data_type,
         epv.sensitive,
         CASE WHEN epv.sensitive = 1 THEN '***SENSITIVE***'
              ELSE CAST(epv.parameter_value AS nvarchar(max))
         END                     AS parameter_value,
         epv.value_set,
         epv.runtime_override_intent
       FROM catalog.execution_parameter_values epv
       JOIN catalog.executions e ON epv.execution_id = e.execution_id
       WHERE e.start_time >= DATEADD(DAY, -@days, GETUTCDATE())
       ORDER BY epv.execution_id DESC`,
      { days, maxRows },
    );
    if (error) {
      warnings.push(`execution_parameter_values: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Event Messages (errors, warnings, info)
  // ───────────────────────────────────────────────────────────────────────────

  async extractEventMessages(warnings, { days = 7, maxRows = 5000 } = {}) {
    // catalog.event_messages may not exist on older SSIS versions
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT TOP (@maxRows)
         em.operation_id       AS execution_id,
         em.event_name,
         em.message_time,
         em.message,
         em.extended_info_id,
         em.package_name,
         em.event_message_id,
         em.message_source_name,
         em.message_source_type,
         em.execution_path,
         em.message_type        -- 110=error,120=warning,130=info,...
       FROM catalog.event_messages em
       JOIN catalog.executions e ON em.operation_id = e.execution_id
       WHERE e.start_time >= DATEADD(DAY, -@days, GETUTCDATE())
         AND em.message_type IN (110, 120)  -- errors + warnings only
       ORDER BY em.operation_id DESC, em.message_time DESC`,
      { days, maxRows },
    );
    if (error) {
      warnings.push(`event_messages: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Validation History
  // ───────────────────────────────────────────────────────────────────────────

  async extractValidations(warnings) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         v.validation_id,
         v.folder_name,
         v.project_name,
         v.package_name,
         v.validation_type,
         v.status,
         CASE v.status
           WHEN 1 THEN 'New' WHEN 2 THEN 'Running' WHEN 3 THEN 'Canceled'
           WHEN 4 THEN 'Failed' WHEN 7 THEN 'Succeeded' WHEN 8 THEN 'Stopping'
           ELSE 'Unknown'
         END                         AS status_label,
         v.start_time,
         v.end_time,
         DATEDIFF(SECOND, v.start_time, v.end_time) AS duration_seconds,
         v.project_lsn,
         v.use32bitruntime
       FROM catalog.validations v
       ORDER BY v.start_time DESC`,
    );
    if (error) {
      warnings.push(`validations: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 11. Package XML → Connection Managers + Data-Flow Components
  // ───────────────────────────────────────────────────────────────────────────

  async extractPackageXmlMetadata(warnings) {
    const xmlResults = [];

    // object_versions stores project .ispac binary; individual package XML
    // is accessible via catalog.get_project() or from deployed package blobs.
    // We query object_versions for all project-level objects first.
    const { rows: versionRows, error: verErr } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         ov.object_version_lsn,
         ov.object_id,
         ov.object_name,
         ov.object_type,   -- 20=project, 30=package
         ov.created_time,
         ov.created_by,
         ov.description,
         ov.object_data    -- varbinary – the raw .ispac / .dtsx bytes
       FROM catalog.object_versions ov
       WHERE ov.object_type IN (20, 30)
       ORDER BY ov.created_time DESC`,
    );
    if (verErr) {
      warnings.push(`object_versions: ${verErr}`);
    }

    if (!versionRows || versionRows.length === 0) {
      warnings.push('object_versions: no rows returned (permission or feature gap)');
      return xmlResults;
    }

    for (const ver of versionRows) {
      const packageKey = `${ver.object_name}@lsn${ver.object_version_lsn}`;
      try {
        if (!ver.object_data) continue;
        const xmlDoc = parsePackageXml(ver.object_data);
        if (!xmlDoc) {
          warnings.push(`xml_parse: could not parse XML for ${packageKey}`);
          continue;
        }

        const connectionManagers = extractConnectionManagers(xmlDoc);
        const dataFlowComponents = extractDataFlowComponents(xmlDoc);

        xmlResults.push({
          objectName: ver.object_name,
          objectType: ver.object_type === 20 ? 'PROJECT' : 'PACKAGE',
          versionLsn: ver.object_version_lsn,
          createdTime: ver.created_time,
          createdBy: ver.created_by,
          connectionManagers,
          dataFlowComponents,
          sourceCount: dataFlowComponents.filter((c) => c.role === 'SOURCE').length,
          destinationCount: dataFlowComponents.filter((c) => c.role === 'DESTINATION').length,
          lookupCount: dataFlowComponents.filter((c) => c.role === 'LOOKUP').length,
          transformCount: dataFlowComponents.filter((c) => c.role === 'TRANSFORM').length,
        });
      } catch (xmlErr) {
        warnings.push(`xml_extract(${packageKey}): ${xmlErr.message}`);
      }
    }

    return xmlResults;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 12. Scale-Out Worker Agents
  // ───────────────────────────────────────────────────────────────────────────

  async extractScaleOutAgents(warnings) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         wa.agent_id,
         wa.agent_name,
         wa.description,
         wa.machine_name,
         wa.machine_ip,
         wa.allow_http,
         wa.enable_http,
         wa.agent_status,     -- 1=online, 2=offline, 3=unknown
         CASE wa.agent_status
           WHEN 1 THEN 'Online' WHEN 2 THEN 'Offline' ELSE 'Unknown'
         END                  AS agent_status_label,
         wa.last_online_time,
         wa.machine_cores,
         wa.machine_ram_mb
       FROM catalog.worker_agents wa
       ORDER BY wa.machine_name`,
    );
    if (error) {
      warnings.push(`scale_out_agents: ${error}`);
      return [];
    }

    const { rows: taskRows, error: taskErr } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT TOP 2000
         wt.task_id,
         wt.agent_id,
         wt.execution_id,
         wt.package_name,
         wt.task_status,
         CASE wt.task_status
           WHEN 1 THEN 'Pending'  WHEN 2 THEN 'Running'
           WHEN 3 THEN 'Finished' WHEN 4 THEN 'Failed'
           ELSE 'Unknown'
         END                      AS task_status_label,
         wt.start_time,
         wt.end_time,
         DATEDIFF(SECOND, wt.start_time, wt.end_time) AS duration_seconds
       FROM catalog.worker_agent_tasks wt
       ORDER BY wt.start_time DESC`,
    );
    if (taskErr) warnings.push(`scale_out_agent_tasks: ${taskErr}`);

    return { agents: rows, tasks: taskRows };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 13. SQL Agent Jobs – SSIS-related steps
  // ───────────────────────────────────────────────────────────────────────────

  async extractAgentJobs(warnings) {
    // Jobs
    const { rows: jobRows, error: jobErr } = await safeQuery(
      this.pool,
      `SELECT
         j.job_id,
         j.name              AS job_name,
         j.description       AS job_description,
         j.enabled,
         j.category_id,
         cat.name            AS category_name,
         j.owner_sid,
         SUSER_SNAME(j.owner_sid) AS owner_name,
         j.date_created,
         j.date_modified,
         j.version_number,
         j.notify_level_eventlog,
         j.notify_level_email,
         j.notify_email_operator_id,
         j.delete_level
       FROM msdb.dbo.sysjobs j
       LEFT JOIN msdb.dbo.syscategories cat ON j.category_id = cat.category_id
       ORDER BY j.name`,
    );
    if (jobErr) {
      warnings.push(`agent_jobs: ${jobErr}`);
      return {
        jobs: [],
        steps: [],
        schedules: [],
        history: [],
      };
    }

    // Steps – filter to SSIS + command-line steps that reference packages
    const { rows: stepRows, error: stepErr } = await safeQuery(
      this.pool,
      `SELECT
         js.job_id,
         js.step_id,
         js.step_name,
         js.subsystem,
         js.command,
         js.database_name,
         js.server,
         js.on_success_action,
         js.on_fail_action,
         js.retry_attempts,
         js.retry_interval,
         js.output_file_name,
         js.step_uid
       FROM msdb.dbo.sysjobsteps js
       WHERE js.subsystem IN ('SSIS')
          OR (js.subsystem IN ('CmdExec','PowerShell') AND js.command LIKE '%dtexec%')
       ORDER BY js.job_id, js.step_id`,
    );
    if (stepErr) warnings.push(`agent_job_steps: ${stepErr}`);

    // ALL steps (for cross-reference to identify step_uid ↔ SSISDB execution)
    const { rows: allStepRows, error: allStepErr } = await safeQuery(
      this.pool,
      `SELECT job_id, step_id, step_name, subsystem, step_uid
       FROM msdb.dbo.sysjobsteps
       ORDER BY job_id, step_id`,
    );
    if (allStepErr) warnings.push(`agent_all_steps: ${allStepErr}`);

    // Schedules
    const { rows: schedRows, error: schedErr } = await safeQuery(
      this.pool,
      `SELECT
         jsch.job_id,
         jsch.schedule_id,
         sch.name             AS schedule_name,
         sch.enabled          AS schedule_enabled,
         sch.freq_type,
         CASE sch.freq_type
           WHEN 1  THEN 'Once'            WHEN 4  THEN 'Daily'
           WHEN 8  THEN 'Weekly'          WHEN 16 THEN 'Monthly'
           WHEN 32 THEN 'MonthlyRelative' WHEN 64 THEN 'AgentStart'
           WHEN 128 THEN 'IdleComputer'   ELSE 'Unknown'
         END                   AS freq_type_label,
         sch.freq_interval,
         sch.freq_subday_type,
         sch.freq_subday_interval,
         sch.freq_recurrence_factor,
         sch.active_start_date,
         sch.active_end_date,
         sch.active_start_time,
         sch.active_end_time,
         sch.date_created      AS schedule_created
       FROM msdb.dbo.sysjobschedules jsch
       JOIN msdb.dbo.sysschedules sch ON jsch.schedule_id = sch.schedule_id
       ORDER BY jsch.job_id, sch.name`,
    );
    if (schedErr) warnings.push(`agent_schedules: ${schedErr}`);

    // Recent execution history (last 30 days)
    const { rows: histRows, error: histErr } = await safeQuery(
      this.pool,
      `SELECT
         jh.job_id,
         jh.step_id,
         jh.step_name,
         jh.run_status,
         CASE jh.run_status
           WHEN 0 THEN 'Failed'    WHEN 1 THEN 'Succeeded'
           WHEN 2 THEN 'Retry'     WHEN 3 THEN 'Canceled'
           WHEN 4 THEN 'InProgress'
         END                       AS run_status_label,
         jh.run_date,
         jh.run_time,
         jh.run_duration,          -- HHMMSS packed integer
         jh.message,
         jh.operator_id_emailed,
         jh.retries_attempted
       FROM msdb.dbo.sysjobhistory jh
       WHERE jh.job_id IN (
               SELECT DISTINCT job_id FROM msdb.dbo.sysjobsteps
               WHERE subsystem = 'SSIS'
                  OR (subsystem IN ('CmdExec','PowerShell') AND command LIKE '%dtexec%')
             )
         AND jh.run_date >= CONVERT(int, CONVERT(varchar(8), DATEADD(DAY,-30,GETDATE()), 112))
       ORDER BY jh.run_date DESC, jh.run_time DESC`,
    );
    if (histErr) warnings.push(`agent_history: ${histErr}`);

    return {
      jobs: jobRows,
      ssisSteps: stepRows,
      allSteps: allStepRows,
      schedules: schedRows,
      recentHistory: histRows,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 14. Legacy SSIS Logging (msdb.dbo.sysssislog)
  // ───────────────────────────────────────────────────────────────────────────

  async extractLegacyLog(warnings, { days = 7, maxRows = 2000 } = {}) {
    const exists = await objectExists(this.pool, 'msdb', 'dbo', 'sysssislog');
    if (!exists) {
      warnings.push('legacy_ssis_log: msdb.dbo.sysssislog does not exist (not configured)');
      return [];
    }

    const { rows, error } = await safeQuery(
      this.pool,
      `SELECT TOP (@maxRows)
         id,
         event,
         computer,
         operator,
         source,
         sourceid,
         executionid,
         starttime,
         endtime,
         datacode,
         databytes,
         message
       FROM msdb.dbo.sysssislog
       WHERE starttime >= DATEADD(DAY, -@days, GETDATE())
       ORDER BY starttime DESC`,
      { days, maxRows },
    );
    if (error) {
      warnings.push(`legacy_ssis_log: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 15. MSDB-deployed packages (pre-catalog / legacy deployment model)
  // ───────────────────────────────────────────────────────────────────────────

  async extractMsdbPackages(warnings) {
    const exists = await objectExists(this.pool, 'msdb', 'dbo', 'sysssispackages');
    if (!exists) {
      warnings.push('msdb_packages: msdb.dbo.sysssispackages does not exist');
      return [];
    }

    const { rows, error } = await safeQuery(
      this.pool,
      `SELECT
         id,
         name,
         description,
         createdate,
         folderid,
         ownersid,
         packagetype,
         vermajor,
         verminor,
         verbuild,
         vercomments,
         packageformat,
         packagetype,
         isencrypted
       FROM msdb.dbo.sysssispackages
       ORDER BY folderid, name`,
    );
    if (error) {
      warnings.push(`msdb_packages: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 16. Package Performance Stats (aggregated from execution history)
  // ───────────────────────────────────────────────────────────────────────────

  async extractPackagePerformanceStats(warnings) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         folder_name,
         project_name,
         package_name,
         COUNT(*)                                        AS total_executions,
         SUM(CASE WHEN status = 7 THEN 1 ELSE 0 END)    AS succeeded,
         SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END)    AS failed,
         SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END)    AS canceled,
         AVG(DATEDIFF(SECOND, start_time, end_time))    AS avg_duration_seconds,
         MAX(DATEDIFF(SECOND, start_time, end_time))    AS max_duration_seconds,
         MIN(DATEDIFF(SECOND, start_time, end_time))    AS min_duration_seconds,
         MIN(start_time)                                AS first_execution,
         MAX(start_time)                                AS last_execution,
         CAST(SUM(CASE WHEN status = 7 THEN 1.0 ELSE 0 END) / COUNT(*) * 100 AS decimal(5,2))
                                                        AS success_rate_pct
       FROM catalog.executions
       WHERE start_time >= DATEADD(DAY, -90, GETUTCDATE())
         AND end_time IS NOT NULL
       GROUP BY folder_name, project_name, package_name
       ORDER BY folder_name, project_name, package_name`,
    );
    if (error) {
      warnings.push(`performance_stats: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 17. SSISDB Project Versions (deployment history)
  // ───────────────────────────────────────────────────────────────────────────

  async extractProjectVersionHistory(warnings) {
    const { rows, error } = await safeQuery(
      this.pool,
      `USE SSISDB;
       SELECT
         ov.object_version_lsn,
         ov.object_id,
         ov.object_name,
         ov.object_type,
         ov.created_time,
         ov.created_by,
         ov.description,
         ov.is_current
       FROM catalog.object_versions ov
       WHERE ov.object_type = 20   -- project only (no binary blob)
       ORDER BY ov.object_name, ov.created_time DESC`,
    );
    if (error) {
      warnings.push(`project_version_history: ${error}`);
      return [];
    }
    return rows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Lineage Edge Builder
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Derive lineage edges from collected metadata.
   * An edge = { from, to, via, edgeType, confidence, ... }
   */
  buildLineageEdges(catalog, xmlMeta, agentData, perfStats) {
    const edges = [];
    const defaultServerHint = this.config?.server || 'unknown_server';
    const safeCatalog = Array.isArray(catalog) ? catalog : [];
    const safeXmlMeta = Array.isArray(xmlMeta) ? xmlMeta : [];
    const safePerfStats = Array.isArray(perfStats) ? perfStats : [];

    // Build lookup maps
    const perfMap = new Map();
    for (const stat of safePerfStats) {
      const key = `${stat.folder_name}/${stat.project_name}/${stat.package_name}`;
      perfMap.set(key, stat);
    }

    // For each package, derive source→destination edges from XML
    for (const xmlPkg of safeXmlMeta) {
      const { connectionManagers, dataFlowComponents, objectName } = xmlPkg;

      // Build connMgr id→info map
      const connMap = new Map();
      for (const cm of connectionManagers) {
        connMap.set(cm.connName, cm);
      }

      const sources = dataFlowComponents.filter((c) => c.role === 'SOURCE');
      const destinations = dataFlowComponents.filter((c) => c.role === 'DESTINATION');
      const lookups = dataFlowComponents.filter((c) => c.role === 'LOOKUP');

      for (const src of sources) {
        const srcConn = connMap.get(src.connectionManagerId) || {};
        const srcServer = srcConn.serverName || defaultServerHint;
        const srcDb = srcConn.databaseName || 'unknown_db';
        const srcTable = src.tableName || src.sqlCommand || 'unknown_table';
        const fromId = `${srcServer}.${srcDb}.${srcTable}`;

        for (const dst of destinations) {
          const dstConn = connMap.get(dst.connectionManagerId) || {};
          const dstServer = dstConn.serverName || defaultServerHint;
          const dstDb = dstConn.databaseName || 'unknown_db';
          const dstTable = dst.tableName || dst.sqlCommand || 'unknown_table';
          const toId = `${dstServer}.${dstDb}.${dstTable}`;

          edges.push({
            from: fromId,
            to: toId,
            via: `SSIS/${objectName}`,
            edgeType: 'ETL',
            confidence: 0.85,
            sourceComponent: src.componentName,
            destinationComponent: dst.componentName,
            packageName: objectName,
          });
        }

        // Lookup tables also read from a reference table – add as lineage source
        for (const lkp of lookups) {
          const lkpTable = lkp.lookupTable || lkp.sqlCommand;
          if (lkpTable) {
            const lkpConn = connMap.get(lkp.lookupConnectionManagerId) || {};
            const lkpServer = lkpConn.serverName || defaultServerHint;
            const lkpDb = lkpConn.databaseName || 'unknown_db';
            edges.push({
              from: `${lkpServer}.${lkpDb}.${lkpTable}`,
              to: fromId,
              via: `SSIS/${objectName}/Lookup/${lkp.componentName}`,
              edgeType: 'LOOKUP',
              confidence: 0.75,
              packageName: objectName,
            });
          }
        }
      }
    }

    // Enrich edges from catalog + performance data
    if (safeCatalog.length > 0) {
      for (const pkg of safeCatalog) {
        const key = `${pkg.folder_name}/${pkg.project_name}/${pkg.package_name}`;
        const perf = perfMap.get(key);

        // If we have no XML-derived edges for this package, create a placeholder
        const hasEdge = edges.some((e) => e.via && e.via.includes(pkg.package_name));
        if (!hasEdge) {
          edges.push({
            from: 'UNKNOWN',
            to: 'UNKNOWN',
            via: `SSIS/${pkg.folder_name}/${pkg.project_name}/${pkg.package_name}`,
            edgeType: 'ETL',
            confidence: 0.3,
            note: 'Package detected; XML lineage not extracted – run with extract_xml=true',
            packageName: pkg.package_name,
            projectName: pkg.project_name,
            folderName: pkg.folder_name,
            lastExecuted: perf ? perf.last_execution : pkg.package_last_validation,
            totalExecutions: perf ? perf.total_executions : null,
            successRate: perf ? perf.success_rate_pct : null,
            avgDurationSeconds: perf ? perf.avg_duration_seconds : null,
          });
        }
      }
    }

    return edges;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Master Extract Entry Point
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Run the full extraction pipeline.
   * @param {object} opts
   * @param {number}  [opts.historyDays=30]    - Days of execution history
   * @param {number}  [opts.phaseDays=7]       - Days of component-phase data
   * @param {boolean} [opts.extractXml=true]   - Parse package XML for lineage
   * @returns {SsisExtractionResult}
   */
  async extractAll(opts = {}) {
    const { historyDays = 30, phaseDays = 7, extractXml = true } = opts;

    const warnings = [];
    const result = {
      extractedAt: new Date().toISOString(),
      ssisdbPresent: false,
      catalog: [],
      parameters: [],
      executables: [],
      environments: { environments: [], variables: [], projectReferences: [] },
      executionHistory: [],
      componentPhases: [],
      dataStatistics: [],
      executionParameterValues: [],
      eventMessages: [],
      validations: [],
      xmlMetadata: [],
      scaleOut: { agents: [], tasks: [] },
      agentJobs: {
        jobs: [],
        ssisSteps: [],
        allSteps: [],
        schedules: [],
        recentHistory: [],
      },
      legacyLog: [],
      msdbPackages: [],
      performanceStats: [],
      projectVersionHistory: [],
      lineageEdges: [],
      warnings,
    };

    // ── Check SSISDB availability ──────────────────────────────────────────
    const ssisPresent = await this.checkSsisdb(warnings);
    result.ssisdbPresent = ssisPresent;

    if (ssisPresent) {
      // ── Catalog inventory ───────────────────────────────────────────────
      result.catalog = await this.extractCatalogInventory(warnings);
      result.parameters = await this.extractParameters(warnings);
      result.executables = await this.extractExecutables(warnings);

      // ── Environments ────────────────────────────────────────────────────
      result.environments = await this.extractEnvironments(warnings);

      // ── Execution history & diagnostics ─────────────────────────────────
      result.executionHistory = await this.extractExecutionHistory(warnings, {
        days: historyDays,
      });
      result.componentPhases = await this.extractComponentPhases(warnings, {
        days: phaseDays,
      });
      result.dataStatistics = await this.extractDataStatistics(warnings, {
        days: phaseDays,
      });
      result.executionParameterValues = await this.extractExecutionParameterValues(warnings, {
        days: phaseDays,
      });
      result.eventMessages = await this.extractEventMessages(warnings, {
        days: phaseDays,
      });

      // ── Validations ─────────────────────────────────────────────────────
      result.validations = await this.extractValidations(warnings);

      // ── Package XML lineage ──────────────────────────────────────────────
      if (extractXml) {
        result.xmlMetadata = await this.extractPackageXmlMetadata(warnings);
      }

      // ── Scale-out ───────────────────────────────────────────────────────
      result.scaleOut = await this.extractScaleOutAgents(warnings);

      // ── Performance aggregates ──────────────────────────────────────────
      result.performanceStats = await this.extractPackagePerformanceStats(warnings);

      // ── Deployment version history ───────────────────────────────────────
      result.projectVersionHistory = await this.extractProjectVersionHistory(warnings);
    }

    // ── SQL Agent (always attempt; separate from SSISDB) ──────────────────
    result.agentJobs = await this.extractAgentJobs(warnings);

    // ── Legacy log ────────────────────────────────────────────────────────
    result.legacyLog = await this.extractLegacyLog(warnings, { days: phaseDays });

    // ── MSDB packages (pre-catalog model) ─────────────────────────────────
    result.msdbPackages = await this.extractMsdbPackages(warnings);

    // ── Build lineage edges ───────────────────────────────────────────────
    result.lineageEdges = this.buildLineageEdges(
      result.catalog,
      result.xmlMetadata,
      result.agentJobs,
      result.performanceStats,
    );

    return result;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public factory function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create an SSIS extractor and run the full extraction.
 *
 * @param {import('mssql').config} connectionConfig - mssql connection config
 * @param {object} [opts] - see SsisMetadataExtractor.extractAll opts
 * @returns {Promise<SsisExtractionResult>}
 */
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
