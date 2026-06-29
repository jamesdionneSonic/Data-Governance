import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  buildDeltaManifest,
  createDeltaScope,
  changedDeltaObjectIds,
  metadataSignature,
  requireDeltaScopeForAi,
  renderDeltaReadback,
  writeDeltaOutputs,
} from '../../engines/connectors/metadata-delta/index.js';

describe('metadata delta engine', () => {
  let tempRoot;
  let catalogRoot;

  beforeEach(async () => {
    tempRoot = await mkdtemp(path.join(tmpdir(), 'dg-metadata-delta-'));
    catalogRoot = path.join(tempRoot, 'catalog');
    await mkdir(path.join(catalogRoot, 'registry'), { recursive: true });
    await mkdir(path.join(catalogRoot, 'context-packs'), { recursive: true });
  });

  afterEach(async () => {
    await rm(tempRoot, { recursive: true, force: true });
  });

  async function writeRegistry(rows) {
    await writeFile(
      path.join(catalogRoot, 'registry', 'object-registry.jsonl'),
      rows.map((row) => JSON.stringify(row)).join('\n'),
      'utf8'
    );
  }

  async function writeContext(file, metadataSignatureValue) {
    await writeFile(
      path.join(catalogRoot, file),
      JSON.stringify({ source: { metadata_signature: metadataSignatureValue } }, null, 2),
      'utf8'
    );
  }

  const baseOptions = {
    connectorId: 'connector-a',
    sourceFamily: 'sql_server',
    sourceScope: 'connector-a',
    generatedAt: '2026-06-29T12:00:00.000Z',
  };

  test('marks first-run objects as new when no baseline exists', async () => {
    await writeRegistry([]);

    const manifest = await buildDeltaManifest({
      ...baseOptions,
      catalogRoot,
      currentObjects: [
        {
          canonical_id: 'object:a',
          display_name: 'A',
          object_type: 'table',
          metadata_signature: 'sig-a',
        },
        {
          canonical_id: 'object:b',
          display_name: 'B',
          object_type: 'view',
          metadata_signature: 'sig-b',
        },
      ],
    });

    expect(manifest.counts).toMatchObject({ new: 2, changed: 0, unchanged: 0 });
    expect(manifest.changed_object_ids).toEqual(['object:a', 'object:b']);
  });

  test('marks repeat metadata as unchanged when signature matches context pack', async () => {
    await writeContext('context-packs/object-a.json', 'sig-a');
    await writeRegistry([
      {
        object_id: 'object:a',
        display_name: 'A',
        object_type: 'table',
        source_system: 'connector-a',
        context_pack_json_path: 'context-packs/object-a.json',
      },
    ]);

    const manifest = await buildDeltaManifest({
      ...baseOptions,
      catalogRoot,
      currentObjects: [{ canonical_id: 'object:a', metadata_signature: 'sig-a' }],
    });

    expect(manifest.counts).toMatchObject({ new: 0, changed: 0, unchanged: 1 });
    expect(manifest.changed_object_ids).toEqual([]);
  });

  test('marks changed objects and retains stale baseline rows by default', async () => {
    await writeContext('context-packs/object-a.json', 'sig-old');
    await writeContext('context-packs/object-b.json', 'sig-b');
    await writeRegistry([
      {
        object_id: 'object:a',
        display_name: 'A',
        object_type: 'table',
        source_system: 'connector-a',
        context_pack_json_path: 'context-packs/object-a.json',
      },
      {
        object_id: 'object:b',
        display_name: 'B',
        object_type: 'table',
        source_system: 'connector-a',
        context_pack_json_path: 'context-packs/object-b.json',
      },
    ]);

    const manifest = await buildDeltaManifest({
      ...baseOptions,
      catalogRoot,
      mode: 'incremental',
      currentObjects: [{ canonical_id: 'object:a', metadata_signature: 'sig-new' }],
    });

    expect(manifest.counts).toMatchObject({ changed: 1, retained_stale: 1, removed_stale: 0 });
    expect(manifest.objects.find((object) => object.canonical_id === 'object:b').status).toBe(
      'retained_stale'
    );
  });

  test('requires a reason for full refresh and then removes stale rows', async () => {
    await writeContext('context-packs/object-b.json', 'sig-b');
    await writeRegistry([
      {
        object_id: 'object:b',
        display_name: 'B',
        object_type: 'table',
        source_system: 'connector-a',
        context_pack_json_path: 'context-packs/object-b.json',
      },
    ]);

    await expect(
      buildDeltaManifest({
        ...baseOptions,
        catalogRoot,
        mode: 'full_refresh',
        currentObjects: [],
      })
    ).rejects.toThrow('fullRefreshReason is required');

    const manifest = await buildDeltaManifest({
      ...baseOptions,
      catalogRoot,
      mode: 'full_refresh',
      fullRefreshReason: 'Signature contract changed for connector-a.',
      currentObjects: [],
    });

    expect(manifest.counts).toMatchObject({ retained_stale: 0, removed_stale: 1 });
    expect(manifest.objects[0].affected_targets).toContain('devops');
  });

  test('stable signature ignores volatile run metadata', () => {
    const left = metadataSignature({
      canonical_id: 'object:a',
      columns: [{ name: 'A', data_type: 'int' }],
      generated_at: '2026-06-29T12:00:00.000Z',
      profile_run_id: 'run-one',
    });
    const right = metadataSignature({
      canonical_id: 'object:a',
      columns: [{ name: 'A', data_type: 'int' }],
      generated_at: '2026-06-30T12:00:00.000Z',
      profile_run_id: 'run-two',
    });

    expect(left).toBe(right);
  });

  test('writes manifest and human readback outputs', async () => {
    await writeRegistry([]);
    const manifest = await buildDeltaManifest({
      ...baseOptions,
      catalogRoot,
      currentObjects: [{ canonical_id: 'object:a', metadata_signature: 'sig-a' }],
    });
    const outputDir = path.join(tempRoot, 'out');
    const outputs = await writeDeltaOutputs({ manifest, outputDir, basename: 'delta' });

    expect(outputs.manifest_path.endsWith('/delta.json')).toBe(true);
    expect(outputs.readback_path.endsWith('/delta.md')).toBe(true);
    expect(renderDeltaReadback(manifest)).toContain('Source Metadata Delta Readback');
  });

  test('creates changed-only downstream scope from manifest', () => {
    const manifest = {
      schema_version: '1.0',
      connector_id: 'connector-a',
      source_family: 'sql_server',
      source_scope: 'connector-a',
      mode: 'incremental',
      counts: { new: 1, changed: 1, unchanged: 1, retained_stale: 0, removed_stale: 0 },
      objects: [
        { canonical_id: 'object:new', status: 'new' },
        { canonical_id: 'object:changed', status: 'changed' },
        { canonical_id: 'object:same', status: 'unchanged' },
      ],
    };

    expect([...changedDeltaObjectIds(manifest)].sort()).toEqual(['object:changed', 'object:new']);
    const scope = createDeltaScope(manifest);
    expect(scope.includesObjectId('object:new')).toBe(true);
    expect(scope.includesObjectId('object:same')).toBe(false);
    expect(scope.includesAny(['object:same', 'object:changed'])).toBe(true);
    expect(scope.filterRows([{ object_id: 'object:new' }, { object_id: 'object:same' }])).toEqual([
      { object_id: 'object:new' },
    ]);
    scope.recordTargetArtifact('object:new', 'rovo', 'data\\confluence\\rovo.md');
    expect(scope.summary().target_artifact_count).toBe(1);
    expect(manifest.target_artifacts).toEqual([
      {
        canonical_id: 'object:new',
        target: 'rovo',
        artifact_path: 'data/confluence/rovo.md',
      },
    ]);
  });

  test('empty downstream scope filters unchanged-only manifests to no target rows', () => {
    const manifest = {
      schema_version: '1.0',
      connector_id: 'connector-a',
      source_family: 'sql_server',
      source_scope: 'connector-a',
      mode: 'incremental',
      counts: { new: 0, changed: 0, unchanged: 1, retained_stale: 0, removed_stale: 0 },
      objects: [{ canonical_id: 'object:same', status: 'unchanged' }],
    };

    const scope = createDeltaScope(manifest);
    expect(scope.summary().changed_object_count).toBe(0);
    expect(scope.includesObjectId('object:same')).toBe(false);
    expect(scope.filterRows([{ object_id: 'object:same' }])).toEqual([]);
  });

  test('AI delta guard fails closed without a manifest path', async () => {
    await expect(requireDeltaScopeForAi('', 'test AI workflow')).rejects.toThrow(
      /requires --delta-manifest/
    );
  });
});
