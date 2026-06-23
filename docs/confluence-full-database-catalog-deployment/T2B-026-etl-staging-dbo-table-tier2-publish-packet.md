# T2B-026 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-026`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                    | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                               |
| ----------------------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `dwDiffActivity_D`                        | table | profiled, review-needed                            | 7          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffActivity_D`                        |
| `dwDiffActivity_U`                        | table | high-use, profiled, lineage-hotspot, review-needed | 2          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffActivity_U`                        |
| `dwDiffCustomer_D`                        | table | profiled, review-needed                            | 7          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffCustomer_D`                        |
| `dwDiffDealSalespersonMap_D`              | table | profiled, review-needed                            | 7          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffDealSalespersonMap_D`              |
| `dwDiffDealSalespersonMap_U`              | table | high-use, profiled, lineage-hotspot, review-needed | 2          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffDealSalespersonMap_U`              |
| `dwDiffEmail_D`                           | table | profiled, review-needed                            | 10         | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffEmail_D`                           |
| `dwDiffLegacyCustomerID_D`                | table | profiled, review-needed                            | 7          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffLegacyCustomerID_D`                |
| `dwDiffLegacyCustomerID_U`                | table | high-use, profiled, lineage-hotspot, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffLegacyCustomerID_U`                |
| `dwDiffLegacyEmployeeID_D`                | table | profiled, review-needed                            | 6          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffLegacyEmployeeID_D`                |
| `dwDiffLegacyEmployeeID_U`                | table | high-use, profiled, lineage-hotspot, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffLegacyEmployeeID_U`                |
| `dwDiffOpportunity_D`                     | table | profiled, review-needed                            | 7          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffOpportunity_D`                     |
| `dwDiffOpportunity_U`                     | table | high-use, profiled, lineage-hotspot, review-needed | 2          | 71      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffOpportunity_U`                     |
| `dwDiffPhone_D`                           | table | profiled, review-needed                            | 5          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffPhone_D`                           |
| `dwDiffPhone_U`                           | table | high-use, profiled, lineage-hotspot, review-needed | 2          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffPhone_U`                           |
| `dwDiffVehicle_D`                         | table | profiled, review-needed                            | 7          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffVehicle_D`                         |
| `dwDiffVehicle_U`                         | table | high-use, profiled, lineage-hotspot, review-needed | 2          | 87      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffVehicle_U`                         |
| `dwDiffVehicleSought_D`                   | table | profiled, review-needed                            | 7          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffVehicleSought_D`                   |
| `dwDiffVehicleSought_U`                   | table | high-use, profiled, lineage-hotspot, review-needed | 2          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffVehicleSought_U`                   |
| `dwFullActivity`                          | table | high-use, profiled, lineage-hotspot, review-needed | 15         | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullActivity`                          |
| `dwFullCustomer`                          | table | high-use, profiled, lineage-hotspot, review-needed | 12         | 79      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullCustomer`                          |
| `dwFullDealSalespersonMap`                | table | profiled, review-needed                            | 3          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullDealSalespersonMap`                |
| `dwFullEmail`                             | table | profiled, review-needed                            | 4          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullEmail`                             |
| `dwFullLegacyCustomerID`                  | table | high-use, profiled, lineage-hotspot, review-needed | 10         | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullLegacyCustomerID`                  |
| `dwFullLegacyEmployeeID`                  | table | profiled, review-needed                            | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullLegacyEmployeeID`                  |
| `dwFullOpportunity`                       | table | high-use, profiled, lineage-hotspot, review-needed | 33         | 73      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullOpportunity`                       |
| `dwFullOpportunity_Old`                   | table | profiled, review-needed                            | 1          | 73      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullOpportunity_Old`                   |
| `dwFullTaskItem`                          | table | profiled, review-needed                            | 4          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullTaskItem`                          |
| `dwFullUser`                              | table | profiled, review-needed                            | 4          | 46      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullUser`                              |
| `dwFullVehicle`                           | table | high-use, profiled, lineage-hotspot, review-needed | 15         | 89      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullVehicle`                           |
| `dwFullVehicleSought`                     | table | high-use, profiled, lineage-hotspot, review-needed | 19         | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullVehicleSought`                     |
| `dwFullWarranty`                          | table | profiled, review-needed                            | 3          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullWarranty`                          |
| `EchoParkGECReportMTD`                    | table | profiled, review-needed                            | 3          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / EchoParkGECReportMTD`                    |
| `Elead_Entity`                            | table | profiled, review-needed                            | 2          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Elead_Entity`                            |
| `Fact_CreditApp_stage`                    | table | profiled, review-needed                            | 7          | 144     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Fact_CreditApp_stage`                    |
| `FORCE_CoraFilter`                        | table | profiled, review-needed                            | 6          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FORCE_CoraFilter`                        |
| `FORCE_DateControl`                       | table | profiled, review-needed                            | 7          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FORCE_DateControl`                       |
| `Invalid_Vin`                             | table | profiled, review-needed                            | 1          | 44      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Invalid_Vin`                             |
| `LU_Location_2_Organization`              | table | profiled, review-needed                            | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / LU_Location_2_Organization`              |
| `ServiceVins_Staging_A`                   | table | profiled, review-needed                            | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ServiceVins_Staging_A`                   |
| `SIMSEPVehicleMake`                       | table | profiled, review-needed                            | 3          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSEPVehicleMake`                       |
| `SIMSRTVehicleMake`                       | table | profiled, review-needed                            | 3          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSRTVehicleMake`                       |
| `StageTrafficDailySourceSubSourceAgg`     | table | profiled, review-needed                            | 7          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficDailySourceSubSourceAgg`     |
| `StageTrafficDailySourceSubSourceAgg_MTD` | table | profiled, review-needed                            | 4          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficDailySourceSubSourceAgg_MTD` |
| `StageTrafficSummaryDaily`                | table | profiled, review-needed                            | 5          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficSummaryDaily`                |
| `StageTrafficSummaryDaily_EntUnmatched`   | table | profiled, review-needed                            | 3          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficSummaryDaily_EntUnmatched`   |
| `StageTrafficSummaryDaily_MTD`            | table | profiled, review-needed                            | 4          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficSummaryDaily_MTD`            |
| `StageTrafficSummaryDailyDepartment`      | table | profiled, review-needed                            | 4          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficSummaryDailyDepartment`      |
| `StageTrafficSummaryDailyDepartment_MTD`  | table | profiled, review-needed                            | 4          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficSummaryDailyDepartment_MTD`  |
| `StageTrafficTextPerformance`             | table | profiled, review-needed                            | 4          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageTrafficTextPerformance`             |
| `StgFactOppScores`                        | table | profiled, review-needed                            | 4          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFactOppScores`                        |
| `StgFBAudienceBMWBrand`                   | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceBMWBrand`                   |
| `StgFBAudienceCarCashAppSoldAudience`     | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceCarCashAppSoldAudience`     |
| `StgFBAudienceDeclinedService_Final`      | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceDeclinedService_Final`      |
| `StgFBAudienceEquityBMWTerm`              | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceEquityBMWTerm`              |
| `StgFBAudienceEquityCustomers`            | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceEquityCustomers`            |
| `StgFBAudienceFinanceBMWTerm`             | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceFinanceBMWTerm`             |
| `StgFBAudienceFinanceTerm`                | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceFinanceTerm`                |
| `StgFBAudienceLeaseBMWTerm`               | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceLeaseBMWTerm`               |
| `StgFBAudienceLeaseTerm`                  | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceLeaseTerm`                  |
| `StgFBAudienceLostServiceCustomers`       | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceLostServiceCustomers`       |
| `StgFBAudienceMercedesAutobahn`           | table | profiled, review-needed                            | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceMercedesAutobahn`           |
| `StgFBAudienceUnsoldShowroom_Final`       | table | profiled, review-needed                            | 4          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceUnsoldShowroom_Final`       |
| `StgFullActivity`                         | table | profiled, review-needed                            | 1          | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullActivity`                         |
| `StgFullCustomer`                         | table | profiled, review-needed                            | 1          | 79      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullCustomer`                         |
| `StgFullDealSalespersonMap`               | table | profiled, review-needed                            | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullDealSalespersonMap`               |
| `StgFullEmail`                            | table | profiled, review-needed                            | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullEmail`                            |
| `StgFullLegacyCustomerID`                 | table | profiled, review-needed                            | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullLegacyCustomerID`                 |
| `StgFullLegacyEmployeeID`                 | table | profiled, review-needed                            | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullLegacyEmployeeID`                 |
| `StgFullOpportunity`                      | table | profiled, review-needed                            | 1          | 73      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullOpportunity`                      |
| `StgFullTaskItem`                         | table | profiled, review-needed                            | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullTaskItem`                         |
| `StgFullUser`                             | table | profiled, review-needed                            | 1          | 46      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullUser`                             |
| `StgFullVehicle`                          | table | profiled, review-needed                            | 1          | 89      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullVehicle`                          |
| `StgFullVehicleSought`                    | table | profiled, review-needed                            | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFullVehicleSought`                    |
| `sysdiagrams`                             | table | profiled, review-needed                            | 6          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / sysdiagrams`                             |
| `TrafficSummaryEleadStoreList`            | table | profiled, review-needed                            | 9          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TrafficSummaryEleadStoreList`            |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-026:publish
```
