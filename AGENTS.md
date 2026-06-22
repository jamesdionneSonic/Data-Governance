# Data Governance Codex Guidance

## Team Lineage Consumer Kit

Do not give teammates the full Data Governance app repository when their role is
lineage consumption, read-only evidence review, or rule recommendation.

The team-facing Codex skill and consumer workflow belong in the separate Azure
DevOps repository:

`https://dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-lineage-consumer-kit`

When the user asks to update the teammate Codex skill, training guide, consumer
contract, raw evidence access rules, runtime readback process, or recommendation
intake workflow, update the consumer-kit repository first. Only update this app
repo when the change affects ingestion engines, parser/extractor/generator code,
runtime package publishing, app UI/API behavior, or maintainer governance.

The Data Governance app repo remains maintainer-only for ingestion engines,
extractors, parsers, generators, rebuild scripts, UI, API, and tests.

Teammate-facing repositories must not expose:

- ingestion engine code
- parser or extractor code
- generator code
- catalog rebuild scripts
- secrets, credentials, connection strings, or raw row/sample data

See `docs/adr/ADR-008-Separate-Lineage-Consumer-Kit-Repo.md` and
`docs/SONIC_LINEAGE_CONSUMER_KIT_REPO.md` before changing the consumer workflow.

## SSIS Runtime Baseline Documentation

SSIS support-documentation enhancements that add runtime baseline context should
follow `docs/adr/ADR-006-SSIS-Native-Hierarchy-And-Classified-Lineage.md` and
`docs/CODEX_LINEAGE_EXECUTION_PACKET_TEMPLATE.md`.

Keep this work medium-safe by limiting runtime evidence to top-most workflow
package pages, using a bounded lookback window, redacting sensitive values, and
publishing only compact support signals such as last success, last failure,
typical successful runtime, recent failure count, latest meaningful error, and
meaningful row-count samples when SSISDB captured them. Do not add broad runtime
sections to every child package page or publish raw SSISDB event-message dumps.

## Human Confluence Lineage Documentation

Human-facing Confluence lineage work should follow
`docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md` and
`docs/CONFLUENCE_LINEAGE_REPOSITORY.md`.

Database Catalog work should also follow
`docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`,
`docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`,
`docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`,
`docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`, and
`docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md`.

Rovo AI retrieval artifact work should follow
`docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md` and
`docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md`.

Keep the boundary clear:

- Confluence is the human documentation and navigation layer.
- Azure DevOps lineage artifacts and runtime packages remain the
  machine-readable source for the Sonic lineage skill.
- Product, database, schema, and canonical object pages should lead with
  plain-English business meaning, support impact, lineage summary, and concrete
  support checks.
- Database schema pages are complete object-library indexes. They should expose
  every cataloged object in grouped sections, while object tags identify
  high-value, high-use, profiled, product-critical, support-critical,
  review-needed, lineage-hotspot, or requested objects.
- Use canonical short Confluence tree titles such as
  `Database Catalog / Sonic_DW / dbo`. Do not generate duplicate schema pages
  such as `Schema - Sonic_DW.dbo` under the database page.
- Do not create a top-level `High-Value Assets` object hierarchy. Use
  `high-value` as an object tag on canonical object pages and schema rows.
- Do not infer owner, data steward, lifecycle/status, live freshness, or
  certification from weak metadata. Mark unsupported facts as not surfaced in
  metadata.
- Canonical object pages should include page-level confidence, aliases,
  backlinks, and missing-facts sections before they become rich support pages.
- AI retrieval artifacts such as object locators, quick context pages, and
  catalog shards should remain separated from the primary human navigation tree.
- Rovo retrieval artifacts should be compact, table-first pages under
  `AI Retrieval Artifacts` so Rovo can answer database, object, and lineage
  questions such as `VendorData`, `DimVehicle`, and `FactOpportunity` without
  scanning the full human tree.
- Rovo is the retrieval and answer layer, not the lineage engine. Deterministic
  lineage/catalog code must provide identity, aliases, counts, lineage,
  confidence, ambiguity groups, and canonical human-page links.
- LLM-written descriptions must be generated from bounded evidence packets and
  must label missing facts as not surfaced in metadata.

Medium-safe Confluence work should be limited to one page type or one catalog
slice at a time, preferably dry-run first. Broad live publish, full-catalog page
generation, ingestion/parser changes, or unrestricted LLM summarization require
a separate approved execution packet.

## Engine Foldering

Batch documentation, catalog, connector, and lineage-runtime engines should
follow `docs/adr/ADR-012-Separate-Documentation-Engines-From-App-Runtime.md`,
`docs/ENGINE_FOLDERING_CONTRACT.md`, and
`docs/CODEX_ENGINE_FOLDERING_MIGRATION_PACKET.md`.

Keep the boundary clear:

- `src/` is for the app, API, UI, middleware, and runtime services.
- `engines/` is the target home for batch documentation, catalog, connector,
  and lineage-runtime engines.
- `scripts/` is the command surface and should become thin wrappers around
  engine modules.
- Existing npm command names should remain stable during migration.
- Move one engine family at a time and validate with dry-run/check commands.

Do not combine engine folder migration with live Confluence/DevOps publish,
auth changes, parser/extractor changes, semantic-lineage scoring changes, or
broad generated-content redesign in the same pass.

## Unified ADF, SSIS, And SSRS Support Documentation

ADF, SSIS, and SSRS support documentation must follow
`docs/adr/ADR-011-Unified-Support-Documentation-Refresh-Contract.md` and
`docs/SUPPORT_DOCUMENTATION_DATASET_CONTRACT.md`.

Use `docs/CODEX_SUPPORT_DOCUMENTATION_REFRESH_PACKET.md` before broad refreshes
of local markdown cache, DevOps catalog/runtime artifacts, or Confluence support
page trees.

Keep these boundaries clear:

- ADF support pages should mimic the SSIS support dataset: plain-English
  purpose, support impact, source/target or dependency summary, schedule/runtime
  signal, and concrete first checks before raw metadata.
- SSRS support pages should use the same shape for report purpose, usage,
  parameters, backend dependencies, and review status.
- ADF, SSIS, and SSRS support documentation roots are separate from the `Sonic
Data Lineage` Confluence human catalog.
- Do not run `confluence:human:*` commands or refresh the Sonic Data Lineage
  Confluence human catalog as part of an ADF/SSIS/SSRS support refresh.
- Live DevOps or Confluence publication requires a reviewed dry run and explicit
  user approval.
- Do not publish secrets, tokens, raw activity output, unrestricted SSISDB event
  dumps, report result rows, or connection strings with credentials.

## Azure Data Factory Operations

ADF operational work must follow
`docs/adr/ADR-010-ADF-Operations-Through-Saved-Connector.md`,
`docs/ADF_PIPELINE_OPERATIONS.md`, and the repo skill
`.agents/skills/adf-operations/SKILL.md`.

For `adf-dw-marketing-prod`, use saved connector
`azure-data-factory-adf-dw-marketing-prod` as the source of truth. Build a live
pipeline queue, start only one selected pipeline at a time, capture the run id,
poll status at least once, and stop before continuing unless the user explicitly
asks to continue. Do not guess pipeline names from Jira or business wording, do
not run broad parallel triggers, and do not expose tokens, connection strings,
linked-service secret details, or raw activity output.
