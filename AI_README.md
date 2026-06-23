# AI Maintainer Readme

This repository is the maintainer-only Data Governance app. Future Codex runs
should use the lowest safe intelligence setting, but must upgrade or stop when a
task crosses a production, auth, publishing, or broad architecture boundary.

## Medium-Safe ADF Operations

Use `.agents/skills/adf-operations/SKILL.md` when asked to inspect, queue,
trigger, monitor, or summarize Azure Data Factory pipelines.

For `adf-dw-marketing-prod`, ADF operations must follow:

1. `docs/adr/ADR-010-ADF-Operations-Through-Saved-Connector.md`
2. `docs/ADF_PIPELINE_OPERATIONS.md`
3. `docs/CODEX_ADF_OPERATION_PACKET.md` for repeated or multi-pipeline work

Medium-safe means:

- use the saved connector as source of truth;
- list live pipelines before choosing a pipeline;
- start only one pipeline at a time;
- capture run id and first status check;
- stop on ambiguity, missing parameters, failures, cancellation, auth mismatch,
  or requests for broad parallel execution;
- do not expose secrets, linked-service connection strings, raw activity output,
  or unrestricted business data.

The current saved ADF connector is
`azure-data-factory-adf-dw-marketing-prod`.

## Shared Runtime Rule

Do not create alternate source-specific engines for metadata harvest. Extend the
shared connector runtime instead. See:

- `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`
- `docs/CONNECTOR_EXTRACTION_FRAMEWORK.md`
- `docs/CONNECTOR_METADATA_PROFILE_FRAMEWORK.md`

## Engine Foldering Rule

Batch documentation, catalog, connector, and lineage-runtime engines belong
under the ADR-012 `engines/` architecture. The current `scripts/` folder may
still contain legacy implementations and command wrappers, but new large engine
logic should move toward:

- `engines/catalog`
- `engines/lineage-runtime`
- `engines/confluence-human-catalog`
- `engines/support-docs`
- `engines/connectors`
- `engines/governance`

Use these documents before moving or creating engine code:

1. `docs/adr/ADR-012-Separate-Documentation-Engines-From-App-Runtime.md`
2. `docs/ENGINE_FOLDERING_CONTRACT.md`
3. `docs/CODEX_ENGINE_FOLDERING_MIGRATION_PACKET.md`

Keep npm command names stable during migration. `scripts/` should become thin
wrappers around engine modules, while `src/` remains the app/API/UI runtime.

## Human Database Catalog Rule

Database Catalog pages under `Sonic Data Lineage` must follow the complete
object-library strategy:

- the catalog groups by platform/product first, then database, schema, and
  object;
- database pages summarize schemas;
- schema pages list every cataloged object in grouped sections;
- canonical object pages live under their database/schema path;
- every publishable object must eventually have a thin Tier 2 object page;
- schema/database object rows must hyperlink to canonical object pages when the
  object page exists or is included in the same reviewed publish packet;
- tags such as `high-value`, `high-use`, `profiled`, `product-critical`,
  `support-critical`, `review-needed`, and `lineage-hotspot` identify priority
  and support context.

Use short canonical Confluence tree titles:

```text
Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicle
```

Do not create duplicate schema pages such as
`Database Catalog / Sonic_DW / Schema - Sonic_DW.dbo`.
Do not create a top-level `High-Value Assets` object hierarchy. Use
`high-value` as an object tag.

Use these documents before changing database catalog page shape or generator
behavior:

1. `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
2. `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
3. `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
4. `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
5. `docs/adr/ADR-021-Platform-Grouped-Database-Catalog.md`
6. `docs/adr/ADR-022-Complete-Tier2-Object-Pages-And-Schema-Hyperlinks.md`
7. `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
8. `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
9. `docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md`
10. `docs/CODEX_FULL_DATABASE_CATALOG_DEPLOYMENT_PACKET.md`
11. `docs/CODEX_DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_PACKET.md`
12. `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md`
13. `docs/DATABASE_CATALOG_MEDIUM_BACKLOG.md`
14. `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_BACKLOG.md`
15. `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_WORK_PACKETS.md`
16. `docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_BACKLOG.md`
17. `docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_WORK_PACKETS.md`
18. `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`

Do not infer owner, data steward, lifecycle/status, live freshness, or
certification unless an approved evidence source explicitly surfaces it. Use
page-level confidence, aliases, backlinks, missing-facts sections, and
evidence-backed object tags to keep generated pages honest.

## eLeadDW Low-Intelligence Onboarding Rule

For `eLeadDW` metadata, lineage, Azure DevOps runtime artifacts, Confluence
database catalog pages, or Rovo retrieval artifacts, start with:

1. `docs/CODEX_ELEADDW_LOW_INTELLIGENCE_ONBOARDING_PACKET.md`
2. `docs/ELEADDW_METADATA_LINEAGE_LOW_INTELLIGENCE_BACKLOG.md`

The permanent connector is `sqlserver-l1-dwasql-02-12010-eleaddw`.

Future runs should execute one backlog item at a time with low thinking after
the connector test passes. Stop and ask for stronger review before auth changes,
parser/extractor changes, lineage-scoring changes, live Azure DevOps publish,
live Confluence publish, cleanup/archive/delete/move operations, or any output
that might include secrets, connection strings, raw rows, or sample data.

Full deployment means every included cataloged database, not only `Sonic_DW`.
Use the canonical tree:

