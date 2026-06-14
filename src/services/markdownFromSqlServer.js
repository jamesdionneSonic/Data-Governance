/**
 * Markdown Generator for SQL Server Metadata
 * Converts extracted metadata into governance-ready markdown files
 */
import { applyDictionaryEnrichmentContract } from './markdownEnrichmentContract.js';

function markdownScalar(value) {
  const text = String(value ?? '');
  if (text === '') return '""';
  if (/^[A-Za-z0-9_.-]+$/.test(text)) return text;
  return JSON.stringify(text);
}

function appendYamlValue(lines, key, value, indent = '') {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      lines.push(`${indent}${key}: []`);
      return;
    }

    lines.push(`${indent}${key}:`);
    value.forEach((item) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        lines.push(`${indent}  -`);
        for (const [childKey, childValue] of Object.entries(item)) {
          appendYamlValue(lines, childKey, childValue, `${indent}    `);
        }
      } else {
        lines.push(`${indent}  - ${markdownScalar(item)}`);
      }
    });
    return;
  }

  if (value && typeof value === 'object') {
    lines.push(`${indent}${key}:`);
    for (const [childKey, childValue] of Object.entries(value)) {
      appendYamlValue(lines, childKey, childValue, `${indent}  `);
    }
    return;
  }

  if (typeof value === 'string') {
    lines.push(`${indent}${key}: ${markdownScalar(value)}`);
  } else if (typeof value === 'number') {
    lines.push(`${indent}${key}: ${value}`);
  } else if (typeof value === 'boolean') {
    lines.push(`${indent}${key}: ${value}`);
  } else if (value === null || value === undefined) {
    lines.push(`${indent}${key}: null`);
  }
}

function renderFrontmatter(frontmatter) {
  const yamlLines = [];
  for (const [key, value] of Object.entries(frontmatter)) {
    appendYamlValue(yamlLines, key, value);
  }

  return `---\n${yamlLines.join('\n')}\n---\n\n`;
}

