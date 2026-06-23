# T2B-033 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-033`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                         | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                    |
| ---------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `StageTrafficDailySourceSubSourceAgg_MTD_Runs` | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficDailySourceSubSourceAgg_MTD_Runs` |
| `StageTrafficDailySourceSubSourceAgg_Runs`     | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficDailySourceSubSourceAgg_Runs`     |
| `StageTrafficSummaryDaily_MTD_Runs`            | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficSummaryDaily_MTD_Runs`            |
| `StageTrafficSummaryDaily_Runs`                | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficSummaryDaily_Runs`                |
| `StandardLeadSourceMapping`                    | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StandardLeadSourceMapping`                    |
| `StandardMakeLookup_20241119`                  | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StandardMakeLookup_20241119`                  |
| `standardmakelookup_bkp_20241212`              | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / standardmakelookup_bkp_20241212`              |
| `Start_CSIMapping`                             | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Start_CSIMapping`                             |
| `Step_1_ODC_checks_GLH_GLD`                    | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Step_1_ODC_checks_GLH_GLD`                    |
| `Step_2_AP_Checks_GLH_GLD`                     | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Step_2_AP_Checks_GLH_GLD`                     |
| `Step_3_Check_Staging`                         | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Step_3_Check_Staging`                         |
| `Step_3_Check_Target`                          | table | profiled, review-needed | 0          | 52      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Step_3_Check_Target`                          |
| `Step_Check_Union`                             | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Step_Check_Union`                             |
| `stg_Dim_Vehicle_Inventory`                    | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / stg_Dim_Vehicle_Inventory`                    |
| `stg_Dim_Vehicle_Service`                      | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / stg_Dim_Vehicle_Service`                      |
| `StgDimActivityStatus`                         | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgDimActivityStatus`                         |
| `stgDimDealType`                               | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / stgDimDealType`                               |
| `StgFacebookUpload_Error`                      | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFacebookUpload_Error`                      |
| `StgFacebookUpload_Success`                    | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFacebookUpload_Success`                    |
| `StgFacebookUploadCarCashEvents`               | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFacebookUploadCarCashEvents`               |
| `StgFactActivity_Historical`                   | table | profiled, review-needed | 0          | 57      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFactActivity_Historical`                   |
| `StgFactOpportunity_Duplicate_Temp`            | table | profiled, review-needed | 0          | 57      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFactOpportunity_Duplicate_Temp`            |
| `StgFactOpportunity_FA_Temp`                   | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFactOpportunity_FA_Temp`                   |
| `StgFactOpportunity_LoadSource_Temp`           | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFactOpportunity_LoadSource_Temp`           |
| `StgFactOpportunity_MergeSource_Temp`          | table | profiled, review-needed | 0          | 30      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFactOpportunity_MergeSource_Temp`          |
| `StgFactOpportunity_ScoresFactSource_Temp`     | table | profiled, review-needed | 0          | 57      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFactOpportunity_ScoresFactSource_Temp`     |
| `StgFactOppScores_Historical`                  | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFactOppScores_Historical`                  |
| `StgFBCarCashEvents`                           | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBCarCashEvents`                           |
| `StgFBCarCashEvents_Error`                     | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBCarCashEvents_Error`                     |
| `StgFBCarCashEvents_Success`                   | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBCarCashEvents_Success`                   |
| `StgFullCompany`                               | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullCompany`                               |
| `StgSimsBookValueResponse`                     | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgSimsBookValueResponse`                     |
| `SurveyGizmoCatchup08132020`                   | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SurveyGizmoCatchup08132020`                   |
| `TCT_eLead_Opportunities`                      | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TCT_eLead_Opportunities`                      |
| `Test_customer`                                | table | profiled, review-needed | 0          | 157     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Test_customer`                                |
| `test1`                                        | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / test1`                                        |
| `TestAssociateDupes`                           | table | profiled, review-needed | 0          | 30      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TestAssociateDupes`                           |
| `TitleStatus_staging`                          | table | profiled, review-needed | 3          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TitleStatus_staging`                          |
| `TMD_CustomSourceSubSource`                    | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMD_CustomSourceSubSource`                    |
| `TMDValidation_Daily_MTD_PerUpType`            | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMDValidation_Daily_MTD_PerUpType`            |
| `TMDValidation_Daily_MTD_Total`                | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMDValidation_Daily_MTD_Total`                |
| `TMDValidation_Daily_PerUpType`                | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMDValidation_Daily_PerUpType`                |
| `TMDValidation_Daily_Total`                    | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMDValidation_Daily_Total`                    |
| `TMDValidation_EntityMatchChecks`              | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMDValidation_EntityMatchChecks`              |
| `TMDValidation_MetricMatchErrors`              | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMDValidation_MetricMatchErrors`              |
| `TMP1companyBJdev`                             | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMP1companyBJdev`                             |
| `TMP1custNoBJDev`                              | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMP1custNoBJDev`                              |
| `TMP1eLead_Opportunity_TradeIn_VehiclesBJDev`  | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMP1eLead_Opportunity_TradeIn_VehiclesBJDev`  |
| `TMP1newUsedBJDev`                             | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMP1newUsedBJDev`                             |
| `TMP1tradeInBJDev`                             | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TMP1tradeInBJDev`                             |
| `tmpBMWFDCI`                                   | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / tmpBMWFDCI`                                   |
| `tmpBMWMenu`                                   | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / tmpBMWMenu`                                   |
| `tmpChevyFDCI`                                 | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / tmpChevyFDCI`                                 |
| `tmpFORDFDCI`                                  | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / tmpFORDFDCI`                                  |
| `tmpFordOpCodes`                               | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / tmpFordOpCodes`                               |
| `tmpPilotOpCodes`                              | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / tmpPilotOpCodes`                              |
| `tmpVehServiceMileage`                         | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / tmpVehServiceMileage`                         |
| `TodayGLJEDetail_Cur`                          | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TodayGLJEDetail_Cur`                          |
| `TrafficSummaryStores`                         | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TrafficSummaryStores`                         |
| `Transaction Data Destination`                 | table | profiled, review-needed | 0          | 54      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Transaction Data Destination`                 |
| `TURBODateLoops`                               | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TURBODateLoops`                               |
| `UKGIncrementalUpdate`                         | table | profiled, review-needed | 0          | 72      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / UKGIncrementalUpdate`                         |
| `Unmapped_Vehicles_2025_01_20250130`           | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Unmapped_Vehicles_2025_01_20250130`           |
| `UnmappedVehicles`                             | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / UnmappedVehicles`                             |
| `UpdateCallRevuDepartmentKey`                  | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / UpdateCallRevuDepartmentKey`                  |
| `updated_mapping12132024`                      | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / updated_mapping12132024`                      |
| `Valid VINs with UNKNOWN values filled - Copy` | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Valid VINs with UNKNOWN values filled - Copy` |
| `Vehicle Mapping`                              | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Vehicle Mapping`                              |
| `Vehicle_FuelMapping_20250206`                 | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Vehicle_FuelMapping_20250206`                 |
| `vehicle_staging_stg`                          | table | profiled, review-needed | 0          | 144     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / vehicle_staging_stg`                          |
| `VehicleOwners`                                | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / VehicleOwners`                                |
| `VehModelCategory_Dim_VehicleUpdate_20240419`  | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / VehModelCategory_Dim_VehicleUpdate_20240419`  |
| `webV_veh_loc_make`                            | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / webV_veh_loc_make`                            |
| `WebV_veh_Loc_Model`                           | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / WebV_veh_Loc_Model`                           |
| `wrrk.RecallMasterSales3`                      | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / wrrk.RecallMasterSales3`                      |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-033:publish
```
