# T2B-168 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-168`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `Elead`      |
| Object type scope     | `table`      |
| Object pages          | 11           |
| Link refresh pages    | 2            |
| Total planned entries | 15           |
| Validation status     | `passed`     |

## Object Pages

| Object                                    | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                               |
| ----------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `ScheduledCompletedTasks`                 | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / ScheduledCompletedTasks`                 |
| `StgEAPSLevelDaily`                       | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / StgEAPSLevelDaily`                       |
| `StgEAPSLevelMTD`                         | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / StgEAPSLevelMTD`                         |
| `StgEchoParkGECReportDaily`               | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / StgEchoParkGECReportDaily`               |
| `StgEchoParkGECReportMTD`                 | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / StgEchoParkGECReportMTD`                 |
| `StgEchoParkGECReportMTDFis`              | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / StgEchoParkGECReportMTDFis`              |
| `StgEchoParkGECReportWTD_DownloadedFiles` | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / StgEchoParkGECReportWTD_DownloadedFiles` |
| `StgMarketingCampaignMonthly`             | table | profiled, review-needed | 1          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / StgMarketingCampaignMonthly`             |
| `StgRetailGECReportDaily`                 | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / StgRetailGECReportDaily`                 |
| `StgRetailGECReportMTD`                   | table | profiled, review-needed | 0          | 29      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / StgRetailGECReportMTD`                   |
| `StgRetailGECReportMTDFis`                | table | profiled, review-needed | 0          | 29      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead / StgRetailGECReportMTDFis`                |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-168:publish
```
