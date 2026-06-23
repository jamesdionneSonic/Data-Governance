# T2B-175 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-175`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `ga`         |
| Object type scope     | `table`      |
| Object pages          | 4            |
| Link refresh pages    | 2            |
| Total planned entries | 8            |
| Validation status     | `passed`     |

## Object Pages

| Object                            | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                    |
| --------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `GoogleAnalyticsReport`           | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ga / GoogleAnalyticsReport`           |
| `GoogleAnalyticsReport_bk`        | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ga / GoogleAnalyticsReport_bk`        |
| `GoogleAnalyticsReportHistorical` | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ga / GoogleAnalyticsReportHistorical` |
| `Vehicle_User_Clicks`             | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ga / Vehicle_User_Clicks`             |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-175:publish
```
