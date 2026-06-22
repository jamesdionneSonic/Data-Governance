# ADR-016: Full Database Catalog Deployment And Cleanup

## Status

Accepted

## Date

2026-06-19

## Context

The first reviewed human catalog pilot proved the target page pattern for one
slice:

```text
Sonic Data Lineage
  Database Catalog
    Sonic_DW
      dbo
        <Object page>
```

That pilot also made an important navigation issue visible. Older generated
schema pages such as `Schema - Sonic_DW.dbo`, `Schema - Sonic_DW.dq`, and
similar pages can remain beside the new canonical `dbo` schema node. This makes
the catalog look duplicated and makes users wonder where the table pages are.

The full deployment must not be interpreted as a `Sonic_DW`-only rollout. Sonic
has multiple cataloged databases. Users need one consistent way to browse every
cataloged database, schema, and object.

## Decision

The full Database Catalog deployment will apply the same canonical tree to every
cataloged database that is in scope for the human catalog:

```text
Sonic Data Lineage
  Database Catalog
    <Database>
      <Schema>
        <Table, view, procedure, function, synonym, or supported object>
```

Examples:

```text
Database Catalog / Sonic_DW / dbo / Dim_Vehicle
Database Catalog / Sonic_DW / dq / vw_Fact_DQValidation
Database Catalog / BI_WorkDB / dbo / <Object>
Database Catalog / CBS / dbo / <Object>
Database Catalog / VendorData / dbo / <Object>
```

The full deployment must:

- discover all cataloged databases from the deterministic catalog, not from a
  hard-coded `Sonic_DW` list;
- apply blocked-schema rules from `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md`;
- exclude SSIS package/catalog artifacts from `ssisdb` from the Database
  Catalog tree because those packages are documented in the SSIS support
  documentation tree;
- create or update database pages for every included database;
- create or update clean schema pages titled only by schema name under each
  database page;
- expose every cataloged object on its schema page;
- create canonical object pages under the database/schema path according to the
  deployment tier for that run;
- keep `high-value`, `high-use`, `profiled`, `product-critical`,
  `support-critical`, `review-needed`, and `lineage-hotspot` as tags rather
  than separate object homes;
- report noncanonical pages, including `Schema - <Database>.<Schema>` pages, as
  cleanup candidates after replacement pages are verified.

## Deployment Tiers

The rollout will use tiers so the catalog can become complete without forcing a
rich prose page for every object on day one.

| Tier   | Output                                     | Purpose                                                                                                                                |
| ------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Tier 1 | Database pages and complete schema indexes | Make every included database and object discoverable.                                                                                  |
| Tier 2 | Thin canonical object pages                | Give every promoted object a stable page with identity, columns, lineage counts, tags, confidence, links, and missing facts.           |
| Tier 3 | Rich canonical object pages                | Add bounded plain-English purpose, business impact, column summary, lineage explanation, and support checks for high-priority objects. |
| Tier 4 | Cleanup and archive                        | Remove or archive superseded pages only after replacement pages pass review.                                                           |

Tier 1 must cover every included database before the catalog is considered
navigationally complete. Tier 2 and Tier 3 may be rolled out by database,
schema, tag, or priority object group.

## Cleanup Policy

Cleanup is not part of page generation.

The generator and dry-run packet must report:

- old schema pages such as `Schema - Sonic_DW.dbo`;
- old high-value object pages or other noncanonical object homes;
- canonical replacement path;
- whether the replacement page exists in the dry run;
- whether the old page appears to have comments, attachments, or manual edits
  when that metadata is available;
- recommended action: keep temporarily, archive candidate, delete candidate, or
  manual review.

Live cleanup requires explicit approval after the replacement deployment is
verified. A broad publish approval is not cleanup approval.

## Confluence Page Rules

Database page titles are database names.

Schema page titles are schema names under the database page. The full database
and schema identity belongs inside the page body.

Object page titles are object names unless a sibling collision requires a short
qualifier.

The publisher must treat these as noncanonical under a database page:

- `Schema - <Database>.<Schema>`;
- `Schema Catalog - <Database>.<Schema>`;
- `High-Value Object - <QualifiedObject>`;
- any object page under a top-level `High-Value Assets` branch.

## AI And LLM Rules

Deterministic code must decide:

- database inventory;
- schema inventory;
- object inventory;
- page paths;
- object counts;
- aliases;
- tags;
- confidence fields;
- lineage relationships;
- duplicate and cleanup candidates.

LLM use is allowed only for bounded prose from evidence packets. It must not
invent owners, stewards, SLAs, lifecycle/status, live freshness, certification,
or business meaning not surfaced in metadata.

## Medium-Intelligence Work Contract

A balanced Codex session at normal speed with medium thinking may work on this
deployment when the work packet is bounded to:

- one deployment tier;
- one database or a small database batch;
- dry-run generation and validation;
- publish-packet preparation;
- post-publish verification for an explicitly approved batch;
- cleanup reporting without live cleanup.

Stop and request stronger review or explicit approval before:

- full-catalog live publish;
- live cleanup, archive, delete, or move;
- broad rich-prose generation across every object;
- ingestion, parser, extractor, or lineage scoring changes;
- changing Confluence root pages or permission behavior;
- using unrestricted LLM prompts.

## Consequences

- Users get one consistent browse pattern across all cataloged databases.
- The old `Schema - ...` pages are treated as temporary superseded pages, not
  as the final design.
- Full coverage can be achieved in tiers without blocking on rich prose for
  every object.
- Cleanup becomes safe because it is evidence-backed and reviewed separately.
- Rovo retrieval artifacts can rely on stable canonical human page links.
- SSIS packages remain findable in SSIS support documentation instead of being
  mixed into the database browse hierarchy as pseudo-schema objects.

## Related Documents

- `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
- `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
- `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
- `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
- `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md`
- `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
- `docs/CODEX_FULL_DATABASE_CATALOG_DEPLOYMENT_PACKET.md`
- `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_BACKLOG.md`
- `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_WORK_PACKETS.md`
