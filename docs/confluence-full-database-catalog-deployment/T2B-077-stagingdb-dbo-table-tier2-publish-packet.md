# T2B-077 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-077`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                         | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                  |
| ---------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `customer_date_temp`                           | table | profiled, review-needed | 0          | 112     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / customer_date_temp`                           |
| `customer_err`                                 | table | profiled, review-needed | 0          | 150     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / customer_err`                                 |
| `customer_error_out_tmp`                       | table | profiled, review-needed | 0          | 222     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / customer_error_out_tmp`                       |
| `customer_pass_connection`                     | table | profiled, review-needed | 0          | 91      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / customer_pass_connection`                     |
| `customer_staging_2`                           | table | profiled, review-needed | 0          | 151     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / customer_staging_2`                           |
| `customer_staging_3`                           | table | profiled, review-needed | 0          | 151     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / customer_staging_3`                           |
| `customer_staging_4`                           | table | profiled, review-needed | 0          | 151     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / customer_staging_4`                           |
| `customer_staging_5`                           | table | profiled, review-needed | 0          | 151     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / customer_staging_5`                           |
| `customer_staging_tmp`                         | table | profiled, review-needed | 0          | 112     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / customer_staging_tmp`                         |
| `customer_test_excution_builder`               | table | profiled, review-needed | 0          | 91      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / customer_test_excution_builder`               |
| `DatabaseStatus`                               | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / DatabaseStatus`                               |
| `date_tempII`                                  | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / date_tempII`                                  |
| `DeleteGLrecords_keys`                         | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / DeleteGLrecords_keys`                         |
| `DODB - pgc_servicesalesdetailsclosed_Staging` | table | profiled, review-needed | 0          | 196     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / DODB - pgc_servicesalesdetailsclosed_Staging` |
| `DODB - Report`                                | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / DODB - Report`                                |
| `dwDiffActivity_Prod_20240401`                 | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / dwDiffActivity_Prod_20240401`                 |
| `dwDiffActivity_U_03Jan2024`                   | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / dwDiffActivity_U_03Jan2024`                   |
| `EchoParkCSISalesStg`                          | table | profiled, review-needed | 2          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / EchoParkCSISalesStg`                          |
| `EchoParkCSIServiceStg`                        | table | profiled, review-needed | 2          | 46      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / EchoParkCSIServiceStg`                        |
| `entity_share_staging`                         | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / entity_share_staging`                         |
| `etl.zzzzzentity_other_active_lkUp`            | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / etl.zzzzzentity_other_active_lkUp`            |
| `FactAccountDetail_Src_Staging`                | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / FactAccountDetail_Src_Staging`                |
| `FO_DeleteKeys`                                | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / FO_DeleteKeys`                                |
| `fsglpclcodes_staging`                         | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / fsglpclcodes_staging`                         |
| `gldept_staging`                               | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / gldept_staging`                               |
| `Gldetail_TT`                                  | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Gldetail_TT`                                  |
| `gljedetail_cur_BAK`                           | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / gljedetail_cur_BAK`                           |
| `GLJEDetailMonthly_Src_Staging`                | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / GLJEDetailMonthly_Src_Staging`                |
| `gljedetal_cur_Stagingn_Table`                 | table | profiled, review-needed | 0          | 57      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / gljedetal_cur_Stagingn_Table`                 |
| `gljeheader_BAK`                               | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / gljeheader_BAK`                               |
| `IinventoryVehicle_staging`                    | table | profiled, review-needed | 0          | 86      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / IinventoryVehicle_staging`                    |
| `JDPower_New_Staging`                          | table | profiled, review-needed | 0          | 58      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / JDPower_New_Staging`                          |
| `load_test_copy_rims`                          | table | profiled, review-needed | 0          | 138     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / load_test_copy_rims`                          |
| `load_test_rj`                                 | table | profiled, review-needed | 0          | 358     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / load_test_rj`                                 |
| `MDPCustomerIDS`                               | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / MDPCustomerIDS`                               |
| `NewDMSCustomersDaily`                         | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / NewDMSCustomersDaily`                         |
| `OLE DB Destination`                           | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / OLE DB Destination`                           |
| `OLE DB Destination 1`                         | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / OLE DB Destination 1`                         |
| `OLE DB Destination1`                          | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / OLE DB Destination1`                          |
| `opcodes_staging`                              | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / opcodes_staging`                              |
| `open_error`                                   | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / open_error`                                   |
| `Open_file`                                    | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Open_file`                                    |
| `pals_ValidationsDimensionsDriver`             | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / pals_ValidationsDimensionsDriver`             |
| `Pals_Vehicle`                                 | table | profiled, review-needed | 0          | 138     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Pals_Vehicle`                                 |
| `partsinventory_satgingII`                     | table | profiled, review-needed | 0          | 120     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / partsinventory_satgingII`                     |
| `partsinventory_stagingIII`                    | table | profiled, review-needed | 0          | 149     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / partsinventory_stagingIII`                    |
| `pg_dm_dlr_staging`                            | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / pg_dm_dlr_staging`                            |
| `pg_dm_download_run_staging`                   | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / pg_dm_download_run_staging`                   |
| `pgc_appointments_Staging`                     | table | profiled, review-needed | 0          | 116     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / pgc_appointments_Staging`                     |
| `pgc_inventoryvehicle_staging`                 | table | profiled, review-needed | 0          | 171     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / pgc_inventoryvehicle_staging`                 |
| `pgc_servicesalesdetailsclosed_Staging`        | table | profiled, review-needed | 0          | 82      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / pgc_servicesalesdetailsclosed_Staging`        |
| `pgc_SourceValidationGrpCounts`                | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / pgc_SourceValidationGrpCounts`                |
| `Pgc_Vehicle_Staging_error_Output`             | table | profiled, review-needed | 0          | 360     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Pgc_Vehicle_Staging_error_Output`             |
| `pgs_AccountLedger_Staging`                    | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / pgs_AccountLedger_Staging`                    |
| `Pls_vehicle_SIMS_Staging_Error_output`        | table | profiled, review-needed | 0          | 358     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Pls_vehicle_SIMS_Staging_Error_output`        |
| `Polk_Data_staging_Used`                       | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Polk_Data_staging_Used`                       |
| `POSTGRES_RELOADS$`                            | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / POSTGRES_RELOADS$`                            |
| `postgres_status_tmp`                          | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / postgres_status_tmp`                          |
| `PostgressDMSLoadHistory`                      | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / PostgressDMSLoadHistory`                      |
| `ReconLocationWorkingHours`                    | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / ReconLocationWorkingHours`                    |
| `ServerDiskStatus`                             | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / ServerDiskStatus`                             |
| `SIMSBookUndeleteKeys`                         | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / SIMSBookUndeleteKeys`                         |
| `SIMSBookUndeletes`                            | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / SIMSBookUndeletes`                            |
| `SIMSBookValueUndeleteKeys`                    | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / SIMSBookValueUndeleteKeys`                    |
| `SIMSstatusUndeleteKeys`                       | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / SIMSstatusUndeleteKeys`                       |
| `SIMSStatusUndeletes`                          | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / SIMSStatusUndeletes`                          |
| `SIMSVehicledeleteKeys`                        | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / SIMSVehicledeleteKeys`                        |
| `SIMSVehicleUndeletes`                         | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / SIMSVehicleUndeletes`                         |
| `sql_TargetValidationGrpCounts`                | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / sql_TargetValidationGrpCounts`                |
| `Step_Check_Union`                             | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Step_Check_Union`                             |
| `Stg_CensusZIPCrossWalk`                       | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Stg_CensusZIPCrossWalk`                       |
| `stg_JobRunStatus`                             | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / stg_JobRunStatus`                             |
| `StgCarGurusExpiredListingIDs`                 | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCarGurusExpiredListingIDs`                 |
| `StgCarGurusScrapingInput`                     | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCarGurusScrapingInput`                     |
| `StgCargurusSellerReviews`                     | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCargurusSellerReviews`                     |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-077:publish
```
