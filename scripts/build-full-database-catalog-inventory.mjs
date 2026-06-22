import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const runtimePackageRoot = path.resolve('data/lineage-runtime-package/sonic-data-lineage-runtime');
const outputRoot = path.resolve('data/confluence/full-database-catalog-deployment');
const canonicalRegistryPath = path.join(runtimePackageRoot, 'registry', 'canonical-objects.jsonl');
const runtimeManifestPath = path.join(runtimePackageRoot, 'manifest.json');
const catalogManifestPath = path.join(runtimePackageRoot, 'catalog-manifest.json');
const supersededReportPath = path.resolve('data/confluence/human-catalog-dry-run/superseded-pages-report.json');

const blockedSchemaRules = [
  {
    database: 'Sonic_DW',
    schemaPrefix: 'SONIC\\bheemappa',
    reason: 'User/account schema; not useful as a human browse page.',
  },
  {
    database: 'Sonic_DW',
    schemaPrefix: 'SONIC\\Murali',
    reason: 'User/account schema; not useful as a human browse page.',
  },
  {
    database: 'Sonic_DW',
    schemaPrefix: 'SONIC\\rajakumar',
    reason: 'User/account schema; not useful as a human browse page.',
  },
  {
    database: 'StagingDB',
    schemaPrefix: 'SONIC\\bheemappa',
    reason: 'User/account schema; not useful as a human browse page.',
  },
];

const excludedArtifactRules = [
  {
    database: 'ssisdb',
    objectTypes: ['dataset', 'package'],
    reason: 'SSIS package/catalog artifact; documented in SSIS support documentation, not as a Database Catalog object.',
  },
];

function nowIso() {
  return new Date().toISOString();
}

function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function hashJson(value) {
  return hashText(JSON.stringify(value));
}

async function readJson(file, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if (fallback !== null && error.code === 'ENOENT') return fallback;
    throw error;
  }
}

async function readCanonicalRows() {
  const text = await fs.readFile(canonicalRegistryPath, 'utf8');
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((row) => row.database && (row.object_name || row.display_name));
}

function increment(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function chooseVariant(variants) {
  return [...variants.entries()].sort(
    ([leftName, leftCount], [rightName, rightCount]) =>
      rightCount - leftCount || leftName.localeCompare(rightName)
  )[0][0];
}

function buildCanonicalDatabaseMap(rows) {
  const variantsByKey = new Map();
  for (const row of rows) {
    const database = String(row.database || '').trim();
    if (!database) continue;
    const key = database.toLowerCase();
    if (!variantsByKey.has(key)) variantsByKey.set(key, new Map());
    increment(variantsByKey.get(key), database);
  }
  return new Map([...variantsByKey.entries()].map(([key, variants]) => [key, chooseVariant(variants)]));
}

function buildCanonicalSchemaMap(rows, databaseMap) {
  const variantsByKey = new Map();
  for (const row of rows) {
    if (isExcludedArtifact(row)) continue;
    const rawDatabase = String(row.database || '').trim();
    const schema = String(row.schema || '').trim();
    if (!schema) continue;
    if (!rawDatabase) continue;
    const database = databaseMap.get(rawDatabase.toLowerCase()) || rawDatabase;
    const key = `${database.toLowerCase()}.${schema.toLowerCase()}`;
    if (!variantsByKey.has(key)) variantsByKey.set(key, new Map());
    increment(variantsByKey.get(key), schema);
  }
  return new Map([...variantsByKey.entries()].map(([key, variants]) => [key, chooseVariant(variants)]));
}

function isBlockedSchema(database, schema) {
  const databaseName = String(database || '').toLowerCase();
  const schemaName = String(schema || '').toLowerCase();
  return blockedSchemaRules.find(
    (rule) =>
      String(rule.database).toLowerCase() === databaseName &&
      schemaName.startsWith(String(rule.schemaPrefix).toLowerCase())
  );
}

function objectType(row) {
  return String(row.object_type || 'object').toLowerCase();
}

function isExcludedArtifact(row) {
  const database = String(row.database || '').trim().toLowerCase();
  const type = objectType(row);
  return excludedArtifactRules.find(
    (rule) =>
      database === String(rule.database).toLowerCase() &&
      rule.objectTypes.map((value) => value.toLowerCase()).includes(type)
  );
}

function blankCounts() {
  return {
    total: 0,
    table: 0,
    view: 0,
    procedure: 0,
    function: 0,
    synonym: 0,
    package: 0,
    dataset: 0,
    other: 0,
  };
}

function addType(counts, type) {
  counts.total += 1;
  if (Object.prototype.hasOwnProperty.call(counts, type)) {
    counts[type] += 1;
  } else {
    counts.other += 1;
  }
}

function summarizeTypeCounts(counts) {
  return Object.entries(counts)
    .filter(([key, value]) => key !== 'total' && value > 0)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([key, value]) => `${key} (${value})`)
    .join(', ');
}

