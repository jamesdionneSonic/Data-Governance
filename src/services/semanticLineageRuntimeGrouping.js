function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueStrings(values = []) {
  return Array.from(new Set(values.filter(Boolean)));
}

function inferObjectType(objectId = '') {
  const lower = normalizeKey(objectId);
  if (!lower) return 'object';
  if (lower.includes('.dtsx')) return 'ssis_package';
  const name = String(objectId).split('.').pop() || '';
  if (/^vw/i.test(name)) return 'view';
  if (/^(usp|sp)/i.test(name)) return 'procedure';
  if (/^(fn|ufn|tf)/i.test(name)) return 'function';
  if (/^(dim|fact|syn|stg|wrk|tmp|tbl)/i.test(name)) return 'table';
  return 'object';
}

function compactLabel(objectId = '') {
  const parts = String(objectId).split('.');
  if (parts.length >= 4 && !normalizeKey(objectId).includes('.dtsx')) {
    return parts.slice(-3).join('.');
  }
  return objectId;
}

function roleLabel(kind, objectType) {
  if (kind === 'orchestrators') return 'Orchestrating SSIS package';
  if (kind === 'maintenance_reads') return 'Maintenance / load-path procedure';
  if (kind === 'loaders')
    return objectType === 'ssis_package' ? 'Loader package' : 'Loader procedure';
  if (kind === 'business_consumers') {
    if (objectType === 'view') return 'Business consumer view';
    if (objectType === 'procedure') return 'Business consumer procedure';
    return 'Business consumer';
  }
  return 'Related object';
}

function relatedObject(kind, objectId) {
  const objectType = inferObjectType(objectId);
  return {
    object_id: objectId,
    label: compactLabel(objectId),
    object_type: objectType,
    role: roleLabel(kind, objectType),
  };
}

function directEdgeTypes(lineage = {}, predicate = () => true) {
  const map = new Map();
  for (const edge of ensureArray(lineage.direct_edges)) {
    if (!predicate(edge)) continue;
    const relatedId = edge.source === lineage.focus_object_id ? edge.target : edge.source;
    if (!relatedId) continue;
    if (!map.has(relatedId)) map.set(relatedId, new Set());
    map.get(relatedId).add(normalizeKey(edge.type));
  }
  return map;
}

export function deriveSemanticLineageGroups(objectId = '', contextPack = {}, options = {}) {
  const lineage = {
    ...(contextPack.lineage || {}),
    focus_object_id: objectId,
  };
  const orchestratorsByTarget = options.orchestratorsByTarget || new Map();

  const writesToFocus = directEdgeTypes(
    lineage,
    (edge) => edge.target === objectId && ['loads', 'created_by'].includes(normalizeKey(edge.type))
  );
  const readsFromFocus = directEdgeTypes(
    lineage,
    (edge) =>
      edge.source === objectId && ['used_by', 'reads', 'extracts'].includes(normalizeKey(edge.type))
  );

  const maintenanceIds = [...readsFromFocus.keys()].filter((id) => writesToFocus.has(id));
  const businessConsumerIds = [...readsFromFocus.keys()].filter((id) => !writesToFocus.has(id));
  const loaderIds = [...writesToFocus.keys()];

  const maintenanceReads = maintenanceIds.map((id) => relatedObject('maintenance_reads', id));
  const businessConsumers = businessConsumerIds.map((id) =>
    relatedObject('business_consumers', id)
  );
  const loaders = loaderIds.map((id) => relatedObject('loaders', id));
  const orchestratorIds = uniqueStrings(
    [...loaderIds, ...maintenanceIds].flatMap((id) =>
      Array.from(orchestratorsByTarget.get(id) || [])
    )
  );
  const orchestrators = orchestratorIds.map((id) => relatedObject('orchestrators', id));

  const plainEnglish = `${compactLabel(objectId)} has ${businessConsumers.length} downstream business ${businessConsumers.length === 1 ? 'consumer' : 'consumers'}, ${maintenanceReads.length} maintenance/load-path ${maintenanceReads.length === 1 ? 'procedure' : 'procedures'} that also touch the table during load processing, and ${orchestrators.length} SSIS ${orchestrators.length === 1 ? 'package' : 'packages'} orchestrating that load path.`;

  return {
    plain_english: plainEnglish,
    counts: {
      loaders: loaders.length,
      business_consumers: businessConsumers.length,
      maintenance_reads: maintenanceReads.length,
      orchestrators: orchestrators.length,
    },
    loaders,
    orchestrators,
    business_consumers: businessConsumers,
    maintenance_reads: maintenanceReads,
    downstream_groups: {
      business_consumers: businessConsumers.map((record) => record.object_id),
      maintenance_reads: maintenanceReads.map((record) => record.object_id),
      orchestrators: orchestrators.map((record) => record.object_id),
    },
  };
}

export default {
  deriveSemanticLineageGroups,
};
