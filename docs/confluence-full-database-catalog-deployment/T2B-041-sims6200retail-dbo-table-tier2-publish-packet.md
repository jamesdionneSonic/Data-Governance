# T2B-041 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value            |
| --------------------- | ---------------- |
| Batch                 | `T2B-041`        |
| Platform/Product      | `SQL Server`     |
| Database              | `SIMS6200Retail` |
| Schema                | `dbo`            |
| Object type scope     | `table`          |
| Object pages          | 27               |
| Link refresh pages    | 2                |
| Total planned entries | 31               |
| Validation status     | `passed`         |

## Object Pages

| Object                     | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                   |
| -------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `ADP_DEALERSHIP_MAPPING`   | table | high-use, profiled, review-needed                  | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / ADP_DEALERSHIP_MAPPING`   |
| `Appraisal`                | table | profiled, review-needed                            | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Appraisal`                |
| `Book`                     | table | high-use, profiled, review-needed                  | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Book`                     |
| `Book_Value_Request`       | table | profiled, review-needed                            | 0          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Book_Value_Request`       |
| `Book_Value_Response`      | table | profiled, review-needed                            | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Book_Value_Response`      |
| `Customer`                 | table | high-use, profiled, review-needed                  | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Customer`                 |
| `EXTERNAL_REPORT_ICON`     | table | profiled, review-needed                            | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / EXTERNAL_REPORT_ICON`     |
| `External_Vehicle_Data`    | table | profiled, review-needed                            | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / External_Vehicle_Data`    |
| `Factory_Options`          | table | profiled, review-needed                            | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Factory_Options`          |
| `FireDealData_New`         | table | profiled, review-needed                            | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / FireDealData_New`         |
| `FIREDealData_New_STG`     | table | profiled, review-needed                            | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / FIREDealData_New_STG`     |
| `Organization`             | table | high-use, profiled, review-needed                  | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Organization`             |
| `Organization_Address`     | table | profiled, review-needed                            | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Organization_Address`     |
| `Organization_Association` | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Organization_Association` |
| `PhotoImport_VehicleUrls`  | table | profiled, review-needed                            | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / PhotoImport_VehicleUrls`  |
| `Sonic_Appraisal_Center`   | table | profiled, review-needed                            | 0          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Sonic_Appraisal_Center`   |
| `SSMS`                     | table | profiled, review-needed                            | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / SSMS`                     |
| `STATUS`                   | table | high-use, profiled, review-needed                  | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / STATUS`                   |
| `Status_Cat`               | table | profiled, review-needed                            | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Status_Cat`               |
| `Status_Rollup`            | table | profiled, review-needed                            | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Status_Rollup`            |
| `TitleStatus`              | table | profiled, review-needed                            | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / TitleStatus`              |
| `TitleStatus_staging`      | table | profiled, review-needed                            | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / TitleStatus_staging`      |
| `Vehicle`                  | table | high-use, profiled, review-needed                  | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Vehicle`                  |
| `Vehicle_Inventory`        | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 134     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Vehicle_Inventory`        |
| `Vehicle_Pricing`          | table | profiled, review-needed                            | 0          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Vehicle_Pricing`          |
| `Vehicle_Source`           | table | profiled, review-needed                            | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Vehicle_Source`           |
| `Vehicle_Status_Log`       | table | profiled, review-needed                            | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Vehicle_Status_Log`       |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-041:publish
```
