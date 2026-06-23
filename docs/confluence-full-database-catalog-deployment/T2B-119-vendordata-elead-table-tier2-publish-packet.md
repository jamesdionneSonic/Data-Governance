# T2B-119 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-119`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `Elead`      |
| Object type scope     | `table`      |
| Object pages          | 12           |
| Link refresh pages    | 2            |
| Total planned entries | 16           |
| Validation status     | `passed`     |

## Object Pages

| Object                         | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                     |
| ------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `DimStoreRegionMapping`        | table | profiled, review-needed | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / DimStoreRegionMapping`        |
| `EAPSLevelDaily`               | table | profiled, review-needed | 1          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / EAPSLevelDaily`               |
| `EAPSLevelMTD`                 | table | profiled, review-needed | 2          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / EAPSLevelMTD`                 |
| `EchoParkGECReportDaily`       | table | profiled, review-needed | 2          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / EchoParkGECReportDaily`       |
| `EchoParkGECReportMTD`         | table | profiled, review-needed | 2          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / EchoParkGECReportMTD`         |
| `EchoParkGECReportMTDFis`      | table | profiled, review-needed | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / EchoParkGECReportMTDFis`      |
| `EchoParkGECReportWTD`         | table | profiled, review-needed | 0          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / EchoParkGECReportWTD`         |
| `MarketingCampaignMonthly`     | table | profiled, review-needed | 0          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / MarketingCampaignMonthly`     |
| `RetailGECReportDaily`         | table | profiled, review-needed | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / RetailGECReportDaily`         |
| `RetailGECReportMTD`           | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / RetailGECReportMTD`           |
| `RetailGECReportMTDFis`        | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / RetailGECReportMTDFis`        |
| `ScheduledCompletedTasksDaily` | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead / ScheduledCompletedTasksDaily` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-119:publish
```
