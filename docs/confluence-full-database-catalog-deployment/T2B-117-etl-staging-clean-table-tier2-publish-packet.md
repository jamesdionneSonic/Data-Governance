# T2B-117 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-117`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `clean`       |
| Object type scope     | `table`       |
| Object pages          | 10            |
| Link refresh pages    | 2             |
| Total planned entries | 14            |
| Validation status     | `passed`      |

## Object Pages

| Object                    | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                 |
| ------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `DimAssociate`            | table | profiled, review-needed | 3          | 73      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean / DimAssociate`            |
| `DimAssociate_bak`        | table | profiled, review-needed | 0          | 72      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean / DimAssociate_bak`        |
| `DimVehicleSought`        | table | profiled, review-needed | 0          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean / DimVehicleSought`        |
| `Fact_ActivityType`       | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean / Fact_ActivityType`       |
| `FactActivity`            | table | profiled, review-needed | 2          | 66      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean / FactActivity`            |
| `FactActivity_BK_24`      | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean / FactActivity_BK_24`      |
| `FactOpportunity`         | table | profiled, review-needed | 4          | 65      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean / FactOpportunity`         |
| `FactOpportunity_history` | table | profiled, review-needed | 0          | 60      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean / FactOpportunity_history` |
| `FactOpportunity_test`    | table | profiled, review-needed | 0          | 59      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean / FactOpportunity_test`    |
| `FactOpportunity_UAT`     | table | profiled, review-needed | 1          | 60      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean / FactOpportunity_UAT`     |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-117:publish
```
