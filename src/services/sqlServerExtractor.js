/**
 * SQL Server Metadata Extractor & Lineage Detector
 * Extracts table, column, and relationship metadata from SQL Server
 * Detects data lineage with confidence scoring
 */

import mssql from 'mssql';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { Parser } = require('node-sql-parser');

const parser = new Parser();


/**
 * Extract table references from SQL text using an AST-first strategy.
 *
 * Why AST here:
 * - Regex-based SQL parsing is brittle for T-SQL because nested queries,
 *   CTEs, derived tables, and vendor-specific hints often defeat simple
 *   pattern matching.
 * - `node-sql-parser` gives us a structured parse tree and a built-in
 *   table reference inventory via `parser.tableList(...)`.
 *
 * Fallback behavior:
 * - If the parser cannot understand the SQL dialect or a T-SQL quirk,
 *   we return an empty array rather than hallucinating references.
 * - That keeps lineage conservative and avoids false positives.
 *
 * @param {string} sqlText - Raw SQL batch / procedure body / query text.
 * @param {string} defaultServer - Fallback server name when the AST does not expose one.
 * @param {string} defaultDatabase - Fallback database name when the AST does not expose one.
 * @param {string} defaultSchema - Fallback schema name; defaults to dbo.
 * @returns {Array<{server: string, database: string, schema: string, object: string}>}
 */
