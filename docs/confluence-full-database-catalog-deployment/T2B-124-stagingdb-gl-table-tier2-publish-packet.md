# T2B-124 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-124`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `gl`         |
| Object type scope     | `table`      |
| Object pages          | 12           |
| Link refresh pages    | 2            |
| Total planned entries | 16           |
| Validation status     | `passed`     |

## Object Pages

| Object                                           | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                   |
| ------------------------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Fuel_gljedetail_cur_BU__staging`                | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / Fuel_gljedetail_cur_BU__staging`                |
| `Fuel_gljedetail_cur_staging`                    | table | profiled, review-needed | 3          | 43      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / Fuel_gljedetail_cur_staging`                    |
| `Fuel_gljedetail_cur_staging_rfj`                | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / Fuel_gljedetail_cur_staging_rfj`                |
| `Fuel_gljeheader_BU_staging`                     | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / Fuel_gljeheader_BU_staging`                     |
| `Fuel_gljeheader_staging`                        | table | profiled, review-needed | 1          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / Fuel_gljeheader_staging`                        |
| `Fuel_MissingData`                               | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / Fuel_MissingData`                               |
| `Fuel_MissingData_File`                          | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / Fuel_MissingData_File`                          |
| `zzzzz_gl.Fuel_gljedetail_cur_staging_0824`      | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / zzzzz_gl.Fuel_gljedetail_cur_staging_0824`      |
| `zzzzz_gl.Fuel_gljedetail_cur_staging_08252017`  | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / zzzzz_gl.Fuel_gljedetail_cur_staging_08252017`  |
| `zzzzz_gl.Fuel_gljedetail_cur_staging_20170827`  | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / zzzzz_gl.Fuel_gljedetail_cur_staging_20170827`  |
| `zzzzz_gl.Fuel_gljedetail_cur_staging_back_0823` | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / zzzzz_gl.Fuel_gljedetail_cur_staging_back_0823` |
| `zzzzz_gl.gljeHeader_BU_20130613`                | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl / zzzzz_gl.gljeHeader_BU_20130613`                |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-124:publish
```
