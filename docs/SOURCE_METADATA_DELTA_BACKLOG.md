# Source Metadata Delta-First Processing Backlog

Generated: 2026-06-29

## Purpose

Implement the source-agnostic delta workflow required before future connector
metadata captures can drive DevOps, runtime package, Rovo, Confluence, support
documentation, or AI-generated summaries.

This backlog exists because source metadata must be acquired, normalized, and
compared against the existing DevOps machine-readable baseline before downstream
work runs. Routine refreshes should process only metadata that is new or
changed.

## Sequencing

Do not start this backlog until the ADF multi-factory work packages in
`docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md` are complete or formally paused.

This backlog is the next architecture work after `ADF-MF-08`.

## Scope

In scope:

- reusable JavaScript delta engine for all connector families;
- deterministic metadata signature contract;
- delta manifest schema and readback output;
- integration with source-family ingestion commands;
- native non-database source handoff, including AWS account/service/assets and
  cloud edge rules;
- DevOps/runtime/Rovo/Confluence/support-doc downstream scoping;
- plan-only and full-refresh behavior;
- fixture validation for first-run, unchanged, changed, and full-refresh cases;
- documentation and packet updates so low/medium-intelligence sessions can run
  the workflow safely.

Out of scope:

- starting ADF pipelines;
- changing production ADF triggers, schedules, retries, linked services, or
  credentials;
- changing source parser semantics or lineage scoring without a separate
  packet;
- publishing broad Confluence trees without dry-run review and explicit
  approval;
- using Rovo or Confluence as the metadata-change baseline.

## Target Architecture

```text
saved connector/runtime
  -> source metadata acquisition
  -> canonical metadata normalization
  -> deterministic metadata signatures
  -> compare against DevOps lineage baseline
  -> delta manifest
  -> changed-only AI/doc generation
  -> changed-only DevOps/runtime/Rovo/Confluence targets
```

The DevOps lineage repo is the comparison baseline:

`../Sonic-data-lineage`

Rovo and Confluence are downstream projections.

## Backlog

### SMD-01: Delta Contract And Placement

Status: complete

Goal:

Define the reusable delta engine API, manifest schema, signature inputs, and
target placement.

Tasks:

- Confirm implementation location under `engines/connectors/metadata-delta/`
  with thin wrappers for scripts and app services.
- Define the canonical metadata object shape consumed by the delta engine.
- Define source-family extension points for SQL Server, SSIS, Snowflake, ADF,
  SSRS, BI, and future connectors.
- Define the delta manifest schema, readback location, and validation rules.
- Define which DevOps files are the comparison baseline.
- Define which downstream targets may be impacted by each object status.

Acceptance criteria:

- Contract references ADR-028 and ADR-020.
- Contract explicitly rejects Rovo/Confluence as the comparison baseline.
- Contract defines required fields for new, changed, unchanged, retained stale,
  and removed stale objects.
- Contract defines plan-only and full-refresh semantics.

Completion notes:

- Added `engines/connectors/metadata-delta/README.md`.
- Added npm command `metadata:delta:plan`.
- Added npm command `metadata:delta:check`.

### SMD-02: Baseline Reader And Signature Engine

Status: complete

Goal:

Build the reusable JavaScript logic that reads existing DevOps lineage metadata
and computes deterministic source metadata signatures.

Tasks:

- Read `registry/object-registry.jsonl` from the DevOps lineage repo.
- Read object context packs when needed for prior signatures.
- Normalize prior metadata into the comparison model.
- Compute stable signatures for current normalized source metadata.
- Exclude volatile run ids, extraction timestamps, local artifact timestamps,
  pagination order, and raw payload order.
- Include stable dependency-changing metadata such as columns, definitions,
  lineage edges, ADF triggers, datasets, child-pipeline calls, linked-service
  references without secrets, and schedule state.

Acceptance criteria:

- First-run fixture marks all scoped objects as new.
- Repeat fixture marks all objects as unchanged.
- Changed fixture marks only modified objects as changed.
- Signature output is deterministic across runs.

