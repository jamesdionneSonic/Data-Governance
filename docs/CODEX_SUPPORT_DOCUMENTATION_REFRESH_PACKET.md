# Codex Support Documentation Refresh Packet

Use this packet for ADF, SSIS, and SSRS support-documentation refresh work. The
goal is to make broad refreshes executable by a balanced Codex model at normal
speed with medium thinking.

Do not start implementation until the packet is filled in or a field is marked
not applicable. Live DevOps and Confluence writes require explicit user
approval after dry-run review.

## Required Pre-Flight

Read these first:

1. `docs/adr/ADR-011-Unified-Support-Documentation-Refresh-Contract.md`
2. `docs/SUPPORT_DOCUMENTATION_DATASET_CONTRACT.md`
3. `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
4. `docs/SOURCE_METADATA_DELTA_BACKLOG.md`
5. `AI_README.md`
6. `AGENTS.md`

Read these for ADF:

1. `docs/adr/ADR-010-ADF-Operations-Through-Saved-Connector.md`
2. `docs/ADF_PIPELINE_OPERATIONS.md`
3. `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`
4. `docs/ADF_PRODUCTION_FACTORY_ACCESS_INVENTORY.md`
5. `docs/ADF_LEGACY_FACTORY_INVENTORY.md`
6. `docs/ADF_MARKETING_AWS_EXPORT_METADATA.md`
7. `.agents/skills/adf-operations/SKILL.md`

Read these for SSIS:

1. `docs/adr/ADR-006-SSIS-Native-Hierarchy-And-Classified-Lineage.md`
2. `docs/CODEX_LINEAGE_EXECUTION_PACKET_TEMPLATE.md`

Read these for SSRS:

1. `docs/CASH_MANAGEMENT_SSRS_SUPPORT_GUIDE.md`
2. `docs/ssrs-report-execution-users-last-6-months.md`
3. `C:/Users/james.dionne/.codex/skills/ssrs-support-docs/SKILL.md`

Read these for Confluence scope:

1. `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md`
2. `docs/CONFLUENCE_SPACE_MAP.md`

## Hard Scope Boundary

This packet may refresh:

- ADF support markdown and ADF Confluence support section;
- SSIS support markdown and SSIS Confluence support section;
- SSRS support markdown and SSRS Confluence support section;
- DevOps catalog/runtime artifacts needed for those support docs.

This packet must not refresh, replace, move, or publish the `Sonic Data Lineage`
Confluence human catalog. That tree has a separate scope document and approval
path.

## Upgrade And Stop Triggers

Stop and ask for stronger review before:

- changing auth, secrets, service principals, managed identity, or connector
  permissions;
- changing production ADF triggers, schedules, retry behavior, or parallel run
  behavior;
- starting ADF multi-factory ingestion while another source ingestion is
  running;
- modifying parser/extractor internals, semantic lineage scoring, or edge
  promotion rules;
- publishing live to DevOps or Confluence before a reviewed dry run;
- deleting Confluence pages;
- moving SSIS, SSRS, or ADF support roots;
- refreshing Sonic Data Lineage Confluence pages;
- using an LLM over unrestricted raw artifacts instead of bounded evidence
  packets;
- running AI summaries, generated support-page updates, DevOps writes, Rovo
  updates, or Confluence dry-runs/live publishes without a reviewed delta
  manifest unless a scoped full-refresh packet has been approved;
- publishing raw activity output, raw SSISDB messages, report result rows,
  connection strings with credentials, tokens, or secret values.

## Work Packet

### Goal

One sentence:

### Platform Scope

Choose one or more:

- ADF
- SSIS
- SSRS

### Publish Scope

Choose one:

- Local markdown cache only
- Local markdown cache plus DevOps export
- Dry-run Confluence only
- Live Confluence publish after approval
- Full support refresh after approval

### Explicit Exclusions

- Do not refresh Sonic Data Lineage Confluence human catalog.
- Do not publish raw secrets or raw business data.
- Do not change production ADF run behavior.
- Do not make manual edits to generated markdown as the durable fix.

### Source Inputs

Delta manifest:

- manifest path:
- mode:
- counts new/changed/unchanged/retained stale/removed stale:
- approved full-refresh reason, if applicable:

ADF:

- saved connector id:
- profile run id:
- profile artifact path:
- runtime package version/hash:

SSIS:

- raw SSIS source path or catalog source:
- package markdown source:
- mapping sidecar source:
- runtime baseline lookback:

SSRS:

- ReportServer source:
- lookback window:
- report path scope:
- backend SQL source:

### Target Outputs

Local markdown cache:

-

DevOps catalog/runtime package:

-

Confluence parent/root pages:

- ADF:
- SSIS:
- SSRS:

### Required Page Contract

All pages must follow `docs/SUPPORT_DOCUMENTATION_DATASET_CONTRACT.md`:

- Plain-English Summary
- At a Glance
- Business Use
- Support Checks
- Lineage And Dependencies
- Runtime Or Usage Signals
- Technical Details
- Evidence And Caveats

### Command Plan

List exact commands. Mark live writes as approval-required.

Discovery / input refresh:

-

Markdown/cache generation:

-

DevOps/runtime package:

-

Confluence dry run:

-

Confluence live publish, approval required:

-

### Dry-Run Review Checklist

Counts:

- delta new objects:
- delta changed objects:
- delta unchanged objects:
- skipped unchanged pages:
- ADF pages to create:
- ADF pages to update:
- SSIS pages to create:
- SSIS pages to update:
- SSRS pages to create:
- SSRS pages to update:
- pages outside approved roots:

Spot checks:

- ADF root pipeline:
- ADF child pipeline:
- SSIS master package:
- SSIS child package:
- active SSRS report:
- stale/review SSRS report:

### Acceptance Criteria

- ADF, SSIS, and SSRS pages share the same support-page shape.
- ADF pages mimic the SSIS support dataset and do not read like raw metadata
  dumps.
- SSRS pages explain report purpose, usage, parameters, and backend dependencies
  in plain English.
- Folder/section pages summarize inventory, business/support purpose, active
  and stale signals, and common support checks.
- DevOps/runtime validation passes before publish.
- Confluence dry run is reviewed before live publish.
- Sonic Data Lineage Confluence human catalog is untouched.
- AI summarization and generated support-page updates are limited to the delta
  object set unless a scoped full refresh is approved.
- Unchanged-only delta produces no Confluence publish candidates.

### Validation

Minimum:

```powershell
git diff --check
npm run metadata:delta:check -- --manifest <manifest.json>
npm run lineage:runtime:check
```

Add when relevant:

```powershell
npm run catalog:repo:check
npm run lineage:answers:check
npm run confluence:check
npm run confluence:generated:check
```

Do not run `confluence:human:*` commands for this support-doc refresh unless a
separate Sonic Data Lineage packet is approved.

### Completion Note

Report:

- files changed;
- profile/package version and hash used;
- generated page counts by platform;
- dry-run result;
- validation commands and results;
- skipped items and weak-evidence pages;
- whether any live publish was performed.