function objectCanonicalPath(database, schema, objectName) {
  return ['Sonic Data Lineage', 'Database Catalog', database, schema, objectName].join(' / ');
}

function schemaCanonicalPath(database, schema) {
  return ['Sonic Data Lineage', 'Database Catalog', database, schema].join(' / ');
}

function databaseCanonicalPath(database) {
  return ['Sonic Data Lineage', 'Database Catalog', database].join(' / ');
}

function buildInventory(rows, runtimeManifest, catalogManifest, supersededReport) {
  const databaseMap = buildCanonicalDatabaseMap(rows);
  const schemaMap = buildCanonicalSchemaMap(rows, databaseMap);
  const rawDatabaseCounts = new Map();
  const databases = new Map();
  const excludedDatabases = new Map();
  const blockedSchemas = new Map();
  const blockedObjects = [];
  const excludedArtifacts = [];
  const excludedArtifactGroups = new Map();

  for (const row of rows) {
    const rawDatabase = String(row.database || '').trim();
    const rawSchema = String(row.schema || '').trim();
    const rawObject = String(row.object_name || row.display_name || '').trim();
    const database = databaseMap.get(rawDatabase.toLowerCase()) || rawDatabase;
    const type = objectType(row);

    increment(rawDatabaseCounts, rawDatabase);

    const excludedArtifactRule = isExcludedArtifact(row);
    if (excludedArtifactRule) {
      const key = `${database}.${type}.${excludedArtifactRule.reason}`;
      if (!excludedArtifactGroups.has(key)) {
        excludedArtifactGroups.set(key, {
          database,
          type,
          reason: excludedArtifactRule.reason,
          object_count: 0,
          sample_objects: [],
        });
      }
      const group = excludedArtifactGroups.get(key);
      group.object_count += 1;
      if (group.sample_objects.length < 5) group.sample_objects.push(rawObject);
      if (excludedArtifacts.length < 50) {
        excludedArtifacts.push({
          database,
          schema: rawSchema || 'not surfaced',
          object: rawObject,
          type,
          reason: excludedArtifactRule.reason,
        });
      }
      continue;
    }

    const schemaKey = `${database.toLowerCase()}.${rawSchema.toLowerCase()}`;
    const schema = schemaMap.get(schemaKey) || rawSchema;

    const blockedRule = isBlockedSchema(database, schema);
    if (blockedRule) {
      const key = `${database}.${schema}`;
      if (!blockedSchemas.has(key)) {
        blockedSchemas.set(key, {
          database,
          schema,
          rule: `${blockedRule.database}.${blockedRule.schemaPrefix}`,
          reason: blockedRule.reason,
          object_count: 0,
          canonical_path: schemaCanonicalPath(database, schema),
        });
      }
      blockedSchemas.get(key).object_count += 1;
      blockedObjects.push({
        database,
        schema,
        object: rawObject,
        type,
        reason: blockedRule.reason,
      });
      continue;
    }

    if (!databases.has(database)) {
      databases.set(database, {
        database,
        status: 'included',
        reason: 'Included from canonical runtime registry after blocked-schema rules.',
        canonical_path: databaseCanonicalPath(database),
        raw_database_variants: [],
        object_counts: blankCounts(),
        schema_count: 0,
        schemas: new Map(),
        source_systems: new Set(),
        sample_objects: [],
      });
    }

    const databaseRecord = databases.get(database);
    databaseRecord.source_systems.add(row.server || row.source_system || 'not surfaced');
    addType(databaseRecord.object_counts, type);
    if (!databaseRecord.schemas.has(schema)) {
      databaseRecord.schemas.set(schema, {
        database,
        schema,
        status: 'included',
        canonical_path: schemaCanonicalPath(database, schema),
        object_counts: blankCounts(),
        source_systems: new Set(),
        sample_objects: [],
      });
    }

    const schemaRecord = databaseRecord.schemas.get(schema);
    schemaRecord.source_systems.add(row.server || row.source_system || 'not surfaced');
    addType(schemaRecord.object_counts, type);
    if (schemaRecord.sample_objects.length < 5) {
      schemaRecord.sample_objects.push({
        object: rawObject,
        type,
        canonical_path: objectCanonicalPath(database, schema, rawObject),
      });
    }
    if (databaseRecord.sample_objects.length < 5) {
      databaseRecord.sample_objects.push({
        schema,
        object: rawObject,
        type,
        canonical_path: objectCanonicalPath(database, schema, rawObject),
      });
    }
  }

  for (const [rawDatabase, count] of rawDatabaseCounts.entries()) {
    const canonicalDatabase = databaseMap.get(rawDatabase.toLowerCase()) || rawDatabase;
    const record = databases.get(canonicalDatabase) || excludedDatabases.get(canonicalDatabase);
    if (record) {
      record.raw_database_variants.push({ name: rawDatabase, object_count: count });
    }
  }

  for (const [rawKey, canonicalDatabase] of databaseMap.entries()) {
    if (!databases.has(canonicalDatabase)) {
      const artifactGroups = [...excludedArtifactGroups.values()].filter(
        (group) => group.database.toLowerCase() === canonicalDatabase.toLowerCase()
      );
      const artifactReason =
        artifactGroups.length > 0
          ? 'All cataloged objects for this database are SSIS package/catalog artifacts documented in SSIS support documentation.'
          : 'All cataloged objects for this database are suppressed by human catalog blocked-schema rules.';
      excludedDatabases.set(canonicalDatabase, {
        database: canonicalDatabase,
        status: 'excluded',
        reason: artifactReason,
        canonical_path: databaseCanonicalPath(canonicalDatabase),
        raw_database_variants: [...rawDatabaseCounts.entries()]
          .filter(([name]) => name.toLowerCase() === rawKey)
          .map(([name, count]) => ({ name, object_count: count })),
        object_counts: blankCounts(),
        schema_count: 0,
        schemas: [],
      });
    }
  }

  const includedDatabases = [...databases.values()]
    .map((database) => {
      const schemas = [...database.schemas.values()]
        .map((schema) => ({
          ...schema,
          source_systems: [...schema.source_systems].sort(),
          object_type_summary: summarizeTypeCounts(schema.object_counts),
        }))
        .sort((left, right) => left.schema.localeCompare(right.schema));
      return {
        ...database,
        source_systems: [...database.source_systems].sort(),
        schema_count: schemas.length,
        schemas,
        object_type_summary: summarizeTypeCounts(database.object_counts),
      };
    })
    .sort((left, right) => left.database.localeCompare(right.database));

  const excluded = [...excludedDatabases.values()].sort((left, right) => left.database.localeCompare(right.database));
  const blocked = [...blockedSchemas.values()].sort(
    (left, right) => left.database.localeCompare(right.database) || left.schema.localeCompare(right.schema)
  );
  const includedObjectCount = includedDatabases.reduce((sum, database) => sum + database.object_counts.total, 0);
  const includedSchemaCount = includedDatabases.reduce((sum, database) => sum + database.schema_count, 0);
  const blockedObjectCount = blocked.reduce((sum, schema) => sum + schema.object_count, 0);
  const excludedArtifactCount = [...excludedArtifactGroups.values()].reduce((sum, group) => sum + group.object_count, 0);
  const sourceCanonicalObjectCount = runtimeManifest?.counts?.canonical_object_count ?? rows.length;
  const failures = [];
  const warnings = [];

  if (includedObjectCount + blockedObjectCount + excludedArtifactCount !== rows.length) {
    failures.push('Included plus blocked plus excluded artifact counts do not reconcile to canonical registry rows.');
  }
  if (rows.length !== sourceCanonicalObjectCount) {
    warnings.push(
      `Canonical registry row count (${rows.length}) differs from runtime manifest canonical_object_count (${sourceCanonicalObjectCount}).`
    );
  }
  if (includedDatabases.length + excluded.length !== databaseMap.size) {
    failures.push('Included plus excluded database counts do not reconcile to canonical database variants.');
  }

  const sourceHash = runtimeManifest?.content_hashes?.['registry/canonical-objects.jsonl'] || hashJson(rows);
  const generatedAt = nowIso();
  const cleanupCandidateCount = supersededReport?.summary?.total_candidates || supersededReport?.candidates?.length || 0;
  const inventory = {
    schema_version: 1,
    generated_at: generatedAt,
    packet: 'FDP-01',
    report_type: 'full-database-catalog-deployment-inventory',
    source: {
      runtime_package_root: path.relative(process.cwd(), runtimePackageRoot).replace(/\\/g, '/'),
      runtime_manifest: path.relative(process.cwd(), runtimeManifestPath).replace(/\\/g, '/'),
      catalog_manifest: path.relative(process.cwd(), catalogManifestPath).replace(/\\/g, '/'),
      canonical_registry: path.relative(process.cwd(), canonicalRegistryPath).replace(/\\/g, '/'),
      runtime_package_version: runtimeManifest?.version || 'not surfaced',
      runtime_generated_at: runtimeManifest?.generated_at || 'not surfaced',
      source_catalog_generated_at:
        runtimeManifest?.source?.catalog_generated_at || catalogManifest?.generated_at || 'not surfaced',
      source_catalog_version: runtimeManifest?.runtime_content_hash || sourceHash,
      canonical_registry_hash: sourceHash,
    },
    scope: {
      catalog_scope: 'all included cataloged databases',
      deployment_tier: 'Tier 1 inventory and manifest foundation',
      publish_mode: 'dry-run',
      cleanup_mode: 'report-only',
      rovo_mode: 'none',
      blocked_schema_rules_source: 'docs/CONFLUENCE_FULL_REBUILD_SCOPE.md',
    },
    summary: {
      raw_database_entry_count: rawDatabaseCounts.size,
      canonical_database_count: databaseMap.size,
      included_database_count: includedDatabases.length,
      excluded_database_count: excluded.length,
      included_schema_count: includedSchemaCount,
      blocked_schema_count: blocked.length,
      excluded_artifact_count: excludedArtifactCount,
      included_object_count: includedObjectCount,
      blocked_object_count: blockedObjectCount,
      source_canonical_object_count: sourceCanonicalObjectCount,
      cleanup_candidate_count: cleanupCandidateCount,
    },
    blocked_schema_rules: blockedSchemaRules,
    excluded_artifact_rules: excludedArtifactRules,
    excluded_artifacts: [...excludedArtifactGroups.values()].sort(
      (left, right) => left.database.localeCompare(right.database) || left.type.localeCompare(right.type)
    ),
    blocked_schemas: blocked,
    blocked_object_samples: blockedObjects.slice(0, 50),
    excluded_artifact_samples: excludedArtifacts,
    databases: includedDatabases,
    excluded_databases: excluded,
    validation: {
      status: failures.length === 0 ? 'passed' : 'failed',
      failures,
      warnings,
    },
  };

  const manifest = {
    run_id: `fdp-01-${generatedAt.replace(/[^0-9]/g, '').slice(0, 14)}`,
    generated_at: generatedAt,
    source_catalog_version: inventory.source.source_catalog_version,
    source_catalog_generated_at: inventory.source.source_catalog_generated_at,
    scope: inventory.scope.catalog_scope,
    deployment_tier: inventory.scope.deployment_tier,
    database_count: includedDatabases.length,
    schema_count: includedSchemaCount,
    object_count: includedObjectCount,
    blocked_schema_count: blocked.length,
    excluded_artifact_count: excludedArtifactCount,
    raw_database_entry_count: rawDatabaseCounts.size,
    canonical_database_count: databaseMap.size,
    excluded_database_count: excluded.length,
    page_counts: {
      create: 0,
      update: 0,
      unchanged: 0,
      cleanup_candidates: cleanupCandidateCount,
    },
    source_artifacts: inventory.source,
    output_artifacts: {
      inventory_json: 'data/confluence/full-database-catalog-deployment/inventory.json',
      inventory_markdown: 'data/confluence/full-database-catalog-deployment/inventory.md',
      manifest_json: 'data/confluence/full-database-catalog-deployment/manifest.json',
    },
    validation: inventory.validation,
  };

  return { inventory, manifest };
}

