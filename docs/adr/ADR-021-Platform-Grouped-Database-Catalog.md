# ADR-021: Platform-Grouped Database Catalog

## Status

Accepted

## Date

2026-06-23

## Context

The Confluence Database Catalog was originally generated as:

```text
Sonic Data Lineage
  Database Catalog
    <Database>
      <Schema>
```

That shape became ambiguous after Snowflake metadata was added. It made every
database look like a peer under one flat catalog root, even though `SQL Server`
and `Snowflake` are different source products with different connection,
ownership, and operational context.

It also made the tree look as if a database could only be represented as one
flat branch, while a real database can contain multiple schemas. The schema
must roll up under its database, and the database must roll up under the source
platform/product.

## Decision

The canonical Confluence Database Catalog tree is:

```text
Sonic Data Lineage
  Database Catalog
    <Platform/Product>
      <Database>
        <Schema>
          <Object>
```

Examples:

```text
Sonic Data Lineage
  Database Catalog
    SQL Server
      Sonic_DW
        dbo
        stg
      eLeadDW_SF
        dbo
    Snowflake
      CDK_ROADSTER_ELEAD_SONIC
        PUBLIC
      HYPERNOVA_SONIC_CUSTACCESS
        PUBLIC
```

The platform/product value is derived from source metadata such as server,
source system, source type, or connector type. It must not be inferred from
database-name suffixes. For example, `eLeadDW_SF` can still be a SQL Server
database when its server/source-system metadata is SQL Server.

## Implementation Rules

- Database pages are published under
  `Database Catalog / <Platform/Product> / <Database>`.
- Schema pages are published under
  `Database Catalog / <Platform/Product> / <Database> / <Schema>`.
- Object pages are published under
  `Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>`.
- Existing pages under `Database Catalog / <Database>` are superseded cleanup
  candidates, not automatic deletes.
- Existing generated pages such as `Database Catalog - <Database>` and
  `Schema - <Database>.<Schema>` are noncanonical titles.
- Live cleanup, archive, or move work requires a reviewed dry run and explicit
  approval.

## Consequences

- SQL Server and Snowflake catalog pages no longer share one flat database
  namespace.
- A database can naturally contain multiple schema children.
- The tree matches user mental models for browsing from source product to
  database to schema to object.
- Existing flat Confluence pages require a controlled cleanup pass after the new
  platform-grouped pages are reviewed.
- DevOps runtime artifacts remain the machine-readable source of truth; this
  ADR changes only the human Confluence navigation shape and generated page
  paths.

## Related Documents

- `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
- `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
- `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
- `docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md`
