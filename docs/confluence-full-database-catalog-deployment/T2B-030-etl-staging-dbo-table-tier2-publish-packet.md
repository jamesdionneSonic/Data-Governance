# T2B-030 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-030`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                       | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                  |
| -------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `dwFullTextConversation`                     | table | profiled, review-needed | 1          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullTextConversation`                     |
| `dwFullTextConversationElement`              | table | profiled, review-needed | 1          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullTextConversationElement`              |
| `dwFullTextConversationMessage`              | table | profiled, review-needed | 1          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullTextConversationMessage`              |
| `dwFullTextCustomerNumber`                   | table | profiled, review-needed | 1          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullTextCustomerNumber`                   |
| `dwFullTextOptInStatus`                      | table | profiled, review-needed | 1          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullTextOptInStatus`                      |
| `dwStatus_dbSonicDW`                         | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwStatus_dbSonicDW`                         |
| `EGMappingNash`                              | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / EGMappingNash`                              |
| `eLeadTMOutPut_MomentumBMW`                  | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / eLeadTMOutPut_MomentumBMW`                  |
| `Employee HR Data - Historical`              | table | profiled, review-needed | 0          | 30      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Employee HR Data - Historical`              |
| `EntityRelationshipGoogleAnalyticsViewID360` | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / EntityRelationshipGoogleAnalyticsViewID360` |
| `EP_DDCVehicleViewsUpdate`                   | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / EP_DDCVehicleViewsUpdate`                   |
| `ERIMS_Entity`                               | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ERIMS_Entity`                               |
| `Err_DimGLDetail`                            | table | profiled, review-needed | 0          | 78      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Err_DimGLDetail`                            |
| `error`                                      | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / error`                                      |
| `etl.LkpJournalType`                         | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / etl.LkpJournalType`                         |
| `Fact_AccountingDetail_BAk`                  | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Fact_AccountingDetail_BAk`                  |
| `FactCallSourceDeletes_CallRevu`             | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FactCallSourceDeletes_CallRevu`             |
| `FactCallSourceEnt59`                        | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FactCallSourceEnt59`                        |
| `FactOppNewVehicleFlagUpdate_20231003`       | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FactOppNewVehicleFlagUpdate_20231003`       |
| `FactOppNewVehicleFlagUpdate_20231003_oct`   | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FactOppNewVehicleFlagUpdate_20231003_oct`   |
| `FactOppNewVehicleFlagUpdate_hist`           | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FactOppNewVehicleFlagUpdate_hist`           |
| `FactOpportunity_BK`                         | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FactOpportunity_BK`                         |
| `FailedAudienceID`                           | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailedAudienceID`                           |
| `FailureList`                                | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureList`                                |
| `FailureListBMWBrand`                        | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListBMWBrand`                        |
| `FailureListCarCashAppSold`                  | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListCarCashAppSold`                  |
| `FailureListCarCashUnSold`                   | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListCarCashUnSold`                   |
| `FailureListCarCashWebSold`                  | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListCarCashWebSold`                  |
| `FailureListDeclinedService`                 | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListDeclinedService`                 |
| `FailureListDueforService`                   | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListDueforService`                   |
| `FailureListEndofFinanceTerm`                | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListEndofFinanceTerm`                |
| `FailureListEquityBMWTerm`                   | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListEquityBMWTerm`                   |
| `FailureListEquityCustomers`                 | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListEquityCustomers`                 |
| `FailureListFinanceBMWTerm`                  | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListFinanceBMWTerm`                  |
| `FailureListLeaseBMWTerm`                    | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListLeaseBMWTerm`                    |
| `FailureListLeaseTerm`                       | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListLeaseTerm`                       |
| `FailureListLostServiceCustomer`             | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListLostServiceCustomer`             |
| `FailureListMercedesAutobahn`                | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListMercedesAutobahn`                |
| `FailureListNonServiceCustomer`              | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListNonServiceCustomer`              |
| `FailureListPurchaseAnniversary`             | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListPurchaseAnniversary`             |
| `FailureListUnsoldShowroom`                  | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FailureListUnsoldShowroom`                  |
| `FCSCallerNumber`                            | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FCSCallerNumber`                            |
| `FCSValidation_CallRevuDailyRecordLoad`      | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FCSValidation_CallRevuDailyRecordLoad`      |
| `FCSValidation_CallRevuLocations`            | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FCSValidation_CallRevuLocations`            |
| `FCSValidation_DailyFileLoadChecks`          | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FCSValidation_DailyFileLoadChecks`          |
| `FCSValidation_EntityMatchChecks`            | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FCSValidation_EntityMatchChecks`            |
| `FinalMapping - February 2025-02-21`         | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FinalMapping - February 2025-02-21`         |
| `FireDeals_Hashed`                           | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FireDeals_Hashed`                           |
| `FO_DeleteKeys`                              | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FO_DeleteKeys`                              |
| `FORCEMileageOpportunityExpanded_old`        | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FORCEMileageOpportunityExpanded_old`        |
| `FSD_temp_04032017`                          | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FSD_temp_04032017`                          |
| `GLBalance_Step_1`                           | table | profiled, review-needed | 1          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GLBalance_Step_1`                           |
| `GLCheck_Step_1`                             | table | profiled, review-needed | 2          | 51      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GLCheck_Step_1`                             |
| `GLInvoice_Step_1`                           | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GLInvoice_Step_1`                           |
| `gljedetail_2008_12`                         | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / gljedetail_2008_12`                         |
| `gljedetail_2011`                            | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / gljedetail_2011`                            |
| `gljedetail_2012`                            | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / gljedetail_2012`                            |
| `gljedetail_2013`                            | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / gljedetail_2013`                            |
| `gljedetail_215`                             | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / gljedetail_215`                             |
| `gljedetail_424`                             | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / gljedetail_424`                             |
| `GLJEDETAIL_TMP`                             | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GLJEDETAIL_TMP`                             |
| `gljeheader_2011`                            | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / gljeheader_2011`                            |
| `gljeheader_2012`                            | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / gljeheader_2012`                            |
| `gljeheader_2013`                            | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / gljeheader_2013`                            |
| `GLSchedule_DateControl`                     | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GLSchedule_DateControl`                     |
| `GLSchedule_Step_0`                          | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GLSchedule_Step_0`                          |
| `GLSchedule_Step_1`                          | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GLSchedule_Step_1`                          |
| `GLSchedule_Step_2A`                         | table | profiled, review-needed | 2          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GLSchedule_Step_2A`                         |
| `GLSchedule_Step_3A`                         | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GLSchedule_Step_3A`                         |
| `GLSchedule_Step_4`                          | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GLSchedule_Step_4`                          |
| `GroupDuration_Temp`                         | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GroupDuration_Temp`                         |
| `GympassADUsers`                             | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GympassADUsers`                             |
| `Historical fix Make Model Mapping`          | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Historical fix Make Model Mapping`          |
| `hmf`                                        | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / hmf`                                        |
| `HMN_Error`                                  | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / HMN_Error`                                  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-030:publish
```
