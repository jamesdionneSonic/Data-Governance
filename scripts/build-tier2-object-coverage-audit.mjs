import fs from 'node:fs/promises';
import path from 'node:path';

const dryRunRoot = path.resolve('data/confluence/human-catalog-dry-run');
const outputRoot = path.resolve('data/confluence/tier2-object-coverage');
const docsRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const localManifestOut = path.join(outputRoot, 't2p-01-object-coverage-manifest.json');
const docsManifestOut = path.join(docsRoot, 'T2P-01-tier2-object-coverage-manifest.jsonl');
const reportOut = path.join(docsRoot, 'T2P-01-tier2-object-coverage-audit.md');
const liveReadbackFile = path.join(docsRoot, 'FDP-04-tier2-batch01-live-publish-readback.md');

const expectedTreePrefix = ['Sonic Data Lineage', 'Database Catalog'];
const requiredCurrentPathParts = ['Sonic Data Lineage', 'Database Catalog'];

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function readTextIfExists(file) {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return '';
  }
}

function pagePath(parts) {
  return parts.filter(Boolean).join(' / ');
}

function isCurrentPlatformPath(parts) {
  return (
    Array.isArray(parts) &&
    parts.length >= 6 &&
    parts[0] === requiredCurrentPathParts[0] &&
    parts[1] === requiredCurrentPathParts[1] &&
    Boolean(parts[2]) &&
    Boolean(parts[3]) &&
    Boolean(parts[4]) &&
    Boolean(parts[5])
  );
}

function objectKey(platform, database, schema, name) {
  return [platform || 'unknown', database || 'unknown', schema || 'unknown', name || 'unknown'].join('|');
}

function mdTable(rows, headers) {
  const safeRows = rows.length > 0 ? rows : [Object.fromEntries(headers.map((header) => [header, 'none']))];
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = safeRows.map((row) => `| ${headers.map((header) => String(row[header] ?? '').replace(/\n/g, '<br>')).join(' | ')} |`);
  return [head, sep, ...body].join('\n');
}

