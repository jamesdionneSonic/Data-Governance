# ADR-011: Use One Support Documentation Contract For ADF, SSIS, And SSRS

## Status

Accepted

## Date

2026-06-18

## Context

Sonic support documentation is now generated from several technical platforms:

- Azure Data Factory metadata from saved ADF connectors, starting with
  `azure-data-factory-adf-dw-marketing-prod` and the additional readable
  production ADF connectors listed in
  `docs/ADF_PRODUCTION_FACTORY_ACCESS_INVENTORY.md`
- SSIS package, mapping, call-chain, and runtime evidence
- SSRS catalog, report definition, execution, datasource, and backend SQL
  evidence

The documentation is useful only when support readers can understand the asset
before reading raw technical detail. ADF, SSIS, and SSRS must therefore look and
feel alike: plain-English purpose first, support impact second, concrete checks
third, and raw evidence last.

The current SSIS support dataset is the model. ADF must mimic that support
dataset instead of becoming a generic connector metadata dump. SSRS must follow
the same support-documentation contract so report pages are not a separate
style of generated page.

The team also needs a medium-intelligence execution path for broad refreshes:
local markdown cache, exported DevOps catalog artifacts, runtime package, and
Confluence support-documentation trees. That refresh must explicitly exclude
the Sonic Data Lineage Confluence human catalog unless a separate approved
packet says otherwise.

## Decision

ADF, SSIS, and SSRS generated support documentation must use one shared support
dataset contract, described in `docs/SUPPORT_DOCUMENTATION_DATASET_CONTRACT.md`.

Every generated support page must lead with:

1. a plain-English summary of what the asset does;
2. the business or support process it affects;
3. what is delayed, stale, wrong, or broken when it fails;
4. the first concrete checks a support analyst should run;
5. an `At a Glance` table using common field names across platforms;
6. lineage/dependency detail and technical appendix sections after the support
   explanation.

Platform-specific evidence remains platform-specific:

- ADF uses factory, trigger, pipeline, activity, dataset, linked-service,
  schedule, run-history, and connector-profile evidence from each approved saved
  connector.
- SSIS uses native folder/project/package hierarchy, package calls, classified
  reads/writes, column mapping sidecars, file/config evidence, and bounded
  runtime baselines.
- SSRS uses ReportServer catalog entries, RDL datasets/parameters, shared
  datasource bindings, execution history, subscriptions, and backend SQL
  dependencies.

The generated markdown cache is the local staging layer for human support docs.
It must be refreshed before DevOps or Confluence publish. The DevOps runtime
package and catalog repo are the machine-readable publication layer.
Confluence is the human navigation layer.

Support documentation refreshes must follow the delta-first publication rule in
ADR-028. ADF, SSIS, and SSRS documentation generators may read broad metadata
inputs when needed to maintain context, but AI-written summaries, generated page
updates, DevOps writes, Rovo updates, and Confluence dry-runs/live publishes
must be limited to new or changed assets and directly impacted index pages.

## Consequences

- Support readers get one mental model across ADF, SSIS, and SSRS.
- ADF support pages explain orchestration, schedules, child pipelines, source
  and target datasets, and failure impact rather than only listing metadata.
- SSRS pages explain the report's business question, likely audience, usage,
  parameters, and backend dependencies in the same style as SSIS/ADF pages.
- Broad refreshes can be executed by a balanced Codex model at normal speed
  with medium thinking when the refresh packet is filled in and dry-run checks
  pass.
- Full live publish remains approval-required because it writes to DevOps and
  Confluence.

## Implementation Rules

- Use `docs/SUPPORT_DOCUMENTATION_DATASET_CONTRACT.md` before changing ADF,
  SSIS, or SSRS support page generators.
- Use `docs/CODEX_SUPPORT_DOCUMENTATION_REFRESH_PACKET.md` before any full or
  broad refresh of ADF, SSIS, or SSRS support documentation.
- Do not publish to Confluence or DevOps without a reviewed dry run and explicit
  user approval for the live write.
- Do not refresh or replace the `Sonic Data Lineage` Confluence human catalog as
  part of this support-documentation refresh.
- Do not move SSIS and SSRS support pages under the Sonic Data Lineage root.
- ADF support documentation must create or use a separate ADF support section in
  Confluence.
- ADF support pages must identify root/orchestrator pipelines separately from
  child pipelines. For `adf-dw-marketing-prod`, `pl_Marketing_AWS_Export` is
  the current root orchestrator.
- Multi-factory ADF documentation refreshes must identify the connector id,
  factory name, resource group, active-trigger count, legacy status, and
  ingestion/profile artifact used for each factory.
- Newly registered ADF connectors must be ingested and documented through
  bounded work packets in `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`; do not
  start that ingestion while another source ingestion is already running.
- After source metadata has a baseline, support-documentation refreshes must
  consume the delta manifest and skip unchanged pages by default.
- A full support-doc tree regeneration requires a scoped full-refresh packet,
  dry-run counts, and explicit approval before live DevOps or Confluence writes.
- SSIS folder and package navigation must continue to follow
  `docs/adr/ADR-006-SSIS-Native-Hierarchy-And-Classified-Lineage.md`.
- SSRS pages must not use generated title prefixes such as `AUTO`; page titles
  should be the clean report or folder name.
- LLM-generated prose must be based on a bounded evidence packet. If evidence
  does not surface a fact, write `not surfaced in metadata` instead of guessing.
- Raw data values, secrets, tokens, linked-service secret details, connection
  passwords, and unrestricted activity output must not be published.
- Manual edits to generated markdown are temporary only; durable changes belong
  in generators, templates, contracts, or skills.

## Medium-Intelligence Work Packet

A medium-intelligence Codex run may perform the refresh when the packet in
`docs/CODEX_SUPPORT_DOCUMENTATION_REFRESH_PACKET.md` is complete and the work is
limited to:

1. refreshing sanitized metadata inputs;
2. producing or consuming a delta manifest;
3. rebuilding local markdown support caches only for changed support assets and
   directly impacted folder/index pages;
4. exporting generated support docs to the DevOps catalog repo for the delta
   scope;
5. rebuilding and validating the runtime package;
6. dry-running Confluence changes for the affected page set;
7. publishing only after explicit user approval and only for the reviewed
   ADF/SSIS/SSRS support page trees.

Stop and request stronger review before changing auth, secrets, connector
permissions, parser/extractor internals, semantic lineage scoring, full Sonic
Data Lineage Confluence IA, or production ADF trigger behavior.

## Related Documents

- `docs/SUPPORT_DOCUMENTATION_DATASET_CONTRACT.md`
- `docs/CODEX_SUPPORT_DOCUMENTATION_REFRESH_PACKET.md`
- `docs/adr/ADR-006-SSIS-Native-Hierarchy-And-Classified-Lineage.md`
- `docs/adr/ADR-010-ADF-Operations-Through-Saved-Connector.md`
- `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md`
- `docs/CONNECTOR_METADATA_PROFILE_FRAMEWORK.md`
- `docs/CONNECTOR_EXTRACTION_FRAMEWORK.md`
- `docs/ADF_PRODUCTION_FACTORY_ACCESS_INVENTORY.md`
- `docs/ADF_LEGACY_FACTORY_INVENTORY.md`
- `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`
- `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
