# T2B-103 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-103`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `load`        |
| Object type scope     | `table`       |
| Object pages          | 19            |
| Link refresh pages    | 2             |
| Total planned entries | 23            |
| Validation status     | `passed`      |

## Object Pages

| Object                                                 | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                             |
| ------------------------------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `WebV_veh_interior_color_staging`                      | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_veh_interior_color_staging`                      |
| `WebV_veh_inventory_staging`                           | table | profiled, review-needed | 0          | 162     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_veh_inventory_staging`                           |
| `WebV_veh_loc_make_staging`                            | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_veh_loc_make_staging`                            |
| `WebV_veh_loc_model_staging`                           | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_veh_loc_model_staging`                           |
| `WebV_veh_loc_series_staging`                          | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_veh_loc_series_staging`                          |
| `WebV_veh_vehicle_staging`                             | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_veh_vehicle_staging`                             |
| `wrkFIREBookings`                                      | table | profiled, review-needed | 0          | 31      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / wrkFIREBookings`                                      |
| `wrkFireFact`                                          | table | profiled, review-needed | 0          | 30      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / wrkFireFact`                                          |
| `wrkFIREWeOwe`                                         | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / wrkFIREWeOwe`                                         |
| `wrkLender`                                            | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / wrkLender`                                            |
| `wrkVSC`                                               | table | profiled, review-needed | 0          | 45      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / wrkVSC`                                               |
| `wrkVSCBook`                                           | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / wrkVSCBook`                                           |
| `wrkVSCBookings`                                       | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / wrkVSCBookings`                                       |
| `xrfCoraCompanyPrefix`                                 | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / xrfCoraCompanyPrefix`                                 |
| `xrfCoraCompanyPrefix_20111215_PostRichardHanksUpdate` | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / xrfCoraCompanyPrefix_20111215_PostRichardHanksUpdate` |
| `xrfCoraCompanyPrefix_20111215_PreRichardHanksUpdate`  | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / xrfCoraCompanyPrefix_20111215_PreRichardHanksUpdate`  |
| `xrfCoraCompanyPrefix20120910`                         | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / xrfCoraCompanyPrefix20120910`                         |
| `xrfFIAcctCode`                                        | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / xrfFIAcctCode`                                        |
| `xrfFIREPackDoc`                                       | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / xrfFIREPackDoc`                                       |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-103:publish
```
