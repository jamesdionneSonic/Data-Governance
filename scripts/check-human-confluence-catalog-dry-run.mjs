import fs from 'node:fs/promises';
import path from 'node:path';

const outputRootArgIndex = process.argv.indexOf('--output-root');
const outputRoot =
  outputRootArgIndex >= 0
    ? path.resolve(process.argv[outputRootArgIndex + 1] || '')
    : path.resolve('data/confluence/human-catalog-dry-run');
const missingPhrase = 'not surfaced in metadata';
const bannedGenericSummaries = [
  'handles data movement',
  'related to data movement',
  'moves data for downstream systems',
  'supports reporting',
];
const requiredObjectConfidenceFields = [
  'lineage_confidence',
  'description_confidence',
  'profile_confidence',
  'documentation_confidence',
];
const databaseCatalogExcludedDatabase = 'ssisdb';
const databaseCatalogExcludedTypes = ['dataset', 'package'];

function section(text, title) {
  const match = String(text).match(new RegExp(`## ${title}\\n\\n([\\s\\S]*?)(?=\\n## |$)`));
  return match ? match[1].trim() : '';
}

function flattenValues(value, terms = []) {
  if (value === null || value === undefined) return terms;
  if (typeof value === 'string') {
    if (/^[A-Za-z0-9_.\\ -]{4,}$/.test(value)) terms.push(value);
    return terms;
  }
  if (Array.isArray(value)) {
    for (const item of value) flattenValues(item, terms);
    return terms;
  }
  if (typeof value === 'object') {
    for (const item of Object.values(value)) flattenValues(item, terms);
  }
  return terms;
}

