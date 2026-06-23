# ADR-013: Complete Database Catalog And Object Library Pages

## Status

Accepted

## Date

2026-06-19

## Context

The Sonic Data Lineage Confluence catalog currently has a useful human
navigation model, but the database branch can stop too early. A user browsing
`Database Catalog > SQL Server > Sonic_DW > dbo` expects to reach table, view,
and procedure information, including columns and plain-English lineage. A schema
page that only shows high-use objects is friendly but incomplete; it can make
users think the catalog is missing objects.

There is also a page-title drift problem. Earlier reviewed pilots used a clean
tree such as:

```text
Database Catalog
  SQL Server
    Sonic_DW
      dbo
```

Later dry-run code generated schema pages with titles such as:

```text
Database Catalog
  SQL Server
    Sonic_DW
      Schema - Sonic_DW.dbo
```

Both pages represent the same schema. The generated tree must use canonical
titles so Confluence updates existing pages instead of creating duplicates.
ADR-021 amends the tree to include the platform/product layer between Database
Catalog and database name.

## Decision

Database Catalog pages will become complete object-library indexes. A schema
page must expose every cataloged object in that schema, grouped in a way that a
human can scan, filter mentally, and drill into detail.

The canonical Confluence tree is:

```text
Sonic Data Lineage
  Database Catalog
    <Platform/Product>
      <Database>
        <Schema>
          <Object page when promoted>
```

Examples:

```text
Sonic Data Lineage
  Database Catalog
    SQL Server
      Sonic_DW
        dbo
          DimVehicle
          factFIRE
          vwFactFIRESummaryReport
          usp_DOC_Booked
```

Page titles should be short in the tree:

| Page type | Tree title   | Full identity shown inside page |
| --------- | ------------ | ------------------------------- |
| Platform  | `SQL Server` | `SQL Server`                    |
| Database  | `Sonic_DW`   | `Sonic_DW`                      |
| Schema    | `dbo`        | `Sonic_DW.dbo`                  |
| Object    | `DimVehicle` | `Sonic_DW.dbo.DimVehicle`       |

If a page-title collision occurs under the same parent, append the minimum
necessary qualifier, such as `DimVehicle (view)` or
`DimVehicle - Sonic_DW.dbo`, and record the collision in the evidence packet.

Schema pages must be complete indexes. Object pages are canonical destinations.
This means:

- every table, view, procedure, and supported object type appears on its schema
  page;
- every object has one canonical destination under its database and schema;
- objects may carry tags such as `high-value`, `high-use`,
  `product-critical`, `support-critical`, `profiled`, `review-needed`, or
  `lineage-hotspot`;
- those tags are signals on the canonical object page and schema index row, not
  separate top-level navigation sections;
- only tagged or requested objects need rich generated prose at first;
- lower-value objects still have index rows with enough facts and links for
  discovery.
- Rovo retrieval pages may point to canonical object pages, but they are not the
  canonical human destination.

## Required Schema Page Shape

Schema pages must follow this order:

1. `Plain-English Summary`
2. `At A Glance`
3. `Most Used Objects`
4. `Tables`
5. `Views`
6. `Procedures`
7. `Other Objects`
8. `Objects With Profile Data`
9. `Objects Needing Review`
10. `Known Gaps And Confidence`
11. `Technical Evidence`

Large sections should use expandable blocks in Confluence output when supported,
but the counts and section headings must remain visible without expanding.

Each object row should include:

| Field        | Meaning                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `Object`     | Display name and link to the canonical object page under this schema.                                        |
| `Type`       | Table, view, procedure, function, synonym, package, report, or other supported type.                         |
| `Tags`       | Evidence-backed signals such as `high-value`, `high-use`, `profiled`, `review-needed`, or `lineage-hotspot`. |
| `Purpose`    | Short deterministic or bounded-LLM summary; use `not surfaced in metadata` when weak.                        |
| `Columns`    | Column count or `not surfaced in metadata`.                                                                  |
| `Upstream`   | Count or compact role summary of feeders/loaders.                                                            |
| `Downstream` | Count or compact role summary of consumers.                                                                  |
| `Profile`    | Available, unavailable, failed, stale, or not surfaced.                                                      |
| `Confidence` | Confidence label and caveat.                                                                                 |

