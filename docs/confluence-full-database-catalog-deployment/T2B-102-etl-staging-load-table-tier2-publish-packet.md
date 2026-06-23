# T2B-102 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-102`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `load`        |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                     | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                 |
| ------------------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `adp_accounts_staging`                     | table | profiled, review-needed | 0          | 44      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / adp_accounts_staging`                     |
| `adp_hfm_accounts_staging`                 | table | profiled, review-needed | 0          | 46      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / adp_hfm_accounts_staging`                 |
| `BI_WorkDB_COA_CoCoaType2_staging`         | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / BI_WorkDB_COA_CoCoaType2_staging`         |
| `BI_WorkDB_COA_Dept_staging`               | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / BI_WorkDB_COA_Dept_staging`               |
| `BI_WorkDB_COA_Map04_staging`              | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / BI_WorkDB_COA_Map04_staging`              |
| `DimDMSDealXREF`                           | table | profiled, review-needed | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DimDMSDealXREF`                           |
| `DMS_appointments_staging`                 | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_appointments_staging`                 |
| `DMS_cora_acct_id_XLAT_Parts`              | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_cora_acct_id_XLAT_Parts`              |
| `DMS_cora_acct_id_XLAT_Service`            | table | profiled, review-needed | 1          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_cora_acct_id_XLAT_Service`            |
| `DMS_cora_acct_id_XLAT_Staging`            | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_cora_acct_id_XLAT_Staging`            |
| `DMS_employee_staging`                     | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_employee_staging`                     |
| `DMS_glcoa_staging`                        | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_glcoa_staging`                        |
| `DMS_glcoa_x_staging`                      | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_glcoa_x_staging`                      |
| `DMS_gldept_staging`                       | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_gldept_staging`                       |
| `DMS_glschedulesetup_staging`              | table | profiled, review-needed | 0          | 57      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_glschedulesetup_staging`              |
| `DMS_inventory_staging`                    | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_inventory_staging`                    |
| `DMS_labortype_staging`                    | table | profiled, review-needed | 0          | 69      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_labortype_staging`                    |
| `DMS_opcodes_staging`                      | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_opcodes_staging`                      |
| `DMS_part_staging`                         | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_part_staging`                         |
| `DMS_partssalesdetail_staging`             | table | profiled, review-needed | 0          | 45      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_partssalesdetail_staging`             |
| `DMS_PricingGrid_staging`                  | table | profiled, review-needed | 1          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_PricingGrid_staging`                  |
| `DMS_servicesalesclosed_prestaging`        | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_servicesalesclosed_prestaging`        |
| `DMS_servicesalesclosed_staging`           | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_servicesalesclosed_staging`           |
| `DMS_servicesalesdetailsclosed_prestaging` | table | profiled, review-needed | 0          | 51      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_servicesalesdetailsclosed_prestaging` |
| `DMS_servicesalesdetailsclosed_staging`    | table | profiled, review-needed | 0          | 54      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_servicesalesdetailsclosed_staging`    |
| `DMS_technician_staging`                   | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_technician_staging`                   |
| `DMS_vehicle_staging`                      | table | profiled, review-needed | 0          | 148     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / DMS_vehicle_staging`                      |
| `FDM_Account_Map_staging`                  | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / FDM_Account_Map_staging`                  |
| `FDM_Department_Map_staging`               | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / FDM_Department_Map_staging`               |
| `FDM4HFM_tDataMap_staging`                 | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / FDM4HFM_tDataMap_staging`                 |
| `FIRE_DateRange`                           | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / FIRE_DateRange`                           |
| `ROAMs_pricinggrid_staging`                | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / ROAMs_pricinggrid_staging`                |
| `stgCITGL`                                 | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgCITGL`                                 |
| `stgCITVSC`                                | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgCITVSC`                                |
| `stgFireFact`                              | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgFireFact`                              |
| `stgFireFact2`                             | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgFireFact2`                             |
| `stgFireFactUnWinds`                       | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgFireFactUnWinds`                       |
| `stgFIREGL`                                | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgFIREGL`                                |
| `stgFIREGLDetail`                          | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgFIREGLDetail`                          |
| `stgFIREWeOwe`                             | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgFIREWeOwe`                             |
| `stgLender`                                | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgLender`                                |
| `stgVSC`                                   | table | profiled, review-needed | 1          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgVSC`                                   |
| `stgVSCBook`                               | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgVSCBook`                               |
| `stgVSCBookings`                           | table | profiled, review-needed | 0          | 234     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / stgVSCBookings`                           |
| `tmpEntityLookupDiscards`                  | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / tmpEntityLookupDiscards`                  |
| `tmpVSC`                                   | table | profiled, review-needed | 0          | 234     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / tmpVSC`                                   |
| `UltiPro_staging`                          | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / UltiPro_staging`                          |
| `veh_acquired_by`                          | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_acquired_by`                          |
| `veh_acquired_type`                        | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_acquired_type`                        |
| `veh_exterior_color`                       | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_exterior_color`                       |
| `veh_interior_color`                       | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_interior_color`                       |
| `veh_inventory`                            | table | profiled, review-needed | 1          | 56      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_inventory`                            |
| `veh_loc_make`                             | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_loc_make`                             |
| `veh_loc_model`                            | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_loc_model`                            |
| `veh_loc_series`                           | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_loc_series`                           |
| `veh_order`                                | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_order`                                |
| `veh_process_code`                         | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_process_code`                         |
| `veh_segment`                              | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_segment`                              |
| `veh_source`                               | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_source`                               |
| `veh_vehicle`                              | table | profiled, review-needed | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / veh_vehicle`                              |
| `vehicle_staging`                          | table | profiled, review-needed | 1          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / vehicle_staging`                          |
| `WebV_inventory_staging`                   | table | profiled, review-needed | 0          | 159     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_inventory_staging`                   |
| `WebV_mps_decode_vehtype_staging`          | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_mps_decode_vehtype_staging`          |
| `WebV_mps_decode_vinattribute_staging`     | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_mps_decode_vinattribute_staging`     |
| `WebV_mps_decode_vinbody_staging`          | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_mps_decode_vinbody_staging`          |
| `WebV_mps_decode_vinbrkout_staging`        | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_mps_decode_vinbrkout_staging`        |
| `WebV_mps_decode_vinmake_staging`          | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_mps_decode_vinmake_staging`          |
| `WebV_mps_decode_vinmfr_staging`           | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_mps_decode_vinmfr_staging`           |
| `WebV_mps_decode_vinmodel_staging`         | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_mps_decode_vinmodel_staging`         |
| `WebV_mps_decode_vinpat_staging`           | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_mps_decode_vinpat_staging`           |
| `WebV_mps_decode_vintrim_staging`          | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_mps_decode_vintrim_staging`          |
| `WebV_mps_decode_vinyear_staging`          | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_mps_decode_vinyear_staging`          |
| `WebV_veh_exterior_color_staging`          | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / WebV_veh_exterior_color_staging`          |
| `wrkCITGL`                                 | table | profiled, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / wrkCITGL`                                 |
| `wrkCITGL_audit`                           | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load / wrkCITGL_audit`                           |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-102:publish
```
