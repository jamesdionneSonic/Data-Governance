# T2B-034 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-034`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 21            |
| Link refresh pages    | 2             |
| Total planned entries | 25            |
| Validation status     | `passed`      |

## Object Pages

| Object                                          | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                     |
| ----------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `xrfCoraCompanyPrefix`                          | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / xrfCoraCompanyPrefix`                          |
| `xrfFIAcctCode`                                 | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / xrfFIAcctCode`                                 |
| `xrfGLSchedule_Plugs`                           | table | profiled, review-needed | 1          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / xrfGLSchedule_Plugs`                           |
| `xrfGLSchedule_SchedRef`                        | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / xrfGLSchedule_SchedRef`                        |
| `xrfGLScheduleExceptions`                       | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / xrfGLScheduleExceptions`                       |
| `zzzzz_dbo.gljedetail_2012_06`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2012_06`                  |
| `zzzzz_dbo.gljedetail_2012_07`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2012_07`                  |
| `zzzzz_dbo.gljedetail_2012_08`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2012_08`                  |
| `zzzzz_dbo.gljedetail_2012_10`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2012_10`                  |
| `zzzzz_dbo.gljedetail_2012_11`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2012_11`                  |
| `zzzzz_dbo.gljedetail_2013_01`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2013_01`                  |
| `zzzzz_dbo.gljedetail_2013_02`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2013_02`                  |
| `zzzzz_dbo.gljedetail_2013_03`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2013_03`                  |
| `zzzzz_dbo.gljedetail_2013_04`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2013_04`                  |
| `zzzzz_dbo.gljedetail_2013_05`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2013_05`                  |
| `zzzzz_dbo.gljedetail_2013_06`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_2013_06`                  |
| `zzzzz_dbo.gljedetail_agg_cora_2011`            | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_agg_cora_2011`            |
| `zzzzz_dbo.GLJEDetail_agg_cora_2011_2`          | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.GLJEDetail_agg_cora_2011_2`          |
| `zzzzz_dbo.gljedetail_cur_staging_Temp12212012` | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.gljedetail_cur_staging_Temp12212012` |
| `zzzzz_dbo.GLJEHeader_agg_cora_2011`            | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.GLJEHeader_agg_cora_2011`            |
| `zzzzz_gljedetail_2012_09`                      | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_gljedetail_2012_09`                      |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-034:publish
```