function mdTable(rows, headers) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${headers.map((header) => row[header] ?? '').join(' | ')} |`);
  return [head, sep, ...body].join('\n');
}

function renderMarkdown(inventory, manifest) {
  const dbRows = inventory.databases.map((database) => ({
    Database: `\`${database.database}\``,
    Schemas: database.schema_count,
    Objects: database.object_counts.total,
    Types: database.object_type_summary || 'not surfaced',
    Variants: database.raw_database_variants.map((variant) => `\`${variant.name}\` (${variant.object_count})`).join('<br>'),
  }));
  const blockedRows = inventory.blocked_schemas.map((schema) => ({
    Database: `\`${schema.database}\``,
    Schema: `\`${schema.schema}\``,
    Objects: schema.object_count,
    Rule: `\`${schema.rule}\``,
    Reason: schema.reason,
  }));
  const excludedRows = inventory.excluded_databases.map((database) => ({
    Database: `\`${database.database}\``,
    Reason: database.reason,
  }));
  const excludedArtifactRows = inventory.excluded_artifacts.map((artifact) => ({
    Database: `\`${artifact.database}\``,
    Type: artifact.type,
    Objects: artifact.object_count,
    Samples: artifact.sample_objects.map((object) => `\`${object}\``).join('<br>'),
    Reason: artifact.reason,
  }));

  return `# FDP-01 Full Database Catalog Inventory And Manifest

Generated: \`${inventory.generated_at}\`

## Summary

This is a dry-run-only inventory for the full Database Catalog deployment. It
accounts for every cataloged database in the runtime package and applies the
human catalog blocked-schema rules before later packets generate or publish
pages.

| Signal | Value |
| --- | --- |
| Packet | \`${inventory.packet}\` |
| Publish mode | \`${inventory.scope.publish_mode}\` |
| Cleanup mode | \`${inventory.scope.cleanup_mode}\` |
| Runtime package version | \`${inventory.source.runtime_package_version}\` |
| Runtime generated at | \`${inventory.source.runtime_generated_at}\` |
| Source catalog generated at | \`${inventory.source.source_catalog_generated_at}\` |
| Raw database entries | ${inventory.summary.raw_database_entry_count} |
| Canonical database names | ${inventory.summary.canonical_database_count} |
| Included databases | ${inventory.summary.included_database_count} |
| Excluded databases | ${inventory.summary.excluded_database_count} |
| Included schemas | ${inventory.summary.included_schema_count} |
| Blocked schemas | ${inventory.summary.blocked_schema_count} |
| Excluded SSIS package/catalog artifacts | ${inventory.summary.excluded_artifact_count} |
| Included objects | ${inventory.summary.included_object_count} |
| Blocked objects | ${inventory.summary.blocked_object_count} |
| Source canonical objects | ${inventory.summary.source_canonical_object_count} |
| Cleanup candidates currently reported | ${inventory.summary.cleanup_candidate_count} |
| Validation status | \`${inventory.validation.status}\` |

## Included Databases

${mdTable(dbRows, ['Database', 'Schemas', 'Objects', 'Types', 'Variants'])}

## Blocked Schemas

${blockedRows.length ? mdTable(blockedRows, ['Database', 'Schema', 'Objects', 'Rule', 'Reason']) : 'No blocked schemas were found in this inventory.'}

## Excluded SSIS Artifacts

${excludedArtifactRows.length ? mdTable(excludedArtifactRows, ['Database', 'Type', 'Objects', 'Samples', 'Reason']) : 'No SSIS package/catalog artifacts were excluded.'}

## Excluded Databases

${excludedRows.length ? mdTable(excludedRows, ['Database', 'Reason']) : 'No databases were fully excluded. Every canonical database has at least one publishable schema.'}

## Validation

Failures:

${inventory.validation.failures.length ? inventory.validation.failures.map((failure) => `- ${failure}`).join('\n') : '- none'}

Warnings:

${inventory.validation.warnings.length ? inventory.validation.warnings.map((warning) => `- ${warning}`).join('\n') : '- none'}

## Manifest

\`\`\`json
${JSON.stringify(manifest, null, 2)}
\`\`\`

## Source Artifacts

- Runtime manifest: \`${inventory.source.runtime_manifest}\`
- Catalog manifest: \`${inventory.source.catalog_manifest}\`
- Canonical registry: \`${inventory.source.canonical_registry}\`
- Blocked schema rules: \`docs/CONFLUENCE_FULL_REBUILD_SCOPE.md\`

## Next Packet

Use this inventory as input for \`FDP-02: Tier 1 Full Dry Run And Validation\`.
`;
}

