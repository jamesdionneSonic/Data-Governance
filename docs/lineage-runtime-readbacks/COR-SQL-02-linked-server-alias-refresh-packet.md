# COR-SQL-02 Linked-Server Alias Refresh Packet

Generated at: `2026-06-22T10:37:07.847Z`

## Purpose

Refresh only lineage affected by stale `COR-SQL-02` references by canonicalizing
them to `L1-DWASQL-02,12010`. This packet is intentionally mechanical so
it can be run at low intelligence one step at a time.

## Fixed Scope

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Stale server token          | `COR-SQL-02`                                                 |
| Canonical linked server     | `L1-DWASQL-02,12010`                                         |
| Referencing databases       | `ETL_Staging`, `Sonic_DW`                                    |
| Referenced source databases | `eLeadDW`, `DMS`, `Speed`, `WebV`, `Sonic_XREF`, `BI_WorkDB` |

## Allowed Outputs

- Local markdown under `data/markdown`
- Raw sanitized metadata under `data/analysis/raw/sqlserver`
- Runtime package under `data/lineage-runtime-package/sonic-data-lineage-runtime`
- Generated DevOps repo artifacts under `../Sonic-data-lineage`
- Targeted Confluence Rovo/human pages after the packet is reviewed

## Forbidden Scope

- full catalog redesign
- broad Confluence tree regeneration
- unbounded dry-run matrix
- parser or scoring redesign
- raw row extraction
- secrets or connection-string publication

## Low-Intelligence Workflow

| Step | Name                                             | Command                                                                                                                                                                                                                                                                                                          | Output                                                                            | Approval                     |
| ---- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------- |
| 1    | Build packet                                     | `npm run lineage:cor-sql:packet`                                                                                                                                                                                                                                                                                 | `docs/lineage-runtime-readbacks/COR-SQL-02-linked-server-alias-refresh-packet.md` | Not required                 |
| 2    | Targeted live SQL metadata refresh               | `npm run lineage:cor-sql:refresh`                                                                                                                                                                                                                                                                                | `data/analysis/raw/live-domain-refresh-summary.json`                              | Not required                 |
| 3    | Targeted catalog rebuild from refreshed markdown | `npm run catalog:rebuild`                                                                                                                                                                                                                                                                                        | `data/markdown/catalog-manifest.json`                                             | Not required                 |
| 4    | Runtime package rebuild and checks               | `npm run lineage:runtime:package && npm run lineage:runtime:check && npm run lineage:answers:check && npm run lineage:runtime:readback`                                                                                                                                                                          | `data/lineage-runtime-package/sonic-data-lineage-runtime/manifest.json`           | Not required                 |
| 5    | DevOps repo sync                                 | `npm run lineage:runtime:sync`                                                                                                                                                                                                                                                                                   | `../Sonic-data-lineage/reports/runtime-sync-summary.json`                         | Not required                 |
| 6    | Confluence targeted review/publish               | `npm run confluence:rovo:validate && npm run confluence:rovo:publish-packet && node scripts/publish-human-confluence-catalog-pilot.mjs --output-root data/confluence/rovo-ai-retrieval-dry-run --packet docs/confluence-full-database-catalog-deployment/FDP-06-rovo-ai-retrieval-publish-packet.json --publish` | `data/confluence/rovo-ai-retrieval-dry-run`                                       | Required before live publish |

## Stop Triggers

- Any target refresh returns zero objects.
- `COR-SQL-02` remains in runtime registry, context packs, or answer cards after rebuild.
- `L1-DWASQL-02,12010.eLeadDW.dbo.dwFullOpportunity` cannot be resolved from the runtime package.
- Validation reports raw rows, secrets, credential values, or connection strings.
- Confluence or DevOps publish would include files outside the affected alias slice.

## Acceptance Checks

- FactOpportunity upstream answer includes the eLeadDW table family, not only two tables.
- Runtime package aliases resolve `COR-SQL-02.eLeadDW.dbo.dwFullOpportunity` and `L1-DWASQL-02,12010.eLeadDW.dbo.dwFullOpportunity` to the same canonical object where cataloged.
- DevOps repo sync summary records the new runtime content hash.
- Confluence affected pages cite the corrected runtime artifact paths.
