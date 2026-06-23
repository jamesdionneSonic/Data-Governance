# Codex Full Database Catalog Deployment Packet

Use this packet when planning, dry-running, publishing, or validating the full
human Database Catalog deployment under `Sonic Data Lineage`.

This packet is for the catalog-wide rollout across every included database. For
small pilot work, use `docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md`.

## Required Reading

Before starting a full deployment packet, read:

1. `AI_README.md`
2. `AGENTS.md`
3. `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
4. `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
5. `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
6. `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
7. `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
8. `docs/adr/ADR-021-Platform-Grouped-Database-Catalog.md`
9. `docs/adr/ADR-022-Complete-Tier2-Object-Pages-And-Schema-Hyperlinks.md`
10. `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
11. `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md`
12. `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
13. `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
14. `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_BACKLOG.md`
15. `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_WORK_PACKETS.md`
16. `docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_BACKLOG.md`
17. `docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_WORK_PACKETS.md`

## Goal

Deploy the final human Database Catalog pattern across all included cataloged
databases:

```text
Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>
```

The deployment must make the catalog complete enough for humans to browse and
for Rovo retrieval artifacts to link to stable canonical pages.

## Non-Goals

This packet does not authorize:

- live cleanup, archive, delete, or move;
- SSIS or SSRS support-documentation refresh;
- publishing SSIS package/catalog artifacts from `ssisdb` as Database Catalog
  pages;
- changing ingestion, parser, extractor, or lineage scoring behavior;
- exposing raw rows, secrets, credentials, or connection strings;
- owner/steward inference;
- lifecycle/status or live freshness inference;
- treating Confluence as a live monitoring system.

## Required Scope Controls

Every run must declare:

| Field                    | Required Value                                                        |
| ------------------------ | --------------------------------------------------------------------- |
| `catalog_scope`          | all included databases, one database, or named database batch         |
| `deployment_tier`        | Tier 1, Tier 2, Tier 3, or Tier 4 cleanup report                      |
| `source_catalog_version` | manifest/version/hash used for input                                  |
| `blocked_schema_rules`   | file and rule version applied                                         |
| `publish_mode`           | dry-run, reviewed publish packet, live publish, or post-publish check |
| `cleanup_mode`           | report-only unless separately approved                                |
| `rovo_mode`              | none, dry-run, publish packet, or live publish                        |

## Canonical Tree

Use:

```text
Sonic Data Lineage
  Database Catalog
    <Platform/Product>
      <Database>
        <Schema>
          <Object>
```

Do not publish new pages under:

```text
Database Catalog / <Database> / Schema - <Database>.<Schema>
High-Value Assets / <Object>
```

## Deployment Tiers

### Tier 1: All Database And Schema Indexes

Purpose: make every included database and object discoverable.

Deliver:

- database pages for every included database;
- schema pages for every included schema;
- complete object rows grouped by type;
- page counts and inventory reconciliation;
- duplicate/superseded-page report.

### Tier 2: Thin Canonical Object Pages

Purpose: provide stable object destinations without requiring rich prose for
everything.

Deliver:

- canonical object pages for the selected database/batch;
- link refreshes for schema/database rows that reference generated or already
  published canonical object pages;
- identity, type, tags, aliases, columns, lineage counts, profile signals,
  confidence, backlinks, related pages, and missing facts;
- no invented owner, status, SLA, or live freshness.

### Tier 3: Rich Priority Object Pages

Purpose: improve high-priority objects for support and business readability.

Deliver:

- bounded plain-English purpose;
- business meaning and support impact;
- column summary;
- lineage summary;
- support checks;
- richer related navigation.

Rich pages are generated first for requested, high-use, profiled,
support-critical, product-critical, or reviewed objects.

### Tier 4: Cleanup Report And Approved Cleanup

Purpose: remove old navigation after replacements are verified.

Deliver report-only first:

- old page title;
- old page id when surfaced;
- canonical replacement path;
- replacement status;
- comments/attachments/manual-edit risk when surfaced;
- recommended action.

Live cleanup needs explicit approval after review.

## Evidence Packet Requirements

A full deployment run must write a deployment manifest with:

```json
{
  "run_id": "",
  "generated_at": "",
  "source_catalog_version": "",
  "scope": "",
  "deployment_tier": "",
  "database_count": 0,
  "schema_count": 0,
  "object_count": 0,
  "blocked_schema_count": 0,
  "page_counts": {
    "create": 0,
    "update": 0,
    "unchanged": 0,
    "cleanup_candidates": 0
  },
  "validation": {
    "status": "",
    "failures": [],
    "warnings": []
  }
}
```

Each database, schema, and object page must also carry the evidence fields
defined in `docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md`.

## Validation Gates

Dry-run validation fails when:

- any included database is missing from Tier 1 output;
- any included schema is omitted without a blocked-schema rule;
- SSIS package/catalog artifacts from `ssisdb` appear under Database Catalog
  instead of SSIS support documentation;
- a schema page title uses `Schema - <Database>.<Schema>`;
- a schema page omits cataloged objects from its complete inventory;
- object pages are generated outside the canonical database/schema path;
- high-value appears as a separate object hierarchy instead of a tag;
- page counts do not reconcile to the deployment manifest;
- unsupported owner, status, SLA, live freshness, or certification is inferred;
- duplicate/superseded pages are not reported;
- secrets, credentials, connection strings, raw rows, or sample values are
  included.

Post-publish validation must check:

- expected page count;
- required labels;
- canonical parent/child paths;
- required snippets/sections;
- no old schema pages were updated as if they were canonical schema nodes;
- cleanup candidates remain report-only unless cleanup was explicitly approved.

## Approval Gates

Use these approvals:

1. dry-run approval for each deployment tier and database batch;
2. live publish approval for reviewed page creates/updates;
3. post-publish verification review;
4. separate cleanup approval for archive/delete/move.

Do not combine steps 2 and 4.

## Recommended Command Shape

Use the repo's npm wrappers when they exist. Until final wrappers exist, use
packet-specific scripts only after confirming scope:

```powershell
npm run confluence:human:dry-run
npm run confluence:human:check
npm run confluence:human:publish
npm run confluence:human:published:check
```

Do not run live publish or cleanup commands from this packet without explicit
user approval.