async function writeText(file, text) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, text.endsWith('\n') ? text : `${text}\n`, 'utf8');
}

async function main() {
  const [rows, runtimeManifest, catalogManifest, supersededReport] = await Promise.all([
    readCanonicalRows(),
    readJson(runtimeManifestPath),
    readJson(catalogManifestPath),
    readJson(supersededReportPath, {}),
  ]);
  const { inventory, manifest } = buildInventory(rows, runtimeManifest, catalogManifest, supersededReport);
  const markdown = renderMarkdown(inventory, manifest);

  await writeText(path.join(outputRoot, 'inventory.json'), JSON.stringify(inventory, null, 2));
  await writeText(path.join(outputRoot, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await writeText(path.join(outputRoot, 'inventory.md'), markdown);

  console.log(
    JSON.stringify(
      {
        status: inventory.validation.status,
        packet: inventory.packet,
        included_databases: inventory.summary.included_database_count,
        included_schemas: inventory.summary.included_schema_count,
        included_objects: inventory.summary.included_object_count,
        blocked_schemas: inventory.summary.blocked_schema_count,
        blocked_objects: inventory.summary.blocked_object_count,
        excluded_artifacts: inventory.summary.excluded_artifact_count,
        cleanup_candidates: inventory.summary.cleanup_candidate_count,
        manifest: path.relative(process.cwd(), path.join(outputRoot, 'manifest.json')).replace(/\\/g, '/'),
        inventory: path.relative(process.cwd(), path.join(outputRoot, 'inventory.json')).replace(/\\/g, '/'),
        markdown: path.relative(process.cwd(), path.join(outputRoot, 'inventory.md')).replace(/\\/g, '/'),
      },
      null,
      2
    )
  );

  if (inventory.validation.failures.length > 0) process.exitCode = 1;
}

await main();
