# T2B-010 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-010`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                 | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                         |
| -------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `Dim_ZipCodeAudit`                     | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ZipCodeAudit`                     |
| `Dim_ZipCodePMA`                       | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ZipCodePMA`                       |
| `DimAdSource_orig`                     | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAdSource_orig`                     |
| `DimAssociate_0418`                    | table | profiled, review-needed | 0          | 71      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate_0418`                    |
| `DimAssociate_07282023`                | table | profiled, review-needed | 0          | 71      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate_07282023`                |
| `DimAssociate_0816`                    | table | profiled, review-needed | 0          | 71      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate_0816`                    |
| `DimAssociate_914_new`                 | table | profiled, review-needed | 0          | 71      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate_914_new`                 |
| `DimAssociate_bk_0413`                 | table | profiled, review-needed | 0          | 71      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate_bk_0413`                 |
| `DimAssociate_FULL`                    | table | profiled, review-needed | 0          | 71      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate_FULL`                    |
| `DimAssociate_newfile`                 | table | profiled, review-needed | 0          | 71      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate_newfile`                 |
| `DimAssociate0711`                     | table | profiled, review-needed | 0          | 72      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate0711`                     |
| `DimAssociate0829`                     | table | profiled, review-needed | 0          | 71      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate0829`                     |
| `DimAssociate1010`                     | table | profiled, review-needed | 0          | 72      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate1010`                     |
| `DimAssociate110724`                   | table | profiled, review-needed | 0          | 72      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate110724`                   |
| `DimCategoryType`                      | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimCategoryType`                      |
| `DimCustomer_20250109`                 | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimCustomer_20250109`                 |
| `dimcustomer_bk05052022`               | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dimcustomer_bk05052022`               |
| `DimDate_Holidays`                     | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimDate_Holidays`                     |
| `DimDate_HolidaysPivot`                | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimDate_HolidaysPivot`                |
| `DimEntityRelationship83_GA_Deletes`   | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimEntityRelationship83_GA_Deletes`   |
| `DimEntityRelationshipBkp20211104`     | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimEntityRelationshipBkp20211104`     |
| `dimFIProduct`                         | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dimFIProduct`                         |
| `DimLeadSource_Backup`                 | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimLeadSource_Backup`                 |
| `DimRemedyDetail`                      | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimRemedyDetail`                      |
| `DimRVP`                               | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimRVP`                               |
| `DimServiceAppointmentDetail_BKP`      | table | profiled, review-needed | 0          | 70      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimServiceAppointmentDetail_BKP`      |
| `DimServiceType`                       | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimServiceType`                       |
| `DimSourceSystem`                      | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimSourceSystem`                      |
| `DimStorePersonnel`                    | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimStorePersonnel`                    |
| `DimSurveyAssociateHistory`            | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimSurveyAssociateHistory`            |
| `DimSurveyAuditDetail_BK_20211018`     | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimSurveyAuditDetail_BK_20211018`     |
| `DimVehicleHistory`                    | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleHistory`                    |
| `DimVehicleType`                       | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleType`                       |
| `DimVinHistory`                        | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVinHistory`                        |
| `DM_FIREBudgets`                       | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FIREBudgets`                       |
| `DM_FIREBudgetsQuarter`                | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FIREBudgetsQuarter`                |
| `DM_FIREBudgetsYear`                   | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FIREBudgetsYear`                   |
| `DM_FixedOpsAvgRR_Historical`          | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FixedOpsAvgRR_Historical`          |
| `DM_FUEL_Dashboard_Budget`             | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FUEL_Dashboard_Budget`             |
| `DM_MSDynamicDistribution`             | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_MSDynamicDistribution`             |
| `DM_NVPDOC`                            | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_NVPDOC`                            |
| `DM_ServicePivot`                      | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_ServicePivot`                      |
| `DM_WhenExecuted`                      | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_WhenExecuted`                      |
| `Doc_DimPrivileges`                    | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_DimPrivileges`                    |
| `Doc_MetricType`                       | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_MetricType`                       |
| `Doc_Projection`                       | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_Projection`                       |
| `Doc_Projection_Schedule`              | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_Projection_Schedule`              |
| `Doc_ProjectionPS`                     | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_ProjectionPS`                     |
| `Doc_ProjectionPS_History`             | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_ProjectionPS_History`             |
| `Doc_Status`                           | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_Status`                           |
| `Doc_SubProjectionOld`                 | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_SubProjectionOld`                 |
| `eLeadProjectionID_History`            | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / eLeadProjectionID_History`            |
| `Fact_AccountingDetail_arch`           | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AccountingDetail_arch`           |
| `Fact_AccountingDetail_ToBeDeleted`    | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AccountingDetail_ToBeDeleted`    |
| `Fact_AccountingDetailPS`              | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AccountingDetailPS`              |
| `Fact_AccountingPS_History`            | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AccountingPS_History`            |
| `Fact_AccountingPS_Stage`              | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AccountingPS_Stage`              |
| `Fact_AdvertisingExpense`              | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AdvertisingExpense`              |
| `Fact_Appointment`                     | table | profiled, review-needed | 0          | 50      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Appointment`                     |
| `Fact_AutoTrader`                      | table | profiled, review-needed | 0          | 54      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AutoTrader`                      |
| `Fact_AutoTraderVINLevel_338_339`      | table | profiled, review-needed | 0          | 31      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AutoTraderVINLevel_338_339`      |
| `Fact_BlackBookLeads`                  | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_BlackBookLeads`                  |
| `Fact_CarsImpression`                  | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_CarsImpression`                  |
| `Fact_CarsInvoice`                     | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_CarsInvoice`                     |
| `Fact_CarsLeads`                       | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_CarsLeads`                       |
| `Fact_EPTNotification`                 | table | profiled, review-needed | 0          | 26      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_EPTNotification`                 |
| `Fact_GLSchedule_arc`                  | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_GLSchedule_arc`                  |
| `Fact_GLScheduleSummary_bk_12_11_2023` | table | profiled, review-needed | 0          | 29      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_GLScheduleSummary_bk_12_11_2023` |
| `Fact_GoldDigger`                      | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_GoldDigger`                      |
| `Fact_HFM_20250619`                    | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_20250619`                    |
| `Fact_HFM_20250819`                    | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_20250819`                    |
| `Fact_HFM_20250916`                    | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_20250916`                    |
| `Fact_HFM_Backup20250819`              | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_Backup20250819`              |
| `Fact_HFM_bk`                          | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_bk`                          |
| `Fact_HFM_bk_20230630`                 | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_bk_20230630`                 |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-010:publish
```
