# T2B-068 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-068`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `cba`        |
| Object type scope     | `table`      |
| Object pages          | 12           |
| Link refresh pages    | 2            |
| Total planned entries | 16           |
| Validation status     | `passed`     |

## Object Pages

| Object                           | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                     |
| -------------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `BuyerTarget`                    | table | profiled, review-needed                            | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / BuyerTarget`                    |
| `DealerDMSMapping`               | table | profiled, review-needed                            | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / DealerDMSMapping`               |
| `Market`                         | table | profiled, review-needed                            | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / Market`                         |
| `MarketParameter`                | table | profiled, review-needed                            | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / MarketParameter`                |
| `MarketParameterType`            | table | profiled, review-needed                            | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / MarketParameterType`            |
| `MarketPerformanceIndicators`    | table | profiled, review-needed                            | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / MarketPerformanceIndicators`    |
| `MarketPerformanceIndicatorType` | table | profiled, review-needed                            | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / MarketPerformanceIndicatorType` |
| `MarketTarget`                   | table | profiled, review-needed                            | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / MarketTarget`                   |
| `PurchaseDetails`                | table | high-use, profiled, lineage-hotspot, review-needed | 8          | 68      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / PurchaseDetails`                |
| `PurchaseMethods`                | table | profiled, review-needed                            | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / PurchaseMethods`                |
| `Sources`                        | table | profiled, review-needed                            | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / Sources`                        |
| `TransportCompany`               | table | profiled, review-needed                            | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba / TransportCompany`               |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-068:publish
```
