# Source Metadata Delta-First Work Packages

Generated: 2026-06-29

## Execution Rule

These work packages must run after the ADF multi-factory work packages in
`docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md` are complete or formally paused.

Do not start implementation while the ADF backlog is active unless the user
explicitly reorders the work.

## Required Reading

Before any package starts, read:

1. `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
2. `docs/adr/ADR-020-Source-Agnostic-Incremental-Lineage-Ingestion.md`
3. `docs/SOURCE_METADATA_DELTA_BACKLOG.md`
4. `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`
5. `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`
6. `docs/adr/ADR-011-Unified-Support-Documentation-Refresh-Contract.md`
7. `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
8. `AI_README.md`
9. `AGENTS.md`

## WP-SMD-01: Contract And File Placement

Status: complete

Objective:

Create the implementation contract for a reusable JavaScript delta engine.

Scope:

- documentation and contract only;
- no source metadata ingestion;
- no DevOps, Rovo, Confluence, or AI generation writes.

Tasks:

- Define API inputs and outputs for the delta engine.
- Confirm implementation root: `engines/connectors/metadata-delta/`.
- Confirm wrapper locations for scripts and app services.
- Define delta manifest file naming and readback locations.
- Define source-family extension points.

Validation:

```powershell
git diff --check
```

Stop triggers:

- request to start ingestion;
- request to publish;
- missing agreement on comparison baseline.

Completion notes:

- Implemented placement under `engines/connectors/metadata-delta/`.
- Added command wrappers in `scripts/`.
- Added npm command entries for planning and checking delta manifests.

## WP-SMD-02: Baseline Reader And Signature Fixtures

Status: complete

Objective:

Build and validate the baseline-reader and deterministic-signature logic.

Scope:

- JavaScript engine code;
- local fixtures only;
- no live connector calls;
- no publication.

Tasks:

- Read DevOps `registry/object-registry.jsonl`.
- Read prior context packs when needed.
- Normalize prior records into the comparison shape.
- Compute current metadata signatures from fixtures.
- Add fixtures for first-run, unchanged, changed, retained-stale, and
  full-refresh cases.

Validation:

```powershell
node scripts/plan-source-metadata-delta.mjs --current-metadata <fixture.json> --connector-id <id> --source-family <family> --source-scope <scope>
node scripts/check-source-metadata-delta-manifest.mjs --manifest <manifest.json>
npm test
git diff --check
```

Acceptance criteria:

- first-run fixture reports all objects as new;
- unchanged fixture reports zero changed objects;
- changed fixture reports only modified objects;
- signatures are deterministic.

Completion notes:

- Added reusable baseline reader and deterministic signature logic.
- Added focused Jest fixtures for first-run, unchanged, changed, stale, and
  full-refresh cases.

## WP-SMD-03: Delta Manifest Planner

Status: complete

Objective:

Produce a reviewable delta manifest and markdown readback before any downstream
processing.

Scope:

- plan-only manifest generation;
- fixture and local metadata inputs;
- no live publication.

Tasks:

- Emit JSON delta manifest.
- Emit markdown readback with counts and changed-object table.
- Add mode support for `plan_only`, `incremental`, and `full_refresh`.
- Require a reason for `full_refresh`.
- Include affected target hints for DevOps, runtime, Rovo, Confluence, and
  support docs.

Validation:

```powershell
node scripts/plan-source-metadata-delta.mjs --current-metadata <fixture.json> --connector-id <id> --source-family <family> --source-scope <scope>
node scripts/check-source-metadata-delta-manifest.mjs --manifest <manifest.json>
npm test
git diff --check
```

Acceptance criteria:

- plan-only performs no target writes;
- counts reconcile to object list statuses;
- full-refresh reason is recorded;
- manifest can be consumed by downstream packages.

Completion notes:

- Added plan-only CLI output for JSON manifest and markdown readback.
- Added manifest checker CLI.
- CLI smoke test passed against a temp fixture.

## WP-SMD-04: Source-Family Integration

Status: complete

Objective:

Integrate the shared delta planner into existing and future source-family
metadata capture workflows.

Scope:

- preserve current npm command names;
- SQL Server, SSIS, Snowflake integration first;
- ADF integration only after ADF-MF-08 is complete or paused;
- no broad live publication.

Tasks:

- Refactor existing incremental scripts to use the shared delta engine.
- Preserve existing run reports and command behavior.
- Add generic connector metadata-profile handoff.
- Add ADF handoff only after ADF backlog completion/pause.
- Confirm unchanged objects stop before artifact generation.

Validation:

```powershell
npm test
npm run metadata:delta:check -- --manifest <manifest.json>
npm run lineage:runtime:check
git diff --check
```

Acceptance criteria:

- SQL Server, SSIS, and Snowflake still run incrementally.
- Generic connector publication requires a delta manifest.
- ADF future refresh path uses the same delta manifest contract.

Readiness note:

- SQL Server, SSIS, and Snowflake ingestion commands now build and consume
  source metadata delta manifests.
- Generic connector metadata-profile runs now produce local delta manifests,
  covering ADF through the shared connector runtime.
- AWS now has a source-family handoff through
  `npm run aws:lineage:ingest`, using native AWS canonical assets and
  deterministic cloud edges before delta comparison.
