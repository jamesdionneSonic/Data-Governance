function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function text(value) {
  return String(value || '').trim();
}

function lower(value) {
  return text(value).toLowerCase();
}

function objectId(mapKey, object = {}) {
  return text(object.id || mapKey);
}

function objectName(object = {}) {
  return text(object.name || object.objectName || object.packageName || object.id || 'unknown');
}

function schemaName(object = {}) {
  return text(object.schema || object.schemaName || object.object_schema || 'dbo');
}

function serverName(object = {}) {
  return text(object.server || object.serverName || object.server_name || 'local');
}

function normalizeColumn(column = {}, index = 0, parent = {}) {
  const name = text(
    column.name || column.column_name || column.columnName || column.id || `column_${index + 1}`
  );
  const semanticType =
    column.semantic_type ||
    column.semanticType ||
    (column.is_metric
      ? 'metric'
      : column.is_identifier
        ? 'identifier'
        : column.is_dimension
          ? 'dimension'
          : null);

  return {
    column_id: text(
      column.column_id || column.columnId || column.id || `${objectId(parent.id, parent)}.${name}`
    ),
    name,
    ordinal: Number(column.ordinal || column.ordinal_position || column.keyOrdinal || index + 1),
    data_type: text(
      column.data_type || column.dataType || column.type || column.system_type || 'unknown'
    ),
    nullable: column.nullable ?? column.is_nullable ?? column.isNullable ?? null,
    max_length: column.max_length ?? column.maxLength ?? null,
    precision: column.precision ?? null,
    scale: column.scale ?? null,
    description: text(column.description || column.business_definition || ''),
    business_name: text(column.business_name || column.businessName || ''),
    sensitivity: text(column.sensitivity || parent.sensitivity || ''),
    classifications: ensureArray(
      column.classifications || column.classification || column.classification_tags || column.tags
    ).filter(Boolean),
    semantic_type: semanticType,
    is_metric: Boolean(column.is_metric || semanticType === 'metric'),
    is_identifier: Boolean(column.is_identifier || semanticType === 'identifier'),
    is_dimension: Boolean(column.is_dimension || semanticType === 'dimension'),
    is_key: Boolean(
      column.is_key || column.primary_key || column.isPrimaryKey || column.keyOrdinal
    ),
    source_expression: text(
      column.expression || column.source_expression || column.calculation || ''
    ),
    dictionary_confidence: text(column.dictionary_confidence || ''),
  };
}

function countDownstream(lineageGraph, assetId) {
  if (!lineageGraph) return 0;
  let count = 0;
  for (const deps of lineageGraph.values()) {
    const values = deps instanceof Set ? Array.from(deps) : ensureArray(deps);
    if (values.includes(assetId)) count += 1;
  }
  return count;
}

function summarizeObject(mapKey, object, lineageGraph) {
  const id = objectId(mapKey, object);
  const columns = ensureArray(object.columns);
  const upstream = lineageGraph?.get(id);
  const upstreamCount = upstream instanceof Set ? upstream.size : ensureArray(upstream).length;

  return {
    id,
    name: objectName(object),
    type: text(object.type || 'object'),
    server: serverName(object),
    database: text(object.database || 'unknown'),
    schema: schemaName(object),
    owner: text(object.owner || 'unknown'),
    steward: text(object.steward || ''),
    domain_manager: text(object.domain_manager || ''),
    business_domain: text(object.business_domain || object.domain || ''),
    sensitivity: text(object.sensitivity || ''),
    tags: ensureArray(object.tags),
    description: text(object.description || ''),
    column_count: Number(object.column_count || columns.length || 0),
    upstream_count: Number(object.upstreamCount ?? upstreamCount),
    downstream_count: Number(object.downstreamCount ?? countDownstream(lineageGraph, id)),
    last_updated: object.last_updated || object.updated_at || null,
    file_path: object.filePath || object.file_path || null,
  };
}

