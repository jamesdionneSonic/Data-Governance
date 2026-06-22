# Codex eLeadDW Low-Intelligence Onboarding Packet

Use this packet to onboard `eLeadDW` metadata, lineage, Azure DevOps runtime
artifacts, Confluence human catalog pages, and Rovo retrieval artifacts with the
lowest safe Codex setting.

This packet is intentionally mechanical. Do not improvise architecture, change
engines, change parser behavior, or publish live artifacts unless the packet
explicitly says the step is approved.

## Required Setting

Use the cheapest Codex-capable model that can run repository commands.

- Speed: fastest
- Thinking: low
- Scope: one checklist item at a time

Stop and ask for a stronger setting before changing shared runtime code,
extractor/parser logic, lineage scoring, auth, publish scripts, Confluence live
pages, Azure DevOps remotes, or generated-content templates.

## Required Reading

Read these before starting:

1. `AI_README.md`
2. `AGENTS.md`
3. `docs/CONNECTOR_EXTRACTION_FRAMEWORK.md`
4. `docs/CONNECTOR_METADATA_PROFILE_FRAMEWORK.md`
5. `docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md`
6. `docs/CODEX_FULL_DATABASE_CATALOG_DEPLOYMENT_PACKET.md`
7. `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md`
8. `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
9. `docs/ELEADDW_METADATA_LINEAGE_LOW_INTELLIGENCE_BACKLOG.md`

## Fixed Inputs

| Field                       | Value                                  |
| --------------------------- | -------------------------------------- |
| Database                    | `eLeadDW`                              |
| Connector id                | `sqlserver-l1-dwasql-02-12010-eleaddw` |
| Configured endpoint         | `L1-DWASQL-02,12010`                   |
| Framework type              | `sql_server`                           |
| Auth mode                   | Windows integrated                     |
| Runtime identity tested     | `SONIC\James.Dionne`                   |
| SQL Server reported by test | `D1-DWASQL-01\INST1`                   |
| Last connector test         | `succeeded` on 2026-06-20              |

## Approved Step 2 Scope

The user approved the source metadata scope on 2026-06-20.

Approved metadata targets:

- schemas
- tables
- views
- columns
- stored procedures
- functions
- triggers
- primary keys
- foreign keys
- constraints
- indexes
- dependency edges
- procedure SQL references
- lineage hints

Not approved by this packet:

- raw business row extraction;
- sample data publication;
- credential, secret, token, or connection-string publication;
- live Confluence publish;
- live Azure DevOps publish;
- page cleanup, archive, delete, or move;
- parser, extractor, or lineage-scoring code changes.

## Step 1: Connector Test

Command:

```powershell
node --input-type=module -e "import 'dotenv/config'; const { testConnector } = await import('./src/services/connectorService.js'); const actor={id:'system',name:'System',role:'admin',roles:['Admin']}; const result=await testConnector('sqlserver-l1-dwasql-02-12010-eleaddw',{timeout_ms:15000},actor); console.log(JSON.stringify({status:result.status,summary:result.summary,diagnostics:result.diagnostics,errors:result.errors},null,2)); if(result.status==='failed') process.exit(1);"
```

Pass criteria:

- status is `succeeded`;
- `live_connection_valid` is `true`;
- `metadata_discovery_valid` is `true`;
- database is `eLeadDW`;
- no errors are returned.

If this fails, stop. Do not continue to extraction or publishing.

## Step 2: Metadata Scope Confirmation

This step is already approved. Do not ask again unless the target database or
connector id changes.

Record the approved scope in the run notes before extraction.

## Step 3: Metadata Extraction Dry Run

Goal: prove the saved connector can extract canonical metadata through the
shared runtime.

Use only the saved connector framework. Do not use ad hoc SQL scripts as the
durable extraction path.

Required streams:

```text
schemas
tables
views
columns
procedures
functions
triggers
relationships
```

Pass criteria:

- extraction status is `succeeded` or an explicitly reviewed `partial_failure`;
- stream results are visible;
- object count and column count are nonzero;
- errors are empty or documented in a review note;
- raw business rows are not captured.

Stop if extraction fails at connection validation.

## Step 4: Local Catalog And Lineage Build

Goal: turn extracted metadata into local catalog artifacts.

Outputs must be local only:

- SQL Server markdown under the normal `data/markdown` structure;
- raw analysis artifacts under the normal `data/analysis/raw/sqlserver`
  structure;
- runtime indexes under the normal local runtime/package build path;
- validation or summary report under `docs/lineage-runtime-readbacks/` or
  another existing project-approved readback path.

Pass criteria:

- `eLeadDW` appears in the database manifest;
- `eLeadDW.dbo` appears as a schema;
- all extracted objects reconcile to the extraction summary;
- lineage edges exist where SQL Server dependencies or procedure references
  support them;
- low-confidence edges are marked for review, not promoted silently.

## Step 5: Azure DevOps Dry Run

Goal: prepare machine-readable runtime artifacts for Azure DevOps without
publishing.

Dry-run artifacts should include:

- object registry entries;
- canonical object records;
- alias indexes;
- context packs;
- answer cards;
- upstream/downstream context;
- profile teasers if available;
- manifest/hash updates.

Pass criteria:

- dry-run validation passes;
- `eLeadDW` object counts reconcile;
- no ingestion engines, parser code, or generator code are exposed to teammate
  repositories;
- no secrets or raw rows are present.

Hard stop: do not publish to Azure DevOps without explicit user approval after
the dry-run report is reviewed.

## Step 6: Confluence Dry Run

Goal: prepare human catalog pages without publishing.

Required page families:

- `Sonic Data Lineage / Database Catalog / eLeadDW`;
- `Sonic Data Lineage / Database Catalog / eLeadDW / dbo`;
- thin object pages only if the dry-run scope explicitly includes them;
- Rovo retrieval artifacts under `AI Retrieval Artifacts`, not under the human
  catalog tree.

Pass criteria:

- no page uses old schema title pattern `Schema - eLeadDW.dbo`;
- unsupported owner, steward, SLA, lifecycle/status, live freshness, and
  certification fields say `not surfaced in metadata`;
- no generic boilerplate business meaning is published as fact;
- duplicate or cleanup candidates are report-only.

Hard stop: do not live publish to Confluence without explicit user approval
after dry-run review.

## Step 7: Readback Verification

Run readback prompts after dry run and after any approved live publish.

Required prompts:

```text
Tell me about the eLeadDW database.
List schemas in eLeadDW.
Tell me about eLeadDW.dbo.dwFullOpportunity.
What feeds eLeadDW.dbo.dwFullOpportunity?
What depends on eLeadDW.dbo.dwFullOpportunity?
Which SSIS or ADF assets reference eLeadDW?
Which eLeadDW lineage edges are low confidence or review-needed?
```

Pass criteria:

- answers cite deterministic artifacts;
- answers do not invent owners or business definitions;
- ambiguous objects are labeled ambiguous;
- stale Confluence pages are not treated as the source of truth.

## Stop Triggers

Stop immediately if any of these occur:

- connector test fails;
- extraction returns zero objects;
- metadata extraction needs new credentials or auth changes;
- a command would publish live to Confluence or Azure DevOps;
- a command would delete, archive, move, or replace Confluence pages;
- a command would edit extractor/parser/lineage-scoring code;
- raw rows, secrets, or connection strings appear in output;
- an LLM would need unrestricted raw metadata instead of bounded evidence
  packets;
- counts do not reconcile between extraction, catalog, runtime package, and
  Confluence dry run.