- Current AWS connectors are explicitly routed to MDP, and
  `npm run aws:mdp:lineage:package` builds local human Confluence markdown,
  Rovo artifacts, and DevOps JSON/JSONL files from that route.
- Existing command names remain stable.
- SQL Server and SSIS plan-only mock command smoke tests passed.

## WP-SMD-04A: AWS Non-Database Lineage Handoff

Status: complete

Objective:

Add the first non-database source-family implementation using the shared delta
contract.

Scope:

- AWS S3, Glue, Athena, and QuickSight metadata acquisition through saved
  connectors;
- AWS-native canonical assets and deterministic edges;
- plan-only local output by default;
- no DevOps, Rovo, or Confluence publish.

Validation:

```powershell
node --check engines/connectors/aws/index.js
node --check scripts/ingest-aws-lineage-incremental.mjs
node --check scripts/build-mdp-aws-lineage-context.mjs
npm test -- tests/unit/aws-lineage-engine.test.js tests/unit/metadata-delta-engine.test.js --runInBand --coverage=false
```

Acceptance criteria:

- AWS assets do not use fake SQL identity.
- Current AWS assets carry explicit MDP route metadata.
- S3/Glue/Athena edge rules are deterministic and tested.
- QuickSight relationship gaps are explicit.
- AI packets contain bounded metadata evidence only.

Completion notes:

- Added ADR-029, AWS runbook, Codex packet, AWS backlog, and AWS work packets.
- Added AWS ingestion command and unit coverage.
- Added MDP package command for local Confluence/Rovo/DevOps outputs.

## WP-SMD-05: Downstream Delta Consumers

Status: complete

Objective:

Make DevOps, runtime package, Rovo, Confluence, support docs, and AI summaries
consume the delta manifest.

Scope:

- changed-only downstream generation;
- dry-run publication only unless separately approved;
- direct impacted index/shard pages only.

Tasks:

- Limit AI summarization to new/changed bounded evidence packets.
- Limit support-doc generation to changed assets and impacted indexes.
- Limit Rovo artifacts to impacted locator/context/evaluation shards.
- Limit Confluence dry-run to affected page slices.
- Record target artifact paths in delta readback.

Validation:

```powershell
npm test
npm run metadata:delta:check -- --manifest <manifest.json>
npm run lineage:runtime:check
npm run lineage:answers:check
git diff --check
```

Acceptance criteria:

- unchanged-only run makes no AI requests;
- unchanged-only run produces no Confluence publish candidates;
- Rovo dry-run reports only impacted shards;
- runtime and answer checks pass.

Readiness note:

- The manifest exists and the first downstream consumers now accept it.
- Rovo AI retrieval dry-run generation now accepts `--delta-manifest` and uses
  changed runtime object ids for locator, object summary, database context, and
  lineage context output.
- Human Confluence catalog dry-run generation now accepts `--delta-manifest`
  and scopes default database/schema/object page generation to changed runtime
  rows.
- The shared delta engine now exposes `loadDeltaManifest`,
  `changedDeltaObjectIds`, and `createDeltaScope` so future generators do not
  reimplement changed-object filtering.
- Runtime package generation now accepts `--delta-manifest`, records the delta
  scope in `manifest.json`, and records changed-object runtime artifact paths.
- ADF support-documentation generators now accept `--delta-manifest`, generate
  only changed support pages plus directly impacted overview pages, and emit
  delta target artifact readback.
- Rovo and human catalog dry-run manifests now include delta target artifacts.
- Rovo, human catalog, and ADF support publication paths now block broad publish
  paths when a delta-scoped manifest is missing.
- General Rovo, Snowflake Rovo, human catalog, Lineage Brain prompts, prompt
  queue utilities, and legacy Confluence export/sync now fail closed without a
  delta-scoped manifest.
- SSIS and SSRS support live publish paths are blocked until rebuilt as true
  delta-scoped publishers.

## WP-SMD-06: Guardrails, Packets, And Readiness

Status: complete

Objective:

Make the delta-first workflow durable enough for future low/medium-intelligence
execution.

Scope:

- docs, packets, validation, and readiness checks;
- no broad publish.

Tasks:

- Update execution packets to require delta manifest review.
- Add publication blockers when a manifest is missing.
- Add troubleshooting guidance for corrupt baseline and signature drift.
- Add final smoke prompts for "what changed" and "why did this publish".
- Produce a readiness readback.

Validation:

```powershell
npm test
npm run metadata:delta:check -- --manifest <manifest.json>
npm run lineage:runtime:check
npm run lineage:answers:check
git diff --check
```

Acceptance criteria:

- future connector ingestion packets require source capture, delta, then
  downstream generation;
- full-refresh cannot be silent;
- documentation makes DevOps the baseline and Rovo/Confluence downstream only;
- readiness readback confirms this backlog can be used after ADF.

Completion notes:

- Rovo and support documentation packets now require `metadata:delta:check`
  before downstream publication validation.
- Rovo and human catalog publish packet builders fail validation when their
  source dry-run manifest is not delta-scoped.
- ADF support publish scripts fail in `--publish` mode when the support
  documentation manifest is not delta-scoped.
- Unit coverage proves unchanged-only manifests produce an empty downstream
  scope.
- Unit coverage proves AI guardrails fail closed when no delta manifest is
  supplied.
