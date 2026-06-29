# ADF Multi-Factory Ingestion Backlog

Generated: 2026-06-26

## Purpose

Plan the ingestion, lineage extraction, DevOps packaging, and support
documentation refresh for newly registered production Azure Data Factory
connectors.

## Hard Stop

Do not start ADF ingestion now.

Current blocker:

- Another source ingestion is already running.

Required clearance before work package `ADF-MF-02`:

- the current non-ADF ingestion is complete or explicitly paused;
- the user confirms which ADF connector or connector batch should run first;
- the user explicitly approves the ADF ingestion packet;
- the run plan names the exact connector ids, streams, output locations, and
  validation commands.

This backlog authorizes planning only. It does not authorize pipeline starts,
trigger changes, linked-service changes, credential changes, live DevOps writes,
or Confluence publication.

## Scope

In scope:

- saved ADF connector readiness checks;
- metadata ingestion through the shared connector runtime;
- lineage extraction for factories, pipelines, activities, datasets, linked
  services, triggers, integration runtimes, data flows, and supported dependency
  edges;
- bounded run-history and activity-run evidence when sanitized by the existing
  connector runtime;
- local support markdown generation;
- DevOps/runtime package export after validation;
- Confluence dry run and later live publish after explicit approval.

Out of scope:

- VDM and SAEDP factories;
- ADF pipeline starts;
- trigger/schedule/retry changes;
- linked-service edits;
- credential or permission changes;
- broad parallel ingestion;
- raw activity output or secret publication;
- Sonic Data Lineage human catalog refresh unless separately approved.

## In-Scope Newly Registered Connectors

Lower-risk first:

| Priority | Connector id                                 | Factory                   | Notes                             |
| -------: | -------------------------------------------- | ------------------------- | --------------------------------- |
|        1 | `azure-data-factory-adf-admin-d1`            | `adf-Admin-D1`            | readable; zero pipelines/triggers |
|        2 | `azure-data-factory-adf-dw-caroffer-prod`    | `adf-dw-caroffer-prod`    | readable; zero pipelines/triggers |
|        3 | `azure-data-factory-adf-dw-lightspeed-prod`  | `adf-dw-lightspeed-prod`  | readable; zero pipelines/triggers |
|        4 | `azure-data-factory-adf-dw-postgres-prod`    | `adf-dw-postgres-prod`    | readable; zero pipelines/triggers |
|        5 | `azure-data-factory-adf-googlesearch-d1`     | `adf-GoogleSearch-D1`     | legacy; no active triggers        |
|        6 | `azure-data-factory-adf-xtime-d1`            | `adf-XTime-D1`            | legacy; no active triggers        |
|        7 | `azure-data-factory-adf-vehiclemart-prod`    | `ADF-VehicleMart-Prod`    | readable; no active triggers      |
|        8 | `azure-data-factory-adf-reputationmgmt-d1`   | `adf-ReputationMgmt-D1`   | active trigger                    |
|        9 | `azure-data-factory-adf-facebookads-d1`      | `adf-FacebookAds-D1`      | active triggers                   |
|       10 | `azure-data-factory-adf-reconpro-d1`         | `adf-ReconPro-D1`         | active triggers                   |
|       11 | `azure-data-factory-adf-mci-d1`              | `adf-MCI-D1`              | active triggers                   |
|       12 | `azure-data-factory-adf-ganalytics-d1`       | `adf-GAnalytics-D1`       | active triggers                   |
|       13 | `azure-data-factory-adf-elead-d1`            | `adf-eLead-D1`            | active triggers                   |
|       14 | `azure-data-factory-adf-inbounddataetl-prod` | `ADF-InboundDataETL-Prod` | active triggers; larger factory   |
|       15 | `azure-data-factory-adf-pricefx-d1`          | `adf-PriceFx-D1`          | active triggers; larger factory   |

`azure-data-factory-adf-dw-marketing-prod` remains the existing baseline and is
not part of the newly registered connector backlog unless a reconciliation task
is explicitly approved.

## Backlog

### ADF-MF-01: Freeze Scope And Connector Readiness

Status: ready to start; planning/readiness only

Goal:

Confirm the newly registered ADF connector inventory and prepare the exact first
ingestion packet without running ingestion.

Tasks:

- Re-run `node scripts/register-production-adf-connectors.mjs`.
- Read back all `azure_data_factory` connectors from the framework.
- Confirm VDM and SAEDP remain excluded.
- Confirm `adf-GoogleSearch-D1` and `adf-XTime-D1` remain marked legacy.
- Select the first connector batch, preferably zero-pipeline/legacy factories.
- Produce an execution packet for `ADF-MF-02`.

Acceptance criteria:

- Connector list matches `docs/ADF_PRODUCTION_FACTORY_ACCESS_INVENTORY.md`.
- No ingestion commands are run.
- First batch is explicit and approved by the user.

### ADF-MF-02: Low-Risk Metadata Ingestion Pilot

Status: blocked until active source ingestion is complete and user approves

Goal:

Run the shared connector runtime for the lowest-risk connector batch and capture
sanitized metadata/profile artifacts.

Recommended first batch:

- `azure-data-factory-adf-admin-d1`
- `azure-data-factory-adf-dw-caroffer-prod`
- `azure-data-factory-adf-dw-lightspeed-prod`
- `azure-data-factory-adf-dw-postgres-prod`
- `azure-data-factory-adf-googlesearch-d1`
- `azure-data-factory-adf-xtime-d1`

Tasks:

- Run connector tests for the selected batch.
- Ingest metadata streams only through the shared connector runtime.
- Capture profile run ids and artifact paths.
- Confirm zero-pipeline factories produce empty but successful support evidence.
- Confirm legacy factories produce pipeline/trigger inventory without active run
  evidence expansion.

