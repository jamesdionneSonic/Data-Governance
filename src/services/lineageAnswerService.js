import { buildSemanticLineagePack } from './semanticLineageService.js';

function normalizeKey(value) {
  return String(value || '').trim().toLowerCase();
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function objectLabel(metadata = {}, objectId = '') {
  if (metadata.schema && metadata.name) return `${metadata.schema}.${metadata.name}`;
  if (metadata.name) return metadata.name;
  return objectId;
}

function compactText(value, maxLength = 260) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function dedupeById(records = []) {
  const seen = new Set();
  return records.filter((record) => {
    const key = `${record.role}:${record.id}:${record.semantic_type || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildRoleRecord(role, record = {}, extra = {}) {
  return {
    role,
    id: record.id,
    label: record.label || record.name || record.id,
    name: record.name || record.label || record.id,
    type: record.type || 'object',
    server: record.server || null,
    database: record.database || null,
    schema: record.schema || null,
    packageName: record.packageName || null,
    packagePath: record.packagePath || null,
    semantic_type: record.semantic_type || null,
    operation: record.operation || null,
    confidence: record.confidence ?? null,
    evidence: compactText(record.evidence || ''),
    location:
      record.packagePath ||
      [record.server, record.database, record.schema, record.name].filter(Boolean).join(' / '),
    ...extra,
  };
}

function canonicalIntent(intent = '') {
  const key = normalizeKey(intent);
  if (['feed', 'feeds', 'upstream', 'sources', 'source'].includes(key)) return 'feeds';
  if (['load', 'loads', 'loader', 'loaders', 'populate', 'populates'].includes(key)) return 'loads';
  if (['use', 'uses', 'consumer', 'consumers', 'downstream'].includes(key)) return 'uses';
  if (['help', '?help', 'question_help'].includes(key)) return 'help';
  return 'full_lineage';
}

function intentDescription(intent) {
  switch (intent) {
    case 'feeds':
      return 'Upstream sources and lookup dependencies';
    case 'loads':
      return 'Packages, jobs, and procedures that maintain the object';
    case 'uses':
      return 'Downstream business consumers';
    case 'help':
      return 'Examples that teach users how to ask lineage questions';
    default:
      return 'Combined lineage view with loaders, sources, consumers, and caveats';
  }
}

export function buildLineageQuestionHelp() {
  const examples = [
    {
      intent: 'loads',
      prompt: 'what loads DimVehicle?',
      description: 'Show packages, procedures, or jobs that write to the object.',
    },
    {
      intent: 'feeds',
      prompt: 'what feeds DimVehicle?',
      description: 'Show staged inputs, source tables, and lookup dependencies.',
    },
    {
      intent: 'uses',
      prompt: 'what uses DimVehicle?',
      description: 'Show downstream business consumers without maintenance reads.',
    },
    {
      intent: 'full_lineage',
      prompt: 'show full lineage for DimVehicle',
      description: 'Show the full chain with sources, loaders, consumers, and caveats.',
    },
    {
      intent: 'logic',
      prompt: 'tell me about the business logic in dbo.usp_DimVehicle',
      description: 'Drill into the procedure or package behavior after the first lineage answer.',
    },
    {
      intent: 'impact',
      prompt: 'what breaks if DimVehicle changes?',
      description: 'Show the likely downstream blast radius.',
    },
  ];

  return {
    title: 'Lineage Question Help',
    plain_english:
      'Use "feeds" for upstream sources, "loads" for processes that write the object, "uses" for downstream consumers, and "logic" when you want the stored procedure or package behavior explained.',
    examples,
  };
}

export function buildLineageAnswer(objects = new Map(), request = {}) {
  const objectId = request.object_id || request.objectId;
  const focusMetadata = objects.get(objectId);
  if (!focusMetadata) {
    throw new Error(`Lineage answer focus object not found: ${objectId}`);
  }

  const intent = canonicalIntent(request.intent || request.question_type);
  const semanticPack = buildSemanticLineagePack(objects, objectId);

  const loaders = ensureArray(semanticPack.loaders).map((record) =>
    buildRoleRecord('Loads target', record, {
      why_it_matters:
        record.operation === 'upsert_write'
          ? `Upserts ${objectLabel(focusMetadata, objectId)}`
          : `Writes to ${objectLabel(focusMetadata, objectId)}`,
    })
  );
  const orchestrators = ensureArray(semanticPack.orchestrators).map((record) =>
    buildRoleRecord('Orchestrates load', record, {
      why_it_matters: 'Runs or calls the loader in the load chain',
    })
  );
  const sourceInputs = ensureArray(semanticPack.source_inputs).map((record) =>
    buildRoleRecord('Source input', record, {
      why_it_matters: 'Provides staged or source data read by the loader',
    })
  );
  const lookupDependencies = ensureArray(semanticPack.lookup_dependencies).map((record) =>
    buildRoleRecord('Lookup dependency', record, {
      why_it_matters: 'Provides keys or reference values during the load',
    })
  );
  const businessConsumers = ensureArray(semanticPack.business_consumers).map((record) =>
    buildRoleRecord('Business consumer', record, {
      why_it_matters: `Consumes ${objectLabel(focusMetadata, objectId)} downstream`,
    })
  );
  const maintenanceReads = ensureArray(semanticPack.maintenance_reads).map((record) =>
    buildRoleRecord('Maintenance read', record, {
      why_it_matters: 'Reads the target only to match or compare rows during maintenance',
    })
  );

  let impactedObjects = [];
  let plainEnglish = semanticPack.summary.plain_english;
  let caveats = [];

  switch (intent) {
    case 'feeds':
      impactedObjects = dedupeById([...orchestrators, ...loaders, ...sourceInputs, ...lookupDependencies]);
      plainEnglish = `${objectLabel(focusMetadata, objectId)} is fed by its load chain. ${semanticPack.summary.plain_english}`;
      caveats = maintenanceReads.length > 0
        ? ['Maintenance reads are implementation detail and are not counted as upstream sources.']
        : [];
      break;
    case 'loads':
      impactedObjects = dedupeById([...orchestrators, ...loaders, ...maintenanceReads]);
      plainEnglish = `${objectLabel(focusMetadata, objectId)} is maintained by the following loaders and orchestrators. ${semanticPack.summary.plain_english}`;
      caveats = maintenanceReads.length > 0
        ? ['The maintenance read below is part of the write path, not a downstream business consumer.']
        : [];
      break;
    case 'uses':
      impactedObjects = dedupeById([...businessConsumers, ...maintenanceReads, ...orchestrators]);
      plainEnglish = `${objectLabel(focusMetadata, objectId)} has ${businessConsumers.length} downstream business ${businessConsumers.length === 1 ? 'consumer' : 'consumers'}, ${maintenanceReads.length} maintenance/load-path ${maintenanceReads.length === 1 ? 'procedure' : 'procedures'} that also read the table during write processing, and ${orchestrators.length} orchestrating ${orchestrators.length === 1 ? 'SSIS package' : 'SSIS packages'} in that load path.`;
      caveats = maintenanceReads.length > 0
        ? ['Maintenance/load-path procedures are shown separately so technical users keep the exact object names without treating those procedures as ordinary business consumers.']
        : [];
      break;
    default:
      impactedObjects = dedupeById([
        ...orchestrators,
        ...loaders,
        ...sourceInputs,
        ...lookupDependencies,
        ...businessConsumers,
        ...maintenanceReads,
      ]);
      caveats = maintenanceReads.length > 0
        ? ['Maintenance reads are shown separately so upsert logic does not look like a normal downstream consumer.']
        : [];
      break;
  }

  return {
    object_id: objectId,
    object_label: objectLabel(focusMetadata, objectId),
    intent,
    intent_description: intentDescription(intent),
    plain_english: plainEnglish,
    caveats,
    impacted_objects: impactedObjects,
    semantic_lineage: semanticPack,
    help: intent === 'help' ? buildLineageQuestionHelp() : undefined,
  };
}

export default {
  buildLineageAnswer,
  buildLineageQuestionHelp,
};