Completion notes:

- Added `engines/connectors/metadata-delta/index.js`.
- Added fixture coverage in `tests/unit/metadata-delta-engine.test.js`.
- Targeted Jest validation passed with coverage disabled for speed.

### SMD-03: Delta Manifest And Plan-Only Reporting

Status: complete

Goal:

Produce a reviewable delta manifest before downstream generation or publication.

Tasks:

- Emit manifest files with connector id, source family, source scope, mode,
  baseline path, counts, object statuses, prior signatures, next signatures, and
  affected target hints.
- Add readback markdown suitable for human review.
- Ensure `plan_only` mode performs no DevOps, Rovo, Confluence, runtime package,
  or AI-description writes.
- Ensure `full_refresh` requires explicit flag/reason and remains scoped.

Acceptance criteria:

- Plan-only run produces manifest and readback only.
- Counts reconcile to object list statuses.
- Full-refresh reason is required and visible in readback.
- The manifest can drive downstream changed-only generation.

Completion notes:

- Added `scripts/plan-source-metadata-delta.mjs`.
- Added `scripts/check-source-metadata-delta-manifest.mjs`.
- CLI smoke test produced and validated a plan-only delta manifest.

### SMD-04: Connector Ingestion Integration

Status: complete

Goal:

Wire the delta engine into source metadata capture paths without creating
source-family-specific comparison forks.

Tasks:

- Integrate SQL Server, SSIS, and Snowflake incremental scripts with the shared
  delta engine while preserving existing command names.
- Add ADF metadata capture integration after the current ADF backlog is done or
  paused.
- Add a generic connector metadata-profile integration path.
- Ensure unchanged objects are skipped before downstream artifact generation.
- Preserve full-refresh overrides for scoped maintenance events.

Acceptance criteria:

- Existing SQL Server, SSIS, and Snowflake behavior remains incremental.
- Future ADF refreshes use the same delta manifest contract.
- Generic connector metadata profiles cannot drive publication without a delta
  manifest.
- Existing npm command names remain stable.

Implementation note:

- SQL Server, SSIS, and Snowflake ingest scripts now consume the shared delta
  manifest for changed/new/unchanged decisions while preserving existing command
  names.
- Snowflake now supports `--plan-only` / `--dry-run` for metadata delta planning
  without catalog writes.
- Generic connector metadata-profile runs now emit local metadata delta
  manifests, which gives ADF and future connector families the same handoff.
- Targeted syntax and mock command validation passed.

### SMD-04A: AWS Non-Database Lineage Handoff

Status: complete

Goal:

Add AWS as the first non-database source family that uses native platform
identity and the shared delta engine.

Tasks:

- Normalize AWS connector runtime events into AWS-native canonical assets.
- Derive deterministic S3, Glue, and Athena lineage edges.
- Record QuickSight relationship gaps instead of guessing.
- Emit source metadata delta manifests for AWS account/region scopes.
- Keep AI description packets bounded to safe metadata evidence.

Acceptance criteria:

- AWS assets use `aws://<account>/<region>/<service>/...` canonical ids.
- AWS command defaults to plan-only local output.
- AWS write/full-refresh modes use the same delta manifest contract.
- Unit tests prove representative AWS edge rules.

Completion notes:

- Added `engines/connectors/aws/index.js`.
- Added `scripts/ingest-aws-lineage-incremental.mjs`.
- Added npm command `aws:lineage:ingest`.
- Added explicit MDP product routing for current AWS connectors.
- Added npm command `aws:mdp:lineage:package` for local human/Rovo/DevOps
  downstream package generation.
- Added ADR-029 and AWS runbooks.

### SMD-05: Downstream Target Scoping

Status: complete

Goal:

Make DevOps, runtime package, Rovo, Confluence, and support-doc generation
consume the delta manifest.

Tasks:

- Limit AI summarization to new or changed bounded evidence packets.
- Limit DevOps object writes to new/changed objects and required indexes.
- Limit runtime package object content updates to changed objects while allowing
  required index rebuilds for consistency.
