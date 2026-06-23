# T2B-156 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-156`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `Auto`       |
| Object type scope     | `table`      |
| Object pages          | 2            |
| Link refresh pages    | 2            |
| Total planned entries | 6            |
| Validation status     | `passed`     |

## Object Pages

| Object                       | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                 |
| ---------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `AutoTrader_Staging`         | table | profiled, review-needed | 0          | 174     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Auto / AutoTrader_Staging`         |
| `AutoTraderVINLevel_Staging` | table | profiled, review-needed | 1          | 47      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Auto / AutoTraderVINLevel_Staging` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-156:publish
```
