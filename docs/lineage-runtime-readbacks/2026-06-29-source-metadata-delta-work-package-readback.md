# Source Metadata Delta Work Package Readback

Generated: 2026-06-29

## Completed

### WP-SMD-01: Contract And File Placement

Implemented the source-agnostic metadata delta engine location:

`engines/connectors/metadata-delta/`

Added:

- `engines/connectors/metadata-delta/README.md`
- `scripts/plan-source-metadata-delta.mjs`
- `scripts/check-source-metadata-delta-manifest.mjs`
- npm commands `metadata:delta:plan` and `metadata:delta:check`

### WP-SMD-02: Baseline Reader And Signature Fixtures

Implemented reusable JavaScript logic to:

- read DevOps `registry/object-registry.jsonl`;
- read object context-pack metadata signatures;
- normalize current metadata objects;
- compute deterministic signatures;
- ignore volatile run metadata such as generated timestamps and profile run ids;
- detect first-run, unchanged, changed, retained-stale, and removed-stale cases.

Added focused tests:

`tests/unit/metadata-delta-engine.test.js`

### WP-SMD-03: Delta Manifest Planner

Implemented plan-only manifest and markdown readback generation.

The manifest includes:

- connector id;
- source family;
- source scope;
- baseline registry path;
- mode;
- full-refresh reason when required;
- counts for new, changed, unchanged, retained stale, and removed stale;
- object-level prior and next signatures;
- affected downstream target hints.

## Partially Completed

### WP-SMD-06: Guardrails, Packets, And Readiness

Added the low-cost manifest validator:

```powershell
npm run metadata:delta:check -- --manifest <manifest.json>
```

Updated the Rovo and support documentation packets to require delta validation
before downstream publication work.

## Ready Next

### WP-SMD-04: Source-Family Integration

The shared engine is ready for integration, but the existing SQL Server, SSIS,
and Snowflake ingest scripts still use local comparison logic. Refactor them in
a focused pass so existing command names remain stable while they consume the
shared delta manifest.

Do not combine this refactor with live ingestion or publication.

## Second Batch Completion

### WP-SMD-04: Source-Family Integration

Completed after ADF work was reported done.

Implemented:

- SQL Server incremental ingest now builds and consumes the shared source
  metadata delta manifest.
- SSIS incremental ingest now builds and consumes the shared source metadata
  delta manifest.
- Snowflake lineage slice ingest now builds and consumes the shared source
  metadata delta manifest.
- Snowflake now supports `--plan-only` / `--dry-run` to produce a metadata delta
  without writing catalog artifacts.
- Generic connector metadata-profile runs now produce local delta manifests
  under the profile runtime directory. This covers ADF metadata-profile runs
  through the shared connector runtime without starting ADF pipelines or
  changing ADF behavior.

Preserved:

- existing npm command names;
- existing SQL Server, SSIS, and Snowflake registry/artifact write behavior for
  normal incremental runs;
- existing no-live-source mock paths for SQL Server and SSIS;
- no live ingestion or publication was started.

Ready next:

- `WP-SMD-05`: make runtime package, Rovo, Confluence, and support-doc
  generators consume the delta manifest so downstream output is changed-only.

## Validation Run

Passed:

```powershell
node --check engines/connectors/metadata-delta/index.js
node --check scripts/plan-source-metadata-delta.mjs
node --check scripts/check-source-metadata-delta-manifest.mjs
node --experimental-vm-modules node_modules/jest/bin/jest.js tests/unit/metadata-delta-engine.test.js --runInBand --coverage=false
node scripts/check-source-metadata-delta-manifest.mjs --manifest <temp-smoke-manifest>
git diff --check
```

Second batch passed:

```powershell
node --check scripts/ingest-sqlserver-lineage-incremental.mjs
node --check scripts/ingest-ssis-lineage-incremental.mjs
node --check scripts/ingest-snowflake-lineage-slice.mjs
node --check src/services/connectorService.js
node scripts/ingest-sqlserver-lineage-incremental.mjs --mock-metadata tests\fixtures\sqlserver-incremental-metadata.json --catalog-repo <temp>\catalog --markdown-root <temp>\raw --plan-only --no-readback
node scripts/ingest-ssis-lineage-incremental.mjs --mock-metadata tests\fixtures\ssis-incremental-metadata.json --catalog-repo <temp>\catalog --markdown-root <temp>\raw --plan-only --no-readback
git diff --check
```

Skipped intentionally:

- full `npm test`, because the default coverage gate fails when running one
  targeted test file by itself;
- runtime package checks, because this pass did not rebuild runtime package
  artifacts;
- live source ingestion, DevOps sync, Rovo generation, or Confluence publish.

## Third Batch Progress

### WP-SMD-05: Downstream Delta Consumers

Partially completed.

Implemented:

- Added reusable downstream delta helpers:
  - `loadDeltaManifest`
  - `changedDeltaObjectIds`
  - `createDeltaScope`
- Rovo AI retrieval dry-run generation now accepts `--delta-manifest`.
- Rovo dry-run object locator, object summary, database context, and lineage
  context output are scoped to changed runtime objects when a delta manifest is
  supplied.
- Human Confluence catalog dry-run generation now accepts `--delta-manifest`.
- Human catalog dry-run default mode now skips the broad product catalog sweep
  when delta-scoped and renders only changed database/schema/object slices plus
  directly derived object pages.

Preserved:

- Existing full Rovo dry-run behavior when no delta manifest is supplied.
- Existing full human catalog dry-run behavior when no delta manifest is
  supplied.
- No live source ingestion.
- No DevOps sync.
- No Rovo or Confluence live publication.

Remaining:

- Runtime package object-content scoping still needs a focused pass. Runtime
  indexes may still need full rebuilds for consistency, but changed object
  content should be traceable to the delta manifest.
- Support-documentation generators still need `--delta-manifest` support.
- Live publish packet enforcement still needs to block broad publication when a
  reviewed delta manifest is missing.
- Target artifact path readback per changed object still needs to be added.

Third batch passed:

```powershell
node --check scripts\build-rovo-ai-retrieval-dry-run.mjs
node --check scripts\build-human-confluence-catalog-dry-run.mjs
npm test -- tests/unit/metadata-delta-engine.test.js --runInBand --coverage=false
```

## Final Bundle Completion

### WP-SMD-05: Downstream Delta Consumers

Completed.

Added:

- Runtime package generation accepts `--delta-manifest`.
- Runtime package `manifest.json` records `delta_scope` and
  `delta_target_artifacts`.
- Rovo AI retrieval dry-run records changed-object target artifacts.
- Human Confluence catalog dry-run records changed-object target artifacts.
- Single-factory and multi-factory ADF support-documentation generators accept
  `--delta-manifest`.
- ADF support-documentation generators produce zero support pages for
  unchanged-only manifests.
- ADF support-documentation manifests record delta scope and target artifacts.

### WP-SMD-06: Guardrails, Packets, And Readiness

Completed.

Added:

- Rovo publish packet validation fails when the Rovo dry-run manifest is not
  delta-scoped.
- Human catalog publish packet validation fails when the human catalog dry-run
  manifest is not delta-scoped.
- Single-factory ADF support live publish fails in `--publish` mode when the
  support manifest is not delta-scoped.
- Multi-factory ADF support live publish fails in `--publish` mode when the
  support manifest is not delta-scoped.
- Unit test coverage proves unchanged-only manifests produce an empty downstream
  scope.

Important caveat:

- Runtime package indexes may still rebuild for consistency. This is allowed by
  ADR-028. Changed object content and changed-object runtime target artifacts
  are now traceable to the source metadata delta manifest.

No live source ingestion, DevOps sync, Rovo publish, Confluence publish, ADF
pipeline execution, or broad AI summarization was run in this bundle.

## AI Delta Hardening Pass

Purpose:

Eliminate broad AI/Rovo/Codex corpus generation for unchanged source metadata.

Plugged holes:

- Added shared AI guard helpers:
  - `requireDeltaScopeForAi`
  - `loadDeltaManifestSync`
  - `requireDeltaScopeForAiSync`
- General Rovo AI retrieval dry-run now fails without `--delta-manifest`.
- Human/Rovo-facing Confluence catalog dry-run now fails without
  `--delta-manifest`.
- Snowflake Rovo AI retrieval dry-run now fails without `--delta-manifest` and
  filters runtime rows to changed object ids.
- Lineage Brain LLM prompt generation now fails without `--delta-manifest` and
  filters SSIS/table prompt candidates to changed ids, paths, or names.
- Lower-level SSIS/table prompt services now fail closed if called directly
  without a delta manifest.
- Prompt queue split/process utilities now require `--delta-manifest` and only
  split/stage prompt sections containing changed object ids.
- Legacy Confluence export now requires a delta manifest and filters
  Rovo/Codex-readable export objects to changed object ids.
- Confluence sync now blocks any export manifest that is not delta-scoped.
- Generic human catalog publisher now blocks dry-run manifests and publish
  packets that are not delta-scoped.
- Tier 1, Tier 2, Tier 3, eLeadDW, and pilot-refresh packet builders now carry
  `delta_scope` forward from the source dry-run.
- Tier wrapper scripts now forward `--delta-manifest` into their human catalog
  dry-run step.
- SSIS and SSRS support live publish scripts are blocked until they are rebuilt
  as true delta-scoped publishers.

Operational result:

- Old default commands that try to build AI/Rovo/Confluence corpus output
  without a delta now fail closed.
- Changed-only commands must pass `--delta-manifest <manifest.json>`.
- Unchanged-only manifests produce empty downstream scopes rather than broad AI
  prompt or corpus generation.

Additional validation passed:

```powershell
node --check engines\connectors\metadata-delta\index.js
node --check scripts\build-rovo-ai-retrieval-dry-run.mjs
node --check scripts\build-human-confluence-catalog-dry-run.mjs
node --check scripts\build-snowflake-rovo-retrieval-dry-run.mjs
node --check src\services\lineageBrain\runner.js
node --check src\services\lineageBrain\runLineageBrain.js
node --check src\services\lineageBrain\tablePromptService.js
node --check src\services\lineageBrain\ssisPromptService.js
node --check src\services\confluenceExportService.js
node --check src\services\confluenceSyncService.js
node --check scripts\build-confluence-export.mjs
node --check scripts\publish-human-confluence-catalog-pilot.mjs
node --check scripts\publish-ssrs-support-docs.mjs
node --check scripts\publish-ssis-package-docs.mjs
node --check scripts\run-tier2-strategy-batch-dry-run.mjs
node --check scripts\run-tier2-pilot-refresh-dry-run.mjs
node --check scripts\build-full-database-catalog-tier1-publish-packet.mjs
node --check scripts\build-full-database-catalog-tier2-object-batch-packet.mjs
node --check scripts\build-full-database-catalog-tier3-rich-object-batch-packet.mjs
node --check scripts\build-eleaddw-dbo-tier2-publish-packet.mjs
$env:PYTHONPYCACHEPREFIX=$env:TEMP; python -m py_compile scripts\process_lineage_prompt_queue.py scripts\split_lineage_prompt_queue.py
npm test -- tests/unit/metadata-delta-engine.test.js --runInBand --coverage=false
```
