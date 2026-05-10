/**
 * SQL Server Metadata Extractor & Lineage Detector
 * Extracts table, column, and relationship metadata from SQL Server
 * Detects data lineage with confidence scoring
 */

import mssql from 'mssql';

/**
 * Confidence scoring for detected relationships
 * Scale: 1.0 (definitive) to 0.0 (reject)
 */
const ConfidenceScores = {
  PRIMARY_TO_FOREIGN_KEY: 1.0, // Explicit FK constraint on PK
  FOREIGN_KEY_UNIQUE: 0.95, // FK on UNIQUE key (not PK)
  EXACT_COLUMN_MATCH: 0.80, // Both tables have "customer_id"
  NAMING_CONVENTION: 0.70, // Pattern-based (e.g., {table}_id)
  SEMANTIC_MATCH: 0.65, // "CustomerID" <-> "Cust_ID"
  ETL_PATTERN: 0.75, // Staging/SCD/CDC patterns detected
  SCHEMA_GROUPING: 0.40, // Same schema prefix
  CARDINALITY_MATCH: 0.50, // Row counts suggest relationship
  COMPOSITE_KEY: 0.75, // Multi-column key match
  SELF_JOIN: 0.85, // Hierarchy/parent-child detected
  SOFT_DELETE_PATTERN: 0.60, // is_deleted, status='inactive'
  MANY_TO_MANY_BRIDGE: 0.75, // Composite PK + 2 FKs
};

class SqlServerMetadataExtractor {
  constructor(connectionConfig, sqlDriver = mssql) {
    this.config = connectionConfig;
    this.sqlDriver = sqlDriver;
    this.pool = null;
    this.metadata = {
      tables: new Map(),
      views: new Map(),
      storedProcedures: new Map(),
      relationships: [],
      extractionWarnings: [],
      objectInventory: null,
      researchReport: null,
    };
  }

  static isPermissionIssue(err) {
    const message = String(err?.message || '').toLowerCase();
    return message.includes('does not have permission')
      || message.includes('permission was denied')
      || message.includes('view database state')
      || message.includes('dm_db_partition_stats');
  }

  /**
   * Connect to SQL Server
   */
  async connect() {
    try {
      this.pool = new this.sqlDriver.ConnectionPool(this.config);
      await this.pool.connect();
      console.log('Connected to SQL Server');
      return true;
    } catch (err) {
      console.error('SQL Server connection failed:', err.message);
      throw err;
    }
  }

