# ADR-022: Complete Tier 2 Object Pages And Schema Hyperlinks

## Status

Accepted

## Date

2026-06-23

## Context

The platform-grouped Database Catalog now uses this canonical human tree:

```text
Sonic Data Lineage
  Database Catalog
    <Platform/Product>
      <Database>
        <Schema>
          <Object>
```

Tier 1 database and schema pages make objects discoverable, but the current
Tier 2 implementation only created a small pilot batch of thin object pages:
25 `Sonic_DW.dbo` objects. Other high-use objects, including
`SQL Server / eLeadDW / dbo / dwFullOpportunity`, appear on schema summary
pages without a canonical object page behind the table name.

That creates a broken user expectation. When a user sees an object in a
`Most Used Objects`, `Tables`, `Views`, `Procedures`, or profile/review list,
the object name should be clickable and should resolve to the same canonical
object page under the database/schema branch.

The older eLeadDW pilot artifacts also contain object locator links and schema
rows from a pre-platform-grouped pattern. Those artifacts are evidence that the
object exists, but they are not acceptable as the final Tier 2 page standard.

## Decision

Every publishable cataloged object must have one canonical Tier 2 object page
under the platform-grouped Database Catalog path:

```text
Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>
```

Schema and database summary pages must hyperlink object names to that canonical
object page when the target page is included in the same publish packet or is
known to already exist.

Tier 2 object coverage is broad and thin by default. Rich prose remains a Tier
3 promotion, not a prerequisite for complete object-page coverage.

## Implementation Rules

- Generate Tier 2 object pages for every publishable object after blocked-schema
  rules are applied.
- Use the same canonical path everywhere:
  `Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>`.
- Do not generate object pages under the old flat
  `Database Catalog / <Database> / <Schema> / <Object>` path.
- Do not generate duplicate object homes such as `High-Value Assets` pages.
- Do not treat Rovo AI retrieval artifacts as substitutes for human object
  pages.
- Keep object pages thin unless the object is selected for Tier 3 rich
  promotion.
- Schema page rows and database high-use rows must render linked object names
  when the canonical object page exists or is planned in the approved packet.
- If an object page is not generated in the current packet, the row must retain
  deterministic target metadata so a later packet can relink it without manual
  research.
- Links must be generated from canonical object identity, not display text or
  name-only matching.
- Objects with identical names in different schemas, databases, platforms, or
  servers must not collapse to one link.

## Tier 2 Thin Object Page Requirements

Each Tier 2 page must include:

- canonical identity and aliases;
- platform/product, database, schema, object name, and type;
- deterministic tags and tag reasons;
- column count and column list when surfaced;
- upstream/downstream counts and compact lineage lists;
- profile availability and profile caveats;
- page-level confidence;
- backlinks to platform, database, and schema pages;
- related SSIS, SSRS, ADF, product, or object pages when surfaced;
- technical evidence links;
- `Known Gaps` or `Not Surfaced In Metadata`.

Unsupported facts such as owner, data steward, SLA, lifecycle/status,
certification, and live freshness must remain `not surfaced in metadata` unless
an approved evidence source explicitly provides them.

## Link Rules

Schema and summary tables must use Confluence links for object names when a
canonical page exists or is included in the publish packet.

Recommended display:

```text
<ObjectName>
```

Recommended target:

```text
Database Catalog / <Platform/Product> / <Database> / <Schema> / <ObjectName>
```

The evidence packet must retain:

```json
{
  "object_id": "",
  "canonical_page_path": "",
  "canonical_page_exists": true,
  "planned_in_packet": true,
  "link_status": "linked | pending | blocked"
}
```

Rows with `link_status = pending` are acceptable only in a dry run or in a
partial packet whose scope intentionally excludes the target object page.

## Batch Strategy

Complete Tier 2 coverage may be built and published in controlled batches, but
the backlog target is complete coverage, not a permanently capped top-25 pilot.

Approved batch dimensions:

- one platform/product and database;
- one database/schema;
- one object type within a schema;
- one bounded page-count slice from a manifest;
- one requested high-use object family when urgency requires it.

Each batch must publish:

1. Tier 2 object pages in scope;
2. any needed schema/database link refreshes for rows that now have canonical
   targets;
3. a validation/readback report.

## Validation Gates

Dry-run validation fails when:

- a publishable object in the batch has no Tier 2 page;
- an object page path omits `<Platform/Product>`;
- a schema row links to the wrong platform, database, schema, or object;
- a linked row points to a Rovo artifact instead of a human object page;
- name-only matching creates ambiguity;
- unsupported governance facts are inferred;
- old noncanonical page patterns are updated as if they were current pages.

Post-publish validation must verify:

- object page count;
- object page parent path;
- required sections and labels;
- schema/database links for in-scope objects;
- no stale top-25-only assumption remains in the published batch report.

## Consequences

- Users can drill from a database page to a schema page to any object detail
  page without dead ends.
- High-use tables such as `dwFullOpportunity` become supportable from the human
  catalog instead of only from machine-friendly DevOps/Rovo artifacts.
- Tier 1 pages become navigation indexes, not final detail pages.
- The object-page workload becomes larger, so publish must be batched and
  validated rather than run as an uncontrolled full-catalog push.
- Existing pilot Tier 2 pages may need refresh because their paths, links, or
  evidence packets may predate the platform-grouped objective schema.

## Related Documents

- `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
- `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
- `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
- `docs/adr/ADR-021-Platform-Grouped-Database-Catalog.md`
- `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
- `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
- `docs/CODEX_DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_PACKET.md`
- `docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_BACKLOG.md`
- `docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_WORK_PACKETS.md`
