# T2B-226 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-226`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `Gold`       |
| Object type scope     | `table`      |
| Object pages          | 2            |
| Link refresh pages    | 2            |
| Total planned entries | 6            |
| Validation status     | `passed`     |

## Object Pages

| Object                            | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                      |
| --------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `GoldDigger_Monthly_Rate_Staging` | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Gold / GoldDigger_Monthly_Rate_Staging` |
| `GoldDigger_Staging`              | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Gold / GoldDigger_Staging`              |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-226:publish
```
