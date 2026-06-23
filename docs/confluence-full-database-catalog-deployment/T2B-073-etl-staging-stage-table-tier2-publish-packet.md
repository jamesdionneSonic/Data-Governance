# T2B-073 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-073`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `stage`       |
| Object type scope     | `table`       |
| Object pages          | 13            |
| Link refresh pages    | 2             |
| Total planned entries | 17            |
| Validation status     | `passed`      |

## Object Pages

| Object                                | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                             |
| ------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `StartStopSaleUsedRetail`             | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartStopSaleUsedRetail`             |
| `StartStopSaleUsedRetail_matched`     | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartStopSaleUsedRetail_matched`     |
| `StartTemplateData_Matched`           | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartTemplateData_Matched`           |
| `StartTradeAppraisal`                 | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartTradeAppraisal`                 |
| `STARTTradeAppraisal_HIST`            | table | profiled, review-needed | 0          | 77      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / STARTTradeAppraisal_HIST`            |
| `StartTradeAppraisal_Matched`         | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartTradeAppraisal_Matched`         |
| `StartTradeAppraisalEchoPark`         | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartTradeAppraisalEchoPark`         |
| `StartTradeAppraisalEchoPark_Matched` | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartTradeAppraisalEchoPark_Matched` |
| `StartTradeAppraisalRetail`           | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartTradeAppraisalRetail`           |
| `StartTradeAppraisalRetail_Matched`   | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartTradeAppraisalRetail_Matched`   |
| `STARTTradeAppraisalTraded_HIST`      | table | profiled, review-needed | 0          | 77      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / STARTTradeAppraisalTraded_HIST`      |
| `StartTrafficManagement_Matched`      | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartTrafficManagement_Matched`      |
| `StartTrafficManagementATIM_Matched`  | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartTrafficManagementATIM_Matched`  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-073:publish
```