  /**
   * Disconnect from SQL Server
   */
  async disconnect() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }

  /**
   * Extract all tables and columns with metadata
   */
  async extractTables(_database, scope = {}) {
    const query = `
      SELECT 
        SCHEMA_NAME(t.schema_id) as schema_name,
        t.name as table_name,
        t.type as table_type,
        ep.value as table_description,
        ps.row_count,
        ps.reserved_page_count * 8 as size_kb
      FROM sys.tables t
      LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id 
        AND ep.minor_id = 0 AND ep.class = 1
      LEFT JOIN sys.dm_db_partition_stats ps ON ps.object_id = t.object_id 
        AND ps.index_id IN (0, 1)
      ORDER BY SCHEMA_NAME(t.schema_id), t.name
    `;

    try {
      const result = await this.pool.request().query(query);
      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));
      const selectedTables = new Set((scope.tables || []).map((t) => t.toLowerCase()));
      const filteredRows = result.recordset.filter((row) => {
        const schemaTableId = `${row.schema_name}.${row.table_name}`.toLowerCase();
        const schemaMatch = selectedSchemas.size === 0
          || selectedSchemas.has(String(row.schema_name || '').toLowerCase());
        const tableMatch = selectedTables.size === 0 || selectedTables.has(schemaTableId);
        return schemaMatch && tableMatch;
      });

      return filteredRows.map((row) => ({
        id: `${row.schema_name}.${row.table_name}`,
        name: row.table_name,
        schema: row.schema_name,
        type: row.table_type === 'U' ? 'table' : 'view',
        description: row.table_description || '',
        rowCount: row.row_count || 0,
        sizeKb: row.size_kb || 0,
      }));
    } catch (err) {
      if (!SqlServerMetadataExtractor.isPermissionIssue(err)) {
        console.error('Error extracting tables:', err.message);
        throw err;
      }

      const fallbackQuery = `
        SELECT
          SCHEMA_NAME(t.schema_id) as schema_name,
          t.name as table_name,
          t.type as table_type,
          ep.value as table_description
        FROM sys.tables t
        LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
          AND ep.minor_id = 0 AND ep.class = 1
        ORDER BY SCHEMA_NAME(t.schema_id), t.name
      `;

      const fallback = await this.pool.request().query(fallbackQuery);
      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));
      const selectedTables = new Set((scope.tables || []).map((t) => t.toLowerCase()));
      const filteredRows = fallback.recordset.filter((row) => {
        const schemaTableId = `${row.schema_name}.${row.table_name}`.toLowerCase();
        const schemaMatch = selectedSchemas.size === 0
          || selectedSchemas.has(String(row.schema_name || '').toLowerCase());
        const tableMatch = selectedTables.size === 0 || selectedTables.has(schemaTableId);
        return schemaMatch && tableMatch;
      });

      this.metadata.extractionWarnings.push({
        code: 'MISSING_VIEW_DATABASE_STATE',
        message: 'Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.',
      });

      return filteredRows.map((row) => ({
        id: `${row.schema_name}.${row.table_name}`,
        name: row.table_name,
        schema: row.schema_name,
        type: row.table_type === 'U' ? 'table' : 'view',
        description: row.table_description || '',
        rowCount: 0,
        sizeKb: 0,
        statsUnavailable: true,
      }));
    }
  }

  /**
   * Lightweight discovery to let users scope extraction before deep analysis
   */
  async listSchemasAndTables() {
    const query = `
      SELECT
        SCHEMA_NAME(t.schema_id) as schema_name,
        t.name as table_name
      FROM sys.tables t
      ORDER BY SCHEMA_NAME(t.schema_id), t.name
    `;

    const result = await this.pool.request().query(query);
    const tables = result.recordset.map((row) => ({
      id: `${row.schema_name}.${row.table_name}`,
      schema: row.schema_name,
      name: row.table_name,
    }));

    const schemaCounts = new Map();
    tables.forEach((table) => {
      schemaCounts.set(table.schema, (schemaCounts.get(table.schema) || 0) + 1);
    });

    const schemas = Array.from(schemaCounts.entries())
      .map(([name, tableCount]) => ({ name, tableCount }))
      .sort((a, b) => b.tableCount - a.tableCount);

    return {
      schemas,
      tables,
    };
  }

  /**
   * Lightweight discovery including all object types (no deep metadata, no DMV scans)
   * Safe for very large schemas—returns object counts only
   */
  async listAllObjectsByType() {
    const query = `
      SELECT
        SCHEMA_NAME(o.schema_id) as schema_name,
        CASE 
          WHEN o.type = 'U' THEN 'table'
          WHEN o.type = 'V' THEN 'view'
          WHEN o.type = 'P' THEN 'stored_procedure'
          WHEN o.type = 'FN' THEN 'function'
          WHEN o.type = 'TF' THEN 'table_function'
          WHEN o.type = 'TR' THEN 'trigger'
          ELSE 'other'
        END as object_type,
        COUNT(*) as count
      FROM sys.objects o
      WHERE o.schema_id NOT IN (SELECT schema_id FROM sys.schemas WHERE name IN ('sys', 'INFORMATION_SCHEMA'))
      GROUP BY SCHEMA_NAME(o.schema_id), o.type
      ORDER BY SCHEMA_NAME(o.schema_id), o.type
    `;

    try {
      const result = await this.pool.request().query(query);
      const summary = {};

      result.recordset.forEach((row) => {
        if (!summary[row.schema_name]) {
          summary[row.schema_name] = {};
        }
        summary[row.schema_name][row.object_type] = row.count;
      });

      return summary;
    } catch (err) {
      console.error('Error listing objects by type:', err.message);
      return {};
    }
  }

  /**
   * Research step: inventory database object types for extraction coverage analysis
   */
  async extractObjectTypeInventory(scope = {}) {
    const query = `
      SELECT
        SCHEMA_NAME(o.schema_id) as schema_name,
        o.type as object_type,
        COUNT(*) as object_count
      FROM sys.objects o
      WHERE o.is_ms_shipped = 0
        AND o.schema_id NOT IN (SELECT schema_id FROM sys.schemas WHERE name IN ('sys', 'INFORMATION_SCHEMA'))
      GROUP BY SCHEMA_NAME(o.schema_id), o.type
      ORDER BY SCHEMA_NAME(o.schema_id), o.type
    `;

    const typeSummary = {
      table: 0,
      view: 0,
      storedProcedure: 0,
      scalarFunction: 0,
      inlineTableFunction: 0,
      tableFunction: 0,
      trigger: 0,
      synonym: 0,
      sequence: 0,
      tableType: 0,
      other: 0,
    };

    const mapType = (typeCode) => {
      switch (typeCode) {
        case 'U': return 'table';
        case 'V': return 'view';
        case 'P': return 'storedProcedure';
        case 'FN': return 'scalarFunction';
        case 'IF': return 'inlineTableFunction';
        case 'TF': return 'tableFunction';
        case 'TR': return 'trigger';
        case 'SN': return 'synonym';
        case 'SO': return 'sequence';
        case 'TT': return 'tableType';
        default: return 'other';
      }
    };

    try {
      const result = await this.pool.request().query(query);
      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));
      const filteredRows = result.recordset.filter((row) => selectedSchemas.size === 0
        || selectedSchemas.has(String(row.schema_name || '').toLowerCase()));

      filteredRows.forEach((row) => {
        const normalizedType = mapType(row.object_type);
        typeSummary[normalizedType] = (typeSummary[normalizedType] || 0) + (row.object_count || 0);
      });

      typeSummary.total = Object.values(typeSummary)
        .reduce((sum, count) => sum + (Number(count) || 0), 0);
      return typeSummary;
    } catch (err) {
      console.error('Error extracting object inventory:', err.message);
      return {
        ...typeSummary,
        total: 0,
        inventoryUnavailable: true,
      };
    }
  }

  /**
   * Research step: summarize extraction coverage and lineage readiness
   */
  static buildCoverageResearchReport({
    inventory,
    extracted,
    relationshipCount,
    columnLineageEnabled,
  }) {
    const expectedFunctions = (inventory.scalarFunction || 0)
      + (inventory.inlineTableFunction || 0)
      + (inventory.tableFunction || 0);

    const extractedCoreTotal = (extracted.tables || 0)
      + (extracted.views || 0)
      + (extracted.storedProcedures || 0)
      + (extracted.functions || 0)
      + (extracted.triggers || 0);

    const expectedCoreTotal = (inventory.table || 0)
      + (inventory.view || 0)
      + (inventory.storedProcedure || 0)
      + expectedFunctions
      + (inventory.trigger || 0);

    const coveragePercent = expectedCoreTotal > 0
      ? Number(((extractedCoreTotal / expectedCoreTotal) * 100).toFixed(2))
      : 100;

    const missingOrUncaptured = [];
    if ((inventory.table || 0) > (extracted.tables || 0)) {
      missingOrUncaptured.push('Some tables were not extracted (scope filtering or permissions).');
    }
    if ((inventory.view || 0) > (extracted.views || 0)) {
      missingOrUncaptured.push('Some views were not extracted.');
    }
    if ((inventory.storedProcedure || 0) > (extracted.storedProcedures || 0)) {
      missingOrUncaptured.push('Some stored procedures were not extracted.');
    }
    if (expectedFunctions > (extracted.functions || 0)) {
      missingOrUncaptured.push('Some functions were not extracted (FN/IF/TF).');
    }
    if ((inventory.trigger || 0) > (extracted.triggers || 0)) {
      missingOrUncaptured.push('Some triggers were not extracted.');
    }

    if ((inventory.synonym || 0) > 0) {
      missingOrUncaptured.push(`Synonyms detected (${inventory.synonym}) but not currently modeled for lineage.`);
    }
    if ((inventory.sequence || 0) > 0) {
      missingOrUncaptured.push(`Sequences detected (${inventory.sequence}) but not currently modeled in markdown output.`);
    }
    if ((inventory.tableType || 0) > 0) {
      missingOrUncaptured.push(`User-defined table types detected (${inventory.tableType}) but not currently extracted.`);
    }

    const recommendations = [
      'Add column-level extraction to markdown output for table-level lineage validation.',
      'Add dependency extraction from sys.sql_expression_dependencies for view/procedure/function lineage.',
      'Add support for synonyms and sequences to improve completeness.',
    ];

    if (!columnLineageEnabled) {
      recommendations.unshift('Run scoped extraction (smaller schema/table set) with full mode to enable column-level lineage detection.');
    }

    return {
      coveragePercent,
      expectedCoreObjects: expectedCoreTotal,
      extractedCoreObjects: extractedCoreTotal,
      relationshipCount,
      columnLineageEnabled,
      inventory,
      missingOrUncaptured,
      recommendations,
    };
  }

  /**
     * Extract columns for a set of tables (batched to avoid timeout)
     */
  async extractTableColumnsInBatches(tables, batchSize = 10) {
    const columnsByTable = new Map();
    const batches = [];

    for (let i = 0; i < tables.length; i += batchSize) {
      batches.push(tables.slice(i, i + batchSize));
    }

    console.log(`Extracting columns in ${batches.length} batches of ${batchSize}...`);

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
      const batch = batches[batchIndex];
      console.log(`Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} tables)...`);

      const promises = batch.map(async (table) => {
        try {
          const columns = await this.extractColumns(table.schema, table.name);
          columnsByTable.set(table.id, columns);
        } catch (err) {
          console.warn(`Failed to extract columns for ${table.schema}.${table.name}:`, err.message);
        }
      });

      // eslint-disable-next-line no-await-in-loop
      await Promise.all(promises);
    }

    return columnsByTable;
  }

  /**
   * Extract index metadata for user tables
   */
  async extractTableIndexes(scope = {}) {
    const query = `
      SELECT
        SCHEMA_NAME(t.schema_id) as schema_name,
        t.name as table_name,
        i.name as index_name,
        i.type_desc as index_type,
        i.is_unique,
        i.is_primary_key,
        i.is_unique_constraint,
        i.is_disabled,
        i.has_filter,
        i.filter_definition,
        c.name as column_name,
        ic.key_ordinal,
        ic.is_descending_key,
        ic.is_included_column
      FROM sys.tables t
      JOIN sys.indexes i ON t.object_id = i.object_id
      LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
        AND i.index_id = ic.index_id
      LEFT JOIN sys.columns c ON ic.object_id = c.object_id
        AND ic.column_id = c.column_id
      WHERE i.index_id > 0
      ORDER BY SCHEMA_NAME(t.schema_id), t.name, i.name, ic.key_ordinal
    `;

    try {
      const result = await this.pool.request().query(query);
      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));
      const selectedTables = new Set((scope.tables || []).map((t) => t.toLowerCase()));
      const indexesByTable = new Map();

      result.recordset.forEach((row) => {
        const tableId = `${row.schema_name}.${row.table_name}`;
        const tableKey = tableId.toLowerCase();
        const schemaMatch = selectedSchemas.size === 0
          || selectedSchemas.has(String(row.schema_name || '').toLowerCase());
        const tableMatch = selectedTables.size === 0 || selectedTables.has(tableKey);

        if (!schemaMatch || !tableMatch) {
          return;
        }

        if (!indexesByTable.has(tableId)) {
          indexesByTable.set(tableId, new Map());
        }

        const tableIndexes = indexesByTable.get(tableId);
        const indexKey = String(row.index_name || 'unnamed_index');

        if (!tableIndexes.has(indexKey)) {
          tableIndexes.set(indexKey, {
            name: row.index_name || 'unnamed_index',
            type: row.index_type,
            isUnique: row.is_unique,
            isPrimaryKey: row.is_primary_key,
            isUniqueConstraint: row.is_unique_constraint,
            isDisabled: row.is_disabled,
            hasFilter: row.has_filter,
            filterDefinition: row.filter_definition || null,
            keyColumns: [],
            includedColumns: [],
          });
        }

        const indexObj = tableIndexes.get(indexKey);
        if (row.column_name) {
          if (row.is_included_column) {
            indexObj.includedColumns.push(row.column_name);
          } else {
            indexObj.keyColumns.push({
              name: row.column_name,
              keyOrdinal: row.key_ordinal,
              sort: row.is_descending_key ? 'DESC' : 'ASC',
            });
          }
        }
      });

      const normalized = new Map();
      indexesByTable.forEach((indexMap, tableId) => {
        normalized.set(tableId, Array.from(indexMap.values()));
      });

      return normalized;
    } catch (err) {
      console.error('Error extracting table indexes:', err.message);
      return new Map();
    }
  }

  /**
   * Extract key and check constraints for user tables
   */
  async extractTableConstraints(scope = {}) {
    const keyConstraintQuery = `
      SELECT
        SCHEMA_NAME(t.schema_id) as schema_name,
        t.name as table_name,
        kc.name as constraint_name,
        kc.type as constraint_type,
        c.name as column_name,
        ic.key_ordinal
      FROM sys.tables t
      JOIN sys.key_constraints kc ON t.object_id = kc.parent_object_id
      JOIN sys.index_columns ic ON kc.parent_object_id = ic.object_id
        AND kc.unique_index_id = ic.index_id
      JOIN sys.columns c ON ic.object_id = c.object_id
        AND ic.column_id = c.column_id
      ORDER BY SCHEMA_NAME(t.schema_id), t.name, kc.name, ic.key_ordinal
    `;

    const checkConstraintQuery = `
      SELECT
        SCHEMA_NAME(t.schema_id) as schema_name,
        t.name as table_name,
        cc.name as constraint_name,
        cc.definition as constraint_definition,
        cc.is_not_trusted,
        cc.is_disabled
      FROM sys.tables t
      JOIN sys.check_constraints cc ON t.object_id = cc.parent_object_id
      ORDER BY SCHEMA_NAME(t.schema_id), t.name, cc.name
    `;

    try {
      const [keyConstraints, checkConstraints] = await Promise.all([
        this.pool.request().query(keyConstraintQuery),
        this.pool.request().query(checkConstraintQuery),
      ]);

      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));
      const selectedTables = new Set((scope.tables || []).map((t) => t.toLowerCase()));
      const constraintsByTable = new Map();

      const ensureTableBucket = (tableId) => {
        if (!constraintsByTable.has(tableId)) {
          constraintsByTable.set(tableId, {
            primaryKey: null,
            uniqueConstraints: [],
            checkConstraints: [],
          });
        }
        return constraintsByTable.get(tableId);
      };

      keyConstraints.recordset.forEach((row) => {
        const tableId = `${row.schema_name}.${row.table_name}`;
        const tableKey = tableId.toLowerCase();
        const schemaMatch = selectedSchemas.size === 0
          || selectedSchemas.has(String(row.schema_name || '').toLowerCase());
        const tableMatch = selectedTables.size === 0 || selectedTables.has(tableKey);

        if (!schemaMatch || !tableMatch) {
          return;
        }

        const bucket = ensureTableBucket(tableId);
        if (row.constraint_type === 'PK') {
          if (!bucket.primaryKey || bucket.primaryKey.name !== row.constraint_name) {
            bucket.primaryKey = {
              name: row.constraint_name,
              columns: [],
            };
          }
          bucket.primaryKey.columns.push({
            name: row.column_name,
            keyOrdinal: row.key_ordinal,
          });
        } else if (row.constraint_type === 'UQ') {
          let uq = bucket.uniqueConstraints.find((item) => item.name === row.constraint_name);
          if (!uq) {
            uq = {
              name: row.constraint_name,
              columns: [],
            };
            bucket.uniqueConstraints.push(uq);
          }
          uq.columns.push({
            name: row.column_name,
            keyOrdinal: row.key_ordinal,
          });
        }
      });

      checkConstraints.recordset.forEach((row) => {
        const tableId = `${row.schema_name}.${row.table_name}`;
        const tableKey = tableId.toLowerCase();
        const schemaMatch = selectedSchemas.size === 0
          || selectedSchemas.has(String(row.schema_name || '').toLowerCase());
        const tableMatch = selectedTables.size === 0 || selectedTables.has(tableKey);

        if (!schemaMatch || !tableMatch) {
          return;
        }

        const bucket = ensureTableBucket(tableId);
        bucket.checkConstraints.push({
          name: row.constraint_name,
          definition: row.constraint_definition,
          isNotTrusted: row.is_not_trusted,
          isDisabled: row.is_disabled,
        });
      });

      return constraintsByTable;
    } catch (err) {
      console.error('Error extracting table constraints:', err.message);
      return new Map();
    }
  }

  /**
   * Extract routine parameters for procedures/functions
   */
  async extractRoutineParameters(scope = {}) {
    const query = `
      SELECT
        SCHEMA_NAME(o.schema_id) as schema_name,
        o.name as routine_name,
        o.type as routine_type,
        p.name as parameter_name,
        tp.name as data_type,
        p.max_length,
        p.precision,
        p.scale,
        p.is_output,
        p.has_default_value,
        p.default_value,
        p.parameter_id
      FROM sys.objects o
      JOIN sys.parameters p ON o.object_id = p.object_id
      JOIN sys.types tp ON p.user_type_id = tp.user_type_id
      WHERE o.type IN ('P', 'FN', 'TF', 'IF')
      ORDER BY SCHEMA_NAME(o.schema_id), o.name, p.parameter_id
    `;

    try {
      const result = await this.pool.request().query(query);
      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));
      const parameterMap = new Map();

      result.recordset.forEach((row) => {
        const routineKey = `${row.schema_name}.${row.routine_name}`;
        const schemaMatch = selectedSchemas.size === 0
          || selectedSchemas.has(String(row.schema_name || '').toLowerCase());
        if (!schemaMatch) {
          return;
        }

        if (!parameterMap.has(routineKey)) {
          parameterMap.set(routineKey, []);
        }

        parameterMap.get(routineKey).push({
          name: row.parameter_name,
          dataType: row.data_type,
          maxLength: row.max_length,
          precision: row.precision,
          scale: row.scale,
          isOutput: row.is_output,
          hasDefaultValue: row.has_default_value,
          defaultValue: row.default_value,
          ordinal: row.parameter_id,
        });
      });

      return parameterMap;
    } catch (err) {
      console.error('Error extracting routine parameters:', err.message);
      return new Map();
    }
  }

  /**
     * Extract dependencies for views, procedures, and functions
     */
  async extractObjectDependencies(objects) {
    const query = `
        SELECT DISTINCT
          SCHEMA_NAME(o1.schema_id) as schema_name,
          o1.name as object_name,
          o1.type as object_type,
          SCHEMA_NAME(o2.schema_id) as referenced_schema,
          o2.name as referenced_object,
          o2.type as referenced_type
        FROM sys.sql_expression_dependencies sed
        JOIN sys.objects o1 ON sed.referencing_id = o1.object_id
        JOIN sys.objects o2 ON sed.referenced_id = o2.object_id
        WHERE o1.is_ms_shipped = 0
          AND o2.is_ms_shipped = 0
          AND sed.referenced_database_name IS NULL
        ORDER BY SCHEMA_NAME(o1.schema_id), o1.name
      `;

    try {
      const result = await this.pool.request().query(query);
      const depsByObject = new Map();
      const scopedObjects = new Set((objects || []).map((obj) => `${obj.schema}.${obj.name}`.toLowerCase()));

      result.recordset.forEach((row) => {
        const objKey = `${row.schema_name}.${row.object_name}`;
        if (scopedObjects.size > 0 && !scopedObjects.has(objKey.toLowerCase())) {
          return;
        }
        if (!depsByObject.has(objKey)) {
          depsByObject.set(objKey, []);
        }
        depsByObject.get(objKey).push({
          referencedSchema: row.referenced_schema,
          referencedObject: row.referenced_object,
          referencedType: row.referenced_type,
        });
      });

      return depsByObject;
    } catch (err) {
      console.error('Error extracting object dependencies:', err.message);
      return new Map();
    }
  }

  /**
   * Extract columns for a specific table
   */
  async extractColumns(schema, table) {
    const query = `
      SELECT 
        c.name as column_name,
        t.name as data_type,
        c.max_length,
        c.is_nullable,
        c.is_identity,
        c.is_computed,
        cc.definition as computed_definition,
        ep.value as column_description,
        dc.definition as default_definition
      FROM sys.columns c
      JOIN sys.types t ON c.user_type_id = t.user_type_id
      LEFT JOIN sys.computed_columns cc ON cc.object_id = c.object_id 
        AND cc.column_id = c.column_id
      LEFT JOIN sys.extended_properties ep ON ep.major_id = c.object_id 
        AND ep.minor_id = c.column_id AND ep.class = 1
      LEFT JOIN sys.default_constraints dc ON dc.parent_object_id = c.object_id 
        AND dc.parent_column_id = c.column_id
      WHERE OBJECT_NAME(c.object_id) = @table 
        AND SCHEMA_NAME(OBJECTPROPERTY(c.object_id, 'SchemaId')) = @schema
      ORDER BY c.column_id
    `;

    try {
      const result = await this.pool
        .request()
        .input('schema', schema)
        .input('table', table)
        .query(query);

      return result.recordset.map((row) => ({
        name: row.column_name,
        dataType: row.data_type,
        maxLength: row.max_length,
        isNullable: row.is_nullable,
        isIdentity: row.is_identity,
        isComputed: row.is_computed,
        computedDefinition: row.computed_definition,
        description: row.column_description || '',
        defaultValue: row.default_definition,
      }));
    } catch (err) {
      console.error(`Error extracting columns for ${schema}.${table}:`, err.message);
      throw err;
    }
  }

  /**
   * Extract all primary keys
   */
  async extractPrimaryKeys(schema, table) {
    const query = `
      SELECT 
        c.name as column_name,
        ic.key_ordinal
      FROM sys.key_constraints kc
      JOIN sys.index_columns ic ON kc.parent_object_id = ic.object_id 
        AND kc.unique_index_id = ic.index_id
      JOIN sys.columns c ON ic.object_id = c.object_id 
        AND ic.column_id = c.column_id
      WHERE kc.type = 'PK'
        AND OBJECT_NAME(kc.parent_object_id) = @table
        AND SCHEMA_NAME(OBJECTPROPERTY(kc.parent_object_id, 'SchemaId')) = @schema
      ORDER BY ic.key_ordinal
    `;

    try {
      const result = await this.pool
        .request()
        .input('schema', schema)
        .input('table', table)
        .query(query);

      return result.recordset.map((row) => row.column_name);
    } catch (err) {
      console.error(
        `Error extracting primary keys for ${schema}.${table}:`,
        err.message,
      );
      return [];
    }
  }

  /**
   * Extract all stored procedures
   */
  async extractStoredProcedures(scope = {}) {
    const query = `
      SELECT
        SCHEMA_NAME(r.schema_id) as schema_name,
        r.name as procedure_name,
        OBJECT_DEFINITION(r.object_id) as procedure_definition,
        ep.value as procedure_description,
        r.create_date,
        r.modify_date
      FROM sys.procedures r
      LEFT JOIN sys.extended_properties ep ON ep.major_id = r.object_id
        AND ep.minor_id = 0 AND ep.class = 1
      ORDER BY SCHEMA_NAME(r.schema_id), r.name
    `;

    try {
      const result = await this.pool.request().query(query);
      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));

      return result.recordset
        .filter((row) => selectedSchemas.size === 0
          || selectedSchemas.has(String(row.schema_name || '').toLowerCase()))
        .map((row) => ({
          id: `${row.schema_name}.${row.procedure_name}`,
          name: row.procedure_name,
          schema: row.schema_name,
          type: 'stored_procedure',
          description: row.procedure_description || '',
          definition: row.procedure_definition || '',
          createdAt: row.create_date,
          modifiedAt: row.modify_date,
        }));
    } catch (err) {
      console.error('Error extracting stored procedures:', err.message);
      return [];
    }
  }

  /**
   * Extract all functions
   */
  async extractFunctions(scope = {}) {
    const query = `
      SELECT
        SCHEMA_NAME(r.schema_id) as schema_name,
        r.name as function_name,
        CASE WHEN r.type IN ('FN', 'TF') THEN 'user_function' ELSE 'other' END as func_type,
        OBJECT_DEFINITION(r.object_id) as function_definition,
        ep.value as function_description,
        r.create_date,
        r.modify_date
      FROM sys.objects r
      LEFT JOIN sys.extended_properties ep ON ep.major_id = r.object_id
        AND ep.minor_id = 0 AND ep.class = 1
      WHERE r.type IN ('FN', 'TF')
      ORDER BY SCHEMA_NAME(r.schema_id), r.name
    `;

    try {
      const result = await this.pool.request().query(query);
      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));

      return result.recordset
        .filter((row) => selectedSchemas.size === 0
          || selectedSchemas.has(String(row.schema_name || '').toLowerCase()))
        .map((row) => ({
          id: `${row.schema_name}.${row.function_name}`,
          name: row.function_name,
          schema: row.schema_name,
          type: row.func_type,
          description: row.function_description || '',
          definition: row.function_definition || '',
          createdAt: row.create_date,
          modifiedAt: row.modify_date,
        }));
    } catch (err) {
      console.error('Error extracting functions:', err.message);
      return [];
    }
  }

  /**
   * Extract all triggers
   */
  async extractTriggers(scope = {}) {
    const query = `
      SELECT
        SCHEMA_NAME(t.schema_id) as schema_name,
        tr.name as trigger_name,
        OBJECT_NAME(tr.parent_id) as parent_object_name,
        OBJECT_DEFINITION(tr.object_id) as trigger_definition,
        ep.value as trigger_description,
        tr.create_date,
        tr.modify_date
      FROM sys.triggers tr
      INNER JOIN sys.objects t ON tr.parent_id = t.object_id
      LEFT JOIN sys.extended_properties ep ON ep.major_id = tr.object_id
        AND ep.minor_id = 0 AND ep.class = 1
      ORDER BY SCHEMA_NAME(t.schema_id), tr.name
    `;

    try {
      const result = await this.pool.request().query(query);
      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));

      return result.recordset
        .filter((row) => selectedSchemas.size === 0
          || selectedSchemas.has(String(row.schema_name || '').toLowerCase()))
        .map((row) => ({
          id: `${row.schema_name}.${row.trigger_name}`,
          name: row.trigger_name,
          schema: row.schema_name,
          type: 'trigger',
          parentObject: row.parent_object_name,
          description: row.trigger_description || '',
          definition: row.trigger_definition || '',
          createdAt: row.create_date,
          modifiedAt: row.modify_date,
        }));
    } catch (err) {
      console.error('Error extracting triggers:', err.message);
      return [];
    }
  }

  /**
   * Extract all views
   */
  async extractViews(scope = {}) {
    const query = `
      SELECT
        SCHEMA_NAME(v.schema_id) as schema_name,
        v.name as view_name,
        OBJECT_DEFINITION(v.object_id) as view_definition,
        ep.value as view_description,
        v.create_date,
        v.modify_date
      FROM sys.views v
      LEFT JOIN sys.extended_properties ep ON ep.major_id = v.object_id
        AND ep.minor_id = 0 AND ep.class = 1
      ORDER BY SCHEMA_NAME(v.schema_id), v.name
    `;

    try {
      const result = await this.pool.request().query(query);
      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));

      return result.recordset
        .filter((row) => selectedSchemas.size === 0
          || selectedSchemas.has(String(row.schema_name || '').toLowerCase()))
        .map((row) => ({
          id: `${row.schema_name}.${row.view_name}`,
          name: row.view_name,
          schema: row.schema_name,
          type: 'view',
          description: row.view_description || '',
          definition: row.view_definition || '',
          createdAt: row.create_date,
          modifiedAt: row.modify_date,
        }));
    } catch (err) {
      console.error('Error extracting views:', err.message);
      return [];
    }
  }

  /**
   * Extract all foreign keys
   */
  async extractForeignKeys() {
    const query = `
      SELECT 
        fk.name as constraint_name,
        SCHEMA_NAME(t1.schema_id) as from_schema,
        t1.name as from_table,
        c1.name as from_column,
        SCHEMA_NAME(t2.schema_id) as to_schema,
        t2.name as to_table,
        c2.name as to_column,
        fk.is_not_trusted
      FROM sys.foreign_keys fk
      JOIN sys.tables t1 ON fk.parent_object_id = t1.object_id
      JOIN sys.tables t2 ON fk.referenced_object_id = t2.object_id
      JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
      JOIN sys.columns c1 ON fkc.parent_object_id = c1.object_id 
        AND fkc.parent_column_id = c1.column_id
      JOIN sys.columns c2 ON fkc.referenced_object_id = c2.object_id 
        AND fkc.referenced_column_id = c2.column_id
      ORDER BY fk.name, fkc.constraint_column_id
    `;

    try {
      const result = await this.pool.request().query(query);
      return result.recordset.map((row) => ({
        id: `${row.from_schema}.${row.from_table}.${row.from_column}->${row.to_schema}.${row.to_table}.${row.to_column}`,
        fromTable: `${row.from_schema}.${row.from_table}`,
        fromColumn: row.from_column,
        toTable: `${row.to_schema}.${row.to_table}`,
        toColumn: row.to_column,
        constraintName: row.constraint_name,
        confidence: row.is_not_trusted ? 0.95 : 1.0,
        type: 'explicit_fk',
      }));
    } catch (err) {
      console.error('Error extracting foreign keys:', err.message);
      throw err;
    }
  }

  /**
   * Detect column-level relationships (same names across tables)
   */
  async detectColumnMatches(tables) {
    const relationships = [];
    const columnIndex = new Map();

    // Build column index by name - extract columns in parallel
    const columnsByTable = await Promise.all(
      tables.map(async (table) => ({
        table,
        cols: await this.extractColumns(table.schema, table.name),
      })),
    );

    for (const { table, cols } of columnsByTable) {
      for (const col of cols) {
        const key = col.name.toLowerCase();
        if (!columnIndex.has(key)) {
          columnIndex.set(key, []);
        }
        columnIndex.get(key).push({
          table: table.id,
          column: col.name,
          dataType: col.dataType,
        });
      }
    }

    // Find matches
    for (const [colName, instances] of columnIndex.entries()) {
      if (instances.length >= 2) {
        for (let i = 0; i < instances.length; i += 1) {
          for (let j = i + 1; j < instances.length; j += 1) {
            const from = instances[i];
            const to = instances[j];
            if (
              from.dataType === to.dataType && colName.toLowerCase().includes('id')
            ) {
              relationships.push({
                id: `${from.table}.${from.column}->${to.table}.${to.column}`,
                fromTable: from.table,
                fromColumn: from.column,
                toTable: to.table,
                toColumn: to.column,
                confidence: ConfidenceScores.EXACT_COLUMN_MATCH,
                type: 'column_match',
                evidence: `Exact column name match: "${colName}" in both tables`,
              });
            }
          }
        }
      }
    }

    return relationships;
  }

  /**
   * Detect ETL/staging patterns (stg_, tmp_, etc.)
   */
  static detectEtlPatterns(tables) {
    const relationships = [];
    const stagingTables = tables.filter(
      (t) =>
        t.name.startsWith('stg_')
        || t.name.startsWith('tmp_')
        || t.name.startsWith('dim_'),
    );

    for (const staging of stagingTables) {
      const baseName = staging.name.replace(/^(stg_|tmp_|dim_)/, '');

      // Look for matching production table
      const prod = tables.find(
        (t) =>
          (t.name === baseName
            || t.name === `fact_${baseName}`
            || t.name === baseName.replace(/s$/, ''))
          && !t.name.startsWith('stg_')
          && !t.name.startsWith('tmp_'),
      );

      if (prod) {
        relationships.push({
          id: `${staging.id}->${prod.id}`,
          fromTable: staging.id,
          toTable: prod.id,
          confidence: ConfidenceScores.ETL_PATTERN,
          type: 'etl_pattern',
          evidence: `ETL pattern: "${staging.name}" → "${prod.name}"`,
        });
      }
    }

    return relationships;
  }

  /**
   * Detect naming convention patterns (table_id, cust_id, etc.)
   */
  static detectNamingConventions(tables) {
    const newRels = [];

    for (const table1 of tables) {
      for (const table2 of tables) {
        if (table1.id === table2.id) continue;

        // Check for {table}_id pattern
        const singularName = table1.name.replace(/s$/, '');
        const expectedColName = `${singularName}_id`;

        // If table2 has a column matching the pattern
        // This would need column info, so we mark for validation
        newRels.push({
          id: `${table1.id}->${table2.id}_pattern`,
          fromTable: table2.id,
          toTable: table1.id,
          confidence: ConfidenceScores.NAMING_CONVENTION,
          type: 'naming_convention',
          evidence: `Naming convention: Look for column "${expectedColName}" in "${table2.name}"`,
          requiresValidation: true,
        });
      }
    }

    return newRels.filter((r) => !r.requiresValidation); // Filter out those needing validation
  }

  /**
   * Extract all relationship data with confidence scoring
   */
  async extractAllMetadata(database, scope = {}) {
    console.log(`Extracting metadata from database: ${database}`);
    this.metadata.extractionWarnings = [];

    // Extract all object types in parallel where possible
    const [
      tables,
      views,
      storedProcedures,
      functions,
      triggers,
      fks,
      objectInventory,
    ] = await Promise.all([
      this.extractTables(database, scope),
      this.extractViews(scope),
      this.extractStoredProcedures(scope),
      this.extractFunctions(scope),
      this.extractTriggers(scope),
      this.extractForeignKeys(),
      this.extractObjectTypeInventory(scope),
    ]);

    console.log(`Found ${tables.length} tables, ${views.length} views, ${storedProcedures.length} procs, ${functions.length} functions, ${triggers.length} triggers`);

    // Extract columns for tables in batches (improved over previous lite-mode approach)
    let columnsByTable = new Map();
    let columnExtractionEnabled = false;
    if (tables.length > 0 && tables.length <= 200) {
      console.log(`Extracting columns for ${tables.length} tables in batches...`);
      columnsByTable = await this.extractTableColumnsInBatches(tables, 15);
      const tablesWithColumns = tables.map((table) => ({
        ...table,
        columns: columnsByTable.get(table.id) || table.columns || [],
      }));
      tables.length = 0;
      tables.push(...tablesWithColumns);
      columnExtractionEnabled = true;
    } else if (tables.length > 200) {
      console.log(`Skipping column extraction for ${tables.length} tables (exceeds threshold). Use scoped extraction for full column lineage.`);
      this.metadata.extractionWarnings.push({
        code: 'LARGE_EXTRACTION_LITE_MODE',
        message: `Column extraction skipped: ${tables.length} tables exceeds threshold. Use scoped extraction for column-level lineage.`,
      });
    }

    let columnsByView = new Map();
    if (views.length > 0 && views.length <= 300) {
      console.log(`Extracting columns for ${views.length} views in batches...`);
      columnsByView = await this.extractTableColumnsInBatches(views, 20);
    } else if (views.length > 300) {
      this.metadata.extractionWarnings.push({
        code: 'VIEW_COLUMN_EXTRACTION_SKIPPED',
        message: `View column extraction skipped: ${views.length} views exceeds threshold. Use scoped extraction for full view metadata.`,
      });
    }

    console.log('Extracting index and constraint metadata...');
    const [tableIndexes, tableConstraints] = await Promise.all([
      this.extractTableIndexes(scope),
      this.extractTableConstraints(scope),
    ]);

    const tablesWithGovernanceMetadata = tables.map((table) => {
      const constraints = tableConstraints.get(table.id) || {
        primaryKey: null,
        uniqueConstraints: [],
        checkConstraints: [],
      };

      return {
        ...table,
        indexes: tableIndexes.get(table.id) || [],
        primaryKey: constraints.primaryKey,
        uniqueConstraints: constraints.uniqueConstraints,
        checkConstraints: constraints.checkConstraints,
      };
    });

    tables.length = 0;
    tables.push(...tablesWithGovernanceMetadata);

    console.log('Extracting routine parameters...');
    const routineParameters = await this.extractRoutineParameters(scope);

    // Extract dependencies for views, procedures, functions, triggers
    console.log('Extracting object dependencies...');
    const objectDependencies = await this.extractObjectDependencies([
      ...views,
      ...storedProcedures,
      ...functions,
      ...triggers,
    ]);

    // Attach dependencies to objects
    const attachDependencies = (collection) => collection.map((obj) => {
      const objKey = `${obj.schema}.${obj.name}`;
      if (objectDependencies.has(objKey)) {
        return {
          ...obj,
          dependencies: objectDependencies.get(objKey),
        };
      }
      return obj;
    });

    const viewsWithDependencies = attachDependencies(views).map((view) => ({
      ...view,
      columns: columnsByView.get(view.id) || [],
    }));
    const storedProceduresWithDependencies = attachDependencies(storedProcedures).map((proc) => ({
      ...proc,
      parameters: routineParameters.get(proc.id) || [],
    }));
    const functionsWithDependencies = attachDependencies(functions).map((func) => ({
      ...func,
      parameters: routineParameters.get(func.id) || [],
    }));
    const triggersWithDependencies = attachDependencies(triggers);
    // For large extractions, skip expensive column-level analysis to avoid timeout
    let columnMatches = [];
    let etlPatterns = [];
    let namingConventions = [];

    if (columnExtractionEnabled && tables.length <= 100) {
      // Only detect column matches for small datasets (<=100 tables)
      columnMatches = await this.detectColumnMatches(tables);
      etlPatterns = SqlServerMetadataExtractor.detectEtlPatterns(tables);
      namingConventions = SqlServerMetadataExtractor.detectNamingConventions(tables);
    } else {
      // For large datasets, skip column analysis but still detect ETL patterns
      if (tables.length <= 200) {
        console.log(`Limited column-level analysis for ${tables.length} tables (lite mode for mid-size extraction)`);
      }
      this.metadata.extractionWarnings.push({
        code: 'LITE_MODE_ENABLED',
        message: `Column-level relationship detection skipped for ${tables.length} tables. Column metadata extracted but not cross-table matched.`,
      });
    }

    // Combine and deduplicate
    const allRelationships = [...fks, ...columnMatches, ...etlPatterns, ...namingConventions];
    const allObjects = [
      ...tables,
      ...viewsWithDependencies,
      ...storedProceduresWithDependencies,
      ...functionsWithDependencies,
      ...triggersWithDependencies,
    ];
    const researchReport = SqlServerMetadataExtractor.buildCoverageResearchReport({
      inventory: objectInventory,
      extracted: {
        tables: tables.length,
        views: views.length,
        storedProcedures: storedProcedures.length,
        functions: functions.length,
        triggers: triggers.length,
      },
      relationshipCount: allRelationships.length,
      columnLineageEnabled: columnExtractionEnabled,
    });

    this.metadata = {
      database,
      tables,
      views: viewsWithDependencies,
      storedProcedures: storedProceduresWithDependencies,
      functions: functionsWithDependencies,
      triggers: triggersWithDependencies,
      allObjects,
      objectInventory,
      researchReport,
      columnsByTable,
      columnsByView,
      objectDependencies,
      relationships: allRelationships,
      extractionWarnings: this.metadata.extractionWarnings,
      extractedAt: new Date().toISOString(),
    };

    return this.metadata;
  }

  /**
   * Get metadata
   */
  getMetadata() {
    return this.metadata;
  }
}

export { ConfidenceScores };
export default SqlServerMetadataExtractor;
