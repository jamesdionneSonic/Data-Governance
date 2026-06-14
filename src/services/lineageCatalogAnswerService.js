function countObjectEntries(value = {}) {
  return Object.entries(value || {}).sort(
    ([, left], [, right]) => Number(right || 0) - Number(left || 0)
  );
}

function formatCountedEntries(value = {}, limit = 4) {
  const entries = countObjectEntries(value).slice(0, limit);
  if (entries.length === 0) return 'unknown';
  return entries.map(([name, count]) => `${name} (${count})`).join(', ');
}

function isNumericCatalogName(name) {
  return /^\d+$/.test(String(name || '').trim());
}

function sampleObjectsForDatabase(databaseName, rowsByDatabase = new Map(), limit = 3) {
  const rows = rowsByDatabase.get(databaseName) || [];
  return rows.slice(0, limit).map((row) => ({
    object_id: row.object_id || row.id || '',
    display_name: row.display_name || row.object_name || row.name || row.object_id || '',
    type: row.object_type || row.type || '',
  }));
}

function databaseNote(name, info = {}, samples = []) {
  const numericSchemaNames = Object.keys(info.schemas || {}).filter(isNumericCatalogName);
  const sampleLooksIpSplit = samples.some((sample) =>
    /^\d+\./.test(String(sample.display_name || sample.object_id || ''))
  );

  if (isNumericCatalogName(name)) {
    if (numericSchemaNames.length > 0 || sampleLooksIpSplit) {
      return 'Numeric/anomalous catalog entry; likely a parsed server/IP/source fragment. Verify extraction before treating it as a business database.';
    }
    return 'Numeric catalog entry; verify whether this is a real source database name or an extraction artifact.';
  }

  return '';
}

function databaseCatalogRow(name, info = {}, rowsByDatabase = new Map()) {
  const samples = sampleObjectsForDatabase(name, rowsByDatabase);
  return {
    database: name,
    object_count: Number(info.object_count || 0),
    main_types: formatCountedEntries(info.types, 5),
    schema_count: Object.keys(info.schemas || {}).length,
    top_schemas: formatCountedEntries(info.schemas, 5),
    context_readme_path: info.context_readme_path || '',
    note: databaseNote(name, info, samples),
    sample_objects: samples,
  };
}

function sortCatalogRows(left, right) {
  const leftNumeric = isNumericCatalogName(left.database);
  const rightNumeric = isNumericCatalogName(right.database);
  if (leftNumeric !== rightNumeric) return Number(leftNumeric) - Number(rightNumeric);
  return String(left.database).localeCompare(String(right.database), undefined, {
    sensitivity: 'base',
  });
}

export function buildDatabaseCatalogAnswer(databaseIndex = {}, rowsByDatabase = new Map()) {
  const rows = Object.entries(databaseIndex.databases || {})
    .map(([name, info]) => databaseCatalogRow(name, info, rowsByDatabase))
    .sort(sortCatalogRows);
  const anomalousEntries = rows.filter((row) => row.note);
  const databases = rows.filter((row) => !row.note);

  return {
    schema_version: 1,
    answer_type: 'catalog-databases',
    counts: {
      database_entries: Number(databaseIndex.database_count || rows.length),
      normal_database_entries: databases.length,
      anomalous_database_entries: anomalousEntries.length,
    },
    plain_english:
      anomalousEntries.length > 0
        ? `The lineage catalog has ${rows.length} database entries. ${databases.length} look like normal database names, and ${anomalousEntries.length} numeric entries should be treated as catalog-quality anomalies until the extraction source is verified.`
        : `The lineage catalog has ${rows.length} database entries.`,
    format_guidance: {
      default_view:
        'Show normal databases in a table, then list numeric/anomalous entries in a separate quality note.',
      columns: ['Database', 'Objects', 'Main types', 'Schemas', 'Notes'],
      avoid: [
        'Do not render database names as a comma-separated inline list.',
        'Do not mix numeric/anomalous entries into the normal database list without explanation.',
      ],
    },
    databases,
    anomalous_entries: anomalousEntries,
  };
}

function markdownTable(rows) {
  const lines = [
    '| Database | Objects | Main types | Schemas | Notes |',
    '| --- | ---: | --- | --- | --- |',
  ];
  for (const row of rows) {
    lines.push(
      `| \`${row.database}\` | ${row.object_count} | ${row.main_types} | ${row.schema_count}: ${row.top_schemas} | ${row.note || ''} |`
    );
  }
  return lines.join('\n');
}

export function renderDatabaseCatalogAnswer(answer) {
  const sections = [answer.plain_english, '', markdownTable(answer.databases || [])];
  if ((answer.anomalous_entries || []).length > 0) {
    sections.push('', '**Catalog Quality Notes**', '', markdownTable(answer.anomalous_entries));
  }
  sections.push('', 'Evidence: `answers/catalog/databases.json`.');
  return sections.join('\n');
}
