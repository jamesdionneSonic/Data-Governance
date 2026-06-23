# T2B-144 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-144`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `ddc`        |
| Object type scope     | `table`      |
| Object pages          | 15           |
| Link refresh pages    | 2            |
| Total planned entries | 19           |
| Validation status     | `passed`     |

## Object Pages

| Object                       | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                |
| ---------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `AccountInfo_staging`        | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / AccountInfo_staging`        |
| `DealixPingData_staging`     | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / DealixPingData_staging`     |
| `Invemtory_ErrorFiles`       | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / Invemtory_ErrorFiles`       |
| `Inventory_staging`          | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / Inventory_staging`          |
| `InventorySource_ErrorFiles` | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / InventorySource_ErrorFiles` |
| `LeadsBySource_Staging`      | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / LeadsBySource_Staging`      |
| `MobileWebStats_Staging`     | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / MobileWebStats_Staging`     |
| `PageViews_Staging`          | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / PageViews_Staging`          |
| `SEM_Day_Parting_staging`    | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / SEM_Day_Parting_staging`    |
| `SEM_staging`                | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / SEM_staging`                |
| `SEOSearchPhrases_Staging`   | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / SEOSearchPhrases_Staging`   |
| `VehicleView_staging`        | table | profiled, review-needed | 1          | 30      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / VehicleView_staging`        |
| `VehicleView_staging_Bkp`    | table | profiled, review-needed | 0          | 30      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / VehicleView_staging_Bkp`    |
| `Vin_Staging`                | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / Vin_Staging`                |
| `Webstats_staging`           | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc / Webstats_staging`           |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-144:publish
```
