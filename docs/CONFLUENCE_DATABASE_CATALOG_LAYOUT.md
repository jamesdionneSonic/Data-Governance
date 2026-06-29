# Confluence Database Catalog Layout

This document defines the human-facing `Database Catalog` branch under
`Sonic Data Lineage`.

It implements:

- `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
- `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
- `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
- `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
- `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
- `docs/adr/ADR-021-Platform-Grouped-Database-Catalog.md`
- `docs/adr/ADR-022-Complete-Tier2-Object-Pages-And-Schema-Hyperlinks.md`

## Purpose

The Database Catalog is the place users go when they know a database, schema,
table, view, or procedure name.

The pattern applies to every included cataloged database, not only `Sonic_DW`.
It must group databases by platform/product first, then database, then schema.
This keeps SQL Server and Snowflake catalogs from sharing one flat namespace and
lets every database own multiple schemas.

SSIS package/catalog artifacts from `ssisdb` are excluded from this tree. They
belong in SSIS support documentation, though Database Catalog pages may link to
SSIS pages when a package is meaningful upstream or orchestration evidence for a
real database object.

It must answer two questions:

1. Can I find the object?
2. Once I find it, can I understand its columns, lineage, support impact, and
   evidence?

Confluence is the human navigation layer. Azure DevOps lineage artifacts and
runtime packages remain the machine-readable source of truth.

Rovo AI retrieval artifacts are a third layer. They help Rovo answer database,
object, and lineage questions from compact lookup/context pages, but they must
not replace the human catalog tree or become the authority for lineage facts.

## Canonical Tree

Use short, human-friendly page titles in the tree:

```text
Sonic Data Lineage
  Database Catalog
    <Platform/Product>
      <Database>
        <Database.Schema>
          <Database.Schema Object Type Bucket>
            <Database.Schema.Object>
```

Supported platform/product titles include `SQL Server` and `Snowflake`. The
platform is derived from source metadata such as server, source system, or
connector type; do not infer it from database-name suffixes such as `_SF`.

Do not use generated schema page titles such as:

```text
Schema - Sonic_DW.dbo
```

The full technical identity belongs inside the page:

```text
Full name: Sonic_DW.dbo
```

Because Confluence page titles must be unique across the whole space, schema
and bucket titles are database-qualified even though they sit under a database
page. Use `Sonic_DW.dbo`, not bare `dbo`, and `Sonic_DW.dbo Tables`, not bare
`dbo Tables`.

Examples:

```text
Sonic Data Lineage
  Database Catalog
    SQL Server
      Sonic_DW
        Sonic_DW.dbo
          Sonic_DW.dbo Tables
            Sonic_DW.dbo.DimVehicle
          Sonic_DW.dbo Views
            Sonic_DW.dbo.vwFactFIRESummaryReport
          Sonic_DW.dbo Stored Procedures
            Sonic_DW.dbo.usp_DOC_Booked
      eLeadDW_SF
        eLeadDW_SF.dbo
          eLeadDW_SF.dbo Tables
            eLeadDW_SF.dbo.CustomerMatchLookup
    Snowflake
      HYPERNOVA_SONIC_CUSTACCESS
        PUBLIC