function concreteTerms(packet) {
  const objectTerms = packet?.object
    ? [
        packet.object.qualified_name,
        [packet.object.database, packet.object.schema, packet.object.name].filter(Boolean).join('.'),
        packet.object.name,
      ]
    : [];
  const raw = [...objectTerms, ...flattenValues(packet)]
    .filter(Boolean)
    .map((term) => term.replace(/`/g, '').trim())
    .filter((term) => term.length >= 4)
    .filter((term) => /[A-Za-z]/.test(term))
    .filter((term) => !/^(strong catalog evidence|lineage-documented|not surfaced)$/i.test(term));
  return [...new Set(raw)].sort((left, right) => right.length - left.length).slice(0, 80);
}

function hasConcreteEvidence(summary, packet) {
  const normalized = summary.toLowerCase();
  const pageTerms = [
    packet?.page_title,
    packet?.database_slice?.database,
    packet?.catalog_slice?.database,
    packet?.catalog_slice?.schema,
    packet?.catalog_slice?.database && packet?.catalog_slice?.schema
      ? `${packet.catalog_slice.database}.${packet.catalog_slice.schema}`
      : '',
  ].filter(Boolean);
  if (pageTerms.some((term) => normalized.includes(String(term).toLowerCase()))) return true;
  const objectTerms = packet?.object
    ? [
        packet.object.qualified_name,
        [packet.object.database, packet.object.schema, packet.object.name].filter(Boolean).join('.'),
        packet.object.name,
      ].filter(Boolean)
    : [];
  if (objectTerms.some((term) => normalized.includes(String(term).toLowerCase()))) return true;
  return concreteTerms(packet).some((term) => normalized.includes(term.toLowerCase()));
}

function isExcludedDatabaseCatalogPath(packet) {
  const pathParts = packet.page_tree_path || [];
  return (
    pathParts[0] === 'Sonic Data Lineage' &&
    pathParts[1] === 'Database Catalog' &&
    pathParts.slice(2).some((part) => String(part || '').toLowerCase() === databaseCatalogExcludedDatabase)
  );
}

function isExcludedDatabaseCatalogObject(object) {
  return (
    String(object?.database || '').toLowerCase() === databaseCatalogExcludedDatabase &&
    databaseCatalogExcludedTypes.includes(String(object?.type || '').toLowerCase())
  );
}

function humanCatalogObjectExclusionReason(object) {
  const type = String(object?.type || object?.object_type || '').trim().toLowerCase();
  if (type !== 'table') return null;
  const name = String(object?.name || object?.object_name || object?.display_name || '').trim();
  if (!name) return null;
  const normalized = name.toLowerCase();
  const tokenized = normalized.replace(/[^a-z0-9]+/g, '_');
  const obviousRetiredToken =
    /(^|_)(bak|bk|bkp|backup|back_up|old|obsolete|deprecated|delete|deleted|drop|remove|retire|retired|scratch|tmp|temp)(_|$|[0-9])/i;
  const obviousPrefix = /^(zzz+|delete_|deleted_|drop_|tmp_|temp_|bak_|bk_|bkp_|backup_|old_)/i;
  const obviousSuffix = /(_bak|_bk|_bkp|_backup|_old|_obsolete|_deprecated|_delete|_deleted|_drop|_remove|_retired|_scratch|_tmp|_temp)$/i;
  if (obviousRetiredToken.test(tokenized) || obviousPrefix.test(normalized) || obviousSuffix.test(normalized)) {
    return 'obvious backup/temp/delete table marker';
  }
  return null;
}

function schemaPageTreeTitle(database, schema) {
  const databaseName = String(database || 'unknown').trim() || 'unknown';
  const schemaName = String(schema || 'unknown').trim() || 'unknown';
  if (schemaName.toLowerCase().startsWith(`${databaseName.toLowerCase()}.`)) return schemaName;
  return `${databaseName}.${schemaName}`;
}

function objectTypeBucketTitle(type) {
  const normalized = String(type || '').trim().toLowerCase();
  if (normalized === 'table') return 'Tables';
  if (normalized === 'view') return 'Views';
  if (normalized === 'procedure') return 'Stored Procedures';
  if (normalized === 'function') return 'Functions';
  if (normalized === 'synonym') return 'Synonyms';
  return 'Other Objects';
}

function objectTypeBucketTreeTitle(database, schema, type) {
  return `${schemaPageTreeTitle(database, schema)} ${objectTypeBucketTitle(type)}`;
}

function objectPageTreeTitle(database, schema, name) {
  return `${database}.${schema}.${name || 'unknown'}`;
}

function validateObjectLinkStatus(object, label) {
  const failures = [];
  const name = object?.full_name || object?.qualified_name || object?.name || label || 'unknown';
  if (!object?.canonical_page_path) failures.push(`${label} is missing canonical page path: ${name}.`);
  if (typeof object?.canonical_page_exists !== 'boolean') {
    failures.push(`${label} is missing canonical_page_exists boolean: ${name}.`);
  }
  if (typeof object?.planned_in_packet !== 'boolean') {
    failures.push(`${label} is missing planned_in_packet boolean: ${name}.`);
  }
  if (!['linked', 'pending', 'blocked'].includes(object?.link_status)) {
    failures.push(`${label} has invalid link_status: ${name}.`);
  }
  if (!object?.link_status_reason) failures.push(`${label} is missing link_status_reason: ${name}.`);
  if (object?.link_status === 'linked' && object?.canonical_page_exists !== true) {
    failures.push(`${label} cannot be linked until canonical_page_exists is true: ${name}.`);
  }
  return failures;
}

function validatePage({ markdown, packet, markdownPath }) {
  const failures = [];
  if (isExcludedDatabaseCatalogPath(packet)) {
    failures.push('SSIS package/catalog artifacts must not be published under Database Catalog; use SSIS support documentation.');
  }
  const summary = section(markdown, 'Plain-English Summary');
  if (summary.length < 80) {
    failures.push('Plain-English Summary is too short to support a human review.');
  }
  if (!hasConcreteEvidence(summary, packet)) {
    failures.push('Plain-English Summary does not name a concrete source, target, product, schema, package, or object from evidence.');
  }
  if (bannedGenericSummaries.some((phrase) => summary.toLowerCase().includes(phrase))) {
    failures.push('Plain-English Summary contains generic unsupported wording.');
  }
  if (!markdown.includes(packet.evidence_hash || 'sha256:')) {
    failures.push('Page does not include the evidence hash used for the generated prose.');
  }
  if (!Array.isArray(packet.source_artifact_paths) || packet.source_artifact_paths.length === 0) {
    failures.push('Evidence packet does not record source artifact paths.');
  }
  if (/no target surfaced|missing target|unknown target/i.test(markdown) && !markdown.toLowerCase().includes(missingPhrase)) {
    failures.push(`Missing target/source facts must use "${missingPhrase}" wording.`);
  }
  if (!/Technical Evidence/i.test(markdown) || !/<details>/i.test(markdown)) {
    failures.push('Technical evidence must be separated below the human summary in an expandable/details section.');
  }
  if (/password=|pwd=|secret|token=/i.test(markdown)) {
    failures.push('Page appears to expose a sensitive value.');
  }
  if (packet.page_type === 'object') {
    if ((packet.page_tree_path || []).includes('High-Value Assets')) {
      failures.push('Object pages must use canonical Database Catalog path, not High-Value Assets.');
    }
    const object = packet.object || {};
    if (isExcludedDatabaseCatalogObject(object)) {
      failures.push('SSIS package/catalog object pages must not be published under Database Catalog; use SSIS support documentation.');
    }
    const expectedPath = [
      'Sonic Data Lineage',
      'Database Catalog',
      object.platform,
      object.database,
      schemaPageTreeTitle(object.database, object.schema),
      objectTypeBucketTreeTitle(object.database, object.schema, object.type),
      objectPageTreeTitle(object.database, object.schema, object.name),
    ].filter(Boolean);
    if (expectedPath.length === 7 && (packet.page_tree_path || []).join(' / ') !== expectedPath.join(' / ')) {
      failures.push('Object page tree path is not the canonical platform/database/schema/type/object path.');
    }
    if (!packet.confidence || typeof packet.confidence !== 'object') {
      failures.push('Object evidence packet does not include page-level confidence.');
    } else {
      for (const field of requiredObjectConfidenceFields) {
        if (!packet.confidence[field]) failures.push(`Object evidence packet is missing confidence field: ${field}.`);
      }
    }
    if (!Array.isArray(packet.not_surfaced_facts) || packet.not_surfaced_facts.length === 0) {
      failures.push('Object evidence packet does not include not_surfaced_facts.');
    }
    if (!Array.isArray(packet.tags)) {
      failures.push('Object evidence packet does not include deterministic tags.');
    }
    if (!Array.isArray(packet.tag_reasons) || packet.tag_reasons.length === 0) {
      failures.push('Object evidence packet does not include tag reasons.');
    }
    if ((packet.tags || []).includes('high-value') && !packet.human_reviewed_high_value) {
      failures.push('Object evidence packet assigns high-value without human-reviewed evidence.');
    }
    if (!Array.isArray(packet.aliases) || packet.aliases.length === 0) {
      failures.push('Object evidence packet does not include aliases.');
    }
    if (!Array.isArray(packet.backlinks) || packet.backlinks.length < 2) {
      failures.push('Object evidence packet does not include database and schema backlinks.');
    }
    if (packet.page_generation_level !== 'thin') {
      failures.push('Object evidence packet must declare the current page_generation_level as thin.');
    }
    const promotion = packet.rich_promotion || {};
    if (promotion.rule_version !== 'dcat-009.2026-06-19') {
      failures.push('Object evidence packet does not include the current rich promotion rule version.');
    }
    if (promotion.current_level !== 'thin') {
      failures.push('Object rich promotion metadata must keep current_level as thin until explicitly promoted.');
    }
    if (typeof promotion.eligible_for_rich_page !== 'boolean') {
      failures.push('Object rich promotion metadata must include eligible_for_rich_page boolean.');
    }
    if (!Array.isArray(promotion.reasons) || !Array.isArray(promotion.blocked_reasons)) {
      failures.push('Object rich promotion metadata must include reasons and blocked_reasons arrays.');
    }
  }
  if (packet.page_type === 'database') {
    const highUsageObjects = packet.database_slice?.high_usage_objects || [];
    for (const object of highUsageObjects) {
      failures.push(...validateObjectLinkStatus(object, 'Database high-use object row'));
    }
    const linkSummary = packet.database_slice?.link_status_summary;
    if (!linkSummary || typeof linkSummary.pending !== 'number') {
      failures.push('Database evidence packet is missing link_status_summary.');
    }
  }
  if (packet.page_type === 'schema') {
    const expectedSchemaPath = [
      'Sonic Data Lineage',
      'Database Catalog',
      packet.catalog_slice?.platform,
      packet.catalog_slice?.database,
      packet.page_tree_path?.at?.(-1) || packet.catalog_slice?.schema,
    ].filter(Boolean);
    if (expectedSchemaPath.length === 5 && (packet.page_tree_path || []).join(' / ') !== expectedSchemaPath.join(' / ')) {
      failures.push('Schema page tree path is not the canonical Database Catalog / Platform / Database / Schema path.');
    }
    const objects = packet.catalog_slice?.objects || [];
    const total = Number(packet.catalog_slice?.object_counts?.total || 0);
    if (!Array.isArray(objects) || objects.length !== total) {
      failures.push(`Schema evidence packet object inventory does not reconcile to total count: ${objects.length} of ${total}.`);
    }
    const objectTags = packet.catalog_slice?.object_tags || [];
    if (!Array.isArray(objectTags) || objectTags.length === 0) {
      failures.push('Schema evidence packet does not include object tag summaries.');
    }
    for (const taggedObject of objectTags) {
      if (!Array.isArray(taggedObject.tags)) failures.push(`Schema object tag row is missing tags: ${taggedObject.full_name || 'unknown'}.`);
      if (!Array.isArray(taggedObject.tag_reasons)) {
        failures.push(`Schema object tag row is missing tag reasons: ${taggedObject.full_name || 'unknown'}.`);
      }
      failures.push(...validateObjectLinkStatus(taggedObject, 'Schema object tag row'));
    }
    const linkSummary = packet.catalog_slice?.link_status_summary;
    if (!linkSummary || typeof linkSummary.pending !== 'number') {
      failures.push('Schema evidence packet is missing link_status_summary.');
    }
    for (const object of objects) {
      if (isExcludedDatabaseCatalogObject(object)) {
        failures.push(`Schema object row is an SSIS package/catalog artifact and must not be in Database Catalog: ${object.full_name || 'unknown'}.`);
      }
      const objectExclusionReason = humanCatalogObjectExclusionReason(object);
      if (objectExclusionReason) {
        failures.push(`Schema object row is an obvious retired/backup table and must not be in Database Catalog: ${object.full_name || object.name || 'unknown'} (${objectExclusionReason}).`);
      }
      failures.push(...validateObjectLinkStatus(object, 'Schema object row'));
      if (!Array.isArray(object.aliases)) failures.push(`Schema object row is missing aliases: ${object.full_name || 'unknown'}.`);
      if (!Array.isArray(object.not_surfaced_facts)) {
        failures.push(`Schema object row is missing not_surfaced_facts: ${object.full_name || 'unknown'}.`);
      }
    }
  }
  return failures.map((message) => ({ markdownPath, message }));
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function listGeneratedFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listGeneratedFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function dryRunManifestPages() {
  const manifest = await readJson(path.join(outputRoot, 'manifest.json'));
  if (!Array.isArray(manifest.pages)) throw new Error('Dry-run manifest does not include a pages array.');
  return manifest.pages;
}

async function validateDryRunPages() {
  const manifestPages = await dryRunManifestPages();
  const failures = [];
  for (const page of manifestPages) {
    const markdownPath = path.join(outputRoot, page.markdownFile);
    const evidencePath = path.join(outputRoot, page.evidenceFile);
    const markdown = await fs.readFile(markdownPath, 'utf8');
    let packet;
    try {
      packet = await readJson(evidencePath);
    } catch {
      failures.push({ markdownPath, message: `Missing or invalid evidence packet: ${evidencePath}` });
      continue;
    }
    failures.push(...validatePage({ markdown, packet, markdownPath }));
  }
  return { checkedPages: manifestPages.length, failures };
}

async function validateSupersededPagesReport() {
  const failures = [];
  const reportPath = path.join(outputRoot, 'superseded-pages-report.json');
  let report;
  try {
    report = await readJson(reportPath);
  } catch {
    return [{ markdownPath: reportPath, message: 'Missing or invalid superseded pages dry-run report.' }];
  }
  if (report.cleanup_allowed !== false) {
    failures.push({ markdownPath: reportPath, message: 'Superseded report must disable cleanup actions.' });
  }
  if (report.requires_explicit_cleanup_approval !== true) {
    failures.push({ markdownPath: reportPath, message: 'Superseded report must require explicit cleanup approval.' });
  }
  const candidates = report.candidates || [];
  if (!Array.isArray(candidates)) {
    failures.push({ markdownPath: reportPath, message: 'Superseded report candidates must be an array.' });
    return failures;
  }
  for (const candidate of candidates) {
    const candidateType = String(candidate.candidate_type || '').trim();
    if (candidate.cleanup_allowed !== false || candidate.requires_explicit_cleanup_approval !== true) {
      failures.push({ markdownPath: reportPath, message: `Superseded candidate is missing cleanup guardrails: ${candidate.noncanonical_title}` });
    }
    if (String(candidate.canonical_path || '').includes('High-Value Assets')) {
      failures.push({ markdownPath: reportPath, message: `Superseded candidate canonical path still points to High-Value Assets: ${candidate.noncanonical_title}` });
    }
    if (candidateType === 'excluded-obvious-retired-table') {
      if (!candidate.noncanonical_title || !candidate.noncanonical_path || !candidate.recommended_action || !candidate.reason) {
        failures.push({ markdownPath: reportPath, message: `Excluded retired-table candidate is incomplete: ${candidate.noncanonical_title || 'unknown'}` });
      }
      if (candidate.canonical_title || candidate.canonical_path) {
        failures.push({
          markdownPath: reportPath,
          message: `Excluded retired-table candidate must not claim a canonical replacement path: ${candidate.noncanonical_title || 'unknown'}`,
        });
      }
      continue;
    }
    if (!candidate.noncanonical_title || !candidate.canonical_path || !candidate.recommended_action) {
      failures.push({ markdownPath: reportPath, message: `Superseded candidate is incomplete: ${candidate.noncanonical_title || 'unknown'}` });
    }
  }
  return failures;
}

async function validateNoExcludedSsisDatabaseCatalogFiles() {
  const failures = [];
  for (const file of await listGeneratedFiles(outputRoot)) {
    const name = path.basename(file).toLowerCase();
    if (name.includes('ssisdb')) {
      failures.push({ markdownPath: file, message: 'Generated output contains stale ssisdb Database Catalog artifact.' });
      continue;
    }
    const text = await fs.readFile(file, 'utf8');
    if (/Sonic Data Lineage\s*\/\s*Database Catalog\s*\/\s*ssisdb/i.test(text)) {
      failures.push({ markdownPath: file, message: 'Generated output contains an ssisdb Database Catalog path.' });
    }
  }
  return failures;
}

function runSmokeChecks() {
  const strongPacket = {
    evidence_hash: 'sha256:STRONG',
    source_artifact_paths: ['data/products/fire.md'],
    product: {
      name: 'FIRE',
      key_final_objects: ['Sonic_DW.dbo.factFIRE'],
      key_jobs: ['FIRE.Summary.FIRESummary_Fact.dtsx'],
    },
  };
  const objectPacket = {
    page_type: 'object',
    evidence_hash: 'sha256:OBJECT',
    source_artifact_paths: ['data/markdown/object.md'],
    object: {
      name: 'DimVehicle',
      qualified_name: 'Sonic_DW.dbo.DimVehicle',
      platform: 'SQL Server',
      database: 'Sonic_DW',
      schema: 'dbo',
      type: 'table',
    },
    page_tree_path: [
      'Sonic Data Lineage',
      'Database Catalog',
      'SQL Server',
      'Sonic_DW',
      'Sonic_DW.dbo',
      'Sonic_DW.dbo Tables',
      'Sonic_DW.dbo.DimVehicle',
    ],
    tags: ['high-use', 'profiled'],
    tag_reasons: ['high-use: 12 downstream consumer signals meet the threshold of 10.'],
    confidence: {
      lineage_confidence: 'high',
      description_confidence: 'low',
      profile_confidence: 'medium',
      documentation_confidence: 'medium',
    },
    not_surfaced_facts: ['business owner', 'SLA', 'live freshness'],
    aliases: ['Sonic_DW.dbo.DimVehicle', 'dbo.DimVehicle', 'DimVehicle', 'dimvehicle'],
    backlinks: [
      'Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW',
      'Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Sonic_DW.dbo',
    ],
    page_generation_level: 'thin',
    rich_promotion: {
      rule_version: 'dcat-009.2026-06-19',
      current_level: 'thin',
      recommended_next_level: 'thin',
      eligible_for_rich_page: false,
      reasons: ['profile context is surfaced'],
      blocked_reasons: ['business definition is not surfaced in metadata'],
    },
  };
  const strongPage = `# Data Product - FIRE

## Plain-English Summary

FIRE represents retail sales and finance reporting. It is loaded by \`FIRE.Summary.FIRESummary_Fact.dtsx\` and supports \`Sonic_DW.dbo.factFIRE\` for downstream summary reporting. If it is stale, sales and finance reporting can miss current rows.

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence hash: \`sha256:STRONG\`

</details>`;

  const weakPacket = {
    evidence_hash: 'sha256:WEAK',
    source_artifact_paths: ['data/markdown/weak.md'],
    object: {
      name: 'UnknownFeed',
      target_summary: '',
    },
  };
  const weakPage = `# Weak Evidence Object

## Plain-English Summary

\`UnknownFeed\` has limited lineage evidence. The final target was not surfaced in metadata, so support should review the source artifact before assuming downstream impact.

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence hash: \`sha256:WEAK\`

</details>`;

  const badWeakPage = weakPage.replace(`The final target was ${missingPhrase}`, 'The missing target was not found');
  const objectPage = `# High-Value Object - Sonic_DW.dbo.DimVehicle

## Plain-English Summary

\`Sonic_DW.dbo.DimVehicle\` is a shared dimension/reference table with concrete lineage evidence and downstream consumers. Missing owner and live freshness are not surfaced in metadata.

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence hash: \`sha256:OBJECT\`

</details>`;
  const strongFailures = validatePage({ markdown: strongPage, packet: strongPacket, markdownPath: 'smoke/strong.md' });
  const weakFailures = validatePage({ markdown: weakPage, packet: weakPacket, markdownPath: 'smoke/weak.md' });
  const objectFailures = validatePage({ markdown: objectPage, packet: objectPacket, markdownPath: 'smoke/object.md' });
  const badWeakFailures = validatePage({ markdown: badWeakPage, packet: weakPacket, markdownPath: 'smoke/bad-weak.md' });
  const badObjectPacket = {
    ...objectPacket,
    page_tree_path: ['Sonic Data Lineage', 'High-Value Assets', 'High-Value Object - Sonic_DW.dbo.DimVehicle'],
  };
  const badSchemaPacket = {
    page_type: 'schema',
    evidence_hash: 'sha256:SCHEMA',
    source_artifact_paths: ['data/lineage-runtime-package/registry/canonical-objects.jsonl'],
    page_tree_path: ['Sonic Data Lineage', 'Database Catalog', 'Sonic_DW', 'Schema - Sonic_DW.dbo'],
    catalog_slice: {
      platform: 'SQL Server',
      database: 'Sonic_DW',
      schema: 'dbo',
      object_counts: { total: 1 },
      objects: [
        {
          full_name: 'Sonic_DW.dbo.DimVehicle',
          canonical_page_path:
            'Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Sonic_DW.dbo / Sonic_DW.dbo Tables / Sonic_DW.dbo.DimVehicle',
          aliases: ['DimVehicle'],
          not_surfaced_facts: ['business definition'],
        },
      ],
      object_tags: [{ full_name: 'Sonic_DW.dbo.DimVehicle', tags: ['review-needed'], tag_reasons: ['review-needed'] }],
    },
  };
  const badSchemaPage = `# Schema - Sonic_DW.dbo

## Plain-English Summary

\`Sonic_DW.dbo\` is a cataloged schema with concrete warehouse objects, but this smoke check intentionally uses a noncanonical page tree path.

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence hash: \`sha256:SCHEMA\`

</details>`;
  const badSsisCatalogPacket = {
    page_type: 'schema',
    evidence_hash: 'sha256:SSIS',
    source_artifact_paths: ['data/lineage-runtime-package/registry/canonical-objects.jsonl'],
    page_tree_path: ['Sonic Data Lineage', 'Database Catalog', 'SQL Server', 'ssisdb', 'external_sources'],
    catalog_slice: {
      platform: 'SQL Server',
      database: 'ssisdb',
      schema: 'external_sources',
      object_counts: { total: 1 },
      objects: [
        {
          database: 'ssisdb',
          schema: 'external_sources',
          name: 'CallRevu_Master.dtsx',
          type: 'package',
          full_name: 'ssisdb.external_sources.CallRevu_Master.dtsx',
          canonical_page_path: 'Sonic Data Lineage / Database Catalog / SQL Server / ssisdb / external_sources / CallRevu_Master.dtsx',
          aliases: ['CallRevu_Master.dtsx'],
          not_surfaced_facts: ['business definition'],
        },
      ],
      object_tags: [{ full_name: 'ssisdb.external_sources.CallRevu_Master.dtsx', tags: ['review-needed'], tag_reasons: ['review-needed'] }],
    },
  };
  const badSsisCatalogPage = `# external_sources

## Plain-English Summary

\`ssisdb.external_sources\` is an SSIS catalog slice that should be rejected from Database Catalog because SSIS packages are documented in the support documentation lane.

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence hash: \`sha256:SSIS\`

</details>`;
  const badObjectFailures = validatePage({ markdown: objectPage, packet: badObjectPacket, markdownPath: 'smoke/bad-object-path.md' });
  const badSchemaFailures = validatePage({ markdown: badSchemaPage, packet: badSchemaPacket, markdownPath: 'smoke/bad-schema-path.md' });
  const badSsisCatalogFailures = validatePage({
    markdown: badSsisCatalogPage,
    packet: badSsisCatalogPacket,
    markdownPath: 'smoke/bad-ssis-database-catalog.md',
  });
  const badBackupTablePacket = {
    page_type: 'schema',
    evidence_hash: 'sha256:BACKUP',
    source_artifact_paths: ['data/lineage-runtime-package/registry/canonical-objects.jsonl'],
    page_tree_path: ['Sonic Data Lineage', 'Database Catalog', 'SQL Server', 'Sonic_DW', 'Sonic_DW.dbo'],
    catalog_slice: {
      platform: 'SQL Server',
      database: 'Sonic_DW',
      schema: 'dbo',
      object_counts: { total: 1 },
      objects: [
        {
          database: 'Sonic_DW',
          schema: 'dbo',
          name: 'Dim_DMSCustomer_temp',
          type: 'table',
          full_name: 'Sonic_DW.dbo.Dim_DMSCustomer_temp',
          canonical_page_path:
            'Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Sonic_DW.dbo / Sonic_DW.dbo Tables / Sonic_DW.dbo.Dim_DMSCustomer_temp',
          aliases: ['Dim_DMSCustomer_temp'],
          not_surfaced_facts: ['business definition'],
          canonical_page_exists: false,
          planned_in_packet: false,
          link_status: 'pending',
          link_status_reason: 'smoke test',
        },
      ],
      object_tags: [],
      link_status_summary: { pending: 1 },
    },
  };
  const badBackupTablePage = `# Sonic_DW.dbo

## Plain-English Summary

\`Sonic_DW.dbo\` is a cataloged schema with concrete warehouse objects; this smoke check intentionally includes a temporary table that should be excluded from human catalog browsing.

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Evidence hash: \`sha256:BACKUP\`

</details>`;
  const badBackupTableFailures = validatePage({
    markdown: badBackupTablePage,
    packet: badBackupTablePacket,
    markdownPath: 'smoke/bad-backup-table.md',
  });
  const failures = [...strongFailures, ...weakFailures, ...objectFailures];
  if (!badWeakFailures.some((failure) => failure.message.includes(missingPhrase))) {
    failures.push({
      markdownPath: 'smoke/bad-weak.md',
      message: `Smoke check failed to reject missing facts without "${missingPhrase}" wording.`,
    });
  }
  if (!badObjectFailures.some((failure) => failure.message.includes('High-Value Assets'))) {
    failures.push({
      markdownPath: 'smoke/bad-object-path.md',
      message: 'Smoke check failed to reject object pages under High-Value Assets.',
    });
  }
  if (!badSchemaFailures.some((failure) => failure.message.includes('canonical Database Catalog'))) {
    failures.push({
      markdownPath: 'smoke/bad-schema-path.md',
      message: 'Smoke check failed to reject noncanonical schema page paths.',
    });
  }
  if (!badSsisCatalogFailures.some((failure) => failure.message.includes('SSIS package/catalog artifacts'))) {
    failures.push({
      markdownPath: 'smoke/bad-ssis-database-catalog.md',
      message: 'Smoke check failed to reject SSIS package/catalog artifacts under Database Catalog.',
    });
  }
  if (!badBackupTableFailures.some((failure) => failure.message.includes('obvious retired/backup table'))) {
    failures.push({
      markdownPath: 'smoke/bad-backup-table.md',
      message: 'Smoke check failed to reject obvious backup/temp/delete tables from Database Catalog.',
    });
  }
  return failures;
}

async function main() {
  const dryRun = await validateDryRunPages();
  const supersededFailures = await validateSupersededPagesReport();
  const staleSsisFailures = await validateNoExcludedSsisDatabaseCatalogFiles();
  const smokeFailures = runSmokeChecks();
  const failures = [...dryRun.failures, ...supersededFailures, ...staleSsisFailures, ...smokeFailures];
  if (failures.length > 0) {
    console.error(JSON.stringify({ status: 'failed', checkedPages: dryRun.checkedPages, failures }, null, 2));
    process.exitCode = 1;
    return;
  }
  console.log(
    JSON.stringify(
      {
        status: 'passed',
        checkedPages: dryRun.checkedPages,
        reportChecks: ['superseded-pages-dry-run'],
        filesystemChecks: ['no-ssisdb-database-catalog-artifacts'],
        smokeChecks: [
          'strong-evidence-object',
          'weak-evidence-object',
          'object-trust-fields',
          'weak-missing-fact-rejection',
          'canonical-object-path-rejection',
          'canonical-schema-path-rejection',
          'ssis-database-catalog-rejection',
        ],
      },
      null,
      2
    )
  );
}

await main();
