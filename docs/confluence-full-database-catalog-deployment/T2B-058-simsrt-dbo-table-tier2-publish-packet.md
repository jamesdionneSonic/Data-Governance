# T2B-058 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value        |
| --------------------- | ------------ |
| Batch                 | `T2B-058`    |
| Platform/Product      | `SQL Server` |
| Database              | `SIMSRT`     |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 6            |
| Link refresh pages    | 2            |
| Total planned entries | 10           |
| Validation status     | `passed`     |

## Object Pages

| Object                | Type  | Tags                              | Downstream | Columns | Confidence | Path                                                                                      |
| --------------------- | ----- | --------------------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------- |
| `Appraisal`           | table | profiled, review-needed           | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSRT / dbo / Appraisal`           |
| `Book_Value_Response` | table | profiled, review-needed           | 0          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSRT / dbo / Book_Value_Response` |
| `Vehicle`             | table | profiled, review-needed           | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSRT / dbo / Vehicle`             |
| `Vehicle_Inventory`   | table | high-use, profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSRT / dbo / Vehicle_Inventory`   |
| `Vehicle_Source`      | table | profiled, review-needed           | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSRT / dbo / Vehicle_Source`      |
| `Vehicle_Status_Log`  | table | profiled, review-needed           | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSRT / dbo / Vehicle_Status_Log`  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-058:publish
```
