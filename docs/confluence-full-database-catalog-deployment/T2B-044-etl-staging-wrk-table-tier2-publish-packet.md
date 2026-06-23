# T2B-044 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-044`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `wrk`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                           | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                      |
| ------------------------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| `appointmentsdetail_bkup`                        | table | profiled, review-needed | 0          | 68      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / appointmentsdetail_bkup`                        |
| `CallRevuCallDetail_EntityKeyFix`                | table | profiled, review-needed | 0          | 63      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / CallRevuCallDetail_EntityKeyFix`                |
| `CallSourceData`                                 | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / CallSourceData`                                 |
| `CallSourceData_missing`                         | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / CallSourceData_missing`                         |
| `CB_Hist_Staging`                                | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / CB_Hist_Staging`                                |
| `CollisionCSI`                                   | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / CollisionCSI`                                   |
| `Coupon`                                         | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Coupon`                                         |
| `DCC_Dim_LeadSource_staging`                     | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DCC_Dim_LeadSource_staging`                     |
| `DCC_Dim_SEM_staging`                            | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DCC_Dim_SEM_staging`                            |
| `DCC_Dim_WebPage_staging`                        | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DCC_Dim_WebPage_staging`                        |
| `DDC_Dim_Fact_SearchPhrase_staging`              | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DDC_Dim_Fact_SearchPhrase_staging`              |
| `DDC_Fact_Merchandising_Staging`                 | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DDC_Fact_Merchandising_Staging`                 |
| `Dim_CarsLeadType_staging`                       | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Dim_CarsLeadType_staging`                       |
| `Dim_Customer`                                   | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Dim_Customer`                                   |
| `Dim_Date_FixedVarOps`                           | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Dim_Date_FixedVarOps`                           |
| `Dim_Fact_SearchPhrase_staging`                  | table | profiled, review-needed | 0          | 29      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Dim_Fact_SearchPhrase_staging`                  |
| `Dim_PartSalesType_Staging`                      | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Dim_PartSalesType_Staging`                      |
| `Dim_Scenario_staging`                           | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Dim_Scenario_staging`                           |
| `DimSimsStoreIDMissingEntityKey_bck`             | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimSimsStoreIDMissingEntityKey_bck`             |
| `DimSurveyQuestion`                              | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimSurveyQuestion`                              |
| `DimVehicle_CBA`                                 | table | profiled, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimVehicle_CBA`                                 |
| `DimVehicle_TSD`                                 | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimVehicle_TSD`                                 |
| `DMS_appointments_staging`                       | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_appointments_staging`                       |
| `DMS_cora_acct_id_XLAT_Service`                  | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_cora_acct_id_XLAT_Service`                  |
| `DMS_cora_acct_id_XLAT_Staging`                  | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_cora_acct_id_XLAT_Staging`                  |
| `DMS_glcoa_staging`                              | table | profiled, review-needed | 0          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_glcoa_staging`                              |
| `DMS_gldept_staging`                             | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_gldept_staging`                             |
| `DMS_glschedulesetup_staging`                    | table | profiled, review-needed | 0          | 57      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_glschedulesetup_staging`                    |
| `DMS_inventory_staging`                          | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_inventory_staging`                          |
| `DMS_JounalImport_csv`                           | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_JounalImport_csv`                           |
| `DMS_JounalImport_csv`                           | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_JounalImport_csv`                           |
| `DMS_servicesalesdetailsclosed_prestaging`       | table | profiled, review-needed | 0          | 58      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_servicesalesdetailsclosed_prestaging`       |
| `DMS_vehicle_staging`                            | table | profiled, review-needed | 0          | 148     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_vehicle_staging`                            |
| `EasyCare_Coupon_EPT`                            | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / EasyCare_Coupon_EPT`                            |
| `EasyCare_Coupons`                               | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / EasyCare_Coupons`                               |
| `EasyCare_Mailing`                               | table | profiled, review-needed | 0          | 47      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / EasyCare_Mailing`                               |
| `eLead_ActivityAggregates`                       | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_ActivityAggregates`                       |
| `eLead_Fact_Activity_Staging_Opps`               | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_Fact_Activity_Staging_Opps`               |
| `eLead_Fact_Opportunity_working_Staging_old`     | table | profiled, review-needed | 0          | 50      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_Fact_Opportunity_working_Staging_old`     |
| `eLead_liveDealers_bk`                           | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_liveDealers_bk`                           |
| `eLead_Opportunity_Activities`                   | table | profiled, review-needed | 0          | 53      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_Opportunity_Activities`                   |
| `Excel_DimJournal_Staging`                       | table | profiled, review-needed | 0          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Excel_DimJournal_Staging`                       |
| `Fact_GoldDigger_Working`                        | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_GoldDigger_Working`                        |
| `Fact_HFM_Staging_StateCount`                    | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_HFM_Staging_StateCount`                    |
| `Fact_HFM_Staging_wrk`                           | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_HFM_Staging_wrk`                           |
| `Fact_HFMBudget_StatCount_Staging`               | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_HFMBudget_StatCount_Staging`               |
| `Fact_LearningProgram_Staging`                   | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_LearningProgram_Staging`                   |
| `Fact_Opportunity_LastActivityDate`              | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_Opportunity_LastActivityDate`              |
| `Fact_PartsSalesDetail_Key_Validation`           | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_PartsSalesDetail_Key_Validation`           |
| `FactAcctgDetail_Staging_20200829`               | table | profiled, review-needed | 0          | 50      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FactAcctgDetail_Staging_20200829`               |
| `FactAcctgDetail_Staging_20200830`               | table | profiled, review-needed | 0          | 50      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FactAcctgDetail_Staging_20200830`               |
| `FactAcctgDetail_Staging_NickTest`               | table | profiled, review-needed | 0          | 50      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FactAcctgDetail_Staging_NickTest`               |
| `FactAcctgDetailMissingRecords`                  | table | profiled, review-needed | 0          | 50      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FactAcctgDetailMissingRecords`                  |
| `FactActivity_LoadSource`                        | table | profiled, review-needed | 0          | 54      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FactActivity_LoadSource`                        |
| `factFIRE_pre_DW_Bk_827`                         | table | profiled, review-needed | 0          | 59      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / factFIRE_pre_DW_Bk_827`                         |
| `FactPriceNotification_TEMP_DM04122022`          | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FactPriceNotification_TEMP_DM04122022`          |
| `FactVehiclePriceChangeNotification`             | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FactVehiclePriceChangeNotification`             |
| `FDM_Account_Map_staging_20170614`               | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FDM_Account_Map_staging_20170614`               |
| `FDM_Account_Map_staging_back_up`                | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FDM_Account_Map_staging_back_up`                |
| `FDM_Department_Map_staging_20170614`            | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FDM_Department_Map_staging_20170614`            |
| `FDM_Department_Map_staging_back_up`             | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FDM_Department_Map_staging_back_up`             |
| `FIRE_DateRange`                                 | table | profiled, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FIRE_DateRange`                                 |
| `FOCUS_CustNo`                                   | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_CustNo`                                   |
| `FOCUS_Elead_ActiveDealers`                      | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_Elead_ActiveDealers`                      |
| `FOCUS_Elead_Update_Keys_UAT`                    | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_Elead_Update_Keys_UAT`                    |
| `FOCUS_FactActivity_Transform_bk_24`             | table | profiled, review-needed | 0          | 53      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_FactActivity_Transform_bk_24`             |
| `FOCUS_Master_Sync`                              | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_Master_Sync`                              |
| `Focus_SCORES_Opportunity_ScoresFactSource_temp` | table | profiled, review-needed | 0          | 60      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Focus_SCORES_Opportunity_ScoresFactSource_temp` |
| `Focus_SourceGroup`                              | table | profiled, review-needed | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Focus_SourceGroup`                              |
| `GLSchedule_CustLook`                            | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GLSchedule_CustLook`                            |
| `SalesTranAssociateInValidation`                 | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / SalesTranAssociateInValidation`                 |
| `SalesTranAssociateOutValidation`                | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / SalesTranAssociateOutValidation`                |
| `stgOpCodeTBD`                                   | table | profiled, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgOpCodeTBD`                                   |
| `SurveyRequestJSON`                              | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / SurveyRequestJSON`                              |
| `tmpEntityLookupDiscards`                        | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / tmpEntityLookupDiscards`                        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-044:publish
```