function matchesQuery(summary, query) {
  if (!query) return true;
  const haystack = [
    summary.id,
    summary.name,
    summary.type,
    summary.server,
    summary.database,
    summary.schema,
    summary.owner,
    summary.steward,
    summary.business_domain,
    summary.description,
    ...summary.tags,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(lower(query));
}

export function buildSchemaDictionary(objects, lineageGraph = new Map(), filters = {}) {
  const limit = Math.max(1, Math.min(Number(filters.limit) || 100, 500));
  const offset = Math.max(0, Number(filters.offset) || 0);
  const database = lower(filters.database);
  const schema = lower(filters.schema);
  const type = lower(filters.type);
  const query = lower(filters.q || filters.query);

  const summaries = Array.from(objects || new Map())
    .map(([mapKey, object]) => summarizeObject(mapKey, object, lineageGraph))
    .filter((summary) => !database || lower(summary.database) === database)
    .filter((summary) => !schema || lower(summary.schema) === schema)
    .filter((summary) => !type || lower(summary.type) === type)
    .filter((summary) => matchesQuery(summary, query))
    .sort((a, b) =>
      [a.database, a.schema, a.name]
        .join('.')
        .localeCompare([b.database, b.schema, b.name].join('.'))
    );

  const hierarchy = new Map();
  for (const summary of summaries) {
    const key = `${summary.server}|${summary.database}|${summary.schema}`;
    if (!hierarchy.has(key)) {
      hierarchy.set(key, {
        server: summary.server,
        database: summary.database,
        schema: summary.schema,
        object_count: 0,
        column_count: 0,
        owners: new Set(),
        objects: [],
      });
    }
    const group = hierarchy.get(key);
    group.object_count += 1;
    group.column_count += summary.column_count;
    if (summary.owner) group.owners.add(summary.owner);
    group.objects.push(summary);
  }

  return {
    generated_at: new Date().toISOString(),
    filters: {
      database: filters.database || null,
      schema: filters.schema || null,
      type: filters.type || null,
      q: filters.q || filters.query || null,
    },
    pagination: {
      limit,
      offset,
      total: summaries.length,
    },
    summary: {
      total_objects: summaries.length,
      total_columns: summaries.reduce((sum, item) => sum + item.column_count, 0),
      databases: new Set(summaries.map((item) => item.database)).size,
      schemas: hierarchy.size,
    },
    hierarchy: Array.from(hierarchy.values()).map((group) => ({
      ...group,
      owners: Array.from(group.owners).sort(),
      objects: group.objects.slice(0, 25),
    })),
    objects: summaries.slice(offset, offset + limit),
  };
}

export function buildObjectDictionary(objects, lineageGraph = new Map(), assetId) {
  const object = objects?.get(assetId);
  if (!object) return null;

  const summary = summarizeObject(assetId, object, lineageGraph);
  const upstream = lineageGraph?.get(summary.id);
  const columns = ensureArray(object.columns).map((column, index) =>
    normalizeColumn(column, index, { ...object, id: summary.id })
  );

  return {
    generated_at: new Date().toISOString(),
    object: {
      ...summary,
      business_justification: text(object.business_justification || ''),
      business_processes: ensureArray(
        object.business_processes || object.business_process || object.use_cases
      ).filter(Boolean),
      related_dashboards: ensureArray(object.related_dashboards || object.dashboards).filter(
        Boolean
      ),
      documentation_links: ensureArray(object.documentation_links || object.links).filter(Boolean),
    },
    columns,
    relationships: {
      upstream: upstream instanceof Set ? Array.from(upstream) : ensureArray(upstream),
      downstream: Array.from(objects || new Map())
        .filter(([mapKey, candidate]) => {
          const deps = lineageGraph?.get(objectId(mapKey, candidate));
          return deps instanceof Set
            ? deps.has(summary.id)
            : ensureArray(deps).includes(summary.id);
        })
        .map(([mapKey, candidate]) => summarizeObject(mapKey, candidate, lineageGraph)),
    },
    completeness: {
      has_description: Boolean(summary.description),
      has_owner: Boolean(summary.owner && summary.owner !== 'unknown'),
      has_steward: Boolean(summary.steward),
      has_columns: columns.length > 0,
      has_business_domain: Boolean(summary.business_domain),
      has_business_justification: Boolean(object.business_justification),
    },
  };
}

export function buildDictionaryMarkdownExport(dictionary) {
  if (!dictionary) return '';
  const lines = [
    `# Schema Dictionary - ${dictionary.object.database}.${dictionary.object.schema}.${dictionary.object.name}`,
    '',
    `- Type: ${dictionary.object.type}`,
    `- Owner: ${dictionary.object.owner || 'unassigned'}`,
    `- Steward: ${dictionary.object.steward || 'unassigned'}`,
    `- Sensitivity: ${dictionary.object.sensitivity || 'unknown'}`,
    `- Business domain: ${dictionary.object.business_domain || 'unassigned'}`,
    '',
    '## Description',
    '',
    dictionary.object.description || 'No description captured.',
    '',
    '## Columns',
    '',
    '| Column | Type | Nullable | Semantic Type | Description |',
    '| --- | --- | --- | --- | --- |',
    ...dictionary.columns.map(
      (column) =>
        `| ${column.name} | ${column.data_type} | ${column.nullable ?? ''} | ${column.semantic_type || ''} | ${column.description || ''} |`
    ),
  ];
  return `${lines.join('\n')}\n`;
}

export function normalizeBusinessMetadataUpdates(input = {}) {
  const allowed = [
    'description',
    'owner',
    'steward',
    'domain_manager',
    'custodian',
    'sensitivity',
    'tags',
    'business_domain',
    'business_justification',
    'business_processes',
    'use_cases',
    'documentation_links',
    'related_dashboards',
  ];
  const updates = {};
  for (const field of allowed) {
    if (!(field in input)) continue;
    if (
      [
        'tags',
        'business_processes',
        'use_cases',
        'documentation_links',
        'related_dashboards',
      ].includes(field)
    ) {
      updates[field] = ensureArray(input[field])
        .flatMap((value) => (typeof value === 'string' ? value.split(',') : [value]))
        .map((value) => text(value))
        .filter(Boolean);
    } else {
      updates[field] = input[field];
    }
  }
  return updates;
}

export default {
  buildSchemaDictionary,
  buildObjectDictionary,
  buildDictionaryMarkdownExport,
  normalizeBusinessMetadataUpdates,
};