- Limit Rovo retrieval artifacts to impacted locator/context shards, ambiguity
  groups, profile/lineage contexts, and evaluation prompts.
- Limit Confluence dry-runs and live publishes to affected page slices and
  directly impacted index pages.
- Record which target artifacts were updated because of each delta object.

Acceptance criteria:

- Unchanged-only run produces no AI summary requests.
- Unchanged-only run produces no Confluence publish candidates.
- Rovo dry-run lists only impacted shards/pages.
- DevOps/runtime validation still passes after changed-only writes.

Implementation note:

- The ingestion side now emits delta manifests.
- The shared metadata delta engine now exposes a downstream scope helper for
  changed-only target filtering.
- Rovo AI retrieval dry-run generation accepts `--delta-manifest` and limits
  locator, summary, and context artifacts to changed runtime objects when a
  manifest is supplied.
- Human Confluence catalog dry-run generation accepts `--delta-manifest` and
  limits default page generation to changed database/schema/object slices rather
  than sweeping all product catalog pages.
- Runtime package generation accepts `--delta-manifest` and writes delta scope
  plus changed-object runtime target artifacts into the package manifest.
- ADF support-documentation generators accept `--delta-manifest` and limit
  generated support pages to changed factories/triggers/pipelines plus directly
  impacted overview pages.
- Rovo, human catalog, and ADF support publication paths now fail publish packet
  validation or live publish execution when a delta-scoped manifest is missing.
- Downstream manifests now expose target artifact paths tied back to changed
  source metadata object ids.
- AI/Rovo/Codex corpus generation now fails closed without a delta manifest.
- Lineage Brain prompt generation and prompt queue utilities are delta-scoped
  and skip unchanged-only manifests.
- Legacy Confluence export/sync paths are blocked unless the export manifest is
  delta-scoped.
- SSIS and SSRS support live publish scripts are blocked until rebuilt as true
  delta-scoped publishers.

### SMD-06: Validation, Guardrails, And Documentation

Status: complete

Goal:

Make the workflow safe for repeat execution by future low/medium-intelligence
sessions.

Tasks:

- Add fixture tests for first-run, unchanged, changed, retained-stale, and
  full-refresh scenarios.
- Add validation that fails if a publication packet lacks a delta manifest.
- Update execution packets to require delta readback before live writes.
- Update teammate/maintainer docs with the rule: source capture first, delta
  second, downstream generation third.
- Add troubleshooting notes for corrupt baseline, signature drift, and scoped
  full refresh.

Acceptance criteria:

- Documentation points to ADR-028.
- Work packets require delta manifest review before publication.
- Tests prove unchanged metadata does not run AI or publish pages.
- The workflow can be executed without broad catalog regeneration.

Completion notes:

- Updated Rovo and support documentation packets to require a delta manifest
  check before downstream publication work.
- Added `metadata:delta:check` as the low-cost publication guardrail command.
- Rovo and human catalog publish packets now fail when the reviewed dry-run
  manifest is not delta-scoped.
- ADF support live publish scripts now fail in `--publish` mode unless the
  generated support manifest is delta-scoped.
- Added unchanged-only downstream scope test coverage.
- Added AI guard coverage that fails closed when no delta manifest is supplied.

## Hard Stops

Stop and ask the user before:

- starting this backlog before ADF-MF-08 is complete or paused;
- changing parser/extractor semantics;
- changing production ADF behavior;
- running full-refresh across more than one approved source scope;
- live publishing DevOps, Rovo, or Confluence changes without reviewed dry-run;
- using unrestricted raw source metadata as LLM input.

## Related Documents

- `docs/SOURCE_METADATA_DELTA_WORK_PACKAGES.md`
- `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
- `docs/adr/ADR-020-Source-Agnostic-Incremental-Lineage-Ingestion.md`
- `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`
- `docs/CODEX_SUPPORT_DOCUMENTATION_REFRESH_PACKET.md`
- `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md`
