# T2B-043 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-043`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `wrk`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                          | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                     |
| ----------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `appointmentsdetail`                            | table | profiled, review-needed | 1          | 68      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / appointmentsdetail`                            |
| `AR_Dim_GLScheduleSummary_degen`                | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / AR_Dim_GLScheduleSummary_degen`                |
| `Auto_Dim_AutoTrader_Staging`                   | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Auto_Dim_AutoTrader_Staging`                   |
| `Auto_Fact_Working_Staging`                     | table | profiled, review-needed | 1          | 55      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Auto_Fact_Working_Staging`                     |
| `BlackBook_Staging`                             | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / BlackBook_Staging`                             |
| `CAR_Fact_CarsLeads_Staging`                    | table | profiled, review-needed | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / CAR_Fact_CarsLeads_Staging`                    |
| `Cars_FactVINLeads_Staging`                     | table | profiled, review-needed | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Cars_FactVINLeads_Staging`                     |
| `Cars_Invoice_Detail_staging`                   | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Cars_Invoice_Detail_staging`                   |
| `DCC_Fact_Merchandising_Staging`                | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DCC_Fact_Merchandising_Staging`                |
| `DDC_Dim_SearchPhrase_staging`                  | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DDC_Dim_SearchPhrase_staging`                  |
| `Dim_BlackbookPackage_staging`                  | table | profiled, review-needed | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Dim_BlackbookPackage_staging`                  |
| `Dim_CarsImpression_staging`                    | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Dim_CarsImpression_staging`                    |
| `DimCustomer`                                   | table | profiled, review-needed | 0          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimCustomer`                                   |
| `DimEmployee`                                   | table | profiled, review-needed | 0          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimEmployee`                                   |
| `DimEmployeeEleadDepartments`                   | table | profiled, review-needed | 1          | 46      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimEmployeeEleadDepartments`                   |
| `DimSimsStoreIDMissingEntityKey`                | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimSimsStoreIDMissingEntityKey`                |
| `DimSurveyAudit`                                | table | profiled, review-needed | 1          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimSurveyAudit`                                |
| `DimSurveyAudit2`                               | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimSurveyAudit2`                               |
| `DimSurveyAuditDetail2`                         | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimSurveyAuditDetail2`                         |
| `DimVehicle_MissingVins`                        | table | profiled, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimVehicle_MissingVins`                        |
| `DMS_employee_staging`                          | table | profiled, review-needed | 1          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_employee_staging`                          |
| `DMS_gljournalsetup_staging`                    | table | profiled, review-needed | 1          | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_gljournalsetup_staging`                    |
| `DMS_labortype_staging`                         | table | profiled, review-needed | 1          | 69      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_labortype_staging`                         |
| `DMS_servicesalesclosed_prestaging`             | table | profiled, review-needed | 1          | 50      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_servicesalesclosed_prestaging`             |
| `DMS_ServiceSalesDetailsSlimClosed_PreStaging`  | table | profiled, review-needed | 1          | 48      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_ServiceSalesDetailsSlimClosed_PreStaging`  |
| `DMS_technician_staging`                        | table | profiled, review-needed | 1          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_technician_staging`                        |
| `DMSVendor_Import_working`                      | table | profiled, review-needed | 1          | 71      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMSVendor_Import_working`                      |
| `EasyCare_EPT_Fact_Working`                     | table | profiled, review-needed | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / EasyCare_EPT_Fact_Working`                     |
| `eLead_Dim_OpprotunitySrc_Staging`              | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_Dim_OpprotunitySrc_Staging`              |
| `eLead_Fact_Opportunity_working_Staging_wk`     | table | profiled, review-needed | 1          | 51      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_Fact_Opportunity_working_Staging_wk`     |
| `eLead_Opportunity_TradeIn_Vehicles`            | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_Opportunity_TradeIn_Vehicles`            |
| `elead_other_opportunity_activities`            | table | profiled, review-needed | 0          | 88      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / elead_other_opportunity_activities`            |
| `eLead_ShowRoomData_staging`                    | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_ShowRoomData_staging`                    |
| `eLead_TaskItem`                                | table | profiled, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_TaskItem`                                |
| `eLead_VehicleSought`                           | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_VehicleSought`                           |
| `err_GLDetail`                                  | table | profiled, review-needed | 0          | 50      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / err_GLDetail`                                  |
| `Fact_AutoTraderVINLevel_Staging`               | table | profiled, review-needed | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_AutoTraderVINLevel_Staging`               |
| `Fact_DDC_VehicleViews_Staging`                 | table | profiled, review-needed | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_DDC_VehicleViews_Staging`                 |
| `Fact_DQValidation_Staging`                     | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_DQValidation_Staging`                     |
| `Fact_HFmBudget_Staging`                        | table | profiled, review-needed | 1          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_HFmBudget_Staging`                        |
| `Fact_RetailUnits_Staging`                      | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_RetailUnits_Staging`                      |
| `Fact_SEO_working_Staging`                      | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fact_SEO_working_Staging`                      |
| `FDM_Account_Map_staging`                       | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FDM_Account_Map_staging`                       |
| `FDM_Department_Map_staging`                    | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FDM_Department_Map_staging`                    |
| `FireSummary_Matches`                           | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FireSummary_Matches`                           |
| `FloorPlanSales`                                | table | profiled, review-needed | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FloorPlanSales`                                |
| `FOCUS_Elead_Update_Keys`                       | table | profiled, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_Elead_Update_Keys`                       |
| `Focus_FactActivity_Transform`                  | table | profiled, review-needed | 0          | 57      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Focus_FactActivity_Transform`                  |
| `Focus_SCORES_Opportunity_Dup`                  | table | profiled, review-needed | 0          | 60      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Focus_SCORES_Opportunity_Dup`                  |
| `Focus_SCORES_Opportunity_ScoresFactSource`     | table | profiled, review-needed | 0          | 60      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Focus_SCORES_Opportunity_ScoresFactSource`     |
| `Focus_SCORES_Opportunity_TempTable`            | table | profiled, review-needed | 0          | 59      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Focus_SCORES_Opportunity_TempTable`            |
| `GLSchedule_Step_6A`                            | table | profiled, review-needed | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GLSchedule_Step_6A`                            |
| `GoldDigger_staging`                            | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GoldDigger_staging`                            |
| `GoogleMyBusinessMetric`                        | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GoogleMyBusinessMetric`                        |
| `HFM_Fact_AdvertisingExpense_Staging`           | table | profiled, review-needed | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / HFM_Fact_AdvertisingExpense_Staging`           |
| `Jumpstart_Activity_Staging`                    | table | profiled, review-needed | 1          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Jumpstart_Activity_Staging`                    |
| `MDS_AccountMgmt_Push_Staging`                  | table | profiled, review-needed | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDS_AccountMgmt_Push_Staging`                  |
| `MDS_AccountMgmtGrouping_Push_Staging`          | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDS_AccountMgmtGrouping_Push_Staging`          |
| `MDS_Entity_Push_Staging`                       | table | profiled, review-needed | 1          | 89      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDS_Entity_Push_Staging`                       |
| `MDS_FIProduct_Push_Staging`                    | table | profiled, review-needed | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDS_FIProduct_Push_Staging`                    |
| `MDS_Industry_SAAR_Push_Staging`                | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDS_Industry_SAAR_Push_Staging`                |
| `MDS_RTM_Entity_Push_Staging`                   | table | profiled, review-needed | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDS_RTM_Entity_Push_Staging`                   |
| `MDS_StandardData_LaborType_Transact_Staging`   | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDS_StandardData_LaborType_Transact_Staging`   |
| `MDS_StandardData_ServicePricingOpcode_Staging` | table | profiled, review-needed | 2          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDS_StandardData_ServicePricingOpcode_Staging` |
| `Missing_VINS_Vehicles`                         | table | profiled, review-needed | 1          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Missing_VINS_Vehicles`                         |
| `ServiceAppointment`                            | table | profiled, review-needed | 1          | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / ServiceAppointment`                            |
| `SoldVehicleNotificationAppt`                   | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / SoldVehicleNotificationAppt`                   |
| `SoldVehicleNotificationSold`                   | table | profiled, review-needed | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / SoldVehicleNotificationSold`                   |
| `Template`                                      | table | profiled, review-needed | 22         | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Template`                                      |
| `TitleTracking_GLVSC_Final`                     | table | profiled, review-needed | 0          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_GLVSC_Final`                     |
| `TrueCarSalesData`                              | table | profiled, review-needed | 0          | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TrueCarSalesData`                              |
| `Vehicle_Inventory_Inc`                         | table | profiled, review-needed | 1          | 49      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Vehicle_Inventory_Inc`                         |
| `wrkVSC_X`                                      | table | profiled, review-needed | 1          | 249     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkVSC_X`                                      |
| `xrefCoraCompanyPrefix_DimEntity_Match_Staging` | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / xrefCoraCompanyPrefix_DimEntity_Match_Staging` |
| `xrfFIAcctCode`                                 | table | profiled, review-needed | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / xrfFIAcctCode`                                 |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-043:publish
```