```

## Database Pages

Database pages summarize the database and point users to schemas.

Required sections:

1. `Plain-English Summary`
2. `At A Glance`
3. `Schema Library`
4. `Most Used Objects`
5. `Profile Coverage`
6. `Known Gaps And Confidence`
7. `Related Product Areas`
8. `Technical Evidence`

The `Schema Library` must include every publishable schema after applying the
blocked-schema rules from `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md`.

## Schema Pages

Schema pages are complete object-library indexes.

Required sections:

1. `Plain-English Summary`
2. `At A Glance`
3. `Most Used Objects`
4. `Tables`
5. `Views`
6. `Procedures`
7. `Functions`
8. `Synonyms`
9. `Other Objects`
10. `Objects With Profile Data`
11. `Objects Needing Review`
12. `Known Gaps And Confidence`
13. `Technical Evidence`

The schema page must expose every cataloged object in the schema. It may use
collapsible sections for long lists, but it must not hide total counts or make
users depend on search to discover whether an object exists.

Object rows should include:

| Column     | Required | Notes                                                                                                                            |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Object     | Yes      | Link to the canonical object page under this platform/database/schema when the page exists or is included in the same packet.    |
| Type       | Yes      | Table, view, procedure, function, synonym, or other supported type.                                                              |
| Tags       | Yes      | Evidence-backed signals such as `high-value`, `high-use`, `profiled`, `support-critical`, `review-needed`, or `lineage-hotspot`. |
| Purpose    | Yes      | Specific summary when evidence supports it; otherwise `not surfaced in metadata`.                                                |
| Columns    | Yes      | Count or `not surfaced in metadata`.                                                                                             |
| Upstream   | Yes      | Count or compact role summary.                                                                                                   |
| Downstream | Yes      | Count or compact role summary.                                                                                                   |
| Profile    | Yes      | Available, unavailable, failed, stale, or not surfaced.                                                                          |
| Confidence | Yes      | Confidence label and caveat.                                                                                                     |

## Object Pages

Object pages are canonical pages under their database/schema/type bucket. They
may start as thin pages and become richer as evidence or review priority
increases. Bucket page titles are database/schema-qualified, for example
`Sonic_DW.dbo Tables`, `Sonic_DW.dbo Views`,
`Sonic_DW.dbo Stored Procedures`, `Sonic_DW.dbo Functions`, and
`Sonic_DW.dbo Synonyms`.
Object page titles use the full technical identity
`<Database>.<Schema>.<Object>` to avoid Confluence space-wide title collisions.
The publisher must verify and, when explicitly approved, move pages by their
full parent path. A same-title lookup elsewhere in the Confluence space is not
proof that the page is correctly placed. After publish, a schema page must not
have direct object children; object pages must live under their typed bucket.

Every publishable object should have a Tier 2 thin object page. A top-used or
top-25 pilot batch is not complete coverage. Schema pages may be published
before every object page exists, but rows must retain deterministic
`canonical_page_path` and link status metadata so later Tier 2 packets can
refresh the links without manual research.

Rich generated prose should be added first for objects tagged:

- high-use objects;
- objects with profile data;
- objects used by SSRS, SSIS, or ADF;
- product-critical objects;
- support-critical objects;
- objects requested by users.

Required sections:

1. `Plain-English Summary`
2. `Business Meaning And Impact`
3. `At A Glance`
4. `Column Summary`
5. `Lineage Summary`
6. `Support Checks`
7. `Profile And Quality Signals`
8. `Related Pages`
9. `Technical Evidence`

Object pages must be evidence-first. Plain-English text should explain the
technical evidence; it must not invent missing business facts.

Object pages may be thin or rich.

Thin pages are acceptable for broad canonical coverage. They must include
identity, type, tags, column signals, lineage counts, profile availability,
confidence, evidence links, backlinks, and missing facts.

Rich pages add stronger plain-English purpose, business/support impact, column
summary, readable lineage, support checks, profile/quality signals, and related
navigation. Rich prose should be generated first for tagged or requested
objects.

## Complete Index, Tagged Objects

The strategy is:

```text
Schema pages are complete indexes.
Object pages are canonical destinations.
High-value is a tag, not a place.
```

This avoids two bad outcomes:

- a high-use-only schema page that feels incomplete;
- a full Confluence tree with thousands of rich object pages before quality and
  navigation have been validated.
- a second object hierarchy that makes users wonder whether the schema page or
  the high-value page is the real source of truth.

## Object Tags

Tags are evidence-backed signals attached to object rows and canonical object
pages.

Suggested tags:

| Tag                | Meaning                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `high-value`       | Human-reviewed or business-significant object. Do not assign from dependency count alone.                   |
| `high-use`         | Many downstream consumers surfaced in lineage metadata.                                                     |
| `lineage-hotspot`  | Technically important because many objects depend on it or feed it.                                         |
| `product-critical` | Tied to a named data product such as FIRE, FUEL, DOC, MCI, MDP, or TURBO.                                   |
| `support-critical` | Frequently used in support workflows or known incident paths.                                               |
| `profiled`         | Profile data is available in the published profile index.                                                   |
| `review-needed`    | Generated page has weak evidence, missing business meaning, duplicate naming, or other validation concerns. |

Do not create a top-level `High-Value Assets` section for these tags. Surface
the tags inside database pages, schema pages, product pages, and object pages.

Do not auto-assign `high-value` from dependency count alone. Use `high-use` or
`lineage-hotspot` for technical dependency signals. Reserve `high-value` for
human-reviewed or explicitly business-significant objects.

## Obvious Retired Tables

The human catalog and Rovo retrieval artifacts should not publish obvious
backup, temporary, old, deprecated, delete/drop/remove, retired, scratch, `tmp`,
or `temp` tables as normal browseable business assets. These rows remain in the
machine-readable DevOps lineage/runtime artifacts for evidence and impact
analysis, but they are suppressed from the Confluence human catalog and Rovo
locator/context pages.

The exclusion is table-only and name-based. It is intentionally conservative:
it applies when the table name contains or starts/ends with explicit markers
such as `bak`, `bk`, `bkp`, `backup`, `old`, `obsolete`, `deprecated`, `delete`,
`deleted`, `drop`, `remove`, `retired`, `scratch`, `tmp`, `temp`, or `zzz`.
Suppressed live pages are cleanup/archive candidates and must be removed only
through the approved cleanup script after checking for child pages, attachments,
and comments.

## Evidence Signals, Not Unsupported Status

Generated pages must not pretend Confluence is a live operational monitor.

Do not require or infer:

- live freshness/runtime status;
- business owner or data steward;
- lifecycle/status such as active, stale, deprecated, or do-not-use.

When these facts are absent, write `not surfaced in metadata`. Use evidence
signals such as `Cataloged`, `Has downstream consumers`, `Profiled`,
`Not profiled`, `Review needed`, and `Metadata capture date`.

## Search Aliases

Canonical object pages should include deterministic search aliases:

- fully qualified name;
- database/schema/object name;
- object name;
- underscore-free normalized name;
- common casing variants;
- surfaced product, report, package, or pipeline names.

Aliases must not invent business names.

## Page-Level Confidence And Missing Facts

Object pages must separate lineage confidence from documentation confidence:

- lineage confidence;
- description confidence;
- profile confidence;
- documentation confidence.

Object pages must also include `Not Surfaced In Metadata` or `Known Gaps` when
important facts are missing, especially owner, steward, SLA, live freshness,
lifecycle/status, business definition, source system of record, downstream
business report names, or profile data.

## Backlinks

Every object page must link back to its database and schema page. It should link
to product pages, SSIS/SSRS/ADF pages, upstream loaders, and downstream
consumers when human pages exist.

## Duplicate Handling

The dry run must detect and report likely duplicate pages, especially titles
that differ only by generated prefixes.

Examples:

| Noncanonical                                   | Canonical                                                                                                         |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `Schema - Sonic_DW.dbo`                        | `SQL Server / Sonic_DW / Sonic_DW.dbo`                                                                            |
| `Schema Catalog - Sonic_DW.dbo`                | page heading only, not tree title                                                                                 |
| `High-Value Object - Sonic_DW.dbo.Dim_Vehicle` | `SQL Server / Sonic_DW / Sonic_DW.dbo / Sonic_DW.dbo.Dim_Vehicle` with a `high-value` tag if evidence supports it |

Do not delete or archive duplicate pages during generation. Cleanup requires a
separate explicit approval.

During full deployment, old schema pages such as
`Schema - Sonic_DW.dbo`, `Schema - Sonic_DW.dq`, and equivalent pages for any
other database are superseded cleanup candidates after their clean
`<Platform/Product> / <Database> / <Database.Schema>` replacements are verified. Existing
pages already published under `Database Catalog / <Database> / <Schema>` are
also superseded by the platform-grouped path after review.

## Page Link Rules

Use these link priorities:

1. canonical object page under
   `Database Catalog / <Platform/Product> / <Database> / <Database.Schema> / <Database.Schema> <Object Type Bucket>`;
2. DevOps answer card or compact context pack;
3. Rovo AI Retrieval Artifact page only when a human page does not exist or
   when documenting the Rovo answer path;
4. source artifact path in technical evidence.

Do not make AI Retrieval Artifact pages the primary human browsing path.

## Rovo Answer Support

The database catalog should expose enough stable links and aliases for Rovo
retrieval pages to answer:

- `Tell me about the database VendorData`
- `Tell me about the DimVehicle table`
- `Show me the lineage of the FactOpportunity table`

The human database and object pages should remain readable support pages. Rovo
retrieval pages should carry the compact locator rows, context records,
ambiguity groups, and evaluation hooks described in
`docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`.

## Quality Gate

A database catalog dry run fails when:

- a schema page omits cataloged objects from the complete inventory;
- SSIS package/catalog artifacts from `ssisdb` appear as database, schema, or
  object pages;
- database pages are published directly under `Database Catalog` instead of
  under the platform/product layer;
- schema page titles use `Schema - <Database>.<Schema>` under a database page;
- object pages are generated under `High-Value Assets` instead of their
  canonical schema location;
- object pages are direct children of schema pages instead of typed bucket
  pages;
- obvious backup/temp/delete tables appear as human catalog or Rovo retrieval
  objects;
- object rows do not show type and lineage/profile signals where available;
- a plain-English purpose is generic or unsupported;
- object pages omit page-level confidence or missing-facts sections;
- object pages infer owner, lifecycle/status, or live freshness without
  evidence;
- duplicate Confluence page candidates are not reported;
- secrets, credentials, raw rows, or sample values are exposed.

## Medium-Safe Change Pattern

Keep each pass bounded:

- one database page;
- one schema page;
- one object type in one schema;
- up to 25 canonical object pages;
- dry-run only unless live publish is explicitly approved.

Use `docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md` before changing the
database catalog generator or page shape.
Use `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md` before changing Rovo retrieval
artifacts.
Use `docs/DATABASE_CATALOG_MEDIUM_BACKLOG.md` to choose bounded implementation
items.
