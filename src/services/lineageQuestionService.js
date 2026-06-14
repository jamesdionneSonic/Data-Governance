import { buildLineageAnswer, buildLineageQuestionHelp } from './lineageAnswerService.js';

function normalizeText(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeKey(value) {
  return normalizeText(value).toLowerCase();
}

function stripSqlDelimiters(value) {
  return normalizeText(value).replace(/\[|\]/g, '');
}

function objectLabel(metadata = {}, objectId = '') {
  if (metadata.schema && metadata.name) return `${metadata.schema}.${metadata.name}`;
  if (metadata.name) return metadata.name;
  return objectId;
}

function fullObjectName(metadata = {}, objectId = '') {
  const parts = [metadata.server, metadata.database, metadata.schema, metadata.name].filter(
    Boolean
  );
  return parts.length > 0 ? parts.join('.') : objectId;
}

function canonicalIntent(question = '') {
  const text = normalizeKey(question);
  if (text === '?help' || /\bhelp\b/.test(text)) return 'help';
  if (/\bwhat\s+(uses|depends on|consumes)\b|\bdownstream\b|\bwhere\s+is\b.*\bused\b/.test(text)) {
    return 'uses';
  }
  if (/\bwhat\s+(loads|populates|writes|maintains)\b|\bloader|load path\b/.test(text)) {
    return 'loads';
  }
  if (/\bwhat\s+(feeds|sources)\b|\bupstream\b|\bsource\b/.test(text)) return 'feeds';
  if (/\bimpact\b|\bbreaks\b|\bblast radius\b/.test(text)) return 'uses';
  return 'full_lineage';
}

function canonicalCatalogIntent(question = '') {
  const text = normalizeKey(question);
  if (/\blist\b.*\bdatabases\b|\bdatabases\b.*\bcatalog\b/.test(text)) return 'database_list';
  if (
    /\bhow many\b.*\b(table|tables|view|views|procedure|procedures|object|objects)\b/.test(text)
  ) {
    return 'database_count';
  }
  return '';
}

function extractDatabaseName(question = '') {
  const text = stripSqlDelimiters(question);
  const patterns = [
    /\bin\s+([a-zA-Z0-9_$#.-]+)\s*$/i,
    /\bfor\s+database\s+([a-zA-Z0-9_$#.-]+)/i,
    /\bdatabase\s+([a-zA-Z0-9_$#.-]+)/i,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match?.[1]) return match[1].replace(/[?.!,;:]$/, '');
  }

  return '';
}

function requestedObjectType(question = '') {
  const text = normalizeKey(question);
  if (/\btables?\b/.test(text)) return 'table';
  if (/\bviews?\b/.test(text)) return 'view';
  if (/\bprocedures?\b|\bprocs?\b/.test(text)) return 'procedure';
  if (/\bfunctions?\b/.test(text)) return 'function';
  if (/\bpackages?\b|\bssis\b/.test(text)) return 'ssis_package';
  return '';
}

function countByType(objects = []) {
  return objects.reduce((acc, object) => {
    const type = normalizeKey(object.type || object.object_type || 'unknown') || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
}

function findDatabaseObjects(objects = new Map(), databaseName = '') {
  const requested = normalizeKey(databaseName);
  return Array.from(objects.values()).filter(
    (object) => normalizeKey(object.database) === requested
  );
}

function databaseNames(objects = new Map()) {
  return Array.from(
    new Set(
      Array.from(objects.values())
        .map((object) => object.database)
        .filter(Boolean)
    )
  ).sort((left, right) =>
    String(left).localeCompare(String(right), undefined, { sensitivity: 'base' })
  );
}

function candidateTokens(question = '') {
  const text = stripSqlDelimiters(question);
  const explicit =
    /(?:for|uses|loads|feeds|lineage|logic|object|table|view|procedure|proc)\s+([a-zA-Z0-9_$#.[\]-]+(?:\.[a-zA-Z0-9_$#.[\]-]+){0,4})/i.exec(
      text
    );
  const tokens = explicit?.[1]
    ? [explicit[1]]
    : text
        .split(/[^a-zA-Z0-9_$#.[\]-]+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 3);

  const stopWords = new Set([
    'what',
    'uses',
    'loads',
    'feeds',
    'show',
    'full',
    'lineage',
    'tell',
    'about',
    'business',
    'logic',
    'table',
    'view',
    'procedure',
    'database',
    'many',
    'objects',
    'tables',
    'views',
    'procs',
  ]);

  return tokens
    .map((token) => token.replace(/[?.!,;:]$/, ''))
    .filter((token) => token && !stopWords.has(normalizeKey(token)));
}

function scoreObjectMatch(objectId = '', metadata = {}, token = '') {
  const normalizedToken = normalizeKey(token);
  const candidates = [
    objectId,
    metadata.id,
    metadata.name,
    metadata.schema && metadata.name ? `${metadata.schema}.${metadata.name}` : '',
    metadata.database && metadata.schema && metadata.name
      ? `${metadata.database}.${metadata.schema}.${metadata.name}`
      : '',
    fullObjectName(metadata, objectId),
  ].map(normalizeKey);

  if (candidates.some((candidate) => candidate === normalizedToken)) return 100;
  if (normalizeKey(metadata.name) === normalizedToken) return 90;
  if (candidates.some((candidate) => candidate.endsWith(`.${normalizedToken}`))) return 80;
  if (candidates.some((candidate) => candidate.includes(normalizedToken))) return 50;
  return 0;
}

function resolveObject(objects = new Map(), question = '') {
  const tokens = candidateTokens(question);
  const matches = [];

  for (const token of tokens) {
    for (const [objectId, metadata] of objects.entries()) {
      const score = scoreObjectMatch(objectId, metadata, token);
      if (score > 0) {
        matches.push({
          object_id: objectId,
          score,
          label: objectLabel(metadata, objectId),
          type: metadata.type || 'object',
        });
      }
    }
  }

  matches.sort(
    (left, right) => right.score - left.score || left.object_id.localeCompare(right.object_id)
  );
  const deduped = [];
  const seen = new Set();
  for (const match of matches) {
    if (seen.has(match.object_id)) continue;
    seen.add(match.object_id);
    deduped.push(match);
  }

  return {
    selected: deduped[0] || null,
    candidates: deduped.slice(0, 10),
  };
}

function buildEvidenceFromAnswer(answer = {}) {
  const sources = [];
  for (const item of answer.impacted_objects || []) {
    if (!item.id) continue;
    sources.push({
      role: item.role,
      object_id: item.id,
      object: item.label || item.id,
      type: item.type || 'object',
      location: item.location || '',
      evidence: item.evidence || item.why_it_matters || '',
    });
  }
  return sources.slice(0, 25);
}

function suggestedFollowups(answer = {}) {
  if (answer.answer_type === 'help') {
    return ['what uses DimVehicle?', 'what loads DimVehicle?', 'how many tables are in WebV?'];
  }

  if (answer.answer_type === 'catalog_database_list') {
    return ['how many tables are in WebV?', 'how many procedures are in Sonic_DW?'];
  }

  if (answer.answer_type === 'database_object_count') {
    return [`list databases in the lineage catalog`, `what uses DimVehicle?`];
  }

  const objectLabelText = answer.resolved_object?.label || answer.object_label || '';
  const objectPrompt = objectLabelText || 'DimVehicle';
  if (answer.answer_type === 'object_lineage') {
    return [
      `what loads ${objectPrompt}?`,
      `what feeds ${objectPrompt}?`,
      `what uses ${objectPrompt}?`,
    ];
  }

  return ['?help'];
}

function displayTitle(answer = {}) {
  if (answer.answer_type === 'help') return 'How to Ask Lineage Questions';
  if (answer.answer_type === 'catalog_database_list') return 'Lineage Catalog Databases';
  if (answer.answer_type === 'database_object_count') return 'Catalog Count';
  if (answer.answer_type === 'database_not_found') return 'Database Not Found';
  if (answer.answer_type === 'object_not_found') return 'Object Not Found';
  if (answer.answer_type === 'needs_database') return 'Database Needed';
  if (answer.object_label) return `Lineage for ${answer.object_label}`;
  return 'Lineage Answer';
}

function asAssistantResponse(answer = {}) {
  const tableRows = answer.table?.rows || answer.impacted_objects || [];
  return {
    ...answer,
    assistant: {
      title: displayTitle(answer),
      message: answer.plain_english || 'I built the lineage answer from the loaded catalog.',
      suggested_followups: suggestedFollowups(answer),
      has_table: tableRows.length > 0,
      has_sources: (answer.sources || []).length > 0,
    },
  };
}

function buildDatabaseListAnswer(objects = new Map()) {
  const names = databaseNames(objects);
  const rows = names.map((database) => {
    const databaseObjects = findDatabaseObjects(objects, database);
    const types = countByType(databaseObjects);
    return {
      database,
      object_count: databaseObjects.length,
      table_count: types.table || 0,
      view_count: types.view || 0,
      procedure_count: types.procedure || types.stored_procedure || 0,
      package_count: types.ssis_package || types.package || 0,
    };
  });

  return {
    answer_type: 'catalog_database_list',
    plain_english: `The lineage catalog currently has ${rows.length} database ${rows.length === 1 ? 'entry' : 'entries'} loaded in the app runtime.`,
    table: {
      columns: ['Database', 'Objects', 'Tables', 'Views', 'Procedures', 'Packages'],
      rows,
    },
    sources: [
      { source: 'app_runtime_cache', detail: 'Counts are computed from loaded catalog objects.' },
    ],
  };
}

function buildDatabaseCountAnswer(objects = new Map(), question = '') {
  const database = extractDatabaseName(question);
  if (!database) {
    return {
      answer_type: 'needs_database',
      plain_english:
        'I can answer that, but I need the database name. Try: "how many tables are in WebV".',
      table: { columns: [], rows: [] },
      sources: [],
    };
  }

  const databaseObjects = findDatabaseObjects(objects, database);
  if (databaseObjects.length === 0) {
    return {
      answer_type: 'database_not_found',
      plain_english: `I could not find a loaded database named ${database}.`,
      table: {
        columns: ['Nearby database names'],
        rows: databaseNames(objects)
          .filter((name) => normalizeKey(name).includes(normalizeKey(database)))
          .map((name) => ({ database: name })),
      },
      sources: [
        {
          source: 'app_runtime_cache',
          detail: 'Searched loaded catalog objects by exact database name.',
        },
      ],
    };
  }

  const type = requestedObjectType(question);
  const counts = countByType(databaseObjects);
  const value = type
    ? counts[type] || (type === 'procedure' ? counts.stored_procedure || 0 : 0)
    : databaseObjects.length;
  const label = type ? `${type.replace('_', ' ')}${value === 1 ? '' : 's'}` : 'objects';

  return {
    answer_type: 'database_object_count',
    plain_english: `${database} has ${value} ${label} in the loaded lineage catalog.`,
    table: {
      columns: ['Database', 'Objects', 'Tables', 'Views', 'Procedures', 'Packages'],
      rows: [
        {
          database,
          object_count: databaseObjects.length,
          table_count: counts.table || 0,
          view_count: counts.view || 0,
          procedure_count: counts.procedure || counts.stored_procedure || 0,
          package_count: counts.ssis_package || counts.package || 0,
        },
      ],
    },
    sources: [
      {
        source: 'app_runtime_cache',
        detail: `Counted loaded objects where database equals ${database}.`,
      },
    ],
  };
}

export function answerLineageQuestion(objects = new Map(), request = {}) {
  const question = normalizeText(request.question);
  if (!question) {
    throw new Error('question is required');
  }

  const catalogIntent = canonicalCatalogIntent(question);
  if (catalogIntent === 'database_list') {
    return asAssistantResponse({ question, ...buildDatabaseListAnswer(objects) });
  }
  if (catalogIntent === 'database_count') {
    return asAssistantResponse({ question, ...buildDatabaseCountAnswer(objects, question) });
  }

  const intent = canonicalIntent(question);
  if (intent === 'help') {
    return asAssistantResponse({
      question,
      answer_type: 'help',
      ...buildLineageQuestionHelp(),
      table: { columns: ['Example', 'What it answers'], rows: buildLineageQuestionHelp().examples },
      sources: [{ source: 'lineage_question_help', detail: 'Built-in question examples.' }],
    });
  }

  const resolved = resolveObject(objects, question);
  if (!resolved.selected) {
    return asAssistantResponse({
      question,
      answer_type: 'object_not_found',
      plain_english:
        'I could not resolve a lineage object from that question. Try the exact table, view, procedure, or package name.',
      table: { columns: ['Candidate'], rows: [] },
      sources: [
        { source: 'app_runtime_cache', detail: 'Searched loaded catalog object names and ids.' },
      ],
    });
  }

  const answer = buildLineageAnswer(objects, {
    object_id: resolved.selected.object_id,
    intent,
  });

  return asAssistantResponse({
    question,
    answer_type: 'object_lineage',
    resolved_object: resolved.selected,
    candidates: resolved.candidates,
    ...answer,
    sources: buildEvidenceFromAnswer(answer),
  });
}

export default {
  answerLineageQuestion,
};