export function extractTablesFromSQL(sqlText, defaultServer, defaultDatabase, defaultSchema = 'dbo') {
  // Keep the parser invocation isolated so unsupported dialect quirks do not
  // impact the rest of the extractor.
  let tableList = [];
  try {
    tableList = parser.tableList(sqlText, { database: 'transactsql' }) || [];
  } catch (err) {
    const fallback = fallbackSqlEntities(sqlText);
    if (fallback.length > 0) {
      tableList = fallback;
    } else {
      console.warn(
        `Warning: AST tableList extraction failed in extractTablesFromSQL; returning empty table list. Reason: ${String(
          err?.message || err
        )}`
      );
      return [];
    }
  }

  const seen = new Set();
  const results = [];

  for (const entry of tableList) {
    const record = parseSqlObjectReference(entry, defaultServer, defaultDatabase, defaultSchema);
    if (!record.object) continue;

    const key = `${record.server}.${record.database}.${record.schema}.${record.object}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(record);
  }

  return results;
}

function parseSqlObjectReference(reference, defaultServer, defaultDatabase, defaultSchema = 'dbo') {
  const text = String(reference || '').trim();
  if (!text) {
    return { server: '', database: '', schema: '', object: '' };
  }

  if (text.includes('::')) {
    const parts = text.split('::').map((part) => part.trim()).filter(Boolean);
    const qualifier = parts.length >= 3 ? parts[1] : '';
    const objectName = parts.length >= 3 ? parts[2] : parts[3] || '';
    const qualifierParts = qualifier.split('.').filter(Boolean);

    if (qualifierParts.length >= 3) {
      return {
        server: qualifierParts[0],
        database: qualifierParts[1],
        schema: qualifierParts[2],
        object: String(objectName || '').trim(),
      };
    }

    if (qualifierParts.length === 2) {
      return {
        server: String(defaultServer || '').trim(),
        database: qualifierParts[0],
        schema: qualifierParts[1],
        object: String(objectName || '').trim(),
      };
    }

    const schemaName = qualifierParts[0] || (parts.length >= 4 ? parts[2] : defaultSchema);
    let dbName = defaultDatabase;
    if (parts.length >= 4 && parts[1] && parts[1] !== 'null') {
      dbName = parts[1];
    }
    return {
      server: String(defaultServer || '').trim(),
      database: String(dbName || defaultDatabase || '').trim(),
      schema: String(schemaName || defaultSchema || 'dbo').trim(),
      object: String(objectName || '').trim(),
    };
  }

  const normalized = String(reference || '')
    .trim()
    .replace(/\]\.\[/g, '.')
    .replace(/\[|\]/g, '')
    .replace(/\s+/g, ' ');
  const parts = normalized.split('.').map((part) => part.trim()).filter(Boolean);

  if (parts.length >= 4) {
    return {
      server: parts[0],
      database: parts[1],
      schema: parts[2],
      object: parts.slice(3).join('.'),
    };
  }

  if (parts.length === 3) {
    return {
      server: String(defaultServer || '').trim(),
      database: parts[0],
      schema: parts[1],
      object: parts[2],
    };
  }

  if (parts.length === 2) {
    return {
      server: String(defaultServer || '').trim(),
      database: String(defaultDatabase || '').trim(),
      schema: parts[0],
      object: parts[1],
    };
  }

  return {
    server: String(defaultServer || '').trim(),
    database: String(defaultDatabase || '').trim(),
    schema: String(defaultSchema || 'dbo').trim(),
    object: parts[0] || '',
  };
}

function fallbackSqlEntities(sqlText) {
  const text = stripSqlComments(sqlText).replace(/[\r\n\t]/g, ' ');
  const patterns = [
    /\b(?:FROM|JOIN|INSERT\s+INTO|UPDATE|MERGE\s+INTO)\s+([A-Za-z0-9_[\].]+)/gi,
    /\b(?:EXEC(?:UTE)?)\s+([A-Za-z0-9_[\].]+)/gi,
  ];
  const refs = [];
  for (const pattern of patterns) {
    let match = pattern.exec(text);
    while (match) {
      refs.push(match[1]);
      match = pattern.exec(text);
    }
  }
  return [...new Set(refs)];
}

function stripSqlComments(sqlText) {
  return String(sqlText || '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--[^\r\n]*/g, ' ');
}


/**
 * Standard ETL, Metadata, and Audit columns to exclude from automated lineage detection
 * to prevent false-positive relationships between tables.
 */
const EXCLUDED_LINEAGE_COLUMNS = [
  'ETLEXECUTION_ID', 'ETLEXECUTIONID', 'FILEPROCESSEDLOGID', 'META_ACTIONFLAG', 
  'META_LASTDMLACTION', 'META_ROWLASTDMLACTION', 'META_SRC_SYS_ID', 'METASRC_SYS_ID', 
  'META_SRCSYSID', 'META_SOURCESYSTEMNAME', 'METASOURCESYSTEMNAME', 'META_COMPUTERNAME', 
  'METACOMPUTERNAME', 'META_SOURCEFILENAME', 'META_LOADDATE', 'METALOADDATE', 
  'META_SYSTEMLOADDATE', 'META_ROWEFFECTIVEDATE', 'METAROWEFFECTIVEDATE', 
  'META_ROWEXPIREDDATE', 'METAROWEXPIREDDATE', 'META_ROWISCURRENT', 'METAROWISCURRENT', 
  'META_ROWLASTCHANGEDDATE', 'METAROWLASTCHANGEDDATE', 'META_ROWLASTCHANGEDATE', 
  'META_ROWLLASTCHANGEDDATE', 'META_LASTMODIFIEDDATE', 'SYSSTARTTIME', 'SYSENDTIME',
  'CREATED', 'CREATEDDATE', 'CREATEDON', 'ROWCREATEDATE', 'CREATEDBY', 'CREATEDBYUSERNAME', 
  'UPDATED', 'UPDATEDDATE', 'UPDATEDON', 'MODIFIEDDATE', 'MODIFIEDON', 'MODIFIEDBY', 
  'MODIFIEDBYUSERNAME', 'USER_ID', 'USERID', 'META_USERID', 'METAUSERID', 
  'META_USERCHANGEID', 'META_LASTCHANGEUSERNAME', 'META_AUDITKEY', 'METAAUDITKEY', 
  'META_AUDITSCORE', 'METAAUDITSCORE', 'META_CHECKSUM', 'METACHECKSUM', 'CHECKSUMHASH', 
  'META_CHECKSUM_TYPE1', 'META_CHECKSUM_TYPE2', 'META_NATURALKEY', 'METANATURALKEY', 
  'METANATURALKEYU'
];

/**
 * Confidence scoring for detected relationships
 * Scale: 1.0 (definitive) to 0.0 (reject)
 */
const ConfidenceScores = {
  PRIMARY_TO_FOREIGN_KEY: 1.0, // Explicit FK constraint on PK
  FOREIGN_KEY_UNIQUE: 0.95, // FK on UNIQUE key (not PK)
  EXACT_COLUMN_MATCH: 0.8, // Both tables have "customer_id"
  NAMING_CONVENTION: 0.7, // Pattern-based (e.g., {table}_id)
  SEMANTIC_MATCH: 0.65, // "CustomerID" <-> "Cust_ID"
  ETL_PATTERN: 0.75, // Staging/SCD/CDC patterns detected
  SCHEMA_GROUPING: 0.4, // Same schema prefix
  CARDINALITY_MATCH: 0.5, // Row counts suggest relationship
  COMPOSITE_KEY: 0.75, // Multi-column key match
  SELF_JOIN: 0.85, // Hierarchy/parent-child detected
  SOFT_DELETE_PATTERN: 0.6, // is_deleted, status='inactive'
  MANY_TO_MANY_BRIDGE: 0.75, // Composite PK + 2 FKs
  DIRECT_LOAD: 0.95, // Explicit INSERT/MERGE target discovered in procedure text
};

const SQL_NOISE_TOKENS = new Set([
  'into',
  'data',
  'lower',
  'upper',
  'trim',
  'ltrim',
  'rtrim',
  'isnull',
  'coalesce',
  'case',
  'when',
  'then',
  'else',
  'end',
  'select',
  'from',
  'join',
  'on',
  'and',
  'or',
  'not',
  'the',
  'statement',
  'cte_source',
]);

class SqlServerMetadataExtractor {
  constructor(connectionConfig, sqlDriver = mssql) {
    this.config = connectionConfig;
    this.sqlDriver = sqlDriver;
    this.pool = null;
    this.metadata = {
      serverName: SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
      tables: new Map(),
      views: new Map(),
      synonyms: new Map(),
      storedProcedures: new Map(),
      relationships: [],
      extractionWarnings: [],
      objectInventory: null,
      researchReport: null,
    };
  }

  static isPermissionIssue(err) {
    const message = String(err?.message || '').toLowerCase();
    return (
      message.includes('does not have permission') ||
      message.includes('permission was denied') ||
      message.includes('view database state') ||
      message.includes('dm_db_partition_stats')
    );
  }

  static normalizeSqlReference(value) {
    return String(value ?? '')
      .trim()
      .replace(/^"+|"+$/g, '')
      .replace(/^'+|'+$/g, '')
      .replace(/\]\.\[/g, '.')
      .replace(/\[|\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static isNoiseSqlReference(reference) {
    const value = SqlServerMetadataExtractor.normalizeSqlReference(reference).toLowerCase();
    if (!value) return true;
    if (SQL_NOISE_TOKENS.has(value)) return true;
    const parts = value.split('.').filter(Boolean);
    if (
      parts.length === 2 &&
      ['source', 'target', 'src', 'inserted', 'deleted'].includes(parts[0])
    ) {
      return true;
    }
    if (value.startsWith('#')) return true;
    if (value.startsWith('@')) return true;
    if (value.includes('doc_proj')) return true;
    if (value.includes('ad_actuals')) return true;
    if (value.includes('lower(') || value.includes('upper(')) return true;
    return false;
  }

  static normalizeSqlObjectId(reference) {
    const normalized = SqlServerMetadataExtractor.normalizeSqlReference(reference);
    if (!normalized) return '';
    const parts = normalized.split('.').filter(Boolean);
    if (parts.length >= 4) {
      return `${parts[parts.length - 4]}.${parts[parts.length - 3]}.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    }
    if (parts.length === 3) {
      return `${parts[0]}.${parts[1]}.${parts[2]}`;
    }
    if (parts.length === 2) {
      return `${parts[0]}.${parts[1]}`;
    }
    return normalized;
  }

  static qualifySqlObjectId(serverName, databaseName, schemaName, objectName) {
    const server = SqlServerMetadataExtractor.normalizeSqlReference(serverName);
    const db = SqlServerMetadataExtractor.normalizeSqlReference(databaseName);
    const schema = SqlServerMetadataExtractor.normalizeSqlReference(schemaName);
    const obj = SqlServerMetadataExtractor.normalizeSqlReference(objectName);

    if (server && db && schema && obj) {
      return `${server}.${db}.${schema}.${obj}`;
    }
    if (db && schema && obj) {
      return `${db}.${schema}.${obj}`;
    }
    if (schema && obj) {
      return `${schema}.${obj}`;
    }
    return obj || schema || db || server || '';
  }

  static extractServerNameFromConfig(config = {}) {
    const serverName =
      config.server ||
      config.serverName ||
      config.dataSource ||
      config.host ||
      config.connectionString?.match(/(?:Data Source|Server)\s*=\s*([^;]+)/i)?.[1] ||
      '';

    return SqlServerMetadataExtractor.canonicalizeServerName(serverName);
  }

  static canonicalizeServerName(value) {
    const text = SqlServerMetadataExtractor.normalizeSqlReference(value)
      .replace(/^tcp:/i, '')
      .replace(/^np:/i, '')
      .replace(/^lpc:/i, '')
      .trim();

    if (!text) return '';

    const [hostName] = text.split('\\');
    return String(hostName || text).trim();
  }

  static normalizeSqlReferenceWithServer(
    reference,
    fallbackServer = '',
    defaultDatabase = '',
    defaultSchema = 'dbo'
  ) {
    const normalized = SqlServerMetadataExtractor.normalizeSqlReference(reference);
    if (!normalized) return '';

    const parts = normalized.split('.').filter(Boolean);
    if (parts.length >= 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3]}`;
    }
    if (parts.length === 3) {
      const server = SqlServerMetadataExtractor.normalizeSqlReference(fallbackServer);
      return [server, parts[0], parts[1], parts[2]].filter(Boolean).join('.');
    }
    if (parts.length === 2) {
      const server = SqlServerMetadataExtractor.normalizeSqlReference(fallbackServer);
      const db = SqlServerMetadataExtractor.normalizeSqlReference(defaultDatabase);
      return [server, db, parts[0], parts[1]].filter(Boolean).join('.');
    }
    if (parts.length === 1) {
      const server = SqlServerMetadataExtractor.normalizeSqlReference(fallbackServer);
      const db = SqlServerMetadataExtractor.normalizeSqlReference(defaultDatabase);
      const schema = SqlServerMetadataExtractor.normalizeSqlReference(defaultSchema);
      return [server, db, schema, parts[0]].filter(Boolean).join('.');
    }
    return normalized;
  }

  static isFourPartReference(reference) {
    const normalized = SqlServerMetadataExtractor.normalizeSqlReference(reference);
    if (!normalized) return false;
    const parts = normalized.split('.').filter(Boolean);
    return parts.length >= 4;
  }

  static extractOpenQueryLiteral(definition = '') {
    const text = String(definition || '');
    const match = text.match(/\bOPENQUERY\s*\(\s*([^,]+)\s*,\s*('(?:''|[^'])*')/i);
    if (!match) return '';
    return `${String(match[1] || '').trim()}, ${String(match[2] || '').trim()}`.trim();
  }

  static extractSourceClausesFromInsert(definition = '') {
    const text = stripSqlComments(definition).replace(/[\r\n\t]+/g, ' ');
    const sources = [];
    const insertSelectMatch = text.match(
      /\bINSERT\s+INTO\b[\s\S]*?\bSELECT\b([\s\S]*?)(?=\b(?:INSERT\s+INTO|MERGE\b|UPDATE\b|DELETE\b|;|$))/i
    );
    if (insertSelectMatch) {
      sources.push(insertSelectMatch[1]);
    }
    const mergeUsingMatch = text.match(
      /\bMERGE\b[\s\S]*?\bUSING\b\s+([\s\S]*?)(?=\bON\b|\bWHEN\b|$)/i
    );
    if (mergeUsingMatch) {
      sources.push(mergeUsingMatch[1]);
    }
    return sources.filter(Boolean);
  }

  static extractTableReferencesFromClause(clause = '', defaultServer = '', defaultDatabase = '') {
    const normalizedClause = stripSqlComments(clause);
    const refs = [];
    const pattern = /\b(?:FROM|JOIN|USING)\s+((?:\[[^\]]+\]|\w+)(?:\s*\.\s*(?:\[[^\]]+\]|\w+)){0,4}|OPENQUERY\s*\(\s*[^,]+,\s*'(?:''|[^'])*'\s*\))/gi;
    let match = pattern.exec(normalizedClause);
    while (match) {
      refs.push(match[1]);
      match = pattern.exec(normalizedClause);
    }

    return Array.from(
      new Set(
        refs
          .map((ref) => {
            const openQuery = SqlServerMetadataExtractor.extractOpenQueryLiteral(ref);
            if (openQuery) {
              return {
                reference: openQuery,
                validationFlag: 'REQUIRES_CATALOG_VALIDATION',
                isOpenQuery: true,
              };
            }
            const normalized = SqlServerMetadataExtractor.normalizeSqlReferenceWithServer(
              ref,
              defaultServer,
              defaultDatabase
            );
            return {
              reference: normalized,
              validationFlag: SqlServerMetadataExtractor.isFourPartReference(normalized)
                ? 'REQUIRES_CATALOG_VALIDATION'
                : '',
              isOpenQuery: false,
            };
          })
          .filter((item) => item.reference && !SqlServerMetadataExtractor.isNoiseSqlReference(item.reference))
          .map((item) => JSON.stringify(item))
      )
    ).map((item) => JSON.parse(item));
  }

  static extractWriteTargetsFromDefinition(definition = '', defaultServer = '', defaultDatabase = '') {
    const targets = [];
    const sql = stripSqlComments(definition);
    const pattern =
      /\b(?:INSERT\s+INTO|MERGE(?:\s+INTO)?)\s+((?:\[[^\]]+\]|\w+)(?:\s*\.\s*(?:\[[^\]]+\]|\w+)){0,4})(?=\s*(?:\(|AS\b|USING\b|WHEN\b|OUTPUT\b|SELECT\b|VALUES\b|SET\b|$))/gi;
    let match = pattern.exec(sql);
    while (match) {
      targets.push(match[1]);
      match = pattern.exec(sql);
    }
    return Array.from(
      new Set(
        targets
          .map((target) =>
            SqlServerMetadataExtractor.normalizeSqlReferenceWithServer(
              target,
              defaultServer,
              defaultDatabase
            )
          )
          .map((target) => target.replace(/\s+/g, ' '))
          .map((target) => target.replace(/\bAS\b.*$/i, '').trim())
          .filter((target) => target && !SqlServerMetadataExtractor.isNoiseSqlReference(target))
      )
    );
  }

  static detectProcedureLoadRelationships(procedures = []) {
    const relationships = [];

    for (const proc of procedures) {
      const procServer = SqlServerMetadataExtractor.extractServerNameFromConfig(proc);
      const procDatabase = proc.database || '';
      const writes = SqlServerMetadataExtractor.extractWriteTargetsFromDefinition(
        proc.definition || '',
        procServer,
        procDatabase
      );
      const procId =
        proc.id ||
        SqlServerMetadataExtractor.qualifySqlObjectId(
          procServer,
          procDatabase,
          proc.schema,
          proc.name
        );

      for (const target of writes) {
        relationships.push({
          id: `${procId}->${target}:loads`,
          fromTable: procId,
          toTable: target,
          source: procId,
          target,
          confidence: ConfidenceScores.DIRECT_LOAD,
          type: 'loads',
          evidence: `Procedure ${procId} writes to ${target} via INSERT/MERGE`,
          validationFlags: SqlServerMetadataExtractor.isFourPartReference(target)
            ? ['REQUIRES_CATALOG_VALIDATION']
            : [],
        });
      }

      const sourceClauses = SqlServerMetadataExtractor.extractSourceClausesFromInsert(
        proc.definition || ''
      );
      if (/\bINSERT\s+INTO\b[\s\S]*?\bVALUES\s*\(/i.test(proc.definition || '')) {
        relationships.push({
          id: `${procId}->LITERAL_VALUE:loads`,
          fromTable: 'LITERAL_VALUE',
          toTable: procId,
          source: 'LITERAL_VALUE',
          target: procId,
          confidence: ConfidenceScores.DIRECT_LOAD,
          type: 'loads',
          evidence: `Procedure ${procId} inserts literal VALUES content`,
        });
      }
      for (const clause of sourceClauses) {
        const clauseRefs = SqlServerMetadataExtractor.extractTableReferencesFromClause(
          clause,
          procServer,
          procDatabase
        );
        if (clauseRefs.length === 0 && /\bVALUES\s*\(/i.test(clause)) {
          relationships.push({
            id: `${procId}->LITERAL_VALUE:loads`,
            fromTable: 'LITERAL_VALUE',
            toTable: procId,
            source: 'LITERAL_VALUE',
            target: procId,
            confidence: ConfidenceScores.DIRECT_LOAD,
            type: 'loads',
            evidence: `Procedure ${procId} loads from literal VALUES content`,
          });
          continue;
        }

        for (const source of clauseRefs) {
          const validationFlags = [];
          if (source.validationFlag) validationFlags.push(source.validationFlag);
          relationships.push({
            id: `${source.reference}->${procId}:reads`,
            fromTable: source.reference,
            toTable: procId,
            source: source.reference,
            target: procId,
            confidence: ConfidenceScores.DIRECT_LOAD,
            type: 'reads',
            evidence: `Procedure ${procId} reads from ${source.reference} in INSERT/MERGE source clause`,
            validationFlags,
          });
        }
      }

      const openQueryLiteral = SqlServerMetadataExtractor.extractOpenQueryLiteral(proc.definition || '');
      if (openQueryLiteral) {
        relationships.push({
          id: `${openQueryLiteral}->${procId}:reads`,
          fromTable: openQueryLiteral,
          toTable: procId,
          source: openQueryLiteral,
          target: procId,
          confidence: ConfidenceScores.DIRECT_LOAD,
          type: 'reads',
          evidence: `Procedure ${procId} references OPENQUERY source ${openQueryLiteral}`,
          validationFlags: ['REQUIRES_CATALOG_VALIDATION'],
        });
      }
    }

    return relationships;
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
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
      SELECT 
        SCHEMA_NAME(t.schema_id) as schema_name,
        t.name as table_name,
        t.type as table_type,
        CAST(ep.value AS NVARCHAR(MAX)) as table_description,
        SUM(ps.row_count) as row_count,
        SUM(ps.reserved_page_count) * 8 as size_kb
      FROM sys.tables t
      LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id 
        AND ep.minor_id = 0 AND ep.class = 1
      LEFT JOIN sys.dm_db_partition_stats ps ON ps.object_id = t.object_id 
        AND ps.index_id IN (0, 1)
      GROUP BY t.schema_id, t.name, t.type, CAST(ep.value AS NVARCHAR(MAX))
      ORDER BY SCHEMA_NAME(t.schema_id), t.name
    `;

    const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));
    const selectedTables = new Set((scope.tables || []).map((t) => t.toLowerCase()));
    const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
    const excludeTables = new Set((scope.excludeTables || []).map((t) => t.toLowerCase()));

    try {
      const result = await this.pool.request().query(query);
      const filteredRows = result.recordset.filter((row) => {
        const schemaName = String(row.schema_name || '').toLowerCase();
        const schemaTableId = `${schemaName}.${row.table_name}`.toLowerCase();
        
        // Exclusions take priority
        if (excludeSchemas.has(schemaName) || excludeTables.has(schemaTableId)) return false;

        const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
        const tableMatch = selectedTables.size === 0 || selectedTables.has(schemaTableId);
        return schemaMatch && tableMatch;
      });

      return filteredRows.map((row) => ({
        id: SqlServerMetadataExtractor.qualifySqlObjectId(
          SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
          this.metadata.database || this.config?.database || '',
          row.schema_name,
          row.table_name
        ),
        name: row.table_name,
        schema: row.schema_name,
        type: String(row.table_type).trim() === 'U' ? 'table' : 'view',
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
      const filteredRows = fallback.recordset.filter((row) => {
        const schemaName = String(row.schema_name || '').toLowerCase();
        const schemaTableId = `${schemaName}.${row.table_name}`.toLowerCase();
        
        if (excludeSchemas.has(schemaName) || excludeTables.has(schemaTableId)) return false;

        const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
        const tableMatch = selectedTables.size === 0 || selectedTables.has(schemaTableId);
        return schemaMatch && tableMatch;
      });

      this.metadata.extractionWarnings.push({
        code: 'MISSING_VIEW_DATABASE_STATE',
        message: 'Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.',
      });

      return filteredRows.map((row) => ({
        id: SqlServerMetadataExtractor.qualifySqlObjectId(
          SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
          this.metadata.database || this.config?.database || '',
          row.schema_name,
          row.table_name
        ),
        name: row.table_name,
        schema: row.schema_name,
        type: String(row.table_type).trim() === 'U' ? 'table' : 'view',
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
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
      SELECT
        SCHEMA_NAME(t.schema_id) as schema_name,
        t.name as table_name
      FROM sys.tables t WITH (NOLOCK)
      ORDER BY SCHEMA_NAME(t.schema_id), t.name
    `;

    const result = await this.pool.request().query(query);
    const tables = result.recordset.map((row) => ({
      id: SqlServerMetadataExtractor.qualifySqlObjectId(
        SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
        this.metadata.database || this.config?.database || '',
        row.schema_name,
        row.table_name
      ),
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
   */
  async listAllObjectsByType() {
    const query = `
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
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
      FROM sys.objects o WITH (NOLOCK)
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
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
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
      table: 0, view: 0, storedProcedure: 0, scalarFunction: 0, inlineTableFunction: 0,
      tableFunction: 0, trigger: 0, synonym: 0, sequence: 0, tableType: 0, other: 0,
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
      const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
      
      const filteredRows = result.recordset.filter((row) => {
        const schemaName = String(row.schema_name || '').toLowerCase();
        if (excludeSchemas.has(schemaName)) return false;
        return selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
      });

      filteredRows.forEach((row) => {
        const normalizedType = mapType(row.object_type);
        typeSummary[normalizedType] = (typeSummary[normalizedType] || 0) + (row.object_count || 0);
      });

      typeSummary.total = Object.values(typeSummary).reduce((sum, count) => sum + (Number(count) || 0), 0);
      return typeSummary;
    } catch (err) {
      console.error('Error extracting object inventory:', err.message);
      return { ...typeSummary, total: 0, inventoryUnavailable: true };
    }
  }

  static buildCoverageResearchReport({ inventory, extracted, relationshipCount, columnLineageEnabled }) {
    const expectedFunctions = (inventory.scalarFunction || 0) + (inventory.inlineTableFunction || 0) + (inventory.tableFunction || 0);
    const extractedCoreTotal = (extracted.tables || 0) + (extracted.views || 0) + (extracted.storedProcedures || 0) + (extracted.functions || 0) + (extracted.triggers || 0);
    const expectedCoreTotal = (inventory.table || 0) + (inventory.view || 0) + (inventory.storedProcedure || 0) + expectedFunctions + (inventory.trigger || 0);
    const coveragePercent = expectedCoreTotal > 0 ? Number(((extractedCoreTotal / expectedCoreTotal) * 100).toFixed(2)) : 100;
    
    const missingOrUncaptured = [];
    if ((inventory.table || 0) > (extracted.tables || 0)) missingOrUncaptured.push('Some tables were not extracted (scope filtering or permissions).');
    if ((inventory.view || 0) > (extracted.views || 0)) missingOrUncaptured.push('Some views were not extracted.');
    if ((inventory.storedProcedure || 0) > (extracted.storedProcedures || 0)) missingOrUncaptured.push('Some stored procedures were not extracted.');
    if (expectedFunctions > (extracted.functions || 0)) missingOrUncaptured.push('Some functions were not extracted (FN/IF/TF).');
    if ((inventory.trigger || 0) > (extracted.triggers || 0)) missingOrUncaptured.push('Some triggers were not extracted.');
    if ((inventory.synonym || 0) > 0) missingOrUncaptured.push(`Synonyms detected (${inventory.synonym}) but not currently modeled for lineage.`);
    if ((inventory.sequence || 0) > 0) missingOrUncaptured.push(`Sequences detected (${inventory.sequence}) but not currently modeled in markdown output.`);
    if ((inventory.tableType || 0) > 0) missingOrUncaptured.push(`User-defined table types detected (${inventory.tableType}) but not currently extracted.`);

    const recommendations = [
      'Add column-level extraction to markdown output for table-level lineage validation.',
      'Add dependency extraction from sys.sql_expression_dependencies for view/procedure/function lineage.',
      'Add support for synonyms and sequences to improve completeness.',
    ];

    if (!columnLineageEnabled) {
      recommendations.unshift('Run scoped extraction (smaller schema/table set) with full mode to enable column-level lineage detection.');
    }

    return { coveragePercent, expectedCoreObjects: expectedCoreTotal, extractedCoreObjects: extractedCoreTotal, relationshipCount, columnLineageEnabled, inventory, missingOrUncaptured, recommendations };
  }

  /**
   * Extract index metadata for user tables
   */
  async extractTableIndexes(scope = {}) {
    const query = `
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
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
      const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
      const excludeTables = new Set((scope.excludeTables || []).map((t) => t.toLowerCase()));
      
      const indexesByTable = new Map();

      result.recordset.forEach((row) => {
        const tableId = `${row.schema_name}.${row.table_name}`;
        const tableKey = tableId.toLowerCase();
        const schemaName = String(row.schema_name || '').toLowerCase();
        
        if (excludeSchemas.has(schemaName) || excludeTables.has(tableKey)) return;

        const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
        const tableMatch = selectedTables.size === 0 || selectedTables.has(tableKey);

        if (!schemaMatch || !tableMatch) return;

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
      const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
      const excludeTables = new Set((scope.excludeTables || []).map((t) => t.toLowerCase()));
      
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
        const schemaName = String(row.schema_name || '').toLowerCase();
        
        if (excludeSchemas.has(schemaName) || excludeTables.has(tableKey)) return;

        const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
        const tableMatch = selectedTables.size === 0 || selectedTables.has(tableKey);

        if (!schemaMatch || !tableMatch) return;

        const bucket = ensureTableBucket(tableId);
        if (row.constraint_type === 'PK') {
          if (!bucket.primaryKey || bucket.primaryKey.name !== row.constraint_name) {
            bucket.primaryKey = { name: row.constraint_name, columns: [] };
          }
          bucket.primaryKey.columns.push({ name: row.column_name, keyOrdinal: row.key_ordinal });
        } else if (row.constraint_type === 'UQ') {
          let uq = bucket.uniqueConstraints.find((item) => item.name === row.constraint_name);
          if (!uq) {
            uq = { name: row.constraint_name, columns: [] };
            bucket.uniqueConstraints.push(uq);
          }
          uq.columns.push({ name: row.column_name, keyOrdinal: row.key_ordinal });
        }
      });

      checkConstraints.recordset.forEach((row) => {
        const tableId = `${row.schema_name}.${row.table_name}`;
        const tableKey = tableId.toLowerCase();
        const schemaName = String(row.schema_name || '').toLowerCase();
        
        if (excludeSchemas.has(schemaName) || excludeTables.has(tableKey)) return;

        const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
        const tableMatch = selectedTables.size === 0 || selectedTables.has(tableKey);

        if (!schemaMatch || !tableMatch) return;

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
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
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
      const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
      
      const parameterMap = new Map();

      result.recordset.forEach((row) => {
        const routineKey = `${row.schema_name}.${row.routine_name}`;
        const schemaName = String(row.schema_name || '').toLowerCase();
        
        if (excludeSchemas.has(schemaName)) return;

        const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
        if (!schemaMatch) return;

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
        SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
        SELECT DISTINCT
          SCHEMA_NAME(o1.schema_id) as schema_name,
          o1.name as object_name,
          o1.type as object_type,
          sed.referenced_server_name as referenced_server_name,
          sed.referenced_database_name as referenced_database_name,
          sed.referenced_schema_name as referenced_schema_name,
          sed.referenced_entity_name as referenced_entity_name,
          SCHEMA_NAME(o2.schema_id) as referenced_schema,
          o2.name as referenced_object,
          o2.type as referenced_type
        FROM sys.sql_expression_dependencies sed
        JOIN sys.objects o1 ON sed.referencing_id = o1.object_id
        LEFT JOIN sys.objects o2 ON sed.referenced_id = o2.object_id
        WHERE o1.is_ms_shipped = 0
          AND (o2.is_ms_shipped = 0 OR o2.object_id IS NULL)
        ORDER BY SCHEMA_NAME(o1.schema_id), o1.name
      `;

    try {
      const result = await this.pool.request().query(query);
      const depsByObject = new Map();
      const scopedObjects = new Set(
        (objects || []).flatMap((obj) => [
          `${obj.schema}.${obj.name}`.toLowerCase(),
          String(obj.id || '').toLowerCase(),
        ])
      );

      result.recordset.forEach((row) => {
        const objKey = SqlServerMetadataExtractor.qualifySqlObjectId(
          SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
          this.metadata.database || this.config?.database || '',
          row.schema_name,
          row.object_name
        );
        const schemaObjectKey = `${row.schema_name}.${row.object_name}`.toLowerCase();
        if (
          scopedObjects.size > 0 &&
          !scopedObjects.has(objKey.toLowerCase()) &&
          !scopedObjects.has(schemaObjectKey)
        ) {
          return;
        }
        if (!depsByObject.has(objKey)) {
          depsByObject.set(objKey, []);
        }
        const referencedObject = SqlServerMetadataExtractor.qualifySqlObjectId(
          row.referenced_server_name ||
            SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
          row.referenced_database_name || this.metadata.database || this.config?.database || '',
          row.referenced_schema || row.referenced_schema_name || 'dbo',
          row.referenced_object || row.referenced_entity_name
        );
        depsByObject.get(objKey).push({
          referencedSchema: row.referenced_schema,
          referencedObject,
          referencedType: row.referenced_type,
          referencedServer: row.referenced_server_name || null,
          referencedDatabase: row.referenced_database_name || null,
          referencedEntity: row.referenced_entity_name || null,
        });
      });

      return depsByObject;
    } catch (err) {
      console.error('Error extracting object dependencies:', err.message);
      return new Map();
    }
  }

  /**
   * Bulk Extract columns for all tables and views in one single query.
   * Eliminates the N+1 query problem.
   */
  async extractAllColumns(scope = {}) {
    const query = `
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
      SELECT 
        SCHEMA_NAME(o.schema_id) as schema_name,
        o.name as object_name,
        c.name as column_name,
        t.name as data_type,
        c.max_length,
        c.is_nullable,
        c.is_identity,
        c.is_computed,
        cc.definition as computed_definition,
        CAST(ep.value AS NVARCHAR(MAX)) as column_description,
        dc.definition as default_definition
      FROM sys.objects o
      JOIN sys.columns c ON o.object_id = c.object_id
      JOIN sys.types t ON c.user_type_id = t.user_type_id
      LEFT JOIN sys.computed_columns cc ON cc.object_id = c.object_id AND cc.column_id = c.column_id
      LEFT JOIN sys.extended_properties ep ON ep.major_id = c.object_id AND ep.minor_id = c.column_id AND ep.class = 1
      LEFT JOIN sys.default_constraints dc ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
      WHERE o.type IN ('U', 'V') AND o.is_ms_shipped = 0
      ORDER BY SCHEMA_NAME(o.schema_id), o.name, c.column_id
    `;

    try {
      const result = await this.pool.request().query(query);

      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));
      const selectedTables = new Set((scope.tables || []).map((t) => t.toLowerCase()));
      const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
      const excludeTables = new Set((scope.excludeTables || []).map((t) => t.toLowerCase()));
      
      const columnsByObject = new Map();

        result.recordset.forEach((row) => {
        const objectId = SqlServerMetadataExtractor.qualifySqlObjectId(
          SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
          this.metadata.database || this.config?.database || '',
          row.schema_name,
          row.object_name
        );
        const objectKey = objectId.toLowerCase();
        const schemaName = String(row.schema_name || '').toLowerCase();
        
        if (excludeSchemas.has(schemaName) || excludeTables.has(objectKey)) return;

        // Only keep objects that are in the user's selected scope
        const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
        const tableMatch = selectedTables.size === 0 || selectedTables.has(objectKey);

        if (!schemaMatch || !tableMatch) return;

        if (!columnsByObject.has(objectId)) {
          columnsByObject.set(objectId, []);
        }

        columnsByObject.get(objectId).push({
          name: row.column_name,
          dataType: row.data_type,
          maxLength: row.max_length,
          isNullable: row.is_nullable,
          isIdentity: row.is_identity,
          isComputed: row.is_computed,
          computedDefinition: row.computed_definition,
          description: row.column_description || '',
          defaultValue: row.default_definition,
        });
      });

      return columnsByObject;
    } catch (err) {
      console.error('Error extracting all columns:', err.message);
      this.metadata.extractionWarnings.push({
        code: 'COLUMN_EXTRACTION_FAILED',
        message: err.message,
      });
      return new Map();
    }
  }

  /**
   * Extract all primary keys
   */
  async extractPrimaryKeys(schema, table) {
    const query = `
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
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
      console.error(`Error extracting primary keys for ${schema}.${table}:`, err.message);
      return [];
    }
  }

  /**
   * Extract all stored procedures
   */
  async extractStoredProcedures(scope = {}) {
    const query = `
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
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
      const selectedTables = new Set((scope.tables || []).map((t) => t.toLowerCase()));
      const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
      const excludeTables = new Set((scope.excludeTables || []).map((t) => t.toLowerCase()));

      return result.recordset
        .filter((row) => {
          const schemaName = String(row.schema_name || '').toLowerCase();
          const objectId = `${schemaName}.${row.procedure_name}`.toLowerCase();
          if (excludeSchemas.has(schemaName) || excludeTables.has(objectId)) return false;
          const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
          const tableMatch = selectedTables.size === 0 || selectedTables.has(objectId);
          return selectedTables.size > 0 ? tableMatch : schemaMatch;
        })
        .map((row) => ({
          id: SqlServerMetadataExtractor.qualifySqlObjectId(
            SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
            this.metadata.database || this.config?.database || '',
            row.schema_name,
            row.procedure_name
          ),
          serverName: SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
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
   * Extract all synonyms
   */
  async extractSynonyms(scope = {}) {
    const query = `
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
      SELECT
        SCHEMA_NAME(s.schema_id) as schema_name,
        s.name as synonym_name,
        s.base_object_name as base_object_name,
        ep.value as synonym_description,
        s.create_date,
        s.modify_date
      FROM sys.synonyms s
      LEFT JOIN sys.extended_properties ep ON ep.major_id = s.object_id
        AND ep.minor_id = 0 AND ep.class = 1
      ORDER BY SCHEMA_NAME(s.schema_id), s.name
    `;

    try {
      const result = await this.pool.request().query(query);
      const selectedSchemas = new Set((scope.schemas || []).map((s) => s.toLowerCase()));
      const selectedTables = new Set((scope.tables || []).map((t) => t.toLowerCase()));
      const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
      const excludeTables = new Set((scope.excludeTables || []).map((t) => t.toLowerCase()));

      return result.recordset
        .filter((row) => {
          const schemaName = String(row.schema_name || '').toLowerCase();
          const objectId = `${schemaName}.${row.synonym_name}`.toLowerCase();
          if (excludeSchemas.has(schemaName) || excludeTables.has(objectId)) return false;

          const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
          const tableMatch = selectedTables.size === 0 || selectedTables.has(objectId);
          return selectedTables.size > 0 ? tableMatch : schemaMatch;
        })
        .map((row) => ({
          id: SqlServerMetadataExtractor.qualifySqlObjectId(
            SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
            this.metadata.database || this.config?.database || '',
            row.schema_name,
            row.synonym_name
          ),
          serverName: SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
          name: row.synonym_name,
          schema: row.schema_name,
          type: 'synonym',
          description: row.synonym_description || '',
          baseObjectName: row.base_object_name || '',
          dependencies: row.base_object_name ? [{ referencedObject: row.base_object_name }] : [],
          createdAt: row.create_date,
          modifiedAt: row.modify_date,
        }));
    } catch (err) {
      console.error('Error extracting synonyms:', err.message);
      return [];
    }
  }

  /**
   * Extract all functions
   */
  async extractFunctions(scope = {}) {
    const query = `
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
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
      const selectedTables = new Set((scope.tables || []).map((t) => t.toLowerCase()));
      const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
      const excludeTables = new Set((scope.excludeTables || []).map((t) => t.toLowerCase()));

      return result.recordset
        .filter((row) => {
          const schemaName = String(row.schema_name || '').toLowerCase();
          const objectId = `${schemaName}.${row.function_name}`.toLowerCase();
          if (excludeSchemas.has(schemaName) || excludeTables.has(objectId)) return false;
          const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
          const tableMatch = selectedTables.size === 0 || selectedTables.has(objectId);
          return selectedTables.size > 0 ? tableMatch : schemaMatch;
        })
        .map((row) => ({
          id: SqlServerMetadataExtractor.qualifySqlObjectId(
            SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
            this.metadata.database || this.config?.database || '',
            row.schema_name,
            row.function_name
          ),
          serverName: SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
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
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
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
      const selectedTables = new Set((scope.tables || []).map((t) => t.toLowerCase()));
      const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
      const excludeTables = new Set((scope.excludeTables || []).map((t) => t.toLowerCase()));

      return result.recordset
        .filter((row) => {
          const schemaName = String(row.schema_name || '').toLowerCase();
          const objectId = `${schemaName}.${row.trigger_name}`.toLowerCase();
          if (excludeSchemas.has(schemaName) || excludeTables.has(objectId)) return false;
          const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
          const tableMatch = selectedTables.size === 0 || selectedTables.has(objectId);
          return selectedTables.size > 0 ? tableMatch : schemaMatch;
        })
        .map((row) => ({
          id: SqlServerMetadataExtractor.qualifySqlObjectId(
            SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
            this.metadata.database || this.config?.database || '',
            row.schema_name,
            row.trigger_name
          ),
          serverName: SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
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
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
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
      const excludeSchemas = new Set((scope.excludeSchemas || []).map((s) => s.toLowerCase()));
      const excludeTables = new Set((scope.excludeTables || []).map((t) => t.toLowerCase()));

      return result.recordset
        .filter((row) => {
          const schemaName = String(row.schema_name || '').toLowerCase();
          const objectId = `${schemaName}.${row.view_name}`.toLowerCase();
          if (excludeSchemas.has(schemaName) || excludeTables.has(objectId)) return false;
          const schemaMatch = selectedSchemas.size === 0 || selectedSchemas.has(schemaName);
          return schemaMatch;
        })
        .map((row) => ({
          id: SqlServerMetadataExtractor.qualifySqlObjectId(
            SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
            this.metadata.database || this.config?.database || '',
            row.schema_name,
            row.view_name
          ),
          serverName: SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
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
      SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
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
        fromTable: SqlServerMetadataExtractor.qualifySqlObjectId(
          SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
          this.metadata.database || this.config?.database || '',
          row.from_schema,
          row.from_table
        ),
        fromColumn: row.from_column,
        toTable: SqlServerMetadataExtractor.qualifySqlObjectId(
          SqlServerMetadataExtractor.extractServerNameFromConfig(this.config),
          this.metadata.database || this.config?.database || '',
          row.to_schema,
          row.to_table
        ),
        toColumn: row.to_column,
        constraintName: row.constraint_name,
        confidence: row.is_not_trusted ? 0.95 : 1.0,
        type: 'explicit_fk',
      }));
    } catch (err) {
      console.error('Error extracting foreign keys:', err.message);
      this.metadata.extractionWarnings.push({
        code: 'FOREIGN_KEY_EXTRACTION_FAILED',
        message: err.message,
      });
      return [];
    }
  }

  /**
   * Detect column-level relationships (same names across tables)
   */
  static detectColumnMatches(tables) {
    const relationships = [];
    const columnIndex = new Map();

    // Build column index by name - columns are already in RAM!
    const columnsByTable = tables.map((table) => ({
      table,
      cols: table.columns || [],
    }));

    for (const { table, cols } of columnsByTable) {
      for (const col of cols) {
        // Exclude standard ETL/Audit columns to prevent false positive lineage
        if (EXCLUDED_LINEAGE_COLUMNS.includes(col.name.toUpperCase())) {
          continue;
        }

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
            if (from.dataType === to.dataType && colName.toLowerCase().includes('id')) {
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
      (t) => t.name.startsWith('stg_') || t.name.startsWith('tmp_') || t.name.startsWith('dim_')
    );

    for (const staging of stagingTables) {
      const baseName = staging.name.replace(/^(stg_|tmp_|dim_)/, '');

      // Look for matching production table
      const prod = tables.find(
        (t) =>
          (t.name === baseName ||
            t.name === `fact_${baseName}` ||
            t.name === baseName.replace(/s$/, '')) &&
          !t.name.startsWith('stg_') &&
          !t.name.startsWith('tmp_')
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
      initialTables,
      synonyms,
      views,
      storedProcedures,
      functions,
      triggers,
      fks,
      objectInventory,
    ] =
      await Promise.all([
        this.extractTables(database, scope),
        this.extractSynonyms(scope),
        this.extractViews(scope),
        this.extractStoredProcedures(scope),
        this.extractFunctions(scope),
        this.extractTriggers(scope),
        this.extractForeignKeys(),
        this.extractObjectTypeInventory(scope),
      ]);
    let tables = initialTables;

    console.log(
      `Found ${tables.length} tables, ${synonyms.length} synonyms, ${views.length} views, ${storedProcedures.length} procs, ${functions.length} functions, ${triggers.length} triggers`
    );

    console.log('Extracting all columns in a single bulk operation...');
    const allColumnsMap = await this.extractAllColumns(scope);

    // Instantly map columns to tables in RAM
    const tablesWithColumns = tables.map((table) => ({
      ...table,
      columns: allColumnsMap.get(table.id) || [],
    }));
    tables = tablesWithColumns;

    // Instantly map columns to views in RAM
    const columnsByView = new Map(); // Keep this reference for the view mapping later
    views.forEach((view) => {
      columnsByView.set(view.id, allColumnsMap.get(view.id) || []);
    });

    const columnExtractionEnabled = true; // Lite Mode is officially dead!

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

    tables = tablesWithGovernanceMetadata;

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
    const attachDependencies = (collection) =>
      collection.map((obj) => {
        const objKey = obj.id;
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

    if (columnExtractionEnabled) {
      // Detect column matches for ALL tables!
      columnMatches = SqlServerMetadataExtractor.detectColumnMatches(tables);
      etlPatterns = SqlServerMetadataExtractor.detectEtlPatterns(tables);
      namingConventions = SqlServerMetadataExtractor.detectNamingConventions(tables);
    }

    const procedureLoads = SqlServerMetadataExtractor.detectProcedureLoadRelationships(
      storedProceduresWithDependencies
    );

    // Combine and deduplicate
    const allRelationships = [
      ...fks,
      ...columnMatches,
      ...etlPatterns,
      ...namingConventions,
      ...procedureLoads,
    ];
    const allObjects = [
      ...tables,
      ...synonyms,
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
      serverName: this.metadata.serverName,
      database,
      tables,
      synonyms,
      views: viewsWithDependencies,
      storedProcedures: storedProceduresWithDependencies,
      functions: functionsWithDependencies,
      triggers: triggersWithDependencies,
      allObjects,
      objectInventory,
      researchReport,
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