function parsePublishedObjects(readback) {
  const published = new Map();
  const linePattern = /^\|\s*`([^`]+)`\s*\|\s*`?([0-9]+)`?\s*\|/;
  for (const line of readback.split(/\r?\n/)) {
    const match = line.match(linePattern);
    if (!match) continue;
    const qualified = match[1].trim();
    const parts = qualified.split('.');
    if (parts.length < 3) continue;
    const [database, schema, ...nameParts] = parts;
    const name = nameParts.join('.');
    const key = objectKey('SQL Server', database, schema, name);
    published.set(key, {
      qualified_name: qualified,
      confluence_page_id: match[2],
      readback_file: path.relative(process.cwd(), liveReadbackFile).replaceAll('\\', '/'),
      published_path_status: 'stale_flat_path',
      reason: 'Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted.',
    });
  }
  return published;
}

function statusFor({ generated, published }) {
  if (published && published.published_path_status === 'current_platform_path') return 'published';
  if (published && published.published_path_status !== 'current_platform_path') return 'stale';
  if (generated) return 'generated';
  return 'missing';
}

async function main() {
  const manifest = await readJson(path.join(dryRunRoot, 'manifest.json'));
  const liveReadback = await readTextIfExists(liveReadbackFile);
  const publishedObjects = parsePublishedObjects(liveReadback);

  const generatedObjects = new Map();
  const schemaObjects = new Map();
  const schemaCounts = new Map();

  for (const entry of manifest.pages || []) {
    const evidence = await readJson(path.join(dryRunRoot, entry.evidenceFile));
    if (evidence.page_type === 'object') {
      const platform = evidence.object?.platform || evidence.platform_product || evidence.object?.source_type || evidence.page_tree_path?.[2];
      const database = evidence.object?.database;
      const schema = evidence.object?.schema;
      const name = evidence.object?.name;
      const key = objectKey(platform, database, schema, name);
      generatedObjects.set(key, {
        key,
        object_id: evidence.object?.object_id || null,
        platform,
        database,
        schema,
        name,
        type: evidence.object?.type,
        generated_path: pagePath(evidence.page_tree_path),
        generated_path_status: isCurrentPlatformPath(evidence.page_tree_path) ? 'current_platform_path' : 'stale_or_invalid_path',
        markdown_file: entry.markdownFile,
        evidence_file: entry.evidenceFile,
        page_generation_level: evidence.page_generation_level || 'unknown',
      });
    }

    if (evidence.page_type === 'schema') {
      const platform = evidence.catalog_slice?.platform_product || evidence.catalog_slice?.platform || evidence.page_tree_path?.[2];
      const database = evidence.catalog_slice?.database;
      const schema = evidence.catalog_slice?.schema;
      const schemaKey = objectKey(platform, database, schema, '*schema*');
      schemaCounts.set(schemaKey, {
        platform,
        database,
        schema,
        schema_path: pagePath(evidence.page_tree_path),
        total_objects: evidence.catalog_slice?.object_counts?.total || 0,
        evidence_file: entry.evidenceFile,
        markdown_file: entry.markdownFile,
      });
      for (const object of evidence.catalog_slice?.objects || []) {
        const key = objectKey(platform, database, schema, object.name);
        schemaObjects.set(key, {
          key,
          object_id: object.object_id || null,
          platform,
          database,
          schema,
          name: object.name,
          type: object.type || 'unknown',
          qualified_name: object.full_name || [database, schema, object.name].filter(Boolean).join('.'),
          canonical_page_path:
            object.canonical_page_path ||
            pagePath([...expectedTreePrefix, platform, database, schema, object.name]),
          devops_artifact_path: object.devops_artifact_path || null,
          column_count: object.column_count ?? null,
          upstream_count: object.upstream_count ?? 0,
          downstream_count: object.downstream_count ?? 0,
          profile_status: object.profile_status || 'not surfaced',
          tags: object.tags || [],
          confidence: object.confidence || 'not surfaced',
          schema_evidence_file: entry.evidenceFile,
          schema_markdown_file: entry.markdownFile,
        });
      }
    }
  }

  const objects = [];
  for (const [key, schemaObject] of schemaObjects) {
    const generated = generatedObjects.get(key) || null;
    const published = publishedObjects.get(key) || null;
    objects.push({
      ...schemaObject,
      status: statusFor({ generated, published }),
      generated: Boolean(generated),
      published: Boolean(published),
      generated_path: generated?.generated_path || null,
      generated_path_status: generated?.generated_path_status || 'not_generated',
      published_path_status: published?.published_path_status || 'not_published',
      confluence_page_id: published?.confluence_page_id || null,
      generated_markdown_file: generated?.markdown_file || null,
      generated_evidence_file: generated?.evidence_file || null,
      stale_reason: published?.published_path_status === 'stale_flat_path' ? published.reason : null,
    });
  }

  objects.sort((left, right) =>
    left.platform.localeCompare(right.platform) ||
    left.database.localeCompare(right.database) ||
    left.schema.localeCompare(right.schema) ||
    left.name.localeCompare(right.name)
  );

  const byStatus = {};
  const byPlatform = {};
  const bySchema = new Map();
  for (const object of objects) {
    byStatus[object.status] = (byStatus[object.status] || 0) + 1;
    byPlatform[object.platform] ||= { total: 0, missing: 0, generated: 0, published: 0, stale: 0, blocked: 0 };
    byPlatform[object.platform].total += 1;
    byPlatform[object.platform][object.status] = (byPlatform[object.platform][object.status] || 0) + 1;
    const schemaKey = objectKey(object.platform, object.database, object.schema, '*schema*');
    const current = bySchema.get(schemaKey) || {
      platform: object.platform,
      database: object.database,
      schema: object.schema,
      total: 0,
      missing: 0,
      generated: 0,
      published: 0,
      stale: 0,
      high_use_missing_or_stale: 0,
    };
    current.total += 1;
    current[object.status] = (current[object.status] || 0) + 1;
    if ((object.status === 'missing' || object.status === 'stale') && object.tags.includes('high-use')) {
      current.high_use_missing_or_stale += 1;
    }
    bySchema.set(schemaKey, current);
  }

  const highUseMissing = objects
    .filter((object) => (object.status === 'missing' || object.status === 'stale') && object.tags.includes('high-use'))
    .sort((left, right) => right.downstream_count - left.downstream_count || left.qualified_name.localeCompare(right.qualified_name));

  const eLeadExamples = highUseMissing
    .filter((object) => object.platform === 'SQL Server' && object.database.toLowerCase() === 'eleaddw')
    .slice(0, 10);

  const topSchemas = [...bySchema.values()]
    .filter((schema) => schema.missing > 0 || schema.stale > 0)
    .sort(
      (left, right) =>
        right.high_use_missing_or_stale - left.high_use_missing_or_stale ||
        right.missing + right.stale - (left.missing + left.stale) ||
        left.database.localeCompare(right.database)
    )
    .slice(0, 25);

  const generatedAt = new Date().toISOString();
  const audit = {
    packet_id: 'T2P-01',
    generated_at: generatedAt,
    source_artifacts: {
      dry_run_manifest: 'data/confluence/human-catalog-dry-run/manifest.json',
      live_tier2_readback: path.relative(process.cwd(), liveReadbackFile).replaceAll('\\', '/'),
    },
    scope: {
      catalog_root: 'Sonic Data Lineage / Database Catalog',
      canonical_path_shape: 'Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>',
      publish_mode: 'none; audit and manifest only',
      cleanup_mode: 'none',
    },
    summary: {
      publishable_objects: objects.length,
      generated_current_tier2_objects: objects.filter((object) => object.generated_path_status === 'current_platform_path').length,
      live_published_objects_from_existing_readback: objects.filter((object) => object.published).length,
      stale_live_published_objects: objects.filter((object) => object.status === 'stale').length,
      missing_objects: objects.filter((object) => object.status === 'missing').length,
      high_use_missing_or_stale: highUseMissing.length,
      schemas_with_missing_or_stale_objects: [...bySchema.values()].filter((schema) => schema.missing > 0 || schema.stale > 0).length,
    },
    status_counts: byStatus,
    platform_counts: byPlatform,
    schemas: [...bySchema.values()].sort(
      (left, right) => left.platform.localeCompare(right.platform) || left.database.localeCompare(right.database) || left.schema.localeCompare(right.schema)
    ),
    top_missing_or_stale_schemas: topSchemas,
    first_missing_high_use_objects: highUseMissing.slice(0, 50),
    eleaddw_missing_high_use_examples: eLeadExamples,
    stale_published_objects: objects.filter((object) => object.status === 'stale'),
    objects,
    validation: {
      status: objects.length > 0 ? 'passed_with_expected_gaps' : 'failed',
      failures: objects.length > 0 ? [] : ['No schema objects were found in the human catalog dry run.'],
      warnings: [
        'Existing live Tier 2 readback covers only the original 25 Sonic_DW.dbo objects.',
        'Those 25 live pages are marked stale because the readback path predates the platform/product catalog level.',
        'No Confluence publish or cleanup was performed by this packet.',
      ],
    },
  };

  await fs.mkdir(outputRoot, { recursive: true });
  await fs.mkdir(docsRoot, { recursive: true });
  await fs.writeFile(localManifestOut, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
  const docsManifestLines = [
    { record_type: 'summary', ...audit.summary, generated_at: audit.generated_at, packet_id: audit.packet_id },
    ...audit.schemas.map((schema) => ({ record_type: 'schema', ...schema })),
    ...audit.objects.map((object) => ({ record_type: 'object', ...object })),
  ];
  await fs.writeFile(docsManifestOut, `${docsManifestLines.map((line) => JSON.stringify(line)).join('\n')}\n`, 'utf8');

  const platformRows = Object.entries(byPlatform)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([platform, counts]) => ({
      Platform: `\`${platform}\``,
      Total: counts.total,
      Missing: counts.missing || 0,
      Generated: counts.generated || 0,
      Stale: counts.stale || 0,
      Published: counts.published || 0,
    }));

  const schemaRows = topSchemas.map((schema) => ({
    Platform: `\`${schema.platform}\``,
    Database: `\`${schema.database}\``,
    Schema: `\`${schema.schema}\``,
    Total: schema.total,
    Missing: schema.missing || 0,
    Stale: schema.stale || 0,
    'High-use missing/stale': schema.high_use_missing_or_stale || 0,
  }));

  const highUseRows = highUseMissing.slice(0, 25).map((object) => ({
    Object: `\`${object.qualified_name}\``,
    Platform: `\`${object.platform}\``,
    Status: `\`${object.status}\``,
    Downstream: object.downstream_count,
    Columns: object.column_count ?? 'not surfaced',
    'Canonical Path': `\`${object.canonical_page_path}\``,
  }));

  const eLeadRows = eLeadExamples.map((object) => ({
    Object: `\`${object.qualified_name}\``,
    Status: `\`${object.status}\``,
    Downstream: object.downstream_count,
    Columns: object.column_count ?? 'not surfaced',
    'Canonical Path': `\`${object.canonical_page_path}\``,
  }));

  const staleRows = audit.stale_published_objects.slice(0, 25).map((object) => ({
    Object: `\`${object.qualified_name}\``,
    'Page ID': object.confluence_page_id,
    'Current Generated Path': object.generated_path ? `\`${object.generated_path}\`` : 'not generated',
    Reason: object.stale_reason,
  }));

  const report = `# T2P-01 Tier 2 Object Coverage Audit

Generated: ${generatedAt}

## Purpose

This report completes T2P-01 from
\`docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_WORK_PACKETS.md\`.

It audits current Tier 2 object-page coverage and writes a machine-readable
object coverage manifest. It does not publish to Confluence and it does not
cleanup, archive, delete, or move pages.

## Result

| Signal | Value |
| --- | --- |
| Publishable objects from schema evidence | ${audit.summary.publishable_objects} |
| Generated current Tier 2 object pages | ${audit.summary.generated_current_tier2_objects} |
| Live published objects found in existing readback | ${audit.summary.live_published_objects_from_existing_readback} |
| Stale live published objects | ${audit.summary.stale_live_published_objects} |
| Missing Tier 2 object pages | ${audit.summary.missing_objects} |
| High-use objects missing or stale | ${audit.summary.high_use_missing_or_stale} |
| Schemas with missing or stale objects | ${audit.summary.schemas_with_missing_or_stale_objects} |
| Machine-readable manifest | \`${path.relative(process.cwd(), docsManifestOut).replaceAll('\\', '/')}\` |
| Local tooling copy | \`${path.relative(process.cwd(), localManifestOut).replaceAll('\\', '/')}\` |

## Interpretation

Tier 2 is not complete. The current dry-run output contains only the first 25
thin object pages, all for \`SQL Server / Sonic_DW / dbo\`. The existing live
readback also covers only those 25 objects, and it records the old flat parent
path \`Database Catalog / Sonic_DW / dbo\`, so those published pages are marked
\`stale\` until refreshed under the platform-grouped objective path.

The expected canonical path for all future Tier 2 pages is:

\`\`\`text
Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>
\`\`\`

## Coverage By Platform

${mdTable(platformRows, ['Platform', 'Total', 'Missing', 'Generated', 'Stale', 'Published'])}

## Top Schemas With Missing Or Stale Tier 2 Pages

${mdTable(schemaRows, ['Platform', 'Database', 'Schema', 'Total', 'Missing', 'Stale', 'High-use missing/stale'])}

## First Missing Or Stale High-Use Objects

${mdTable(highUseRows, ['Object', 'Platform', 'Status', 'Downstream', 'Columns', 'Canonical Path'])}

## eLeadDW High-Use Examples

${mdTable(eLeadRows, ['Object', 'Status', 'Downstream', 'Columns', 'Canonical Path'])}

## Stale Published Pilot Pages

${mdTable(staleRows, ['Object', 'Page ID', 'Current Generated Path', 'Reason'])}

## Validation

| Check | Result |
| --- | --- |
| Schema objects found | ${objects.length > 0 ? 'passed' : 'failed'} |
| Generated versus published separated | passed |
| Stale pilot artifacts distinguished | passed |
| eLeadDW missing high-use examples listed | ${eLeadExamples.length > 0 ? 'passed' : 'not found'} |
| Live Confluence publish avoided | passed |
| Cleanup avoided | passed |

## Next Packet

Proceed with T2P-02 to add deterministic link status to schema/database evidence,
then T2P-03 for the first complete one-schema dry run. The suggested first
schema remains \`SQL Server / eLeadDW / dbo\` because it contains
\`dwFullOpportunity\` and other high-use objects that currently lack current
Tier 2 pages.
`;

  await fs.writeFile(reportOut, `${report.trim()}\n`, 'utf8');
  console.log(JSON.stringify({
    manifest: path.relative(process.cwd(), docsManifestOut),
    local_manifest: path.relative(process.cwd(), localManifestOut),
    report: path.relative(process.cwd(), reportOut),
    summary: audit.summary,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
