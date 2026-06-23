# T2B-122 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value         |
| --------------------- | ------------- |
| Batch                 | `T2B-122`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `SIMS`        |
| Object type scope     | `table`       |
| Object pages          | 5             |
| Link refresh pages    | 2             |
| Total planned entries | 9             |
| Validation status     | `passed`      |

## Object Pages

| Object                      | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                  |
| --------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `CarInventory_Staging`      | table | profiled, review-needed | 2          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / SIMS / CarInventory_Staging`      |
| `CarsWebMetrics_Summary`    | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / SIMS / CarsWebMetrics_Summary`    |
| `EP_CarInventory_Staging`   | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / SIMS / EP_CarInventory_Staging`   |
| `EP_CarsWebMetrics_Summary` | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / SIMS / EP_CarsWebMetrics_Summary` |
| `Vehicle_To_Inventory`      | table | profiled, review-needed | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / SIMS / Vehicle_To_Inventory`      |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-122:publish
```
