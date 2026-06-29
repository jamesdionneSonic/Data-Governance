# ADR-027: Multi-Factory ADF Ingestion And Documentation Backlog

## Status

Accepted - completed

## Date

2026-06-26

## Context

The production subscription
`bee9b611-da99-4cfc-9fb7-50f1359e5ca2` contains multiple Azure Data Factory
instances that the current delegated Azure CLI identity can read. VDM and SAEDP
factories were intentionally excluded from the current scope. The original
saved ADF connector covered only `adf-dw-marketing-prod`.

The team needed the new readable ADF factories ingested into the data governance
framework, lineage extracted for all supported ADF objects where deterministic
edges were surfaced, and human support documentation produced.

## Decision

Register the readable production ADF factories as permanent saved connectors and
complete the approved ADF multi-factory work packages through metadata
ingestion, lineage edge review, support documentation, DevOps catalog export,
runtime package publication, and Confluence publication.

The durable registration command is:

```powershell
node scripts/register-production-adf-connectors.mjs
```

The in-scope newly registered ADF connectors are:

| Connector id                                 | Factory                   | Status                                  |
| -------------------------------------------- | ------------------------- | --------------------------------------- |
| `azure-data-factory-adf-admin-d1`            | `adf-Admin-D1`            | readable; no pipelines found            |
| `azure-data-factory-adf-dw-caroffer-prod`    | `adf-dw-caroffer-prod`    | readable; no pipelines found            |
| `azure-data-factory-adf-dw-lightspeed-prod`  | `adf-dw-lightspeed-prod`  | readable; no pipelines found            |
| `azure-data-factory-adf-dw-postgres-prod`    | `adf-dw-postgres-prod`    | inventory-only; no usable lineage edges |
| `azure-data-factory-adf-elead-d1`            | `adf-eLead-D1`            | readable; active triggers               |
| `azure-data-factory-adf-facebookads-d1`      | `adf-FacebookAds-D1`      | readable; active triggers               |
| `azure-data-factory-adf-ganalytics-d1`       | `adf-GAnalytics-D1`       | readable; active triggers               |
| `azure-data-factory-adf-googlesearch-d1`     | `adf-GoogleSearch-D1`     | readable; legacy                        |
| `azure-data-factory-adf-inbounddataetl-prod` | `ADF-InboundDataETL-Prod` | readable; active triggers               |
| `azure-data-factory-adf-mci-d1`              | `adf-MCI-D1`              | readable; active triggers               |
| `azure-data-factory-adf-pricefx-d1`          | `adf-PriceFx-D1`          | readable; active triggers               |
| `azure-data-factory-adf-reconpro-d1`         | `adf-ReconPro-D1`         | readable; active triggers               |
| `azure-data-factory-adf-reputationmgmt-d1`   | `adf-ReputationMgmt-D1`   | readable; active triggers               |
| `azure-data-factory-adf-vehiclemart-prod`    | `ADF-VehicleMart-Prod`    | readable; no active triggers            |
| `azure-data-factory-adf-xtime-d1`            | `adf-XTime-D1`            | readable; legacy                        |

The original connector `azure-data-factory-adf-dw-marketing-prod` remains the
known marketing ADF baseline and is not counted as newly registered work.

The source-agnostic delta-first workflow in ADR-028 is queued after this
completed ADF multi-factory backlog. The next architecture backlog must
implement the reusable metadata delta engine so future connector captures,
including later ADF refreshes, can update only new or changed metadata, AI
summaries, DevOps artifacts, Rovo shards, and Confluence pages.

Publication results:

- Confluence root page id: `2322792450`
- Confluence page count: 403
- Runtime package: `sonic-data-lineage-runtime` version `2026.6.29-1`
- Runtime content hash:
  `1a06a3fd1e33fa0c40811eb875a5c3ddc77c8c7a64ad3b38f2db6d980dcfda78`
- App repo commit: `25eeab402`
- Machine-readable lineage repo commit: `e4cfaeb1e2`

## Consequences

- The framework can recreate all saved ADF connectors without committing ignored
  runtime state under `data/`.
- The approved ingestion and publication work is complete.
- Active-trigger factories are treated as production-operational and require
  careful bounded ingestion/readback. This decision does not authorize trigger
  or pipeline execution.
- Legacy factories are included for documentation and migration analysis, not
  as target-state architecture.
- `azure-data-factory-adf-dw-postgres-prod` is intentionally not advanced for
  lineage because it surfaced one pipeline and zero deterministic lineage edges.
  It remains inventory/support documentation only.

## Implementation Rules

- Follow `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md` before running any ADF
  ingestion work packet.
- Run one connector or one small connector batch at a time.
- Start with zero-pipeline and legacy factories before active-trigger factories
  if the goal is to validate tooling with the lowest operational risk.
- Use the shared connector runtime only. Do not create an alternate ADF
  extraction engine or ad-hoc metadata cache path.
- Do not start ADF pipelines, modify triggers, change schedules, rotate
  credentials, or alter linked services as part of ingestion.
- Do not publish raw activity output, linked-service secret details, connection
  strings with credentials, tokens, or unrestricted business data.
- DevOps and Confluence publication require dry-run review and explicit user
  approval. That approval was granted and the ADF publication was completed.
- After the post-ADF delta-first workflow is implemented, future ADF refreshes
  must consume the delta manifest and must not regenerate unchanged support
  pages, Rovo artifacts, runtime package object content, or Confluence pages.

## Related Documents

- `docs/ADF_PRODUCTION_FACTORY_ACCESS_INVENTORY.md`
- `docs/ADF_LEGACY_FACTORY_INVENTORY.md`
- `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`
- `docs/ADF_PIPELINE_OPERATIONS.md`
- `docs/CODEX_SUPPORT_DOCUMENTATION_REFRESH_PACKET.md`
- `docs/SOURCE_METADATA_DELTA_BACKLOG.md`
- `docs/SOURCE_METADATA_DELTA_WORK_PACKAGES.md`
- `docs/adr/ADR-010-ADF-Operations-Through-Saved-Connector.md`
- `docs/adr/ADR-011-Unified-Support-Documentation-Refresh-Contract.md`
- `docs/adr/ADR-020-Source-Agnostic-Incremental-Lineage-Ingestion.md`
- `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
