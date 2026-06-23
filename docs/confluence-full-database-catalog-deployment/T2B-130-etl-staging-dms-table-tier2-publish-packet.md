# T2B-130 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-130`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `dms`         |
| Object type scope     | `table`       |
| Object pages          | 5             |
| Link refresh pages    | 2             |
| Total planned entries | 9             |
| Validation status     | `passed`      |

## Object Pages

| Object                  | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                             |
| ----------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `CustomerCleanAll`      | table | profiled, review-needed | 3          | 122     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dms / CustomerCleanAll`      |
| `CustomerCleanAll_org`  | table | profiled, review-needed | 0          | 114     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dms / CustomerCleanAll_org`  |
| `DMS_NewDailyCustomers` | table | profiled, review-needed | 0          | 83      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dms / DMS_NewDailyCustomers` |
| `Vendor`                | table | profiled, review-needed | 1          | 40      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dms / Vendor`                |
| `VendorCleanedAll`      | table | profiled, review-needed | 1          | 92      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dms / VendorCleanedAll`      |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-130:publish
```
