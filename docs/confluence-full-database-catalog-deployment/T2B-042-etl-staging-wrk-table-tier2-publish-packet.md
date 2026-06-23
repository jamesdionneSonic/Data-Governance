# T2B-042 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-042`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `wrk`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                      | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                                 |
| ------------------------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `AR_schedule_step_1`                        | table | profiled, review-needed                            | 4          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / AR_schedule_step_1`                        |
| `AR_schedule_step_2`                        | table | profiled, review-needed                            | 7          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / AR_schedule_step_2`                        |
| `AR_schedule_step_3`                        | table | profiled, review-needed                            | 3          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / AR_schedule_step_3`                        |
| `AR_schedule_step_4`                        | table | profiled, review-needed                            | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / AR_schedule_step_4`                        |
| `Budget_Staging`                            | table | profiled, review-needed                            | 2          | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Budget_Staging`                            |
| `CallBright_AcccountDetailesReport_Staging` | table | profiled, review-needed                            | 2          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / CallBright_AcccountDetailesReport_Staging` |
| `CallRevuCallDetail`                        | table | profiled, review-needed                            | 4          | 70      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / CallRevuCallDetail`                        |
| `DDC_Dim_LeadSource_staging`                | table | profiled, review-needed                            | 2          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DDC_Dim_LeadSource_staging`                |
| `DDC_Dim_Refferrer_staging`                 | table | profiled, review-needed                            | 2          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DDC_Dim_Refferrer_staging`                 |
| `DDC_Dim_SEM_staging`                       | table | profiled, review-needed                            | 3          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DDC_Dim_SEM_staging`                       |
| `DDC_Dim_WebPage_staging`                   | table | profiled, review-needed                            | 2          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DDC_Dim_WebPage_staging`                   |
| `Dim_DMSCustomer_Staging`                   | table | profiled, review-needed                            | 2          | 104     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Dim_DMSCustomer_Staging`                   |
| `Dim_VehicleSoughtXref_Staging`             | table | profiled, review-needed                            | 3          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Dim_VehicleSoughtXref_Staging`             |
| `DimVehicle_Inventory`                      | table | profiled, review-needed                            | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimVehicle_Inventory`                      |
| `DimVehicle_InventoryVins`                  | table | profiled, review-needed                            | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimVehicle_InventoryVins`                  |
| `DimVehicle_Vehicle`                        | table | profiled, review-needed                            | 2          | 66      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimVehicle_Vehicle`                        |
| `DimVehicle_VehicleMart`                    | table | profiled, review-needed                            | 1          | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DimVehicle_VehicleMart`                    |
| `DMS_cora_acct_id_XLAT_Parts`               | table | profiled, review-needed                            | 1          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_cora_acct_id_XLAT_Parts`               |
| `DMS_glcoa_x_staging`                       | table | profiled, review-needed                            | 2          | 60      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_glcoa_x_staging`                       |
| `DMS_opcodes_staging`                       | table | profiled, review-needed                            | 1          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_opcodes_staging`                       |
| `DMS_part_staging`                          | table | profiled, review-needed                            | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_part_staging`                          |
| `DMS_partssalesdetail_staging`              | table | profiled, review-needed                            | 1          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_partssalesdetail_staging`              |
| `DMS_PricingGrid_staging`                   | table | profiled, review-needed                            | 4          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_PricingGrid_staging`                   |
| `DMS_servicesalesclosed_staging`            | table | profiled, review-needed                            | 5          | 51      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_servicesalesclosed_staging`            |
| `DMS_servicesalesdetailsclosed_staging`     | table | profiled, review-needed                            | 3          | 61      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_servicesalesdetailsclosed_staging`     |
| `DMS_ServiceSalesDetailsSlimClosed_Staging` | table | profiled, review-needed                            | 3          | 48      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / DMS_ServiceSalesDetailsSlimClosed_Staging` |
| `EasyCare_Mail_Staging`                     | table | profiled, review-needed                            | 2          | 68      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / EasyCare_Mail_Staging`                     |
| `EasyCare_Mailings`                         | table | profiled, review-needed                            | 2          | 59      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / EasyCare_Mailings`                         |
| `EasyCare_PhoneEmailText_Staging`           | table | profiled, review-needed                            | 5          | 50      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / EasyCare_PhoneEmailText_Staging`           |
| `eLead_ActivityCounts`                      | table | profiled, review-needed                            | 6          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_ActivityCounts`                      |
| `eLead_ActivityFlags`                       | table | high-use, profiled, lineage-hotspot, review-needed | 8          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_ActivityFlags`                       |
| `eLead_ActivityUsers`                       | table | high-use, profiled, review-needed                  | 7          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_ActivityUsers`                       |
| `eLead_Dim_LeadStatus_Staging`              | table | profiled, review-needed                            | 2          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_Dim_LeadStatus_Staging`              |
| `eLead_Fact_Opportunity_working_Staging`    | table | profiled, review-needed                            | 4          | 51      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_Fact_Opportunity_working_Staging`    |
| `eLead_liveDealers`                         | table | high-use, profiled, lineage-hotspot, review-needed | 16         | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_liveDealers`                         |
| `FactAcctgDetail_Staging`                   | table | profiled, review-needed                            | 1          | 50      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FactAcctgDetail_Staging`                   |
| `factFIRE_pre_DW`                           | table | profiled, review-needed                            | 2          | 107     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / factFIRE_pre_DW`                           |
| `FactSurveyAuditDetail`                     | table | profiled, review-needed                            | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FactSurveyAuditDetail`                     |
| `FireSummary_Detail`                        | table | profiled, review-needed                            | 4          | 109     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FireSummary_Detail`                        |
| `FireSummary_VSC`                           | table | profiled, review-needed                            | 4          | 69      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FireSummary_VSC`                           |
| `FloorPlanInventoryVehicle`                 | table | profiled, review-needed                            | 3          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FloorPlanInventoryVehicle`                 |
| `FloorPlanPayoffSales`                      | table | profiled, review-needed                            | 2          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FloorPlanPayoffSales`                      |
| `Fuel_Incremental_Key_data`                 | table | profiled, review-needed                            | 3          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fuel_Incremental_Key_data`                 |
| `GLBalance_Step_2`                          | table | profiled, review-needed                            | 3          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GLBalance_Step_2`                          |
| `GLBalance_Step_3`                          | table | profiled, review-needed                            | 3          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GLBalance_Step_3`                          |
| `GLCheck_Step_2`                            | table | profiled, review-needed                            | 2          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GLCheck_Step_2`                            |
| `GLCheck_Step_3`                            | table | profiled, review-needed                            | 1          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GLCheck_Step_3`                            |
| `GLSchedule_Step_5`                         | table | profiled, review-needed                            | 1          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GLSchedule_Step_5`                         |
| `GLSchedule_Step_5A`                        | table | profiled, review-needed                            | 5          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GLSchedule_Step_5A`                        |
| `stgFireFact`                               | table | profiled, review-needed                            | 2          | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgFireFact`                               |
| `stgFIREGL`                                 | table | profiled, review-needed                            | 5          | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgFIREGL`                                 |
| `stgFIREWeOwe`                              | table | profiled, review-needed                            | 1          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgFIREWeOwe`                              |
| `stgVSC`                                    | table | profiled, review-needed                            | 6          | 72      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgVSC`                                    |
| `stgVSC_ALL`                                | table | profiled, review-needed                            | 2          | 72      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgVSC_ALL`                                |
| `stgVSCBookings`                            | table | high-use, profiled, review-needed                  | 7          | 235     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgVSCBookings`                            |
| `SurveyRequest`                             | table | profiled, review-needed                            | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / SurveyRequest`                             |
| `TitleTracking_GLSchdule`                   | table | profiled, review-needed                            | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_GLSchdule`                   |
| `TitleTracking_GLSchdule_CM`                | table | profiled, review-needed                            | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_GLSchdule_CM`                |
| `TitleTracking_GLSchdule_STG`               | table | profiled, review-needed                            | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_GLSchdule_STG`               |
| `TitleTracking_GLSchdule_STGFinal`          | table | profiled, review-needed                            | 3          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_GLSchdule_STGFinal`          |
| `TitleTracking_GLSchdule_VehicleKeyNoMatch` | table | profiled, review-needed                            | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_GLSchdule_VehicleKeyNoMatch` |
| `TitleTracking_VSC`                         | table | profiled, review-needed                            | 3          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_VSC`                         |
| `TrueCarSalesData_1`                        | table | profiled, review-needed                            | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TrueCarSalesData_1`                        |
| `TrueCarTransactionData`                    | table | profiled, review-needed                            | 1          | 51      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TrueCarTransactionData`                    |
| `Vehicle_Sales_Inc`                         | table | profiled, review-needed                            | 2          | 49      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Vehicle_Sales_Inc`                         |
| `Vehicle_Service_Inc`                       | table | profiled, review-needed                            | 2          | 49      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Vehicle_Service_Inc`                       |
| `wrkFactFIRE_M1`                            | table | profiled, review-needed                            | 1          | 100     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFactFIRE_M1`                            |
| `wrkFactFIRE_M2`                            | table | profiled, review-needed                            | 1          | 103     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFactFIRE_M2`                            |
| `wrkFIREBookings`                           | table | profiled, review-needed                            | 2          | 49      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFIREBookings`                           |
| `wrkFireFact`                               | table | profiled, review-needed                            | 5          | 40      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFireFact`                               |
| `wrkFIREWeOwe`                              | table | profiled, review-needed                            | 2          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkFIREWeOwe`                              |
| `wrkVSC`                                    | table | profiled, review-needed                            | 6          | 90      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkVSC`                                    |
| `wrkVSCBookings`                            | table | profiled, review-needed                            | 2          | 43      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / wrkVSCBookings`                            |
| `XrefServiceCora`                           | table | profiled, review-needed                            | 4          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / XrefServiceCora`                           |
| `xrfCoraCompanyPrefix`                      | table | profiled, review-needed                            | 6          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / xrfCoraCompanyPrefix`                      |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-042:publish
```
