# Linked-Server Alias Lineage Backlog

This backlog tracks scoped repairs for lineage identity drift caused by stale
linked-server aliases.

| ID       | Status  | Priority | Item                                                  | Acceptance                                                                                        |
| -------- | ------- | -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| LSAL-001 | Done    | High     | Add `COR-SQL-02` alias mapping to lineage config      | `COR-SQL-02` and `cor-sql-02` map to `L1-DWASQL-02,12010`                                         |
| LSAL-002 | Done    | High     | Apply alias mapping in live SQL dependency extraction | `sys.sql_expression_dependencies` rows canonicalize referenced server before object IDs are built |
| LSAL-003 | Done    | High     | Apply alias mapping in raw markdown catalog rebuild   | `V1-SQL-03` and `COR-SQL-02` source identities for affected databases converge during rebuild     |
| LSAL-004 | Done    | Medium   | Add targeted low-intelligence packet builder          | `npm run lineage:cor-sql:packet` writes markdown and JSON packet outputs                          |
| LSAL-005 | Done    | Medium   | Add targetable live refresh command                   | `npm run lineage:cor-sql:refresh` refreshes only the affected SQL databases                       |
| LSAL-006 | Planned | High     | Run targeted refresh and rebuild local markdown       | `data/markdown` and `data/analysis/raw/sqlserver` reflect corrected alias identities              |
| LSAL-007 | Planned | High     | Rebuild and validate runtime package                  | Runtime checks pass and FactOpportunity upstream readback includes corrected eLeadDW sources      |
| LSAL-008 | Planned | High     | Sync generated DevOps repo artifacts                  | `../Sonic-data-lineage/reports/runtime-sync-summary.json` records new runtime hash                |
| LSAL-009 | Planned | High     | Publish new Azure Artifacts runtime version           | New package version is published only after readback passes                                       |
| LSAL-010 | Planned | Medium   | Update targeted Confluence/Rovo artifacts             | Affected pages cite corrected runtime paths; no broad Confluence tree publish occurs              |
| LSAL-011 | Planned | Medium   | Review non-COR stale server names                     | UAT/dev/test/lab aliases are classified as map, quarantine, or leave unresolved                   |

## Non-COR Aliases Requiring Review

Do not canonicalize these automatically:

- `U1-SQL-01\INST1`
- `v1-sql-01`
- `cor-bisql-02\bisql02`
- `TEST-BISQL-01`
- `CHO-LAB-01A\CHOA2008R2`
- `CHO-LAB-01I`

These may represent dev, UAT, lab, historical, or true separate sources.