## Required Object Page Shape

Canonical object pages must include:

1. `Plain-English Summary`
2. `Business Meaning And Impact`
3. `At A Glance`
4. `Column Summary`
5. `Lineage Summary`
6. `Support Checks`
7. `Profile And Quality Signals`
8. `Related Pages`
9. `Technical Evidence`

Object pages must explain lineage in plain English but keep exact technical
names visible. The page should distinguish:

- upstream loaders and source objects;
- orchestrators such as SSIS packages or ADF pipelines;
- downstream business consumers such as SSRS reports or product tables;
- maintenance reads, audit/logging procedures, and self-upsert patterns.

## LLM Usage

The database catalog must remain deterministic first.

Use deterministic code for:

- page paths and canonical titles;
- object inventory and counts;
- grouping by type;
- upstream/downstream counts;
- profile availability;
- confidence and caveat propagation;
- links to object pages, answer cards, or DevOps artifacts.

Use an LLM only for bounded prose:

- object purpose;
- business/support impact;
- readable lineage explanation;
- support-check wording.

The LLM must receive a bounded evidence packet. It must not decide lineage,
count objects, choose page paths, infer owners, or invent business meaning not
supported by metadata. Missing facts must be labeled as `not surfaced in
metadata`.

## Duplicate And Rename Rules

- `Schema - <Database>.<Schema>` is not a canonical title under the database
  page.
- `<Schema>` is the canonical schema title when it is already under
  `<Platform/Product> / <Database>`.
- `High-Value Assets` is not a canonical home for object pages.
- `high-value` is an object tag, not a top-level page tree.
- Existing `High-Value Object - <qualified name>` pages should be treated as
  superseded by canonical object pages under
  `Database Catalog / <Platform/Product> / <Database> / <Schema> /
<ObjectName>`.
- Before live publish, the dry run must report pages that would be superseded
  by canonical titles.
- Duplicate cleanup requires explicit approval and should be handled as a
  separate operation from content generation.
- The generator must write stable canonical ids into evidence packets so a page
  can be matched even if the display title changes later.

## Medium-Intelligence Work Contract

A balanced Codex session at normal speed with medium thinking may implement
this catalog layout when the work is limited to:

1. one database or schema slice, such as `Sonic_DW.dbo`;
2. dry-run-only output;
3. deterministic object inventory and grouping;
4. canonical object pages or placeholders under that schema;
5. evidence-backed object tags;
6. bounded LLM summary generation from evidence packets, if configured;
7. no live Confluence cleanup or broad publish.

Stop and request stronger review before:

- publishing broad live catalog updates;
- generating full rich object pages for every object in every database;
- changing ingestion, parser, extractor, or semantic-lineage scoring behavior;
- deleting or archiving duplicate Confluence pages;
- deleting or archiving the existing `High-Value Assets` section;
- using unrestricted LLM prompts against raw markdown or source data.

## Consequences

- Users can find every object from the schema page.
- Rovo has stable canonical links and aliases it can use from its own retrieval
  artifact branch.
- Confluence remains readable because object tags guide attention without
  creating a second home for objects.
- The tree no longer creates duplicate schema pages for the same schema.
- The `High-Value Assets` section becomes obsolete after canonical object pages
  exist and should be removed through a separate approved cleanup.
- The Database Catalog becomes a trusted library index, while DevOps runtime
  artifacts remain the machine-readable source of truth.

## Related Documents

- `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
- `docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md`
- `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
- `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
- `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
- `docs/DATABASE_CATALOG_MEDIUM_BACKLOG.md`
- `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_BACKLOG.md`
- `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_WORK_PACKETS.md`
- `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
- `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`
- `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
- `docs/adr/ADR-012-Separate-Documentation-Engines-From-App-Runtime.md`
