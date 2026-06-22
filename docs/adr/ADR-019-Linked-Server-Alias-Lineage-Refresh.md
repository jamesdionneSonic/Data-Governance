# ADR-019: Linked-Server Alias Lineage Refresh

## Status

Accepted

## Date

2026-06-22

## Context

Live lineage review of `Sonic_DW.dbo.FactOpportunity` found that SQL Server
module definitions and dependency metadata still reference `COR-SQL-02`, while
the current registered linked server on `L1-5FSQL-01\INST1` is
`L1-DWASQL-02,12010`.

This caused equivalent source objects to appear under different server
identities. For example, a dependency could surface as
`COR-SQL-02.eLeadDW.dbo.dwFullOpportunity` while the cataloged source object is
published under `L1-DWASQL-02,12010.eLeadDW.dbo.dwFullOpportunity`.

The same pattern appears in `ETL_Staging` and `Sonic_DW` modules that reference
`eLeadDW`, `DMS`, `Speed`, `WebV`, `Sonic_XREF`, and `BI_WorkDB`.

## Decision

Maintain an explicit linked-server alias map and apply it before lineage object
IDs are created or resolved.

The first accepted mapping is:

| Alias        | Canonical linked server |
| ------------ | ----------------------- |
| `COR-SQL-02` | `L1-DWASQL-02,12010`    |
| `cor-sql-02` | `L1-DWASQL-02,12010`    |

The alias correction applies to:

- live SQL Server dependency extraction;
- local markdown rebuild from raw metadata;
- runtime package canonical object and alias indexes;
- DevOps runtime repo sync;
- Confluence pages generated from corrected runtime artifacts.

## Low-Intelligence Refresh Rule

Alias-only lineage repairs may run with a low-intelligence packet when the scope
is limited to the known linked-server alias and affected databases.

The approved packet is:

`docs/CODEX_COR_SQL_LINKED_SERVER_ALIAS_REFRESH_PACKET.md`

Low-intelligence runs must not improvise new aliases. New server aliases such as
UAT, dev, lab, or test server names require review before being canonicalized.

## Publication Rule

The broad Confluence and DevOps dry-run chain is not required for this class of
repair. Instead, use one targeted review packet that lists:

- alias mapping;
- affected source and referencing databases;
- local markdown outputs;
- runtime package hash;
- DevOps sync output;
- Confluence pages or retrieval artifacts to update.

Live Confluence publish and DevOps package publication still require explicit
approval after the targeted packet is reviewed. The packet may be reviewed as
the dry-run artifact for this narrow alias-only change.

## Consequences

- Equivalent `COR-SQL-02` and `L1-DWASQL-02,12010` references converge to the
  same canonical source identity.
- FactOpportunity upstream lineage can include the full eLeadDW table family
  instead of stopping at a shallow staging edge.
- Low-intelligence agents get a deterministic command path.
- Broad live publishes remain protected by review gates.
- Unreviewed old server names are not silently merged into production lineage.

## Validation

Minimum validation for this ADR:

- `npm run lineage:cor-sql:packet`
- `npm run lineage:cor-sql:refresh`
- `npm run catalog:rebuild`
- `npm run lineage:runtime:package`
- `npm run lineage:runtime:check`
- `npm run lineage:answers:check`
- `npm run lineage:runtime:readback`

Before publishing:

- confirm `COR-SQL-02` is absent from generated runtime registry/context/answer
  artifacts except in documented alias history;
- confirm the affected FactOpportunity/eLeadDW prompt answers cite corrected
  runtime artifact paths;
- review the targeted packet before any Confluence or DevOps live publish.

## Related Documents

- `docs/CODEX_COR_SQL_LINKED_SERVER_ALIAS_REFRESH_PACKET.md`
- `docs/LINKED_SERVER_ALIAS_LINEAGE_REFRESH_PROCESS.md`
- `docs/LINKED_SERVER_ALIAS_LINEAGE_BACKLOG.md`
- `docs/LINEAGE_RUNTIME_PACKAGE_BACKLOG.md`
- `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`
- `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
- `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
