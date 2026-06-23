# T2B-051 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-051`     |
| Platform/Product      | `SQL Server`  |
| Database              | `SIMS6200_EP` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 26            |
| Link refresh pages    | 2             |
| Total planned entries | 30            |
| Validation status     | `passed`      |

## Object Pages

| Object                     | Type  | Tags                              | Downstream | Columns | Confidence | Path                                                                                                |
| -------------------------- | ----- | --------------------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `ADP_DEALERSHIP_MAPPING`   | table | profiled, review-needed           | 0          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / ADP_DEALERSHIP_MAPPING`   |
| `Appraisal`                | table | profiled, review-needed           | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Appraisal`                |
| `Book`                     | table | profiled, review-needed           | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Book`                     |
| `Book_Value_Request`       | table | profiled, review-needed           | 0          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Book_Value_Request`       |
| `Book_Value_Response`      | table | profiled, review-needed           | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Book_Value_Response`      |
| `Customer`                 | table | profiled, review-needed           | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Customer`                 |
| `EXTERNAL_REPORT_ICON`     | table | profiled, review-needed           | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / EXTERNAL_REPORT_ICON`     |
| `External_Vehicle_Data`    | table | profiled, review-needed           | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / External_Vehicle_Data`    |
| `Factory_Options`          | table | profiled, review-needed           | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Factory_Options`          |
| `Organization`             | table | profiled, review-needed           | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Organization`             |
| `Organization_Address`     | table | profiled, review-needed           | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Organization_Address`     |
| `Organization_Association` | table | profiled, review-needed           | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Organization_Association` |
| `PhotoImport_VehicleUrls`  | table | profiled, review-needed           | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / PhotoImport_VehicleUrls`  |
| `Sonic_Appraisal_Center`   | table | profiled, review-needed           | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Sonic_Appraisal_Center`   |
| `SSMS`                     | table | profiled, review-needed           | 2          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / SSMS`                     |
| `STATUS`                   | table | high-use, profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / STATUS`                   |
| `Status_Cat`               | table | profiled, review-needed           | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Status_Cat`               |
| `Status_Rollup`            | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Status_Rollup`            |
| `TitleStatus`              | table | profiled, review-needed           | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / TitleStatus`              |
| `TitleStatus_staging`      | table | profiled, review-needed           | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / TitleStatus_staging`      |
| `Vehicle`                  | table | high-use, profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Vehicle`                  |
| `Vehicle_Inventory`        | table | profiled, review-needed           | 0          | 127     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Vehicle_Inventory`        |
| `Vehicle_Pricing`          | table | high-use, profiled, review-needed | 0          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Vehicle_Pricing`          |
| `Vehicle_Source`           | table | profiled, review-needed           | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Vehicle_Source`           |
| `Vehicle_Status_Log`       | table | profiled, review-needed           | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / Vehicle_Status_Log`       |
| `VW_Vehicle_Inventory`     | table | profiled, review-needed           | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo / VW_Vehicle_Inventory`     |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-051:publish
```
