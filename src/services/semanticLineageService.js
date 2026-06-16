function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function compactText(value, maxLength = 220) {
  const text = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function uniqueStrings(values = []) {
  return Array.from(new Set(values.filter(Boolean)));
}

function edgeId(source, target, semanticType) {
  return `${source}->${target}:${semanticType}`;
}

function objectLabel(metadata = {}, objectId = '') {
  if (metadata.schema && metadata.name) return `${metadata.schema}.${metadata.name}`;
  if (metadata.name) return metadata.name;
  return objectId;
}

function runtimeLocation(metadata = {}, objectId = '') {
  return {
    id: objectId,
    name: metadata.name || objectId,
    label: objectLabel(metadata, objectId),
    type: metadata.type || 'object',
    server: metadata.server || null,
    database: metadata.database || null,
    schema: metadata.schema || null,
    packageName: metadata.packageName || metadata.package_name || null,
    packagePath: metadata.packagePath || metadata.package_path || null,
    source_path: metadata.source_path || metadata.sourcePath || null,
  };
}

function isProcedureLike(metadata = {}) {
  const type = normalizeKey(metadata.type);
  return type === 'procedure' || type === 'stored_procedure' || type === 'proc';
}

function isOrchestratorLike(metadata = {}) {
  const type = normalizeKey(metadata.type);
  return type === 'ssis_package' || type === 'package' || type === 'job' || type === 'agent_job';
}

function inferReadRole(sourceMetadata = {}, consumerMetadata = {}) {
  const sourceSchema = normalizeKey(sourceMetadata.schema);
  const sourceName = normalizeKey(sourceMetadata.name);
  const sourceType = normalizeKey(sourceMetadata.type);
  const consumerType = normalizeKey(consumerMetadata.type);

  if (consumerType === 'view') return 'business_consumer_read';
  if (
    /^(stg|wrk|synwrk|stage|tmp|temp|landing|src)/.test(sourceName) ||
    ['stg', 'wrk', 'stage', 'etl_staging', 'landing', 'source'].includes(sourceSchema) ||
    sourceType === 'synonym'
  ) {
    return 'source_read';
  }
  if (
    /^(dim|lkp|lookup|ref|map)/.test(sourceName) ||
    /lookup|reference|bridge|xref/.test(sourceName)
  ) {
    return 'lookup_read';
  }
  return 'business_consumer_read';
}

function referenceTokens(objectId = '', metadata = {}) {
  const tokens = [
    objectId,
    metadata.name,
    metadata.schema && metadata.name ? `${metadata.schema}.${metadata.name}` : '',
    metadata.database && metadata.schema && metadata.name
      ? `${metadata.database}.${metadata.schema}.${metadata.name}`
      : '',
  ];
  return uniqueStrings(
    tokens
      .map((value) => String(value || '').trim())
      .filter(Boolean)
      .map((value) => value.replace(/\[|\]/g, ''))
  );
}

function mentionsTarget(definition = '', targetId = '', targetMetadata = {}) {
  const text = normalizeKey(definition).replace(/\[|\]/g, '');
  if (!text) return false;
  return referenceTokens(targetId, targetMetadata).some((token) =>
    text.includes(normalizeKey(token))
  );
}

function inferWriteOperation(processMetadata = {}, targetId = '', targetMetadata = {}) {
  const definition = String(processMetadata.definition || '');
  const normalizedDefinition = normalizeKey(definition).replace(/\[|\]/g, '');
  const readsFrom = new Set(ensureArray(processMetadata.reads_from).map(normalizeKey));
  const writesTo = new Set(ensureArray(processMetadata.writes_to).map(normalizeKey));
  const selfTarget = readsFrom.has(normalizeKey(targetId)) && writesTo.has(normalizeKey(targetId));

  const hasMerge =
    /\bmerge\b/.test(normalizedDefinition) && mentionsTarget(definition, targetId, targetMetadata);
  const hasInsert = /\binsert\s+into\b/.test(normalizedDefinition)
    ? mentionsTarget(definition, targetId, targetMetadata) || writesTo.has(normalizeKey(targetId))
    : false;
  const hasUpdate = /\bupdate\b/.test(normalizedDefinition)
    ? mentionsTarget(definition, targetId, targetMetadata) || writesTo.has(normalizeKey(targetId))
    : false;
  const hasDelete =
    /\bdelete\b/.test(normalizedDefinition) && mentionsTarget(definition, targetId, targetMetadata);

  if (hasMerge || (hasInsert && hasUpdate) || selfTarget) return 'upsert_write';
  if (hasUpdate) return 'update_write';
  if (hasInsert) return 'insert_write';
  if (hasDelete) return 'delete_write';
  return 'write';
}

function buildWriteEvidence(
  processMetadata = {},
  processId = '',
  targetMetadata = {},
  targetId = ''
) {
  const operation = inferWriteOperation(processMetadata, targetId, targetMetadata);
  const processLabel = objectLabel(processMetadata, processId);
  const targetLabel = objectLabel(targetMetadata, targetId);
  const messages = {
    upsert_write: `${processLabel} upserts ${targetLabel}.`,
    update_write: `${processLabel} updates ${targetLabel}.`,
    insert_write: `${processLabel} inserts rows into ${targetLabel}.`,
    delete_write: `${processLabel} deletes rows from ${targetLabel}.`,
    write: `${processLabel} writes to ${targetLabel}.`,
  };

  return {
    operation,
    evidence: messages[operation] || messages.write,
  };
}

function buildSemanticEdge({
  source,
  target,
  semanticType,
  rawTypes = [],
  confidence = 0.75,
  evidence = '',
  operation = null,
  role = null,
  showInDownstream = true,
  showInTechnicalDetail = true,
}) {
  return {
    id: edgeId(source, target, semanticType),
    source,
    target,
    semantic_type: semanticType,
    raw_types: uniqueStrings(rawTypes),
    confidence,
    evidence: compactText(evidence),
    operation,
    role,
    show_in_downstream: showInDownstream,
    show_in_technical_detail: showInTechnicalDetail,
  };
}

export function buildSemanticLineageEdges(objects = new Map()) {
  const edges = [];
  const seen = new Set();

  const pushEdge = (edge) => {
    if (!edge?.source || !edge?.target) return;
    if (seen.has(edge.id)) return;
    seen.add(edge.id);
    edges.push(edge);
  };

  for (const [objectId, metadata] of objects.entries()) {
    const readsFrom = ensureArray(metadata.reads_from);
    const writesTo = ensureArray(metadata.writes_to);
    const calls = ensureArray(metadata.calls);
    const writeTargets = new Set(writesTo.map(normalizeKey));

    for (const targetId of writesTo) {
      const targetMetadata = objects.get(targetId) || {};
      const { operation, evidence } = buildWriteEvidence(
        metadata,
        objectId,
        targetMetadata,
        targetId
      );
      pushEdge(
        buildSemanticEdge({
          source: objectId,
          target: targetId,
          semanticType: operation,
          rawTypes: ['writes_to', 'created_by'],
          confidence: 0.95,
          evidence,
          operation,
          role: 'maintains_target',
        })
      );
    }

    for (const sourceId of readsFrom) {
      const sourceMetadata = objects.get(sourceId) || {};
      if (writeTargets.has(normalizeKey(sourceId))) {
        pushEdge(
          buildSemanticEdge({
            source: sourceId,
            target: objectId,
            semanticType: 'target_maintenance_read',
            rawTypes: ['reads_from', 'used_by'],
            confidence: 0.9,
            evidence: `${objectLabel(metadata, objectId)} reads ${objectLabel(sourceMetadata, sourceId)} only to match, compare, or avoid duplicate writes during target maintenance.`,
            role: 'maintenance_read',
            showInDownstream: false,
          })
        );
        continue;
      }

      const semanticType = inferReadRole(sourceMetadata, metadata);
      pushEdge(
        buildSemanticEdge({
          source: sourceId,
          target: objectId,
          semanticType,
          rawTypes: ['reads_from'],
          confidence: semanticType === 'source_read' ? 0.85 : 0.8,
          evidence: `${objectLabel(metadata, objectId)} reads ${objectLabel(sourceMetadata, sourceId)} as a ${semanticType.replace(/_/g, ' ')}.`,
          role: semanticType.replace(/_read$/, ''),
        })
      );
    }

    for (const calledId of calls) {
      const calledMetadata = objects.get(calledId) || {};
      const semanticType =
        isOrchestratorLike(metadata) || isProcedureLike(calledMetadata) ? 'orchestrates' : 'calls';
      pushEdge(
        buildSemanticEdge({
          source: objectId,
          target: calledId,
          semanticType,
          rawTypes: ['calls'],
          confidence: 0.9,
          evidence: `${objectLabel(metadata, objectId)} ${semanticType === 'orchestrates' ? 'orchestrates' : 'calls'} ${objectLabel(calledMetadata, calledId)}.`,
          role: semanticType,
        })
      );
    }
  }

  return edges;
}

export function classifyReadRole(sourceMetadata = {}, consumerMetadata = {}) {
  return inferReadRole(sourceMetadata, consumerMetadata);
}

export function classifyWriteOperation(processMetadata = {}, targetId = '', targetMetadata = {}) {
  return inferWriteOperation(processMetadata, targetId, targetMetadata);
}

function collectConnected(edges = [], focusId = '', predicate = () => true) {
  return edges.filter(
    (edge) => predicate(edge) && (edge.source === focusId || edge.target === focusId)
  );
}

function relatedObjects(edges, objects, focusId, predicate) {
  return collectConnected(edges, focusId, predicate).map((edge) => {
    const relatedId = edge.source === focusId ? edge.target : edge.source;
    const metadata = objects.get(relatedId) || {};
    return {
      ...runtimeLocation(metadata, relatedId),
      semantic_type: edge.semantic_type,
      operation: edge.operation || null,
      confidence: edge.confidence,
      evidence: edge.evidence,
      direction: edge.source === focusId ? 'outgoing' : 'incoming',
      show_in_downstream: edge.show_in_downstream,
    };
  });
}

function countBySemanticType(records = []) {
  return records.reduce((acc, record) => {
    const key = record.semantic_type || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function buildPlainEnglishSummary(focusMetadata = {}, pack = {}) {
  const label = objectLabel(focusMetadata, pack.object_id);
  if (normalizeKey(focusMetadata.type) !== 'table' && normalizeKey(focusMetadata.type) !== 'view') {
    return `${label} has ${pack.loaders.length} loader relationships, ${pack.source_inputs.length} upstream source inputs, and ${pack.business_consumers.length} business consumers in the current semantic lineage pack.`;
  }

  const primaryLoader = pack.loaders[0];
  const orchestrator = pack.orchestrators.find(
    (record) => record.target_loader_id === primaryLoader?.id
  );
  const lead = primaryLoader
    ? `${label} is maintained by ${primaryLoader.label}.`
    : `${label} has no detected loader in the current semantic lineage pack.`;
  const chain = primaryLoader
    ? orchestrator
      ? `${orchestrator.label} orchestrates ${primaryLoader.label}, which ${primaryLoader.operation === 'upsert_write' ? 'upserts' : 'writes to'} ${label}.`
      : `${primaryLoader.label} ${primaryLoader.operation === 'upsert_write' ? 'upserts' : 'writes to'} ${label}.`
    : '';
  const sourceCount = pack.source_inputs.length;
  const lookupCount = pack.lookup_dependencies.length;
  const caveat =
    pack.maintenance_reads.length > 0
      ? `${primaryLoader?.label || 'The loader'} also reads ${label} during the write path for match or change detection. That is a maintenance read, not a downstream business dependency.`
      : '';
  const context =
    sourceCount > 0 || lookupCount > 0
      ? `Detected upstream inputs include ${sourceCount} source ${sourceCount === 1 ? 'object' : 'objects'} and ${lookupCount} lookup ${lookupCount === 1 ? 'dependency' : 'dependencies'}.`
      : '';

  return [lead, chain, context, caveat].filter(Boolean).join(' ');
}

export function buildSemanticLineagePack(objects = new Map(), focusObjectId = '') {
  const focusMetadata = objects.get(focusObjectId);
  if (!focusMetadata) {
    throw new Error(`Semantic lineage focus object not found: ${focusObjectId}`);
  }

  const edges = buildSemanticLineageEdges(objects);
  const loaders = relatedObjects(
    edges,
    objects,
    focusObjectId,
    (edge) => edge.target === focusObjectId && /_write$|^write$/.test(edge.semantic_type)
  );
  const maintenanceReads = relatedObjects(
    edges,
    objects,
    focusObjectId,
    (edge) => edge.source === focusObjectId && edge.semantic_type === 'target_maintenance_read'
  );
  const businessConsumers = relatedObjects(
    edges,
    objects,
    focusObjectId,
    (edge) =>
      edge.source === focusObjectId &&
      edge.semantic_type === 'business_consumer_read' &&
      edge.show_in_downstream !== false
  );

  const loaderIds = new Set(loaders.map((record) => record.id));
  const sourceInputs = [];
  const lookupDependencies = [];
  const orchestrators = [];

  for (const loaderId of loaderIds) {
    for (const edge of edges) {
      if (edge.target === loaderId && edge.semantic_type === 'source_read') {
        sourceInputs.push({
          ...runtimeLocation(objects.get(edge.source) || {}, edge.source),
          semantic_type: edge.semantic_type,
          confidence: edge.confidence,
          evidence: edge.evidence,
          target_loader_id: loaderId,
        });
      }
      if (edge.target === loaderId && edge.semantic_type === 'lookup_read') {
        lookupDependencies.push({
          ...runtimeLocation(objects.get(edge.source) || {}, edge.source),
          semantic_type: edge.semantic_type,
          confidence: edge.confidence,
          evidence: edge.evidence,
          target_loader_id: loaderId,
        });
      }
      if (edge.target === loaderId && edge.semantic_type === 'orchestrates') {
        orchestrators.push({
          ...runtimeLocation(objects.get(edge.source) || {}, edge.source),
          semantic_type: edge.semantic_type,
          confidence: edge.confidence,
          evidence: edge.evidence,
          target_loader_id: loaderId,
        });
      }
    }
  }

  const pack = {
    object_id: focusObjectId,
    object_type: focusMetadata.type || 'object',
    summary: {
      plain_english: '',
      counts: {
        loaders: loaders.length,
        source_inputs: sourceInputs.length,
        lookup_dependencies: lookupDependencies.length,
        business_consumers: businessConsumers.length,
        maintenance_reads: maintenanceReads.length,
        orchestrators: orchestrators.length,
      },
      semantic_edge_types: countBySemanticType(
        collectConnected(edges, focusObjectId, () => true).map((edge) => ({
          semantic_type: edge.semantic_type,
        }))
      ),
    },
    loaders,
    source_inputs: sourceInputs,
    lookup_dependencies: lookupDependencies,
    business_consumers: businessConsumers,
    maintenance_reads: maintenanceReads,
    orchestrators,
  };
  pack.summary.plain_english = buildPlainEnglishSummary(focusMetadata, pack);
  return pack;
}

export function buildSemanticLineageIndex(objects = new Map()) {
  const edges = buildSemanticLineageEdges(objects);
  const packs = new Map();

  for (const objectId of objects.keys()) {
    packs.set(objectId, buildSemanticLineagePack(objects, objectId));
  }

  return {
    edges,
    packs,
  };
}

export default {
  classifyReadRole,
  classifyWriteOperation,
  buildSemanticLineageEdges,
  buildSemanticLineageIndex,
  buildSemanticLineagePack,
};
