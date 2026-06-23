# Codex Database Catalog Tier 2 Object Coverage Packet

Use this packet when creating, refreshing, linking, publishing, or validating
Tier 2 thin object pages for the human Confluence Database Catalog.

This packet exists because the first Tier 2 implementation was a small
`Sonic_DW.dbo` pilot. The standard is now complete Tier 2 object coverage under
the platform-grouped tree.

## Required Reading

Before starting a Tier 2 object coverage packet, read:

1. `AI_README.md`
2. `AGENTS.md`
3. `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
4. `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
5. `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
6. `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
7. `docs/adr/ADR-021-Platform-Grouped-Database-Catalog.md`
8. `docs/adr/ADR-022-Complete-Tier2-Object-Pages-And-Schema-Hyperlinks.md`
9. `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
10. `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
11. `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
12. `docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_BACKLOG.md`
13. `docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_WORK_PACKETS.md`

## Goal

Create a complete, navigable Tier 2 object-detail layer:

```text
Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>
```

Every object listed on a schema page should eventually click through to a
canonical object page. Partial batches are allowed, but they must not pretend
that a top-25 pilot equals complete coverage.

## Non-Goals

This packet does not authorize:

- live Confluence publish without explicit user approval;
- cleanup, archive, delete, or move;
- full rich Tier 3 prose generation for every object;
- changing ingestion, parser, extractor, or lineage scoring behavior;
- publishing Rovo retrieval artifacts as human object pages;
- exposing secrets, credentials, connection strings, raw rows, or sample values;
- owner/steward, lifecycle/status, SLA, certification, or live freshness
  inference.

## Required Scope Declaration

Every packet must declare:

| Field                    | Required Value                                                     |
| ------------------------ | ------------------------------------------------------------------ |
| `platform_product`       | `SQL Server`, `Snowflake`, or another approved platform/product    |
| `database_scope`         | one database, one schema, or a named manifest batch                |
| `schema_scope`           | one schema, all schemas in database, or explicit list              |
| `object_scope`           | all publishable objects, object type, tag filter, or named objects |
| `source_catalog_version` | manifest/hash/input version                                        |
| `blocked_schema_rules`   | applied rule file and version                                      |
| `publish_mode`           | dry-run, reviewed publish packet, live publish, or readback        |
| `link_mode`              | no links, planned links, same-packet links, or live-known links    |
| `cleanup_mode`           | report-only unless separately approved                             |

## Evidence Packet Requirements

Each object evidence packet must include:

```json
{
  "page_type": "object",
  "page_generation_level": "thin",
  "platform_product": "",
  "object": {
    "object_id": "",
    "server": "",
    "database": "",
    "schema": "",
    "name": "",
    "type": "",
    "canonical_page_path": "",
    "devops_artifact_path": ""
  },
  "linking": {
    "canonical_page_exists": false,
    "planned_in_packet": true,
    "link_status": "pending",
    "source_rows_to_refresh": []
  },
  "aliases": [],
  "tags": [],
  "tag_reasons": [],
  "lineage": {
    "upstream": [],
    "downstream": [],
    "orchestrators": [],
    "reports": []
  },
  "columns": [],
  "profile_signals": {},
  "confidence": {},
  "not_surfaced_facts": []
}
```

## Page Requirements

Thin Tier 2 pages must include:

1. `Plain-English Summary`
2. `At A Glance`
3. `Aliases`
4. `Column Summary`
5. `Lineage Summary`
6. `Profile And Quality Signals`
7. `Related Pages`
8. `Known Gaps`
9. `Technical Evidence`

Thin pages may use concise generated prose. Do not invent business meaning just
to make the page feel rich.

## Link Requirements

When a Tier 2 object page is generated or confirmed live, refresh every in-scope
schema/database row that references that object so the object name links to the
canonical human page.

Link from:

- database `Most Used Objects`;
- schema `Most Used Objects`;
- schema `Tables`;
- schema `Views`;
- schema `Procedures`;
- schema `Other Objects`;
- `Objects With Profile Data`;
- `Objects Needing Review`;
- Rovo locator/context artifacts only when the packet also includes Rovo mode.

Do not link to:

- old flat database paths;
- `Schema - <Database>.<Schema>` pages;
- `High-Value Assets`;
- Rovo pages from the human schema index.

## Validation Checklist

Dry-run validation must answer:

1. How many publishable objects are in scope?
2. How many Tier 2 object pages are generated?
3. Which schema/database rows will become links?
4. Which rows remain pending and why?
5. Are all paths platform-grouped?
6. Are any object names ambiguous by name-only matching?
7. Are unsupported facts kept as `not surfaced in metadata`?
8. Are Rovo artifacts kept separate?

Post-publish validation must answer:

1. Were all approved object pages created or updated?
2. Do the pages live under the approved parent path?
3. Do the schema/database links resolve to human object pages?
4. Do required labels and sections exist?
5. Are old pages untouched unless cleanup was separately approved?

## Approval Gates

1. Dry-run review.
2. Publish packet review.
3. Explicit live publish approval.
4. Post-publish readback.
5. Separate cleanup approval, only if cleanup is requested.

## Medium-Intelligence Handoff Prompt

```text
Start the Tier 2 Database Catalog object coverage work using
docs/CODEX_DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_PACKET.md. Stay in dry-run
mode unless I explicitly approve live publish. Use the platform-grouped path
Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>.
Create or refresh thin object pages for the selected scope and refresh schema
or summary rows so object names link to canonical object pages. Do not cleanup,
archive, move, delete, infer unsupported governance facts, or publish Rovo
artifacts as human pages.
```