function normalizeSynonymReference(value) {
  return String(value ?? '')
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/^'+|'+$/g, '')
    .replace(/\]\.\[/g, '.')
    .replace(/\[|\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSqlReference(value) {
  return String(value ?? '')
    .trim()
    .replace(/^dbo\./i, '')
    .replace(/\]\.\[/g, '.')
    .replace(/\[|\]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^ssis\//i, '')
    .trim();
}

function stripSqlComments(sqlText) {
  return String(sqlText || '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--[^\r\n]*/g, ' ');
}

function extractCteNames(definition = '') {
  const sql = stripSqlComments(definition);
  const names = new Set();
  const pattern = /(?:\bWITH|,)\s+([A-Za-z_][A-Za-z0-9_]*)\s+AS\s*\(/gi;
  let match = pattern.exec(sql);
  while (match) {
    names.add(String(match[1] || '').toLowerCase());
    match = pattern.exec(sql);
  }
  return names;
}

function sqlReferenceTails(value) {
  const normalized = normalizeSqlReference(value).toLowerCase();
  if (!normalized) return [];
  const parts = normalized.split('.').filter(Boolean);
  return [
    normalized,
    parts.length >= 3 ? parts.slice(-3).join('.') : '',
    parts.length >= 2 ? parts.slice(-2).join('.') : '',
  ].filter(Boolean);
}

function referencesSameSqlObject(left, right) {
  const leftTails = new Set(sqlReferenceTails(left));
  return sqlReferenceTails(right).some((tail) => leftTails.has(tail));
}

function normalizeSegment(value, fallback = 'unknown') {
  const text = String(value ?? '').trim();
  const safe = text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if ('<>:"/\\|?*'.includes(char) || code <= 0x1f) {
        return '_';
      }
      return char;
    })
    .join('')
    .replace(/\s+/g, '_');
  return safe || fallback;
}

function toBoolean(value) {
  return value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true';
}

function canonicalColumnId(objectId, columnName) {
  return `${objectId}.${String(columnName || '').trim()}`;
}

function columnNameKey(value) {
  return String(value || '').toLowerCase();
}

const SQL_IDENTIFIER_PATTERN = String.raw`(?:\[[^\]]+\]|[A-Za-z_][A-Za-z0-9_$#@]*)`;
const SQL_OBJECT_REFERENCE_PATTERN = String.raw`${SQL_IDENTIFIER_PATTERN}(?:\s*\.\s*${SQL_IDENTIFIER_PATTERN}){0,4}`;
const RESERVED_SQL_ALIASES = new Set([
  'where',
  'join',
  'inner',
  'left',
  'right',
  'full',
  'cross',
  'outer',
  'on',
  'group',
  'order',
  'having',
  'union',
  'where',
  'set',
  'when',
  'then',
  'else',
  'end',
  'values',
]);

function cleanSqlName(value) {
  return String(value || '')
    .trim()
    .replace(/^\[|\]$/g, '')
    .replace(/^"+|"+$/g, '')
    .replace(/^'+|'+$/g, '')
    .trim();
}

function sqlNameKey(value) {
  return cleanSqlName(value).toLowerCase();
}

function splitSqlObjectParts(reference) {
  return normalizeSqlReference(reference).split('.').map(cleanSqlName).filter(Boolean);
}

function splitCommaAware(value) {
  const parts = [];
  let current = '';
  let depth = 0;
  let quote = '';

  for (const char of String(value || '')) {
    if (quote) {
      current += char;
      if (char === quote) quote = '';
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      current += char;
      continue;
    }
    if (char === '(') depth += 1;
    if (char === ')' && depth > 0) depth -= 1;
    if (char === ',' && depth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function stripColumnAlias(expression) {
  return String(expression || '')
    .replace(/\s+AS\s+(?:\[[^\]]+\]|[A-Za-z_][A-Za-z0-9_$#@]*)\s*$/i, '')
    .replace(/\s+(?:\[[^\]]+\]|[A-Za-z_][A-Za-z0-9_$#@]*)\s*$/i, '')
    .trim();
}

function expressionLooksCalculated(expression) {
  const text = String(expression || '');
  if (
    /\b(CASE|CAST|CONVERT|COALESCE|ISNULL|NULLIF|ROUND|SUM|AVG|MIN|MAX|COUNT|DATEADD|DATEDIFF)\b/i.test(
      text
    )
  ) {
    return true;
  }
  return /[+\-*/]/.test(text.replace(/\[[^\]]+\]/g, ''));
}

function compactSqlEvidence(value, maxLength = 500) {
  const text = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

function sqlEvidenceWindow(sql, startIndex, matchText, maxLength = 500) {
  const source = String(sql || '');
  const start = Math.max(0, startIndex - 120);
  const end = Math.min(source.length, startIndex + String(matchText || '').length + 240);
  return compactSqlEvidence(source.slice(start, end), maxLength);
}

function containsSelectStarExpression(expression) {
  const cleaned = String(expression || '').trim();
  if (cleaned === '*') return true;
  const qualifiedStarPattern = new RegExp(
    `(?:^|[\\s,(])${SQL_IDENTIFIER_PATTERN}\\s*\\.\\s*\\*(?:$|[\\s,)])`,
    'i'
  );
  return qualifiedStarPattern.test(cleaned);
}

function findColumnTokens(expression) {
  const tokens = [];
  const pattern = new RegExp(
    `(${SQL_IDENTIFIER_PATTERN})\\s*\\.\\s*(${SQL_IDENTIFIER_PATTERN}|\\*)`,
    'gi'
  );
  let match = pattern.exec(expression || '');
  while (match) {
    const alias = cleanSqlName(match[1]);
    const column = cleanSqlName(match[2]);
    if (alias && column && column !== '*') {
      tokens.push({
        alias,
        column,
        evidence: match[0],
      });
    }
    match = pattern.exec(expression || '');
  }
  return tokens;
}

function isNoiseSqlReference(reference) {
  const value = normalizeSqlReference(reference).toLowerCase();
  if (!value) return true;

  const noiseTokens = new Set([
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

  if (noiseTokens.has(value)) return true;
  const parts = value.split('.').filter(Boolean);
  if (parts.length === 2 && ['source', 'target', 'src', 'inserted', 'deleted'].includes(parts[0])) {
    return true;
  }
  if (value.startsWith('#')) return true;
  if (value.startsWith('@')) return true;
  if (value.includes('doc_proj')) return true;
  if (value.includes('ad_actuals')) return true;
  if (value.includes('lower(') || value.includes('upper(')) return true;
  return false;
}

class MarkdownGenerator {
  constructor(metadata) {
    this.metadata = metadata;
  }

  static buildColumnInventory(object, metadata = {}) {
    const { id: objectId } = object;
    const relationships = metadata.relationships || [];
    const primaryKeyColumns = new Set(
      (object.primaryKey?.columns || []).map((column) => columnNameKey(column.name))
    );

    return (object.columns || []).map((column) => {
      const { name } = column;
      const nameKey = columnNameKey(name);
      const uniqueKeys = (object.uniqueConstraints || [])
        .filter((constraint) =>
          (constraint.columns || []).some(
            (constraintColumn) => columnNameKey(constraintColumn.name) === nameKey
          )
        )
        .map((constraint) => constraint.name)
        .filter(Boolean);
      const indexes = MarkdownGenerator.buildColumnIndexParticipation(object.indexes || [], name);
      const foreignKeys = relationships
        .filter(
          (rel) =>
            rel.type === 'explicit_fk' &&
            rel.fromTable === objectId &&
            columnNameKey(rel.fromColumn) === nameKey
        )
        .map((rel) => ({
          constraint_name: rel.constraintName || '',
          references_object_id: rel.toTable,
          references_column_id: canonicalColumnId(rel.toTable, rel.toColumn),
          references_column: rel.toColumn,
        }));
      const referencedByForeignKeys = relationships
        .filter(
          (rel) =>
            rel.type === 'explicit_fk' &&
            rel.toTable === objectId &&
            columnNameKey(rel.toColumn) === nameKey
        )
        .map((rel) => ({
          constraint_name: rel.constraintName || '',
          referencing_object_id: rel.fromTable,
          referencing_column_id: canonicalColumnId(rel.fromTable, rel.fromColumn),
          referencing_column: rel.fromColumn,
        }));

      return {
        name,
        column_id: canonicalColumnId(objectId, name),
        ordinal: column.ordinal ?? null,
        data_type: column.dataType || '',
        max_length: column.maxLength ?? null,
        precision: column.precision ?? null,
        scale: column.scale ?? null,
        nullable: toBoolean(column.isNullable),
        identity: toBoolean(column.isIdentity),
        computed: toBoolean(column.isComputed),
        computed_definition: column.computedDefinition || null,
        default: column.defaultValue || null,
        description: column.description || '',
        primary_key: primaryKeyColumns.has(nameKey),
        unique_keys: uniqueKeys,
        foreign_keys: foreignKeys,
        referenced_by_foreign_keys: referencedByForeignKeys,
        indexes,
        sensitivity: column.sensitivity || 'internal',
        classification_tags: Array.isArray(column.classificationTags)
          ? column.classificationTags
          : [],
        extraction_evidence: {
          source: 'sys.columns',
          extracted_at: metadata.extractedAt || null,
        },
      };
    });
  }

  static buildColumnIndexParticipation(indexes, columnName) {
    const nameKey = columnNameKey(columnName);
    const participation = [];

    for (const index of indexes || []) {
      for (const keyColumn of index.keyColumns || []) {
        if (columnNameKey(keyColumn.name) !== nameKey) continue;
        participation.push({
          name: index.name,
          type: index.type,
          role: 'key',
          key_ordinal: keyColumn.keyOrdinal ?? null,
          sort: keyColumn.sort || null,
          unique: toBoolean(index.isUnique),
          primary_key: toBoolean(index.isPrimaryKey),
        });
      }

      for (const includedColumn of index.includedColumns || []) {
        if (columnNameKey(includedColumn) !== nameKey) continue;
        participation.push({
          name: index.name,
          type: index.type,
          role: 'included',
          key_ordinal: null,
          sort: null,
          unique: toBoolean(index.isUnique),
          primary_key: toBoolean(index.isPrimaryKey),
        });
      }
    }

    return participation;
  }

  static buildSqlObjectLookup(metadata = {}) {
    const lookup = new Map();
    const add = (key, object) => {
      const normalized = String(key || '').toLowerCase();
      if (!normalized || lookup.has(normalized)) return;
      lookup.set(normalized, object);
    };

    for (const object of [...(metadata.tables || []), ...(metadata.views || [])]) {
      if (!object?.id) continue;
      const server = object.serverName || metadata.serverName || '';
      const database = object.database || metadata.database || '';
      const schema = object.schema || 'dbo';
      const name = object.name || '';
      add(object.id, object);
      add([server, database, schema, name].filter(Boolean).join('.'), object);
      add([database, schema, name].filter(Boolean).join('.'), object);
      add([schema, name].filter(Boolean).join('.'), object);
    }

    return lookup;
  }

  static resolveSqlObjectReference(reference, context, lookup) {
    const parts = splitSqlObjectParts(reference);
    if (parts.length === 0) return null;

    const candidates = [];
    if (parts.length >= 4) {
      candidates.push(parts.join('.'));
    } else if (parts.length === 3) {
      candidates.push([context.server, ...parts].filter(Boolean).join('.'));
      candidates.push(parts.join('.'));
    } else if (parts.length === 2) {
      candidates.push([context.server, context.database, ...parts].filter(Boolean).join('.'));
      candidates.push(parts.join('.'));
    } else {
      candidates.push(
        [context.server, context.database, context.schema || 'dbo', parts[0]]
          .filter(Boolean)
          .join('.')
      );
      if (context.schema !== 'dbo') {
        candidates.push(
          [context.server, context.database, 'dbo', parts[0]].filter(Boolean).join('.')
        );
      }
    }

    for (const candidate of candidates) {
      const resolved = lookup.get(candidate.toLowerCase());
      if (resolved) return resolved;
    }
    return null;
  }

  static buildSqlAliasMap(sql, context, lookup) {
    const aliases = new Map();
    const cteNames = extractCteNames(sql);
    const addAlias = (alias, object) => {
      const key = sqlNameKey(alias);
      if (!key || RESERVED_SQL_ALIASES.has(key) || !object) return;
      aliases.set(key, object);
    };
    const addObjectReference = (reference, alias) => {
      const parts = splitSqlObjectParts(reference);
      const objectName = parts[parts.length - 1] || '';
      if (cteNames.has(objectName.toLowerCase())) return;
      const object = MarkdownGenerator.resolveSqlObjectReference(reference, context, lookup);
      if (!object) return;
      addAlias(alias || objectName, object);
      addAlias(objectName, object);
    };

    const fromJoinPattern = new RegExp(
      `\\b(?:FROM|JOIN)\\s+(${SQL_OBJECT_REFERENCE_PATTERN})(?:\\s+(?:AS\\s+)?(${SQL_IDENTIFIER_PATTERN}))?`,
      'gi'
    );
    let match = fromJoinPattern.exec(sql);
    while (match) {
      addObjectReference(match[1], match[2]);
      match = fromJoinPattern.exec(sql);
    }

    const mergePattern = new RegExp(
      `\\bMERGE(?:\\s+INTO)?\\s+(${SQL_OBJECT_REFERENCE_PATTERN})(?:\\s+(?:AS\\s+)?(${SQL_IDENTIFIER_PATTERN}))?`,
      'gi'
    );
    match = mergePattern.exec(sql);
    while (match) {
      addObjectReference(match[1], match[2]);
      match = mergePattern.exec(sql);
    }

    const usingPattern = new RegExp(
      `\\bUSING\\s+(${SQL_OBJECT_REFERENCE_PATTERN})(?:\\s+(?:AS\\s+)?(${SQL_IDENTIFIER_PATTERN}))?`,
      'gi'
    );
    match = usingPattern.exec(sql);
    while (match) {
      addObjectReference(match[1], match[2]);
      match = usingPattern.exec(sql);
    }

    return aliases;
  }

  static columnInventoryForObject(object) {
    const columns = object?.columns || [];
    return new Map(columns.map((column) => [columnNameKey(column.name), column]));
  }

  static buildColumnUsageRecord(object, columnName, process, usageType, usageContext, expression) {
    const inventory = MarkdownGenerator.columnInventoryForObject(object);
    const column = inventory.get(columnNameKey(columnName));
    if (!object || !column) return null;
    const evidence = compactSqlEvidence(expression);
    return {
      column_id: canonicalColumnId(object.id, column.name),
      object_id: object.id,
      process_id: process.id,
      column_name: column.name,
      usage_type: usageType,
      usage_context: usageContext,
      expression: evidence,
      evidence_type: 'sql_definition',
      evidence_text: evidence,
      source_artifact: process.id,
      validation_status: 'validated',
    };
  }

  static extractSqlColumnUsage(definition = '', process = {}, metadata = {}) {
    const sql = stripSqlComments(definition);
    const context = {
      server: process.serverName || metadata.serverName || '',
      database: process.database || metadata.database || '',
      schema: process.schema || 'dbo',
    };
    const lookup = MarkdownGenerator.buildSqlObjectLookup(metadata);
    const aliases = MarkdownGenerator.buildSqlAliasMap(sql, context, lookup);
    const usage = [];
    const unresolved = [];
    const riskFlags = [];
    const seen = new Set();
    const unresolvedSeen = new Set();
    const riskSeen = new Set();

    const addRiskFlag = (flagType, payload = {}) => {
      const evidence = compactSqlEvidence(payload.evidence_text || payload.expression || '');
      const record = {
        process_id: process.id,
        flag_type: flagType,
        severity: payload.severity || 'medium',
        usage_context: payload.usage_context || 'sql_definition',
        object_id: payload.object_id || null,
        evidence_type: payload.evidence_type || 'sql_definition',
        evidence_text: evidence,
        reason: payload.reason || '',
        suggested_action: payload.suggested_action || '',
        validation_status: 'risk_flag',
      };
      const key = [
        record.process_id,
        record.flag_type,
        record.usage_context,
        record.object_id || '',
        record.evidence_text,
        record.reason,
      ]
        .map((value) => String(value || '').toLowerCase())
        .join('|');
      if (riskSeen.has(key)) return;
      riskSeen.add(key);
      riskFlags.push(record);
    };

    const addUnresolved = (payload) => {
      const record = {
        ...payload,
        expression: compactSqlEvidence(payload.expression),
        evidence_text: compactSqlEvidence(payload.evidence_text || payload.expression),
      };
      const key = [
        record.process_id,
        record.alias || '',
        record.column_name || '',
        record.usage_type || '',
        record.usage_context || '',
        record.evidence_text || '',
        record.reason || '',
      ]
        .map((value) => String(value || '').toLowerCase())
        .join('|');
      if (unresolvedSeen.has(key)) return;
      unresolvedSeen.add(key);
      if (unresolved.length >= 1000) return;
      unresolved.push(record);
    };

    const addUsage = (object, columnName, usageType, usageContext, expression) => {
      const record = MarkdownGenerator.buildColumnUsageRecord(
        object,
        columnName,
        process,
        usageType,
        usageContext,
        expression
      );
      if (!record) {
        addUnresolved({
          process_id: process.id,
          column_name: columnName,
          usage_type: usageType,
          usage_context: usageContext,
          expression: String(expression || '').trim(),
          evidence_type: 'sql_definition',
          evidence_text: String(expression || '').trim(),
          reason: object ? 'column_not_found_on_resolved_object' : 'object_context_unresolved',
          validation_status: 'unresolved',
        });
        return;
      }

      const key = [
        record.column_id,
        record.usage_type,
        record.usage_context,
        record.expression.toLowerCase(),
      ].join('|');
      if (seen.has(key)) return;
      seen.add(key);
      usage.push(record);
    };

    const addTokenUsage = (token, usageType, usageContext, expression) => {
      const object = aliases.get(sqlNameKey(token.alias));
      if (!object) {
        addUnresolved({
          process_id: process.id,
          alias: token.alias,
          column_name: token.column,
          usage_type: usageType,
          usage_context: usageContext,
          expression: String(expression || token.evidence || '').trim(),
          evidence_type: 'sql_definition',
          evidence_text: String(token.evidence || expression || '').trim(),
          reason: 'alias_not_resolved_to_known_table_or_view',
          validation_status: 'unresolved',
        });
        return;
      }
      addUsage(object, token.column, usageType, usageContext, expression || token.evidence);
    };

    const addTokensFromExpression = (expression, usageType, usageContext) => {
      for (const token of findColumnTokens(expression)) {
        addTokenUsage(token, usageType, usageContext, expression);
      }
    };

    const selectPattern = /\bSELECT\b\s+(?:DISTINCT\s+)?([\s\S]*?)\bFROM\b/gi;
    let match = selectPattern.exec(sql);
    while (match) {
      for (const expression of splitCommaAware(match[1])) {
        const cleaned = stripColumnAlias(expression);
        if (containsSelectStarExpression(cleaned)) {
          addRiskFlag('select_star', {
            severity: 'high',
            usage_context: 'select_list',
            evidence_text: cleaned,
            reason:
              'SELECT * or alias.* hides column-level dependencies from explicit parser evidence.',
            suggested_action:
              'Replace star expansion with an explicit column list before relying on column impact answers.',
          });
        }
        const usageType = expressionLooksCalculated(cleaned) ? 'calculation' : 'read';
        addTokensFromExpression(cleaned, usageType, 'select_list');
      }
      match = selectPattern.exec(sql);
    }

    const insertWithoutColumnPattern = new RegExp(
      `\\bINSERT\\s+(?:INTO\\s+)?(${SQL_OBJECT_REFERENCE_PATTERN})(?:\\s+WITH\\s*\\([^)]*\\))?\\s+(SELECT|VALUES|EXEC(?:UTE)?|WITH)\\b`,
      'gi'
    );
    match = insertWithoutColumnPattern.exec(sql);
    while (match) {
      const target = MarkdownGenerator.resolveSqlObjectReference(match[1], context, lookup);
      addRiskFlag('insert_without_column_list', {
        severity: 'high',
        usage_context: 'insert_target',
        object_id: target?.id || null,
        evidence_text: sqlEvidenceWindow(sql, match.index, match[0]),
        reason: 'INSERT target columns are positional because no explicit column list was found.',
        suggested_action:
          'Add an explicit INSERT column list so source-to-target column impact can be validated.',
      });
      match = insertWithoutColumnPattern.exec(sql);
    }

    const insertPattern = new RegExp(
      `\\bINSERT\\s+INTO\\s+(${SQL_OBJECT_REFERENCE_PATTERN})\\s*\\(([^)]*)\\)`,
      'gi'
    );
    match = insertPattern.exec(sql);
    while (match) {
      const target = MarkdownGenerator.resolveSqlObjectReference(match[1], context, lookup);
      for (const columnName of splitCommaAware(match[2]).map(cleanSqlName).filter(Boolean)) {
        addUsage(target, columnName, 'insert_target', 'insert_column_list', columnName);
      }
      match = insertPattern.exec(sql);
    }

    const updatePattern = new RegExp(
      `\\bUPDATE\\s+(${SQL_OBJECT_REFERENCE_PATTERN})\\s+SET\\s+([\\s\\S]*?)(?=\\bFROM\\b|\\bWHERE\\b|;|$)`,
      'gi'
    );
    match = updatePattern.exec(sql);
    while (match) {
      const target =
        aliases.get(sqlNameKey(match[1])) ||
        MarkdownGenerator.resolveSqlObjectReference(match[1], context, lookup);
      for (const assignment of splitCommaAware(match[2])) {
        const [left, right = ''] = assignment.split('=');
        const leftTokens = findColumnTokens(left);
        if (leftTokens.length > 0) {
          leftTokens.forEach((token) => addTokenUsage(token, 'update_target', 'set_clause', left));
        } else {
          addUsage(target, cleanSqlName(left), 'update_target', 'set_clause', left);
        }
        addTokensFromExpression(right, 'read', 'set_clause');
      }
      match = updatePattern.exec(sql);
    }

    const mergePattern = new RegExp(
      `\\bMERGE(?:\\s+INTO)?\\s+(${SQL_OBJECT_REFERENCE_PATTERN})(?:\\s+(?:AS\\s+)?(${SQL_IDENTIFIER_PATTERN}))?[\\s\\S]*?\\bON\\b\\s+([\\s\\S]*?)(?=\\bWHEN\\b|;|$)`,
      'gi'
    );
    match = mergePattern.exec(sql);
    while (match) {
      addTokensFromExpression(match[3], 'merge_key', 'merge_on');
      match = mergePattern.exec(sql);
    }

    const mergeUpdatePattern =
      /\bWHEN\s+MATCHED\b[\s\S]*?\bUPDATE\s+SET\s+([\s\S]*?)(?=\bWHEN\b|;|$)/gi;
    match = mergeUpdatePattern.exec(sql);
    while (match) {
      for (const assignment of splitCommaAware(match[1])) {
        const [left, right = ''] = assignment.split('=');
        findColumnTokens(left).forEach((token) =>
          addTokenUsage(token, 'update_target', 'merge_update_set', left)
        );
        addTokensFromExpression(right, 'read', 'merge_update_set');
      }
      match = mergeUpdatePattern.exec(sql);
    }

    const mergeInsertPattern = /\bWHEN\s+NOT\s+MATCHED\b[\s\S]*?\bINSERT\s*\(([^)]*)\)/gi;
    const mergeTargetMatch = new RegExp(
      `\\bMERGE(?:\\s+INTO)?\\s+(${SQL_OBJECT_REFERENCE_PATTERN})(?:\\s+(?:AS\\s+)?(${SQL_IDENTIFIER_PATTERN}))?`,
      'i'
    ).exec(sql);
    const mergeTarget = mergeTargetMatch
      ? MarkdownGenerator.resolveSqlObjectReference(mergeTargetMatch[1], context, lookup)
      : null;
    const mergeWithoutExplicitInsertPattern =
      /\bMERGE\b[\s\S]*?\bWHEN\s+NOT\s+MATCHED\b[\s\S]*?\bINSERT\s+(?!\()/gi;
    match = mergeWithoutExplicitInsertPattern.exec(sql);
    while (match) {
      addRiskFlag('merge_without_explicit_column_mapping', {
        severity: 'high',
        usage_context: 'merge_insert',
        object_id: mergeTarget?.id || null,
        evidence_text: sqlEvidenceWindow(sql, match.index, match[0]),
        reason: 'MERGE INSERT branch does not expose an explicit target column mapping.',
        suggested_action: 'Add an explicit MERGE INSERT column list and VALUES mapping.',
      });
      match = mergeWithoutExplicitInsertPattern.exec(sql);
    }
    match = mergeInsertPattern.exec(sql);
    while (match) {
      for (const columnName of splitCommaAware(match[1]).map(cleanSqlName).filter(Boolean)) {
        addUsage(mergeTarget, columnName, 'insert_target', 'merge_insert_column_list', columnName);
      }
      match = mergeInsertPattern.exec(sql);
    }

    const joinOnPattern =
      /\bON\b\s+([\s\S]*?)(?=\b(?:INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\b|\bWHERE\b|\bGROUP\s+BY\b|\bORDER\s+BY\b|\bHAVING\b|\bWHEN\b|;|$)/gi;
    match = joinOnPattern.exec(sql);
    while (match) {
      addTokensFromExpression(match[1], 'join_key', 'join_on');
      match = joinOnPattern.exec(sql);
    }

    const wherePattern =
      /\bWHERE\b\s+([\s\S]*?)(?=\bGROUP\s+BY\b|\bORDER\s+BY\b|\bHAVING\b|\bUNION\b|;|$)/gi;
    match = wherePattern.exec(sql);
    while (match) {
      addTokensFromExpression(match[1], 'filter', 'where');
      match = wherePattern.exec(sql);
    }

    const groupByPattern = /\bGROUP\s+BY\b\s+([\s\S]*?)(?=\bORDER\s+BY\b|\bHAVING\b|;|$)/gi;
    match = groupByPattern.exec(sql);
    while (match) {
      splitCommaAware(match[1]).forEach((expression) =>
        addTokensFromExpression(expression, 'group_by', 'group_by')
      );
      match = groupByPattern.exec(sql);
    }

    const orderByPattern = /\bORDER\s+BY\b\s+([\s\S]*?)(?=;|$)/gi;
    match = orderByPattern.exec(sql);
    while (match) {
      splitCommaAware(match[1]).forEach((expression) =>
        addTokensFromExpression(expression, 'order_by', 'order_by')
      );
      match = orderByPattern.exec(sql);
    }

    const dynamicSqlPattern =
      /\bsp_executesql\b|\bEXEC(?:UTE)?\s*\(\s*@|\bEXEC(?:UTE)?\s+@[A-Za-z_][A-Za-z0-9_]*/gi;
    match = dynamicSqlPattern.exec(sql);
    while (match) {
      addRiskFlag('dynamic_sql', {
        severity: 'high',
        usage_context: 'dynamic_sql',
        evidence_text: sqlEvidenceWindow(sql, match.index, match[0]),
        reason: 'Dynamic SQL can hide table and column dependencies from static parsing.',
        suggested_action:
          'Capture runtime-expanded SQL or document the dynamic targets explicitly.',
      });
      match = dynamicSqlPattern.exec(sql);
    }

    const dynamicTablePattern =
      /\b(?:FROM|JOIN|INTO|UPDATE|MERGE)\b[\s\S]{0,200}\+\s*(?:QUOTENAME\s*\()?\s*@[A-Za-z_][A-Za-z0-9_]*/gi;
    match = dynamicTablePattern.exec(sql);
    while (match) {
      addRiskFlag('dynamic_table_name', {
        severity: 'high',
        usage_context: 'dynamic_table_name',
        evidence_text: sqlEvidenceWindow(sql, match.index, match[0]),
        reason: 'A table/object name appears to be assembled dynamically.',
        suggested_action:
          'Document allowed runtime table names or add runtime SQL capture evidence.',
      });
      match = dynamicTablePattern.exec(sql);
    }

    const dynamicColumnPattern =
      /\b(?:SELECT|ORDER\s+BY|GROUP\s+BY|SET)\b[\s\S]{0,200}\+\s*(?:QUOTENAME\s*\()?\s*@[A-Za-z_][A-Za-z0-9_]*/gi;
    match = dynamicColumnPattern.exec(sql);
    while (match) {
      addRiskFlag('dynamic_column_name', {
        severity: 'high',
        usage_context: 'dynamic_column_name',
        evidence_text: sqlEvidenceWindow(sql, match.index, match[0]),
        reason: 'A column list or column expression appears to be assembled dynamically.',
        suggested_action: 'Document allowed runtime columns or add runtime SQL capture evidence.',
      });
      match = dynamicColumnPattern.exec(sql);
    }

    if (unresolved.length > 0) {
      addRiskFlag('unresolved_parser_context', {
        severity: 'medium',
        usage_context: 'column_resolution',
        evidence_text: unresolved[0]?.evidence_text || unresolved[0]?.expression || '',
        reason: `${unresolved.length} column usage record(s) could not be validated to a known object/column.`,
        suggested_action:
          'Review unresolved_column_usage before treating column impact answers as complete.',
      });
    }

    return {
      column_usage: usage,
      unresolved_column_usage: unresolved,
      column_risk_flags: riskFlags,
    };
  }

  static isContextualSqlReference(reference) {
    return isNoiseSqlReference(reference);
  }

  static splitSqlReferences(references = []) {
    const direct = [];
    const contextual = [];
    const seen = new Set();

    for (const reference of references) {
      const normalized = normalizeSqlReference(reference);
      if (!normalized) continue;
      const key = normalized.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      if (MarkdownGenerator.isContextualSqlReference(normalized)) {
        contextual.push(normalized);
      } else {
        direct.push(normalized);
      }
    }

    return { direct, contextual };
  }

  /**
   * Generate markdown for a single table
   */
  generateTableMarkdown(table) {
    const extractionWarnings = this.metadata.extractionWarnings || [];

    const relationships = this.metadata.relationships
      .filter((r) => (r.fromTable === table.id || r.toTable === table.id) && r.confidence >= 0.5)
      .sort((a, b) => b.confidence - a.confidence);

    const directCreators = Array.from(
      new Set(
        relationships
          .filter((r) => r.toTable === table.id)
          .filter((r) =>
            ['procedure', 'ssis', 'package', 'etl_pattern', 'loads', 'calls'].includes(r.type)
          )
          .map((r) => r.fromTable)
          .filter((ref) => !isNoiseSqlReference(ref))
      )
    );
    const usedBy = Array.from(
      new Set(
        relationships
          .filter((r) => r.fromTable === table.id)
          .filter((r) =>
            [
              'procedure',
              'view',
              'ssis',
              'package',
              'reads',
              'extracts',
              'loads',
              'calls',
            ].includes(r.type)
          )
          .map((r) => r.toTable)
          .filter((ref) => !isNoiseSqlReference(ref))
      )
    );
    const contextualReads = Array.from(
      new Set(
        relationships
          .filter((r) => r.fromTable === table.id || r.toTable === table.id)
          .filter((r) =>
            ['column_match', 'reference', 'lookup', 'helper', 'contextual_read'].includes(r.type)
          )
          .map((r) => (r.fromTable === table.id ? r.toTable : r.fromTable))
          .filter((ref) => !isNoiseSqlReference(ref))
      )
    );
    const createdVia = Array.from(
      new Set(
        relationships
          .filter((r) => r.toTable === table.id)
          .filter((r) => ['calls', 'ssis', 'package', 'created_via'].includes(r.type))
          .map((r) => r.fromTable)
          .filter((ref) => !isNoiseSqlReference(ref))
      )
    );
    let lineageStatus = 'external_or_unresolved';
    if (directCreators.length > 0) {
      lineageStatus = 'creator_found';
    } else if (contextualReads.length > 0 || usedBy.length > 0) {
      lineageStatus = 'creator_unresolved';
    }
    const dependsOn = Array.from(
      new Set([
        ...directCreators,
        ...relationships
          .filter((r) => r.fromTable === table.id)
          .filter((r) =>
            ['foreign_key', 'etl_pattern', 'many_to_many_bridge', 'reads', 'extracts'].includes(
              r.type
            )
          )
          .map((r) => r.toTable)
          .filter((ref) => !isNoiseSqlReference(ref)),
      ])
    );

    // Group relationships by confidence before rendering lineage quality.
    const highConfidence = relationships.filter((r) => r.confidence >= 0.8);
    const mediumConfidence = relationships.filter((r) => r.confidence >= 0.6 && r.confidence < 0.8);
    const lowConfidence = relationships.filter((r) => r.confidence < 0.6);

    const frontmatter = applyDictionaryEnrichmentContract(
      {
        id: table.id,
        name: table.name,
        server: table.serverName || this.metadata.serverName || 'unknown',
        database: this.metadata.database,
        type: table.type,
        schema: table.schema,
        owner: 'Data Team', // TODO: Extract from extended properties
        sensitivity: 'internal', // TODO: Infer from data classification
        tags: MarkdownGenerator.inferTags(table),
        depends_on: dependsOn,
        created_by: directCreators,
        created_via: createdVia,
        used_by: usedBy,
        contextual_reads: contextualReads,
        lineage_status: lineageStatus,
        external_source: Boolean(table.external_source),
        lineage_quality: {
          validated_edges: highConfidence.length + mediumConfidence.length,
          probable_edges: lowConfidence.length,
          unresolved_facts: 0,
        },
        row_count: table.rowCount,
        size_kb: table.sizeKb,
        column_count: table.columns?.length || 0,
        columns: MarkdownGenerator.buildColumnInventory(table, this.metadata),
        index_count: table.indexes?.length || 0,
        check_constraint_count: table.checkConstraints?.length || 0,
        extraction_warnings: extractionWarnings.map((warning) => warning.code),
        extracted_at: this.metadata.extractedAt,
      },
      { extractedAt: this.metadata.extractedAt }
    );

    let markdown = renderFrontmatter(frontmatter);

    // Table description
    markdown += '## Overview\n\n';
    markdown += table.description
      ? `${table.description}\n\n`
      : 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += `- **Type**: ${table.type}\n`;
    markdown += `- **Schema**: ${table.schema}\n`;
    markdown += `- **Row Count**: ${table.rowCount.toLocaleString()}\n`;
    markdown += `- **Size**: ${table.sizeKb.toLocaleString()} KB\n\n`;

    // Columns section
    if (table.columns && table.columns.length > 0) {
      markdown += '## Columns\n\n';
      markdown += '| Name | Type | Nullable | Identity | Default | Description |\n';
      markdown += '|------|------|----------|----------|---------|-------------|\n';
      table.columns.forEach((col) => {
        const nullable = col.isNullable ? '✓' : '';
        const identity = col.isIdentity ? '✓' : '';
        const defaultValue = col.defaultValue || '';
        const desc = col.description || '';
        markdown += `| \`${col.name}\` | ${col.dataType} | ${nullable} | ${identity} | ${defaultValue} | ${desc} |\n`;
      });
      markdown += '\n';
    }

    if (
      table.primaryKey ||
      (table.uniqueConstraints && table.uniqueConstraints.length > 0) ||
      (table.checkConstraints && table.checkConstraints.length > 0)
    ) {
      markdown += '## Constraints\n\n';
      if (table.primaryKey && table.primaryKey.columns?.length > 0) {
        markdown += `- **Primary Key**: ${table.primaryKey.name}\n`;
        markdown += `  - Columns: ${table.primaryKey.columns.map((c) => c.name).join(', ')}\n`;
      }

      if (table.uniqueConstraints && table.uniqueConstraints.length > 0) {
        table.uniqueConstraints.forEach((constraint) => {
          markdown += `- **Unique**: ${constraint.name}\n`;
          markdown += `  - Columns: ${constraint.columns.map((c) => c.name).join(', ')}\n`;
        });
      }

      if (table.checkConstraints && table.checkConstraints.length > 0) {
        table.checkConstraints.forEach((constraint) => {
          markdown += `- **Check**: ${constraint.name}\n`;
          markdown += `  - Definition: ${constraint.definition}\n`;
        });
      }

      markdown += '\n';
    }

    if (table.indexes && table.indexes.length > 0) {
      markdown += '## Indexes\n\n';
      table.indexes.forEach((index) => {
        markdown += `- **${index.name}** (${index.type})\n`;
        markdown += `  - Unique: ${index.isUnique ? 'Yes' : 'No'}\n`;
        markdown += `  - Primary Key: ${index.isPrimaryKey ? 'Yes' : 'No'}\n`;
        if (index.keyColumns && index.keyColumns.length > 0) {
          const keyCols = index.keyColumns.map((c) => `${c.name} ${c.sort}`).join(', ');
          markdown += `  - Key Columns: ${keyCols}\n`;
        }
        if (index.includedColumns && index.includedColumns.length > 0) {
          markdown += `  - Included Columns: ${index.includedColumns.join(', ')}\n`;
        }
        if (index.hasFilter && index.filterDefinition) {
          markdown += `  - Filter: ${index.filterDefinition}\n`;
        }
      });
      markdown += '\n';
    }
    if (extractionWarnings.length > 0) {
      markdown += '## Extraction Notes\n\n';
      extractionWarnings.forEach((warning) => {
        markdown += `- **${warning.code}**: ${warning.message}\n`;
      });
      markdown += '\n';
    }

    // Relationships
    if (relationships.length > 0) {
      markdown += '## Relationships\n\n';
      markdown +=
        '> Note: Creator, usage, and contextual references are split in frontmatter. Column-match evidence remains below for review.\n\n';

      if (highConfidence.length > 0) {
        markdown += '### High Confidence (≥ 0.8)\n\n';
        for (const rel of highConfidence) {
          markdown += MarkdownGenerator.generateRelationshipMarkdown(rel);
        }
        markdown += '\n';
      }

      if (mediumConfidence.length > 0) {
        markdown += '### Medium Confidence (0.6-0.8)\n\n';
        for (const rel of mediumConfidence) {
          markdown += MarkdownGenerator.generateRelationshipMarkdown(rel);
        }
        markdown += '\n';
      }

      if (lowConfidence.length > 0) {
        markdown += '### Low Confidence (< 0.6) - Review Required\n\n';
        for (const rel of lowConfidence) {
          markdown += MarkdownGenerator.generateRelationshipMarkdown(rel);
        }
        markdown += '\n';
      }
    }

    markdown += '## Lineage Tiers\n\n';
    markdown += `- **Created By**: ${directCreators.length > 0 ? directCreators.join(', ') : 'unresolved'}\n`;
    markdown += `- **Created Via**: ${createdVia.length > 0 ? createdVia.join(', ') : 'unresolved'}\n`;
    markdown += `- **Used By**: ${usedBy.length > 0 ? usedBy.join(', ') : 'none found'}\n`;
    markdown += `- **Contextual Reads**: ${contextualReads.length > 0 ? contextualReads.join(', ') : 'none found'}\n`;
    markdown += `- **Lineage Status**: ${lineageStatus}\n\n`;

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;
    markdown += '- **Data Classification**: To be assigned\n';
    markdown += '- **Stewardship**: To be assigned\n';
    markdown += '- **Compliance**: Review for GDPR/HIPAA applicability\n';
    if (extractionWarnings.length > 0) {
      markdown += '- **Extractor Warnings**: Present (see Extraction Notes)\n';
    }

    return markdown;
  }

  /**
   * Generate relationship markdown
   */
  static generateRelationshipMarkdown(rel) {
    let md = `- **${rel.type}**: ${rel.fromTable} → ${rel.toTable}\n`;
    md += `  - Confidence: ${(rel.confidence * 100).toFixed(0)}%\n`;
    md += `  - Evidence: ${rel.evidence}\n`;
    if (rel.fromColumn) {
      md += `  - Column: \`${rel.fromColumn}\` → \`${rel.toColumn}\`\n`;
    }
    return md;
  }

  /**
   * Infer tags from table characteristics
   */
  static inferTags(table) {
    const tags = [];

    const nameLower = table.name.toLowerCase();

    if (nameLower.startsWith('fact_')) tags.push('fact-table');
    if (nameLower.startsWith('dim_')) tags.push('dimension');
    if (nameLower.startsWith('stg_')) tags.push('staging');
    if (nameLower.startsWith('tmp_')) tags.push('temporary');
    if (table.type === 'view') tags.push('view');
    if (table.rowCount > 1000000) tags.push('large-table');
    if (table.schema === 'dbo') tags.push('core-schema');

    return tags.length > 0 ? tags : ['auto-extracted'];
  }

  /**
   * Generate markdown for a view
   */
  generateViewMarkdown(view) {
    const rawReferences = [
      ...(view.dependencies || []).map((dep) => dep.referencedObject),
      ...(view.reads_from || []),
    ];
    const { direct: dependsOn, contextual } = MarkdownGenerator.splitSqlReferences(rawReferences);
    const usedBy = Array.from(
      new Set((view.used_by || []).filter((ref) => !isNoiseSqlReference(ref)))
    );
    const columnUsage = MarkdownGenerator.extractSqlColumnUsage(
      view.definition,
      view,
      this.metadata
    );
    const frontmatter = applyDictionaryEnrichmentContract(
      {
        id: view.id,
        name: view.name,
        server: view.serverName || this.metadata.serverName || 'unknown',
        database: this.metadata.database,
        type: 'view', // parser-accepted type
        schema: view.schema,
        owner: 'Data Team',
        sensitivity: 'internal',
        tags: ['view', 'auto-extracted'],
        depends_on: dependsOn, // ADDED: Wires up the graph
        reads_from: MarkdownGenerator.extractReadSources(view.definition),
        contextual_reads: contextual,
        used_by: usedBy,
        lineage_quality: {
          validated_edges: dependsOn.length,
          probable_edges: 0,
          unresolved_facts: 0,
        },
        dependency_count: view.dependencies?.length || 0,
        column_count: view.columns?.length || 0,
        columns: MarkdownGenerator.buildColumnInventory(view, this.metadata),
        column_usage: columnUsage.column_usage,
        unresolved_column_usage: columnUsage.unresolved_column_usage,
        column_risk_flags: columnUsage.column_risk_flags,
        extracted_at: this.metadata.extractedAt,
      },
      { extractedAt: this.metadata.extractedAt }
    );

    let markdown = renderFrontmatter(frontmatter);

    markdown += '## Overview\n\n';
    markdown += view.description || 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += '- **Type**: View\n';
    markdown += `- **Schema**: ${view.schema}\n\n`;

    // Dependencies section
    if (view.dependencies && view.dependencies.length > 0) {
      markdown += '## Dependencies\n\n';
      markdown += 'This view depends on:\n\n';
      view.dependencies.forEach((dep) => {
        markdown += `- **${dep.referencedSchema}.${dep.referencedObject}** (${dep.referencedType})\n`;
      });
      markdown += '\n';
    }

    if (view.columns && view.columns.length > 0) {
      markdown += '## Columns\n\n';
      markdown += '| Name | Type | Nullable | Description |\n';
      markdown += '|------|------|----------|-------------|\n';
      view.columns.forEach((col) => {
        markdown += `| \`${col.name}\` | ${col.dataType} | ${col.isNullable ? '✓' : ''} | ${col.description || ''} |\n`;
      });
      markdown += '\n';
    }
    if (view.definition) {
      markdown += '## Definition\n\n';
      markdown += '```sql\n';
      markdown += view.definition;
      markdown += '\n```\n\n';
    }

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;
    markdown += '- **Data Classification**: To be assigned\n';
    markdown += '- **Stewardship**: To be assigned\n';

    return markdown;
  }

  /**
   * Normalize SQL object references for markdown lineage.
   */
  static normalizeObjectReference(reference) {
    return String(reference || '')
      .replace(/\[|\]/g, '')
      .replace(/^dbo\./i, '')
      .trim();
  }

  static uniqueObjectReferences(references) {
    return Array.from(
      new Set(
        references
          .map((reference) => MarkdownGenerator.normalizeObjectReference(reference))
          .filter(
            (reference) => reference && !reference.startsWith('#') && !reference.startsWith('@')
          )
      )
    );
  }

  static extractReadSources(definition = '') {
    const sql = stripSqlComments(definition);
    const cteNames = extractCteNames(definition);
    const sources = [];
    const pattern = /\b(?:FROM|JOIN)\s+((?:\[[^\]]+\]|\w+)(?:\s*\.\s*(?:\[[^\]]+\]|\w+)){0,4})/gi;
    let match = pattern.exec(sql);
    while (match) {
      sources.push(match[1]);
      match = pattern.exec(sql);
    }
    return MarkdownGenerator.uniqueObjectReferences(sources).filter(
      (source) => !cteNames.has(normalizeSqlReference(source).toLowerCase())
    );
  }

  static extractWriteTargets(definition = '') {
    const sql = stripSqlComments(definition);
    const targets = [];
    const pattern =
      /\b(?:INSERT\s+INTO|MERGE(?:\s+INTO)?)\s+((?:\[[^\]]+\]|\w+)(?:\s*\.\s*(?:\[[^\]]+\]|\w+)){0,4})/gi;
    let match = pattern.exec(sql);
    while (match) {
      targets.push(match[1]);
      match = pattern.exec(sql);
    }
    return MarkdownGenerator.uniqueObjectReferences(targets);
  }

  static extractProcedureCalls(definition = '') {
    const sql = stripSqlComments(definition);
    const calls = [];
    const pattern = /\bEXEC(?:UTE)?\s+((?:\[[^\]]+\]|\w+)(?:\s*\.\s*(?:\[[^\]]+\]|\w+)){0,2})/gi;
    let match = pattern.exec(sql);
    while (match) {
      calls.push(match[1]);
      match = pattern.exec(sql);
    }
    return MarkdownGenerator.uniqueObjectReferences(calls);
  }

  static excludeWriteTargets(references = [], writeTargets = []) {
    return references.filter(
      (reference) => !writeTargets.some((target) => referencesSameSqlObject(reference, target))
    );
  }

  /**
   * Generate markdown for a stored procedure
   */
  generateStoredProcedureMarkdown(proc) {
    const dependencyRefs = (proc.dependencies || []).map((dep) => dep.referencedObject);
    const readRefs = MarkdownGenerator.extractReadSources(proc.definition);
    const writeRefs = MarkdownGenerator.extractWriteTargets(proc.definition);
    const callRefs = MarkdownGenerator.extractProcedureCalls(proc.definition);
    const { direct: rawDependsOn, contextual } = MarkdownGenerator.splitSqlReferences([
      ...dependencyRefs,
      ...readRefs,
    ]);
    const { direct: writesTo } = MarkdownGenerator.splitSqlReferences(writeRefs);
    const dependsOn = MarkdownGenerator.excludeWriteTargets(rawDependsOn, writesTo);
    const { direct: rawReadsFrom } = MarkdownGenerator.splitSqlReferences(readRefs);
    const readsFrom = MarkdownGenerator.excludeWriteTargets(rawReadsFrom, writesTo);
    const { direct: calls } = MarkdownGenerator.splitSqlReferences(callRefs);
    const columnUsage = MarkdownGenerator.extractSqlColumnUsage(
      proc.definition,
      proc,
      this.metadata
    );
    const frontmatter = applyDictionaryEnrichmentContract(
      {
        id: proc.id,
        name: proc.name,
        server: proc.serverName || this.metadata.serverName || 'unknown',
        database: this.metadata.database,
        type: 'procedure', // parser-accepted type
        schema: proc.schema,
        owner: 'Data Team',
        tags: ['procedure', 'auto-extracted'],
        depends_on: dependsOn, // ADDED: Wires up the graph
        reads_from: readsFrom,
        writes_to: writesTo,
        calls,
        created_by: [],
        contextual_reads: contextual,
        lineage_quality: {
          validated_edges: readsFrom.length + writesTo.length + calls.length,
          probable_edges: 0,
          unresolved_facts: 0,
        },
        dependency_count: proc.dependencies?.length || 0,
        parameter_count: proc.parameters?.length || 0,
        column_usage: columnUsage.column_usage,
        unresolved_column_usage: columnUsage.unresolved_column_usage,
        column_risk_flags: columnUsage.column_risk_flags,
        extracted_at: this.metadata.extractedAt,
      },
      { extractedAt: this.metadata.extractedAt }
    );

    let markdown = renderFrontmatter(frontmatter);

    markdown += '## Overview\n\n';
    markdown += proc.description || 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += '- **Type**: Stored Procedure\n';
    markdown += `- **Schema**: ${proc.schema}\n\n`;

    // Dependencies section
    if (proc.dependencies && proc.dependencies.length > 0) {
      markdown += '## Dependencies\n\n';
      markdown += 'This procedure depends on:\n\n';
      proc.dependencies.forEach((dep) => {
        markdown += `- **${dep.referencedSchema}.${dep.referencedObject}** (${dep.referencedType})\n`;
      });
      markdown += '\n';
    }

    if (proc.parameters && proc.parameters.length > 0) {
      markdown += '## Parameters\n\n';
      markdown += '| Name | Type | Output | Default |\n';
      markdown += '|------|------|--------|---------|\n';
      proc.parameters.forEach((param) => {
        markdown += `| \`${param.name}\` | ${param.dataType} | ${param.isOutput ? 'Yes' : 'No'} | ${param.hasDefaultValue ? 'Yes' : 'No'} |\n`;
      });
      markdown += '\n';
    }
    if (proc.definition) {
      markdown += '## Definition\n\n';
      markdown += '```sql\n';
      markdown += proc.definition;
      markdown += '\n```\n\n';
    }

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;

    return markdown;
  }

  /**
   * Generate markdown for a function
   */
  generateFunctionMarkdown(func) {
    const dependsOn = (func.dependencies || []).map((dep) => dep.referencedObject);
    const columnUsage = MarkdownGenerator.extractSqlColumnUsage(
      func.definition,
      func,
      this.metadata
    );
    const frontmatter = applyDictionaryEnrichmentContract(
      {
        id: func.id,
        name: func.name,
        server: func.serverName || this.metadata.serverName || 'unknown',
        database: this.metadata.database,
        type: 'function',
        schema: func.schema,
        owner: 'Data Team',
        tags: ['function', 'auto-extracted'],
        depends_on: dependsOn, // ADDED: Wires up the graph
        lineage_quality: {
          validated_edges: dependsOn.length,
          probable_edges: 0,
          unresolved_facts: 0,
        },
        dependency_count: func.dependencies?.length || 0,
        parameter_count: func.parameters?.length || 0,
        column_usage: columnUsage.column_usage,
        unresolved_column_usage: columnUsage.unresolved_column_usage,
        column_risk_flags: columnUsage.column_risk_flags,
        extracted_at: this.metadata.extractedAt,
      },
      { extractedAt: this.metadata.extractedAt }
    );

    let markdown = renderFrontmatter(frontmatter);

    markdown += '## Overview\n\n';
    markdown += func.description || 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += `- **Type**: ${func.type}\n`;
    markdown += `- **Schema**: ${func.schema}\n\n`;

    // Dependencies section
    if (func.dependencies && func.dependencies.length > 0) {
      markdown += '## Dependencies\n\n';
      markdown += 'This function depends on:\n\n';
      func.dependencies.forEach((dep) => {
        markdown += `- **${dep.referencedSchema}.${dep.referencedObject}** (${dep.referencedType})\n`;
      });
      markdown += '\n';
    }

    if (func.parameters && func.parameters.length > 0) {
      markdown += '## Parameters\n\n';
      markdown += '| Name | Type | Output | Default |\n';
      markdown += '|------|------|--------|---------|\n';
      func.parameters.forEach((param) => {
        markdown += `| \`${param.name}\` | ${param.dataType} | ${param.isOutput ? 'Yes' : 'No'} | ${param.hasDefaultValue ? 'Yes' : 'No'} |\n`;
      });
      markdown += '\n';
    }
    if (func.definition) {
      markdown += '## Definition\n\n';
      markdown += '```sql\n';
      markdown += func.definition;
      markdown += '\n```\n\n';
    }

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;

    return markdown;
  }

  /**
   * Generate markdown for a trigger
   */
  generateTriggerMarkdown(trigger) {
    const dependsOn = (trigger.dependencies || []).map((dep) => dep.referencedObject);
    const columnUsage = MarkdownGenerator.extractSqlColumnUsage(
      trigger.definition,
      trigger,
      this.metadata
    );
    const frontmatter = applyDictionaryEnrichmentContract(
      {
        id: trigger.id,
        name: trigger.name,
        server: trigger.serverName || this.metadata.serverName || 'unknown',
        database: this.metadata.database,
        type: 'procedure', // Store triggers as 'procedure'
        schema: trigger.schema,
        owner: 'Data Team',
        parent_object: trigger.parentObject,
        tags: ['trigger', 'auto-extracted'],
        depends_on: dependsOn, // ADDED: Wires up the graph
        lineage_quality: {
          validated_edges: dependsOn.length,
          probable_edges: 0,
          unresolved_facts: 0,
        },
        dependency_count: trigger.dependencies?.length || 0,
        column_usage: columnUsage.column_usage,
        unresolved_column_usage: columnUsage.unresolved_column_usage,
        column_risk_flags: columnUsage.column_risk_flags,
        extracted_at: this.metadata.extractedAt,
      },
      { extractedAt: this.metadata.extractedAt }
    );

    let markdown = renderFrontmatter(frontmatter);

    markdown += '## Overview\n\n';
    markdown += trigger.description || 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += '- **Type**: Trigger\n';
    markdown += `- **Schema**: ${trigger.schema}\n`;
    markdown += `- **Parent Object**: ${trigger.parentObject}\n\n`;

    // Dependencies section
    if (trigger.dependencies && trigger.dependencies.length > 0) {
      markdown += '## Dependencies\n\n';
      markdown += 'This trigger depends on:\n\n';
      trigger.dependencies.forEach((dep) => {
        markdown += `- **${dep.referencedSchema}.${dep.referencedObject}** (${dep.referencedType})\n`;
      });
      markdown += '\n';
    }

    if (trigger.definition) {
      markdown += '## Definition\n\n';
      markdown += '```sql\n';
      markdown += trigger.definition;
      markdown += '\n```\n\n';
    }

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;

    return markdown;
  }

  /**
   * Generate markdown for a synonym
   */
  generateSynonymMarkdown(synonym) {
    let dependencies = [];
    if (Array.isArray(synonym.dependencies)) {
      dependencies = synonym.dependencies.map((dep) =>
        normalizeSynonymReference(dep.referencedObject || dep)
      );
    } else if (synonym.baseObjectName) {
      dependencies = [normalizeSynonymReference(synonym.baseObjectName)];
    }

    const frontmatter = applyDictionaryEnrichmentContract(
      {
        id: synonym.id,
        name: synonym.name,
        server: synonym.serverName || this.metadata.serverName || 'unknown',
        database: this.metadata.database,
        type: 'synonym',
        schema: synonym.schema,
        owner: 'Data Team',
        tags: ['synonym', 'auto-extracted'],
        depends_on: dependencies,
        lineage_quality: {
          validated_edges: dependencies.length,
          probable_edges: 0,
          unresolved_facts: 0,
        },
        extracted_at: this.metadata.extractedAt,
      },
      { extractedAt: this.metadata.extractedAt }
    );

    let markdown = renderFrontmatter(frontmatter);

    markdown += '## Overview\n\n';
    markdown += synonym.description || 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += '- **Type**: Synonym\n';
    markdown += `- **Schema**: ${synonym.schema}\n`;
    markdown += `- **Base Object**: ${synonym.baseObjectName || 'n/a'}\n\n`;

    if (synonym.baseObjectName) {
      markdown += '## Base Object\n\n';
      markdown += `- **${synonym.baseObjectName}**\n\n`;
    }

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;

    return markdown;
  }

  /**
   * Generate all markdowns (tables + synonyms + views + procs + functions + triggers)
   */
  generateAllMarkdowns() {
    const markdowns = [];

    if (this.metadata.synonyms) {
      this.metadata.synonyms.forEach((synonym) => {
        markdowns.push({
          fileName: `${synonym.schema}__${synonym.name}.md`,
          directory: `servers/${normalizeSegment(synonym.serverName || this.metadata.serverName)}/databases/${normalizeSegment(this.metadata.database)}/synonyms`,
          content: this.generateSynonymMarkdown(synonym),
        });
      });
    }

    // Generate markdown for each table
    if (this.metadata.tables) {
      this.metadata.tables.forEach((table) => {
        markdowns.push({
          fileName: `${table.schema}__${table.name}.md`,
          directory: `servers/${normalizeSegment(table.serverName || this.metadata.serverName)}/databases/${normalizeSegment(this.metadata.database)}/tables`,
          content: this.generateTableMarkdown(table),
        });
      });
    }

    // Generate markdown for each view
    if (this.metadata.views) {
      this.metadata.views.forEach((view) => {
        markdowns.push({
          fileName: `${view.schema}__${view.name}.md`,
          directory: `servers/${normalizeSegment(view.serverName || this.metadata.serverName)}/databases/${normalizeSegment(this.metadata.database)}/views`,
          content: this.generateViewMarkdown(view),
        });
      });
    }

    // Generate markdown for each stored procedure
    if (this.metadata.storedProcedures) {
      this.metadata.storedProcedures.forEach((proc) => {
        markdowns.push({
          fileName: `${proc.schema}__${proc.name}.md`,
          directory: `servers/${normalizeSegment(proc.serverName || this.metadata.serverName)}/databases/${normalizeSegment(this.metadata.database)}/stored_procedures`,
          content: this.generateStoredProcedureMarkdown(proc),
        });
      });
    }

    // Generate markdown for each function
    if (this.metadata.functions) {
      this.metadata.functions.forEach((func) => {
        markdowns.push({
          fileName: `${func.schema}__${func.name}.md`,
          directory: `servers/${normalizeSegment(func.serverName || this.metadata.serverName)}/databases/${normalizeSegment(this.metadata.database)}/functions`,
          content: this.generateFunctionMarkdown(func),
        });
      });
    }

    // Generate markdown for each trigger
    if (this.metadata.triggers) {
      this.metadata.triggers.forEach((trigger) => {
        markdowns.push({
          fileName: `${trigger.schema}__${trigger.name}.md`,
          directory: `servers/${normalizeSegment(trigger.serverName || this.metadata.serverName)}/databases/${normalizeSegment(this.metadata.database)}/triggers`,
          content: this.generateTriggerMarkdown(trigger),
        });
      });
    }

    return markdowns;
  }
}

export default MarkdownGenerator;