```text
Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>
```

Old pages such as `Schema - Sonic_DW.dbo` are superseded cleanup candidates.
Report them during dry run, but do not archive, delete, or move them without a
separate explicit cleanup approval after replacement pages are verified.

## Rovo AI Retrieval Rule

Rovo should be able to answer Sonic lineage questions such as:

```text
Tell me about the database VendorData.
Tell me about the DimVehicle table.
Show me the lineage of the FactOpportunity table.
```

To support that, publish compact Rovo retrieval artifacts under
`Sonic Data Lineage / AI Retrieval Artifacts`, not inside the primary human
catalog tree. The required page families are `Rovo Start Here`,
`Rovo Object Locator`, `Rovo Database Context`, `Rovo Object Summary Context`,
`Rovo Upstream Context`, `Rovo Downstream Context`, `Rovo Column Context`,
`Rovo Profile Context`, `Rovo Ambiguity Context`, and
`Rovo Evaluation Prompts`.

Use these documents before changing Rovo retrieval artifacts:

1. `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
2. `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
3. `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md`
4. `docs/DATABASE_CATALOG_MEDIUM_BACKLOG.md`

Rovo is the retrieval and answer layer, not the lineage engine. Deterministic
code must compute identity, aliases, counts, lineage, confidence, ambiguity,
and page links. LLM use is bounded to concise explanation from evidence
packets.

## Rovo Description Generation Rule

For sustainable new database onboarding, follow ADR-017. Codex must not be used
as the LLM author for catalog descriptions in the Rovo-assisted workflow.
Codex may build the deterministic engines, evidence packets, confidence scoring,
validators, importers, publish packets, and readbacks.

Rovo may generate plain-English descriptions for strong/medium evidence packets.
Weak evidence uses deterministic direct support language. Human-approved
overrides win over Rovo and template text on every refresh.

Use these documents before implementing this workflow:

1. `docs/adr/ADR-017-Rovo-Assisted-Plain-English-Catalog-Descriptions.md`
2. `docs/ROVO_DESCRIPTION_GENERATION_CONTRACT.md`
3. `docs/CODEX_ROVO_DESCRIPTION_GENERATION_PACKET.md`
4. `docs/ORGANIZATION_DATABASE_ROVO_PILOT_BACKLOG.md`
5. `docs/ORGANIZATION_DATABASE_ROVO_PILOT_WORK_PACKETS.md`

The first pilot scope is `D1-SQL-07A\INST1.Organization`.

## Automated Onboarding Hard Gate

The long-term target is an npm-driven database onboarding command that can run
without Codex orchestration. Follow ADR-018 before building this flow.

Use these documents:

1. `docs/adr/ADR-018-Automated-Npm-Catalog-Onboarding-With-Rovo-Hard-Gate.md`
2. `docs/ROVO_AUTOMATED_ONBOARDING_CONTRACT.md`
3. `docs/CODEX_ROVO_AUTOMATED_ONBOARDING_PACKET.md`
4. `docs/ROVO_AUTOMATED_ONBOARDING_BACKLOG.md`
5. `docs/ROVO_AUTOMATED_ONBOARDING_WORK_PACKETS.md`

Hard stop after `ROVOAUTO-01`: prove whether Rovo can produce structured,
machine-retrievable, validated descriptions from one evidence packet without
Codex acting as the LLM. Do not build the full automated onboarding command
until that readback is reviewed and accepted.

## Medium-Safe Support Documentation Refresh

Use `docs/CODEX_SUPPORT_DOCUMENTATION_REFRESH_PACKET.md` for broad ADF, SSIS,
or SSRS support-documentation refreshes.

Support pages must follow one shared contract:

1. `docs/adr/ADR-011-Unified-Support-Documentation-Refresh-Contract.md`
2. `docs/SUPPORT_DOCUMENTATION_DATASET_CONTRACT.md`

ADF pages must mimic the SSIS support dataset: plain-English purpose, support
impact, source/target or dependency summary, runtime/schedule signal, and
concrete first checks before raw activity or metadata detail. SSRS pages must
use the same shape for report purpose, usage, parameters, backend dependencies,
and review signals.

Medium-safe means:

- refresh local markdown cache before publishing;
- validate DevOps/runtime artifacts before live publication;
- dry-run Confluence changes before live publication;
- keep ADF, SSIS, and SSRS support roots separate from the `Sonic Data Lineage`
  Confluence human catalog;
- do not run `confluence:human:*` commands as part of an ADF/SSIS/SSRS support
  refresh;
- do not publish secrets, raw activity output, unrestricted SSISDB messages, or
  report result rows.

## Upgrade Triggers

Stop and request stronger review before:

- changing auth, permissions, secrets, service principals, or managed identity;
- changing production trigger behavior, retry behavior, scheduling, or parallel
  execution;
- publishing to Confluence, Azure Artifacts, DevOps, or external systems without
  an approved packet;
- refreshing or replacing broad ADF, SSIS, or SSRS support documentation without
  `docs/CODEX_SUPPORT_DOCUMENTATION_REFRESH_PACKET.md`;
- touching the `Sonic Data Lineage` Confluence human catalog during an
  ADF/SSIS/SSRS support-documentation refresh;
- modifying ingestion engines, parser/extractor/generator code, or catalog
  rebuild scripts;
- broad Rovo retrieval artifact redesign or live publish without
  `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md`;
- running broad live operations where the user has not explicitly selected the
  next item.
