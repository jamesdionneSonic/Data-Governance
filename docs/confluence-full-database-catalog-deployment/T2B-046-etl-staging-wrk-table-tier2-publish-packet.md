# T2B-046 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-046`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `wrk`         |
| Object type scope     | `table`       |
| Object pages          | 31            |
| Link refresh pages    | 2             |
| Total planned entries | 35            |
| Validation status     | `passed`      |

## Object Pages

| Object                                 | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                            |
| -------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| `WebV_inventory_staging`               | table | profiled, review-needed | 0          | 161     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_inventory_staging`               |
| `WebV_mps_decode_vehtype_staging`      | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_mps_decode_vehtype_staging`      |
| `WebV_mps_decode_vinattribute_staging` | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_mps_decode_vinattribute_staging` |
| `WebV_mps_decode_vinbody_staging`      | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_mps_decode_vinbody_staging`      |
| `WebV_mps_decode_vinbrkout_staging`    | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_mps_decode_vinbrkout_staging`    |
| `WebV_mps_decode_vinmake_staging`      | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_mps_decode_vinmake_staging`      |
| `WebV_mps_decode_vinmfr_staging`       | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_mps_decode_vinmfr_staging`       |
| `WebV_mps_decode_vinmodel_staging`     | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_mps_decode_vinmodel_staging`     |
| `WebV_mps_decode_vinpat_staging`       | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_mps_decode_vinpat_staging`       |
| `WebV_mps_decode_vintrim_staging`      | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_mps_decode_vintrim_staging`      |
| `WebV_mps_decode_vinyear_staging`      | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_mps_decode_vinyear_staging`      |
| `WebV_veh_exterior_color_staging`      | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_veh_exterior_color_staging`      |
| `WebV_veh_interior_color_staging`      | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_veh_interior_color_staging`      |
| `WebV_veh_inventory_staging`           | table | profiled, review-needed | 0          | 162     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_veh_inventory_staging`           |
| `WebV_veh_loc_make_staging`            | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_veh_loc_make_staging`            |
| `WebV_veh_loc_model_staging`           | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_veh_loc_model_staging`           |
| `WebV_veh_loc_series_staging`          | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_veh_loc_series_staging`          |
| `WebV_veh_vehicle_staging`             | table | profiled, review-needed | 0          | 45      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / WebV_veh_vehicle_staging`             |
| `wrkfactFIRE_Deal1`                    | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkfactFIRE_Deal1`                    |
| `wrkFactFIRE_M1_BK_827`                | table | profiled, review-needed | 0          | 52      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFactFIRE_M1_BK_827`                |
| `wrkFactFIRE_M2_BK827`                 | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFactFIRE_M2_BK827`                 |
| `wrkFactFIRE_PreLoad`                  | table | profiled, review-needed | 0          | 29      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFactFIRE_PreLoad`                  |
| `wrkFireFact_BK_827`                   | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFireFact_BK_827`                   |
| `wrkFireFact_PostUpdate`               | table | profiled, review-needed | 0          | 30      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFireFact_PostUpdate`               |
| `wrkFireFact_PreUpdate`                | table | profiled, review-needed | 0          | 30      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFireFact_PreUpdate`                |
| `wrkLender`                            | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkLender`                            |
| `wrkVSC_BK_827`                        | table | profiled, review-needed | 0          | 65      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkVSC_BK_827`                        |
| `xrfCoraCompanyPrefix20120910`         | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / xrfCoraCompanyPrefix20120910`         |
| `xrfFIREPackDoc`                       | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / xrfFIREPackDoc`                       |
| `xrfFIREPackDoc_20180926`              | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / xrfFIREPackDoc_20180926`              |
| `zzzzz_wrk.Budget_2012_Staging`        | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / zzzzz_wrk.Budget_2012_Staging`        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-046:publish
```
