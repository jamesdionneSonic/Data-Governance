/**
 * Column Lineage Resolver
 * Promotes only exact, validated column-to-column mappings into column_lineage.
 */

const LEGAL_TRANSFORM_TYPES = new Set([
  'direct',
  'cast',
  'rename',
  'derived',
  'aggregate',
  'lookup',
  'constant',
  'case_expression',
  'calculation',
  'dynamic_or_unresolved',
]);

const SOURCE_USAGE_TYPES = new Set([
  'read',
  'join_key',
  'filter',
  'group_by',
  'order_by',
  'calculation',
  'merge_key',
  'lookup_key',
  'lookup_output',
]);

const TARGET_USAGE_TYPES = new Set(['insert_target', 'update_target']);

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeRef(value) {
  return String(value ?? '')
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/^'+|'+$/g, '')
    .replace(/\]\.\[/g, '.')
    .replace(/\[|\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeKey(value) {
  return normalizeRef(value).toLowerCase();
}

function splitReference(value) {
  return normalizeRef(value).split('.').filter(Boolean);
}

function compactEvidence(value, maxLength = 300) {
  const text = String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function cleanRecord(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => {
      if (value === null || value === undefined || value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
  );
}

function objectIdFor(mapKey, metadata = {}) {
  return String(metadata.id || mapKey || '').trim();
}

function addMulti(map, key, value) {
  const normalized = normalizeKey(key);
  if (!normalized || !value) return;
  if (!map.has(normalized)) map.set(normalized, new Set());
  map.get(normalized).add(value);
}

function objectReferences(objectId, metadata = {}) {
  const server = metadata.server || metadata.serverName || metadata.server_name || '';
  const database = metadata.database || '';
  const schema = metadata.schema || '';
  const name = metadata.name || metadata.packageName || metadata.package_name || '';
  const refs = [
    objectId,
    server && database && schema && name ? `${server}.${database}.${schema}.${name}` : '',
    database && schema && name ? `${database}.${schema}.${name}` : '',
    schema && name ? `${schema}.${name}` : '',
  ];

  if (metadata.type === 'package') {
    refs.push(
      metadata.packageName,
      metadata.package_name,
      metadata.packagePath,
      metadata.package_path
    );
  }

  return refs.filter(Boolean);
}

export function buildColumnResolutionIndex(objects = new Map()) {
  const objectById = new Map();
  const objectRefIndex = new Map();
  const columnById = new Map();
  const columnByObjectAndName = new Map();

  for (const [mapKey, metadata] of objects.entries()) {
    const objectId = objectIdFor(mapKey, metadata);
    if (!objectId) continue;

    const objectRecord = {
      id: objectId,
      metadata,
    };
    objectById.set(normalizeKey(objectId), objectRecord);

    for (const reference of objectReferences(objectId, metadata)) {
      addMulti(objectRefIndex, reference, objectId);
    }

    for (const column of ensureArray(metadata.columns)) {
      if (!column || typeof column !== 'object' || !column.name) continue;
      const columnId = String(column.column_id || `${objectId}.${column.name}`).trim();
      const columnRecord = {
        column_id: columnId,
        object_id: objectId,
        object: metadata,
        column,
        name: column.name,
      };
      columnById.set(normalizeKey(columnId), columnRecord);
      columnByObjectAndName.set(
        `${normalizeKey(objectId)}|${normalizeKey(column.name)}`,
        columnRecord
      );
    }
  }

  return {
    objectById,
    objectRefIndex,
    columnById,
    columnByObjectAndName,
  };
}

function exactObjectRefsForCandidate(index, objectId) {
  const objectRecord = index.objectById.get(normalizeKey(objectId));
  if (!objectRecord) return new Set();
  return new Set(objectReferences(objectRecord.id, objectRecord.metadata).map(normalizeKey));
}

function resolveObjectIds(index, reference, candidateObjectIds = []) {
  const normalizedReference = normalizeKey(reference);
  if (!normalizedReference) {
    return {
      status: 'unresolved',
      reason: 'object_reference_missing',
      matches: [],
    };
  }

  const directObject = index.objectById.get(normalizedReference);
  if (directObject) {
    return { status: 'validated', reason: '', matches: [directObject.id] };
  }

  const parts = splitReference(reference);
  const scopedCandidates = Array.from(
    new Set(
      ensureArray(candidateObjectIds)
        .filter(Boolean)
        .map((candidate) => String(candidate))
    )
  );
  if (scopedCandidates.length > 0) {
    const matches = scopedCandidates.filter((candidateId) =>
      exactObjectRefsForCandidate(index, candidateId).has(normalizedReference)
    );
    if (matches.length === 1) {
      return { status: 'validated', reason: '', matches };
    }
    if (matches.length > 1) {
      return {
        status: 'rejected',
        reason: 'ambiguous_scoped_object_reference',
        matches,
      };
    }
  }

  if (parts.length < 3) {
    return {
      status: 'rejected',
      reason:
        parts.length <= 1
          ? 'name_only_object_reference_not_promoted'
          : 'partial_object_reference_not_promoted',
      matches: [],
    };
  }

  const globalMatches = Array.from(index.objectRefIndex.get(normalizedReference) || []);
  if (globalMatches.length === 1) {
    return { status: 'validated', reason: '', matches: globalMatches };
  }
  if (globalMatches.length > 1) {
    return {
      status: 'rejected',
      reason: 'ambiguous_object_reference',
      matches: globalMatches,
    };
  }

  return {
    status: 'unresolved',
    reason: 'object_reference_not_found',
    matches: [],
  };
}

function resolveColumnReference(index, reference = {}) {
  const columnId = normalizeRef(reference.column_id || reference.columnId);
  if (columnId) {
    const match = index.columnById.get(normalizeKey(columnId));
    if (match) {
      return {
        status: 'validated',
        column_id: match.column_id,
        object_id: match.object_id,
        column_name: match.name,
      };
    }
    return {
      status: 'rejected',
      reason: 'canonical_column_id_not_found',
      evidence_text: columnId,
    };
  }

  const columnName = normalizeRef(reference.column_name || reference.columnName);
  if (!columnName) {
    return {
      status: 'unresolved',
      reason: 'column_name_missing',
    };
  }

  let objectResolution;
  if (reference.object_id || reference.objectId) {
    objectResolution = resolveObjectIds(index, reference.object_id || reference.objectId);
  } else {
    objectResolution = resolveObjectIds(
      index,
      reference.object_ref || reference.objectRef,
      reference.candidateObjectIds
    );
  }

  if (objectResolution.status !== 'validated') {
    const scopedColumn = resolveUniqueScopedCandidateColumn(
      index,
      reference.candidateObjectIds,
      columnName,
      reference.object_ref || reference.objectRef || reference.object_id || reference.objectId
    );
    if (scopedColumn) {
      return {
        status: 'validated',
        column_id: scopedColumn.column_id,
        object_id: scopedColumn.object_id,
        column_name: scopedColumn.name,
      };
    }

    return {
      status: objectResolution.status,
      reason: objectResolution.reason,
      object_ref:
        reference.object_ref || reference.objectRef || reference.object_id || reference.objectId,
      column_name: columnName,
      matches: objectResolution.matches,
    };
  }

  const objectId = objectResolution.matches[0];
  const column = index.columnByObjectAndName.get(
    `${normalizeKey(objectId)}|${normalizeKey(columnName)}`
  );
  if (!column) {
    return {
      status: 'unresolved',
      reason: 'column_not_found_on_resolved_object',
      object_id: objectId,
      column_name: columnName,
    };
  }

  return {
    status: 'validated',
    column_id: column.column_id,
    object_id: objectId,
    column_name: column.name,
  };
}

function candidateMatchesObjectHint(index, candidateId = '', objectHint = '') {
  const hint = normalizeKey(objectHint);
  if (!hint) return true;
  const objectRecord = index.objectById.get(normalizeKey(candidateId));
  if (!objectRecord) return false;

  const hintParts = splitReference(objectHint);
  const metadata = objectRecord.metadata || {};
  const refs = objectReferences(objectRecord.id, metadata).map(normalizeKey);
  if (refs.some((ref) => ref === hint || ref.endsWith(`.${hint}`))) return true;

  if (hintParts.length === 1) {
    return normalizeKey(metadata.name) === hint;
  }
  if (hintParts.length === 2) {
    return (
      normalizeKey(`${metadata.schema || ''}.${metadata.name || ''}`) === hint ||
      normalizeKey(`${metadata.database || ''}.${metadata.name || ''}`) === hint
    );
  }
  return false;
}

function resolveUniqueScopedCandidateColumn(
  index,
  candidateObjectIds = [],
  columnName = '',
  objectHint = ''
) {
  const normalizedColumn = normalizeKey(columnName);
  if (!normalizedColumn) return null;

  const candidateIds = Array.from(
    new Set(
      ensureArray(candidateObjectIds)
        .filter(Boolean)
        .map((candidate) => String(candidate))
    )
  );
  const hintMatches = candidateIds.filter((candidateId) =>
    candidateMatchesObjectHint(index, candidateId, objectHint)
  );
  const scopedCandidateIds = hintMatches.length > 0 ? hintMatches : candidateIds;
  const matches = [];

  for (const candidateId of scopedCandidateIds) {
    const objectId = index.objectById.get(normalizeKey(candidateId))?.id;
    if (!objectId) continue;
    const column = index.columnByObjectAndName.get(`${normalizeKey(objectId)}|${normalizedColumn}`);
    if (column) matches.push(column);
  }

  return matches.length === 1 ? matches[0] : null;
}

function normalizeTransformType(value, expression = '') {
  const raw = normalizeKey(value);
  if (LEGAL_TRANSFORM_TYPES.has(raw)) return raw;

  const expr = String(expression || '').trim();
  if (!expr) return 'direct';
  if (/\bCASE\b/i.test(expr)) return 'case_expression';
  if (/\b(CAST|CONVERT|TRY_CAST|TRY_CONVERT)\s*\(/i.test(expr)) return 'cast';
  if (/\b(SUM|COUNT|AVG|MIN|MAX)\s*\(/i.test(expr)) return 'aggregate';
  if (/^[N]?'[^']*'$|^\d+(?:\.\d+)?$/i.test(expr)) return 'constant';
  if (/[+\-*/%]|\b(CONCAT|COALESCE|ISNULL|NULLIF|DATEADD|DATEDIFF)\s*\(/i.test(expr)) {
    return 'calculation';
  }

  return 'dynamic_or_unresolved';
}

function transformConfidence(transformType) {
  if (transformType === 'direct' || transformType === 'rename') return 1.0;
  if (transformType === 'lookup') return 0.9;
  if (transformType === 'dynamic_or_unresolved') return 0.0;
  return 0.95;
}

function statusRank(...statuses) {
  if (statuses.includes('rejected')) return 'rejected';
  if (statuses.includes('unresolved')) return 'unresolved';
  return 'probable';
}

function makeNonPromotedFact(status, payload = {}) {
  return cleanRecord({
    process_id: payload.process_id,
    package_id: payload.package_id,
    source_object: payload.source_object,
    target_object: payload.target_object,
    source_column_name: payload.source_column_name,
    target_column_name: payload.target_column_name,
    source_column_id: payload.source_column_id,
    target_column_id: payload.target_column_id,
    transform_type: payload.transform_type,
    expression: compactEvidence(payload.expression),
    evidence_type: payload.evidence_type || 'column_lineage_resolution',
    evidence_text: compactEvidence(payload.evidence_text || payload.expression || payload.reason),
    reason: payload.reason,
    suggested_action:
      payload.suggested_action ||
      'Provide exact object and column metadata before promoting this column lineage edge.',
    validation_status: status,
    confidence: status === 'probable' ? 0.5 : 0,
  });
}

function makeValidatedLineage(source, target, payload = {}) {
  const transformType = normalizeTransformType(payload.transform_type, payload.expression);
  return cleanRecord({
    source_column_id: source.column_id,
    target_column_id: target.column_id,
    process_id: payload.process_id,
    transform_type: transformType,
    expression: compactEvidence(payload.expression),
    evidence_type: payload.evidence_type || 'column_lineage_resolution',
    evidence_text: compactEvidence(payload.evidence_text || payload.expression),
    validation_status: 'validated',
    confidence: transformConfidence(transformType),
  });
}

function dedupePush(collection, record) {
  const key = [
    record.process_id || '',
    record.package_id || '',
    record.source_column_id || '',
    record.target_column_id || '',
    record.source_object || '',
    record.target_object || '',
    record.source_column_name || '',
    record.target_column_name || '',
    record.transform_type || '',
    record.validation_status || '',
    record.reason || '',
    record.evidence_type || '',
    record.evidence_text || '',
  ]
    .map((value) => String(value || '').toLowerCase())
    .join('|');
  if (collection._seen.has(key)) return;
  collection._seen.add(key);
  collection.push(record);
}

function initBucket() {
  const bucket = [];
  Object.defineProperty(bucket, '_seen', {
    value: new Set(),
    enumerable: false,
  });
  return bucket;
}

function resolveColumnPair(index, payload, output) {
  const transformType = normalizeTransformType(payload.transform_type, payload.expression);
  if (!LEGAL_TRANSFORM_TYPES.has(transformType) || transformType === 'dynamic_or_unresolved') {
    dedupePush(
      output.unresolved,
      makeNonPromotedFact('unresolved', {
        ...payload,
        transform_type: transformType,
        reason: 'dynamic_or_unresolved_transform_not_promoted',
      })
    );
    return;
  }

  const source = resolveColumnReference(index, payload.source);
  const target = resolveColumnReference(index, payload.target);

  if (source.status === 'validated' && target.status === 'validated') {
    dedupePush(
      output.validated,
      makeValidatedLineage(source, target, { ...payload, transform_type: transformType })
    );
    return;
  }

  const status = statusRank(source.status, target.status);
  const reason = [
    source.status !== 'validated' ? `source_${source.reason}` : '',
    target.status !== 'validated' ? `target_${target.reason}` : '',
  ]
    .filter(Boolean)
    .join('; ');

  dedupePush(
    output[status],
    makeNonPromotedFact(status, {
      ...payload,
      transform_type: transformType,
      source_column_id: source.column_id || payload.source?.column_id || payload.source?.columnId,
      target_column_id: target.column_id || payload.target?.column_id || payload.target?.columnId,
      source_column_name: payload.source?.column_name || payload.source?.columnName,
      target_column_name: payload.target?.column_name || payload.target?.columnName,
      source_object:
        payload.source?.object_ref || payload.source?.objectRef || payload.source?.object_id,
      target_object:
        payload.target?.object_ref || payload.target?.objectRef || payload.target?.object_id,
      reason,
    })
  );
}

function resolveExistingLineage(metadata, index, output) {
  for (const record of ensureArray(metadata.column_lineage)) {
    const transformType = normalizeTransformType(record.transform_type, record.expression);
    if (!LEGAL_TRANSFORM_TYPES.has(transformType)) {
      dedupePush(
        output.rejected,
        makeNonPromotedFact('rejected', {
          ...record,
          process_id: record.process_id || metadata.id,
          reason: 'invalid_transform_type',
        })
      );
      continue;
    }

    resolveColumnPair(
      index,
      {
        process_id: record.process_id || metadata.id,
        source: { column_id: record.source_column_id },
        target: { column_id: record.target_column_id },
        transform_type: transformType,
        expression: record.expression,
        evidence_type: record.evidence_type || 'existing_column_lineage',
        evidence_text: record.evidence_text,
      },
      output
    );
  }
}

function resolveSsisMappings(metadata, index, output) {
  const packageId = metadata.package_id || metadata.packageId || metadata.id;
  const sourceCandidates = [
    ...ensureArray(metadata.reads_from),
    ...ensureArray(metadata.depends_on),
  ];
  const targetCandidates = ensureArray(metadata.writes_to);

  for (const mapping of ensureArray(metadata.ssis_column_mappings)) {
    const processId = mapping.package_id || mapping.packageId || packageId;
    if (mapping.validation_status && mapping.validation_status !== 'validated') {
      dedupePush(
        output.unresolved,
        makeNonPromotedFact('unresolved', {
          process_id: processId,
          package_id: processId,
          source_object: mapping.source_object,
          target_object: mapping.destination_object,
          source_column_name: mapping.input_column,
          target_column_name: mapping.external_metadata_column || mapping.output_column,
          transform_type: mapping.transform_type || 'dynamic_or_unresolved',
          expression: mapping.expression,
          evidence_type: mapping.evidence_type,
          evidence_text: mapping.evidence_text,
          reason: 'ssis_mapping_not_validated',
        })
      );
      continue;
    }

    resolveColumnPair(
      index,
      {
        process_id: processId,
        package_id: processId,
        source: {
          object_ref: mapping.source_object,
          column_name: mapping.input_column || mapping.source_column || mapping.output_column,
          candidateObjectIds: sourceCandidates,
        },
        target: {
          object_ref: mapping.destination_object,
          column_name:
            mapping.external_metadata_column || mapping.output_column || mapping.target_column,
          candidateObjectIds: targetCandidates,
        },
        transform_type: mapping.transform_type,
        expression: mapping.expression,
        evidence_type: mapping.evidence_type || 'ssis_dataflow_column_mapping',
        evidence_text: mapping.evidence_text,
      },
      output
    );
  }

  for (const unresolved of ensureArray(metadata.unresolved_ssis_column_mappings)) {
    const processId = unresolved.package_id || unresolved.packageId || packageId;
    dedupePush(
      output.unresolved,
      makeNonPromotedFact('unresolved', {
        process_id: processId,
        package_id: processId,
        source_object: unresolved.source_object,
        target_object: unresolved.destination_object,
        source_column_name: unresolved.input_column,
        target_column_name: unresolved.output_column,
        transform_type: 'dynamic_or_unresolved',
        expression: unresolved.expression,
        evidence_type: unresolved.evidence_type || 'ssis_unresolved_column_mapping',
        evidence_text: unresolved.evidence_text,
        reason: unresolved.reason || 'unresolved_ssis_column_mapping',
        suggested_action:
          unresolved.suggested_action ||
          'Resolve dynamic SSIS metadata or inspect the package XML before trusting column impact.',
      })
    );
  }
}

function sourceUsagesForContext(usages, context) {
  return usages.filter(
    (usage) => SOURCE_USAGE_TYPES.has(usage.usage_type) && usage.usage_context === context
  );
}

function resolveSqlUsage(metadata, output, options = {}) {
  const usages = ensureArray(metadata.column_usage);
  const targets = usages.filter((usage) => TARGET_USAGE_TYPES.has(usage.usage_type));
  const diagnosticLimit = Math.max(
    0,
    Number(options.maxSqlColumnLineageDiagnosticsPerObject ?? 50)
  );
  let emittedDiagnostics = 0;

  const pushSqlDiagnostic = (bucket, record) => {
    if (emittedDiagnostics >= diagnosticLimit) return;
    dedupePush(output[bucket], record);
    emittedDiagnostics += 1;
  };

  for (const target of targets) {
    const sources = sourceUsagesForContext(usages, target.usage_context);

    if (sources.length === 1) {
      const source = sources[0];
      const status =
        target.usage_context === 'set_clause' || target.usage_context === 'merge_update_set'
          ? 'probable'
          : 'probable';
      pushSqlDiagnostic(
        status,
        makeNonPromotedFact(status, {
          process_id: metadata.id,
          source_column_id: source.column_id,
          target_column_id: target.column_id,
          source_column_name: source.column_name,
          target_column_name: target.column_name,
          transform_type: normalizeTransformType(source.usage_type, source.expression),
          expression: source.expression,
          evidence_type: source.evidence_type || 'sql_definition',
          evidence_text: source.evidence_text,
          reason: 'sql_column_usage_does_not_encode_explicit_source_target_mapping_id',
          suggested_action:
            'Add resolver evidence that ties this source expression to the target column before promotion.',
        })
      );
      continue;
    }

    if (sources.length > 1) {
      pushSqlDiagnostic(
        'probable',
        makeNonPromotedFact('probable', {
          process_id: metadata.id,
          target_column_id: target.column_id,
          target_column_name: target.column_name,
          transform_type: 'calculation',
          evidence_type: target.evidence_type || 'sql_definition',
          evidence_text: target.evidence_text,
          reason: 'multiple_source_columns_share_target_context',
          suggested_action:
            'Capture assignment-level SQL parser evidence before promoting this target column lineage.',
        })
      );
      continue;
    }

    pushSqlDiagnostic(
      'unresolved',
      makeNonPromotedFact('unresolved', {
        process_id: metadata.id,
        target_column_id: target.column_id,
        target_column_name: target.column_name,
        transform_type: 'dynamic_or_unresolved',
        evidence_type: target.evidence_type || 'sql_definition',
        evidence_text: target.evidence_text,
        reason: 'target_column_has_no_resolved_source_column',
      })
    );
  }

  for (const unresolved of ensureArray(metadata.unresolved_column_usage)) {
    pushSqlDiagnostic(
      'unresolved',
      makeNonPromotedFact('unresolved', {
        process_id: metadata.id,
        source_object: unresolved.object_id || unresolved.alias,
        source_column_name: unresolved.column_name,
        transform_type: 'dynamic_or_unresolved',
        expression: unresolved.expression,
        evidence_type: unresolved.evidence_type || 'sql_definition',
        evidence_text: unresolved.evidence_text,
        reason: unresolved.reason || 'unresolved_column_usage',
        suggested_action:
          unresolved.suggested_action ||
          'Resolve the SQL alias/object before trusting column-level impact.',
      })
    );
  }
}

export function resolveColumnLineage(objects = new Map(), options = {}) {
  const index = buildColumnResolutionIndex(objects);
  const output = {
    validated: initBucket(),
    probable: initBucket(),
    unresolved: initBucket(),
    rejected: initBucket(),
  };

  for (const [mapKey, metadata] of objects.entries()) {
    const objectId = objectIdFor(mapKey, metadata);
    const object = metadata.id ? metadata : { ...metadata, id: objectId };

    resolveExistingLineage(object, index, output);
    resolveSsisMappings(object, index, output);
    if (options.includeSqlUsage !== false) {
      resolveSqlUsage(object, output, options);
    }
  }

  return {
    validated: [...output.validated],
    probable: [...output.probable],
    unresolved: [...output.unresolved],
    rejected: [...output.rejected],
  };
}

export default {
  buildColumnResolutionIndex,
  resolveColumnLineage,
};
