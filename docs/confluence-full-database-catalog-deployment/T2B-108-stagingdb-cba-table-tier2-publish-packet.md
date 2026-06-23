# T2B-108 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-108`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `cba`        |
| Object type scope     | `table`      |
| Object pages          | 13           |
| Link refresh pages    | 2            |
| Total planned entries | 17           |
| Validation status     | `passed`     |

## Object Pages

| Object                           | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                    |
| -------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `BuyerTarget`                    | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / BuyerTarget`                    |
| `DealerDMSMapping`               | table | profiled, review-needed | 0          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / DealerDMSMapping`               |
| `Market`                         | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / Market`                         |
| `MarketParameter`                | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / MarketParameter`                |
| `MarketParameterType`            | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / MarketParameterType`            |
| `MarketPerformanceIndicators`    | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / MarketPerformanceIndicators`    |
| `MarketPerformanceIndicatorType` | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / MarketPerformanceIndicatorType` |
| `MarketTarget`                   | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / MarketTarget`                   |
| `PurchaseDetails`                | table | profiled, review-needed | 9          | 67      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / PurchaseDetails`                |
| `PurchaseDetails_ErrorOutput`    | table | profiled, review-needed | 0          | 84      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / PurchaseDetails_ErrorOutput`    |
| `PurchaseMethods`                | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / PurchaseMethods`                |
| `Sources`                        | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / Sources`                        |
| `TransportCompany`               | table | profiled, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba / TransportCompany`               |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-108:publish
```
