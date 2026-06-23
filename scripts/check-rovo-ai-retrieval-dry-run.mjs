import fs from 'node:fs/promises';
import path from 'node:path';

const outputRoot = path.resolve('data/confluence/rovo-ai-retrieval-dry-run');
const rootPath = ['Sonic Data Lineage', 'AI Retrieval Artifacts'];
const requiredLocatorFields = [
  'lookup_key',
  'canonical_id',
  'type',
  'database',
  'schema',
  'object',
  'aliases',
  'quick_context_page',
  'canonical_human_page',
  'canonical_human_page_status',
  'confidence',
];
const requiredPageTypes = [
  'rovo-start-here',
  'rovo-object-locator',
  'rovo-database-context',
  'rovo-object-summary-context',
  'rovo-upstream-context',
  'rovo-downstream-context',
  'rovo-ambiguity-context',
  'rovo-evaluation-prompts',
];
const contextPageSizeLimit = 120000;
const locatorRowLimit = 500;

function pagePath(values) {
  return (values || []).filter(Boolean).join(' / ');
}

function normalizeLookup(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function hasForbiddenBranch(treePath) {
  const text = pagePath(treePath);
  return text.includes('Database Catalog') || text.includes('Data Product Catalog') || text.includes('High-Value Assets');
}

function isOldFlatDatabaseCatalogPath(value) {
  const text = String(value || '');
  if (!text.startsWith('Sonic Data Lineage / Database Catalog / ')) return false;
  return ![
    'Sonic Data Lineage / Database Catalog / SQL Server',
    'Sonic Data Lineage / Database Catalog / Snowflake',
    'not created yet',
  ].some((prefix) => text.startsWith(prefix));
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function readText(file) {
  return fs.readFile(file, 'utf8');
}

function validateLocatorRows(packet) {
  const failures = [];
  const rows = packet.locator_rows || [];
  if (!Array.isArray(rows) || rows.length === 0) failures.push('Locator page has no rows.');
  if (rows.length > locatorRowLimit) failures.push(`Locator page has ${rows.length} rows; limit is ${locatorRowLimit}.`);
  if (!rows.some((row) => row.canonical_id === 'database:VendorData' && row.type === 'database')) {
    failures.push('Locator rows do not include a VendorData database-level entry.');
  }
  if (!rows.some((row) => normalizeLookup(row.lookup_key) === 'dimvehicle')) {
    failures.push('Locator rows do not include a DimVehicle normalized alias.');
  }
  if (!rows.some((row) => normalizeLookup(row.lookup_key) === 'factopportunity')) {
    failures.push('Locator rows do not include a FactOpportunity normalized alias.');
  }
  for (const row of rows) {
    for (const field of requiredLocatorFields) {
      if (row[field] === undefined || row[field] === null || row[field] === '') {
        failures.push(`Locator row missing required field ${field}: ${row.lookup_key || row.canonical_id || 'unknown'}.`);
      }
    }
    if (!Array.isArray(row.aliases) || row.aliases.length === 0) {
      failures.push(`Locator row aliases must be a nonempty array: ${row.lookup_key || row.canonical_id || 'unknown'}.`);
    }
    if (isOldFlatDatabaseCatalogPath(row.canonical_human_page)) {
      failures.push(`Locator row uses old flat Database Catalog path: ${row.lookup_key || row.canonical_id || 'unknown'}.`);
    }
    if (row.canonical_human_page === 'not created yet' && row.canonical_human_page_status !== 'pending') {
      failures.push(`Locator row with missing human page must be marked pending: ${row.lookup_key || row.canonical_id || 'unknown'}.`);
    }
  }
  return failures;
}

function validateDatabaseContext(packet) {
  const failures = [];
  const context = (packet.contexts || [])[0];
  if (!context) return ['Database context page has no contexts.'];
  if (context.canonical_id !== 'database:VendorData') failures.push('Database context does not describe VendorData.');
  if (!context.canonical_human_page) failures.push('Database context is missing canonical human page link.');
  if (isOldFlatDatabaseCatalogPath(context.canonical_human_page)) failures.push('Database context uses old flat Database Catalog path.');
  if (context.canonical_human_page === 'not created yet' && context.canonical_human_page_status !== 'pending') {
    failures.push('Database context missing human page must be marked pending.');
  }
  const missingText = JSON.stringify(context.known_gaps || []).toLowerCase();
  for (const term of ['owner', 'sla', 'lifecycle', 'freshness', 'certification']) {
    if (!missingText.includes(term) || !missingText.includes('not surfaced')) {
      failures.push(`Database context does not mark ${term} as not surfaced in metadata.`);
    }
  }
  return failures;
}

function validateObjectSummary(packet) {
  const failures = [];
  const objects = packet.objects || [];
  if (objects.length > 50) failures.push(`Object summary context has ${objects.length} records; target is about 50.`);
  if (!objects.some((object) => normalizeLookup(object.object) === 'dimvehicle')) {
    failures.push('Object summary context is missing DimVehicle/Dim_Vehicle records.');
  }
  if (!objects.some((object) => normalizeLookup(object.object) === 'factopportunity')) {
    failures.push('Object summary context is missing FactOpportunity records.');
  }
  for (const object of objects) {
    for (const field of ['canonical_id', 'full_name', 'type', 'aliases', 'tags', 'column_count', 'confidence', 'missing_facts', 'canonical_human_page']) {
      if (object[field] === undefined || object[field] === null || object[field] === '') {
        failures.push(`Object summary missing ${field}: ${object.full_name || object.canonical_id || 'unknown'}.`);
      }
    }
    if (object.canonical_human_page_status === undefined || object.canonical_human_page_status === null || object.canonical_human_page_status === '') {
      failures.push(`Object summary missing canonical_human_page_status: ${object.full_name || object.canonical_id || 'unknown'}.`);
    }
    if (isOldFlatDatabaseCatalogPath(object.canonical_human_page)) {
      failures.push(`Object summary uses old flat Database Catalog path: ${object.full_name || object.canonical_id || 'unknown'}.`);
    }
    if (object.canonical_human_page === 'not created yet' && object.canonical_human_page_status !== 'pending') {
      failures.push(`Object summary missing human page must be marked pending: ${object.full_name || object.canonical_id || 'unknown'}.`);
    }
    const missingText = JSON.stringify(object.missing_facts || []).toLowerCase();
    for (const term of ['owner', 'sla', 'lifecycle', 'freshness', 'certification']) {
      if (!missingText.includes(term) || !missingText.includes('not surfaced')) {
        failures.push(`Object summary does not mark ${term} as not surfaced: ${object.full_name || object.canonical_id}.`);
      }
    }
  }
  return failures;
}

function validateLineageContext(packet, expectedType) {
  const failures = [];
  const record = packet.record || {};
  if (record.canonical_id !== 'object:L1-5FSQL-01.Sonic_DW.dbo.FactOpportunity') {
    failures.push(`${expectedType} context does not target Sonic_DW.dbo.FactOpportunity.`);
  }
  if (!record.canonical_human_page) failures.push(`${expectedType} context is missing canonical human page link.`);
  if (isOldFlatDatabaseCatalogPath(record.canonical_human_page)) failures.push(`${expectedType} context uses old flat Database Catalog path.`);
  if (record.canonical_human_page === 'not created yet' && record.canonical_human_page_status !== 'pending') {
    failures.push(`${expectedType} context missing human page must be marked pending.`);
  }
  if (expectedType === 'upstream' && !(record.upstream_sources || []).length && !(record.upstream_loaders || []).length && !(record.orchestrators || []).length) {
    failures.push('Upstream context does not include upstream sources, loaders, or orchestrators.');
  }
  if (expectedType === 'downstream' && !(record.downstream_consumers || []).length && !(record.downstream_reports || []).length) {
    failures.push('Downstream context does not include downstream consumers or reports.');
  }
  if (!record.relationship_confidence) failures.push(`${expectedType} context is missing relationship confidence.`);
  return failures;
}

function validateAmbiguity(packet) {
  const failures = [];
  const groups = packet.ambiguity_groups || [];
  if (!Array.isArray(groups) || groups.length === 0) failures.push('Ambiguity context has no groups.');
  for (const key of ['dimvehicle', 'factopportunity']) {
    const group = groups.find((item) => item.lookup_key === key);
    if (!group) {
      failures.push(`Ambiguity context is missing ${key}.`);
    } else if (!Array.isArray(group.options) || group.options.length < 2) {
      failures.push(`Ambiguity group ${key} does not contain multiple options.`);
    }
  }
  return failures;
}

function validateEvaluationPrompts(packet) {
  const failures = [];
  const prompts = packet.evaluation?.prompts || [];
  if (prompts.length === 0) failures.push('Evaluation prompt page has no prompts.');
  if (prompts.length > 50) failures.push(`Evaluation prompt page has ${prompts.length} prompts; max is 50.`);
  for (const needle of ['VendorData', 'DimVehicle', 'FactOpportunity']) {
    if (!prompts.some((prompt) => JSON.stringify(prompt).includes(needle))) {
      failures.push(`Evaluation prompts do not include ${needle}.`);
    }
  }
  for (const term of ['owner', 'SLA', 'lifecycle/status', 'live freshness', 'certification']) {
    if (!prompts.some((prompt) => JSON.stringify(prompt).includes(term))) {
      failures.push(`Evaluation prompts do not test unsupported fact: ${term}.`);
    }
  }
  for (const prompt of prompts) {
    for (const field of ['id', 'category', 'prompt', 'expected_canonical_id', 'expected_retrieval_page', 'expected_behavior', 'forbidden_invented_facts']) {
      if (prompt[field] === undefined || prompt[field] === null || prompt[field] === '') {
        failures.push(`Evaluation prompt missing ${field}: ${prompt.id || 'unknown'}.`);
      }
    }
  }
  return failures;
}

function safetyFailures(markdown, packet, markdownPath) {
  const failures = [];
  if (/password=|pwd=|secret|token=/i.test(markdown)) failures.push(`${markdownPath} appears to expose a sensitive value.`);
  if (/(sample value|raw row|raw data value)\s*:/i.test(markdown)) failures.push(`${markdownPath} appears to publish raw/sample data wording.`);
  if (/\bOwner\s*:\s*(?!not surfaced)/i.test(markdown)) failures.push(`${markdownPath} appears to publish an owner value.`);
  if (hasForbiddenBranch(packet.page_tree_path)) failures.push(`${markdownPath} is under a forbidden Rovo branch.`);
  if (!pagePath(packet.page_tree_path).startsWith(pagePath(rootPath))) failures.push(`${markdownPath} is outside the AI Retrieval Artifacts root.`);
  if (!markdown.includes(packet.evidence_hash || 'sha256:')) failures.push(`${markdownPath} does not include its evidence hash.`);
  return failures;
}

function splitRecommendations(markdownPath, markdown, packet) {
  const recommendations = [];
  if (markdown.length > contextPageSizeLimit) {
    recommendations.push({
      markdownPath,
      message: `Page size ${markdown.length} exceeds ${contextPageSizeLimit}; split ${packet.page_title || markdownPath}.`,
    });
  }
  return recommendations;
}

async function validateDryRun() {
  const failures = [];
  const split_recommendations = [];
  const manifest = await readJson(path.join(outputRoot, 'manifest.json'));
  const seenTypes = new Set();
  for (const page of manifest.pages || []) {
    const packet = await readJson(path.join(outputRoot, page.evidenceFile));
    const markdownPath = path.join(outputRoot, page.markdownFile);
    const markdown = await readText(markdownPath);
    seenTypes.add(packet.page_type);
    failures.push(...safetyFailures(markdown, packet, page.markdownFile));
    split_recommendations.push(...splitRecommendations(page.markdownFile, markdown, packet));
    if (packet.page_type === 'rovo-object-locator') failures.push(...validateLocatorRows(packet));
    if (packet.page_type === 'rovo-database-context') failures.push(...validateDatabaseContext(packet));
    if (packet.page_type === 'rovo-object-summary-context') failures.push(...validateObjectSummary(packet));
    if (packet.page_type === 'rovo-upstream-context') failures.push(...validateLineageContext(packet, 'upstream'));
    if (packet.page_type === 'rovo-downstream-context') failures.push(...validateLineageContext(packet, 'downstream'));
    if (packet.page_type === 'rovo-ambiguity-context') failures.push(...validateAmbiguity(packet));
    if (packet.page_type === 'rovo-evaluation-prompts') failures.push(...validateEvaluationPrompts(packet));
  }
  for (const pageType of requiredPageTypes) {
    if (!seenTypes.has(pageType)) failures.push(`Manifest is missing required page type: ${pageType}.`);
  }
  return { checkedPages: (manifest.pages || []).length, failures, split_recommendations };
}

function runSmokeChecks() {
  const failures = [];
  const noDatabaseFailures = validateLocatorRows({
    locator_rows: [
      {
        lookup_key: 'DimVehicle',
        canonical_id: 'object:example',
        type: 'table',
        database: 'Sonic_DW',
        schema: 'dbo',
        object: 'DimVehicle',
        aliases: ['DimVehicle'],
        quick_context_page: 'Rovo Object Summary Context 001',
        canonical_human_page: 'not created yet',
        confidence: 'high',
      },
    ],
  });
  if (!noDatabaseFailures.some((message) => message.includes('VendorData database-level'))) {
    failures.push('Smoke check failed to reject missing database locator rows.');
  }

  const noAmbiguityFailures = validateAmbiguity({ ambiguity_groups: [] });
  if (!noAmbiguityFailures.some((message) => message.includes('Ambiguity context has no groups'))) {
    failures.push('Smoke check failed to reject missing ambiguity groups.');
  }

  const oversizedRecommendations = splitRecommendations(
    'smoke/oversized.md',
    'x'.repeat(contextPageSizeLimit + 1),
    { page_title: 'Oversized Context' }
  );
  if (oversizedRecommendations.length === 0) {
    failures.push('Smoke check failed to produce split recommendation for oversized page.');
  }
  return { failures, splitRecommendations: oversizedRecommendations };
}

async function main() {
  const dryRun = await validateDryRun();
  const smoke = runSmokeChecks();
  const failures = [...dryRun.failures, ...smoke.failures];
  const split_recommendations = [...dryRun.split_recommendations, ...smoke.splitRecommendations];
  const status = failures.length === 0 ? 'passed' : 'failed';
  console.log(
    JSON.stringify(
      {
        status,
        checkedPages: dryRun.checkedPages,
        split_recommendations,
        smokeChecks: [
          'missing-database-locator-rejection',
          'missing-ambiguity-rejection',
          'oversized-page-split-recommendation',
        ],
        failures,
      },
      null,
      2
    )
  );
  if (failures.length > 0) process.exitCode = 1;
}

await main();