Acceptance criteria:

- Each selected connector has a successful or explicitly explained profile run.
- No ADF pipeline is started.
- No linked-service secret detail is persisted or published.

### ADF-MF-03: Lineage Extraction And Edge Review

Status: blocked by `ADF-MF-02`

Goal:

Extract and validate lineage for all supported ADF objects in the pilot batch.

Tasks:

- Build factory-level object identity records.
- Build pipeline, activity, dataset, linked-service, trigger, integration
  runtime, data-flow, and dependency-edge records where surfaced.
- Classify edges as orchestration, dataset read/write, linked-service dependency,
  trigger-to-pipeline, and activity-to-child-pipeline.
- Identify missing or ambiguous edges.
- Produce a readback report with counts by connector and object type.

Acceptance criteria:

- Lineage edges are deterministic and tied to source connector/profile artifacts.
- Ambiguous edges are marked review-needed, not guessed.
- Readback report is stored under the lineage-runtime readback path.

### ADF-MF-04: Active-Trigger Factory Ingestion

Status: blocked by `ADF-MF-02`, `ADF-MF-03`, and user approval

Goal:

Ingest active-trigger factories one connector or small batch at a time.

Recommended order:

1. `azure-data-factory-adf-reputationmgmt-d1`
2. `azure-data-factory-adf-facebookads-d1`
3. `azure-data-factory-adf-reconpro-d1`
4. `azure-data-factory-adf-mci-d1`
5. `azure-data-factory-adf-ganalytics-d1`
6. `azure-data-factory-adf-elead-d1`
7. `azure-data-factory-adf-inbounddataetl-prod`
8. `azure-data-factory-adf-pricefx-d1`

Tasks:

- Run one connector or one small approved batch.
- Keep bounded lookback windows.
- Store sanitized metadata/profile artifacts.
- Produce per-connector object and edge counts.
- Stop on permission, timeout, schema drift, or raw-output risk.

Acceptance criteria:

- Each active-trigger factory has an ingestion readback.
- Runtime history evidence is bounded and sanitized.
- No trigger, schedule, retry, linked-service, or pipeline behavior is changed.

### ADF-MF-05: Local Support Documentation Generation

Status: blocked by lineage/profile artifacts

Goal:

Generate local ADF support markdown for each ingested factory.

Tasks:

- Generate factory overview pages.
- Generate pipeline pages with root/child/orchestrator classification.
- Generate trigger pages and identify active/inactive status.
- Generate dataset and linked-service dependency sections without secret detail.
- Mark legacy factories clearly.
- Mark weak evidence as `not surfaced in metadata`.

Acceptance criteria:

- Pages follow `docs/SUPPORT_DOCUMENTATION_DATASET_CONTRACT.md`.
- Legacy pages do not imply target-state architecture.
- Local markdown can be reviewed before any publication.

### ADF-MF-06: DevOps Runtime Package And Catalog Export

Status: blocked by local documentation review

Goal:

Package the ADF metadata, lineage, and support docs for machine-readable team
use.

Tasks:

- Export catalog/runtime artifacts for the approved ADF connector set.
- Run runtime package validation.
- Run catalog repo checks.
- Produce object counts, edge counts, profile artifact ids, and package hash.

Acceptance criteria:

- Runtime validation passes.
- DevOps export is dry-run/reviewed before any live write.
- Machine-readable artifacts include connector ids and profile run ids.

### ADF-MF-07: Confluence Dry Run

Status: blocked by DevOps/runtime validation

Goal:

Prepare human support documentation publication without writing live pages.

Tasks:

- Build Confluence dry run for ADF support pages only.
- Confirm pages stay under the ADF support root.
- Confirm Sonic Data Lineage human catalog is untouched.
- Spot-check one legacy factory, one zero-pipeline factory, and one active
  trigger factory.

Acceptance criteria:

- Dry-run page counts are reviewed.
- No pages are outside approved ADF support roots.
- No secret or raw activity output appears in rendered pages.

### ADF-MF-08: Live Publish

Status: hard stop; requires explicit approval after dry-run review

Goal:

Publish reviewed ADF support documentation and runtime artifacts.

Tasks:

- Ask the user for explicit live publish approval.
- Publish only the reviewed ADF support page set.
- Capture publication ids/URLs and verification output.

Acceptance criteria:

- User approval is recorded in the thread.
- Publication matches the reviewed dry-run scope.
- Post-publish check passes.

## Next Architecture Backlog After ADF

After `ADF-MF-08` is complete or the ADF backlog is formally paused, start the
source metadata delta-first backlog:

- `docs/SOURCE_METADATA_DELTA_BACKLOG.md`
- `docs/SOURCE_METADATA_DELTA_WORK_PACKAGES.md`
- `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`

This follow-on backlog must make all future connector metadata captures compare
fresh source metadata against the DevOps lineage baseline before downstream
work runs. AI summarization, DevOps updates, runtime package object updates,
Rovo retrieval artifacts, Confluence dry-runs, and live publication must then
process only new or changed metadata plus directly impacted index/shard pages.

Do not start this follow-on backlog while ADF ingestion/publication work is
active unless the user explicitly reorders the work.

## Minimum Validation Commands

Use only after the relevant packet is approved:

```powershell
node scripts/register-production-adf-connectors.mjs
npm run lineage:runtime:check
npm run catalog:repo:check
```

Use for documentation dry runs after local generation:

```powershell
npm run adf:support:generate
npm run adf:support:dry-run
```

Do not run live publish commands until `ADF-MF-08` is explicitly approved.
