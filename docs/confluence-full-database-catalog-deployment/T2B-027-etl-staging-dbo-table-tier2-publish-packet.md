# T2B-027 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-027`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                      | Type  | Tags                                     | Downstream | Columns | Confidence | Path                                                                                                                 |
| ------------------------------------------- | ----- | ---------------------------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `COA_Dept`                                  | table | profiled, review-needed                  | 0          | 57      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / COA_Dept`                                  |
| `ControllerScorecardPoints`                 | table | profiled, review-needed                  | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ControllerScorecardPoints`                 |
| `DMSCustomerKeyIDX`                         | table | profiled, review-needed                  | 2          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DMSCustomerKeyIDX`                         |
| `dwDiffActivity`                            | table | profiled, review-needed                  | 1          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffActivity`                            |
| `dwDiffActivity_I`                          | table | profiled, review-needed                  | 4          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffActivity_I`                          |
| `dwDiffAudit_I`                             | table | profiled, review-needed                  | 2          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffAudit_I`                             |
| `dwDiffCustomer_I`                          | table | profiled, review-needed                  | 2          | 77      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffCustomer_I`                          |
| `dwDiffCustomer_U`                          | table | profiled, review-needed                  | 2          | 77      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffCustomer_U`                          |
| `dwDiffDealSalespersonMap_I`                | table | profiled, review-needed                  | 2          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffDealSalespersonMap_I`                |
| `dwDiffEmail_I`                             | table | profiled, review-needed                  | 2          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffEmail_I`                             |
| `dwDiffEmail_U`                             | table | profiled, review-needed                  | 2          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffEmail_U`                             |
| `dwDiffLegacyCustomerID_I`                  | table | profiled, review-needed                  | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffLegacyCustomerID_I`                  |
| `dwDiffLegacyEmployeeID_I`                  | table | profiled, review-needed                  | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffLegacyEmployeeID_I`                  |
| `dwDiffMessages_I`                          | table | profiled, review-needed                  | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffMessages_I`                          |
| `dwDiffOpportunity_I`                       | table | profiled, review-needed                  | 2          | 71      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffOpportunity_I`                       |
| `dwDiffPhone_I`                             | table | profiled, review-needed                  | 2          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffPhone_I`                             |
| `dwDiffTaskItem_I`                          | table | profiled, review-needed                  | 2          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffTaskItem_I`                          |
| `dwDiffVehicle_I`                           | table | profiled, review-needed                  | 2          | 87      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffVehicle_I`                           |
| `dwDiffVehicleSought_I`                     | table | profiled, review-needed                  | 2          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffVehicleSought_I`                     |
| `dwDiffWarranty_D`                          | table | profiled, review-needed                  | 1          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffWarranty_D`                          |
| `dwDiffWarranty_I`                          | table | profiled, review-needed                  | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffWarranty_I`                          |
| `dwFullCompany`                             | table | profiled, review-needed                  | 4          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullCompany`                             |
| `dwFullCompany_P`                           | table | profiled, review-needed                  | 2          | 34      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullCompany_P`                           |
| `dwFullDaylightSavingTime`                  | table | profiled, review-needed                  | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullDaylightSavingTime`                  |
| `dwFullEmailOptOut_P`                       | table | profiled, review-needed                  | 2          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullEmailOptOut_P`                       |
| `dwFullPosition_P`                          | table | profiled, review-needed                  | 2          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullPosition_P`                          |
| `dwFullRelationship_P`                      | table | profiled, review-needed                  | 2          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullRelationship_P`                      |
| `dwFullUser_P`                              | table | profiled, review-needed                  | 2          | 44      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullUser_P`                              |
| `dwFullUserPositionMap_P`                   | table | profiled, review-needed                  | 2          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullUserPositionMap_P`                   |
| `eLeads_Load_UDI_status`                    | table | profiled, review-needed                  | 3          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / eLeads_Load_UDI_status`                    |
| `FailedAudienceIDBMWBrand`                  | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDBMWBrand`                  |
| `FailedAudienceIDCarCashAppSold`            | table | profiled, review-needed                  | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDCarCashAppSold`            |
| `FailedAudienceIDCarCashUnSold`             | table | profiled, review-needed                  | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDCarCashUnSold`             |
| `FailedAudienceIDCarCashWebSold`            | table | profiled, review-needed                  | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDCarCashWebSold`            |
| `FailedAudienceIDDeclinedService`           | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDDeclinedService`           |
| `FailedAudienceIDDueforService`             | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDDueforService`             |
| `FailedAudienceIDEndofFinanceTerm`          | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDEndofFinanceTerm`          |
| `FailedAudienceIDEquityBMWTerm`             | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDEquityBMWTerm`             |
| `FailedAudienceIDEquityCustomers`           | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDEquityCustomers`           |
| `FailedAudienceIDFinanceBMWTerm`            | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDFinanceBMWTerm`            |
| `FailedAudienceIDLeaseBMWTerm`              | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDLeaseBMWTerm`              |
| `FailedAudienceIDLeaseTerm`                 | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDLeaseTerm`                 |
| `FailedAudienceIDLostServiceCustomer`       | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDLostServiceCustomer`       |
| `FailedAudienceIDMercedesAutobahn`          | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDMercedesAutobahn`          |
| `FailedAudienceIDNonServiceCustomer`        | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDNonServiceCustomer`        |
| `FailedAudienceIDPurchaseAnniversary`       | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDPurchaseAnniversary`       |
| `FailedAudienceIDUnsoldShowroom`            | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceIDUnsoldShowroom`            |
| `FORCEMileageOpportunityExpanded`           | table | profiled, review-needed                  | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FORCEMileageOpportunityExpanded`           |
| `GPA_TheNetworkEntityMapping`               | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GPA_TheNetworkEntityMapping`               |
| `mds_DimEntities_export`                    | table | profiled, review-needed                  | 2          | 110     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / mds_DimEntities_export`                    |
| `mdsSonicEntitiesDimEntitiesAttributes_tmp` | table | profiled, review-needed                  | 2          | 65      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / mdsSonicEntitiesDimEntitiesAttributes_tmp` |
| `Microstrategy_EV_Vehicle_Mapping`          | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Microstrategy_EV_Vehicle_Mapping`          |
| `opportunity`                               | table | profiled, review-needed                  | 2          | 318     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / opportunity`                               |
| `RouteOne_Daily_Mart_Staging`               | table | profiled, review-needed                  | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / RouteOne_Daily_Mart_Staging`               |
| `Sa_Deal_fire_opp`                          | table | profiled, review-needed                  | 2          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Sa_Deal_fire_opp`                          |
| `SIMSEPAppraisal`                           | table | profiled, review-needed                  | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSEPAppraisal`                           |
| `SIMSEPOrganization`                        | table | profiled, review-needed                  | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSEPOrganization`                        |
| `SIMSEPVehicleInventory`                    | table | profiled, lineage-hotspot, review-needed | 1          | 80      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSEPVehicleInventory`                    |
| `SIMSRTAppraisal`                           | table | profiled, review-needed                  | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSRTAppraisal`                           |
| `SIMSRTVehicleInventory`                    | table | profiled, lineage-hotspot, review-needed | 1          | 79      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSRTVehicleInventory`                    |
| `StageSameDayAppt`                          | table | profiled, review-needed                  | 2          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StageSameDayAppt`                          |
| `StandardMakeLookup`                        | table | profiled, review-needed                  | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StandardMakeLookup`                        |
| `Stg_QuartileOpportunityElead`              | table | profiled, review-needed                  | 1          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Stg_QuartileOpportunityElead`              |
| `Stg_QuartileOpportunityScores`             | table | profiled, review-needed                  | 2          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Stg_QuartileOpportunityScores`             |
| `StgDimFocusCustomer`                       | table | profiled, review-needed                  | 1          | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgDimFocusCustomer`                       |
| `StgDimVehicleSought`                       | table | profiled, review-needed                  | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgDimVehicleSought`                       |
| `StgFactActivity`                           | table | profiled, review-needed                  | 2          | 56      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFactActivity`                           |
| `StgFBAudienceCarCashUnSoldAudience`        | table | profiled, review-needed                  | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceCarCashUnSoldAudience`        |
| `StgFBAudienceNonServiceCustomers`          | table | profiled, review-needed                  | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceNonServiceCustomers`          |
| `StgFBAudiencePurchaseAnniversary`          | table | profiled, review-needed                  | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudiencePurchaseAnniversary`          |
| `StgFBAudienceServiceDue`                   | table | profiled, review-needed                  | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceServiceDue`                   |
| `StgSimsEPVehicle`                          | table | profiled, review-needed                  | 1          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgSimsEPVehicle`                          |
| `StgSimsRTVehicle`                          | table | profiled, review-needed                  | 1          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgSimsRTVehicle`                          |
| `tblQuartile_Staging`                       | table | profiled, review-needed                  | 0          | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / tblQuartile_Staging`                       |
| `ViolationRule`                             | table | profiled, review-needed                  | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ViolationRule`                             |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-027:publish
```
