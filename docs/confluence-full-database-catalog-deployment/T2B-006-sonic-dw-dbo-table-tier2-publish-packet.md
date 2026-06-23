# T2B-006 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-006`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                             | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                     |
| ---------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `BT_ChecklistDimAnswers`           | table | profiled, review-needed | 1          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / BT_ChecklistDimAnswers`           |
| `BT_Requests`                      | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / BT_Requests`                      |
| `BT_RequestsCategory`              | table | profiled, review-needed | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / BT_RequestsCategory`              |
| `Coupa_Access_Terminations`        | table | profiled, review-needed | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Coupa_Access_Terminations`        |
| `Dim_AccountPS`                    | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_AccountPS`                    |
| `Dim_ADUsers_Manual`               | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ADUsers_Manual`               |
| `Dim_AdvertisingMetrics`           | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_AdvertisingMetrics`           |
| `Dim_Application`                  | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Application`                  |
| `Dim_AutoTrader_ListingPriority`   | table | profiled, review-needed | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_AutoTrader_ListingPriority`   |
| `Dim_AutoTrader_ListingType`       | table | profiled, review-needed | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_AutoTrader_ListingType`       |
| `Dim_CarsImpressionType`           | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_CarsImpressionType`           |
| `Dim_CarsLeadType`                 | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_CarsLeadType`                 |
| `Dim_CarsProduct`                  | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_CarsProduct`                  |
| `Dim_CouponXref`                   | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_CouponXref`                   |
| `Dim_Date_Powersports`             | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Date_Powersports`             |
| `Dim_DDC_Classification`           | table | profiled, review-needed | 2          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DDC_Classification`           |
| `Dim_EchoPark_VehicleType`         | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_EchoPark_VehicleType`         |
| `Dim_ECStatusEmail`                | table | profiled, review-needed | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ECStatusEmail`                |
| `Dim_ECStatusPhone`                | table | profiled, review-needed | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ECStatusPhone`                |
| `Dim_GLChecks_Degen`               | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_GLChecks_Degen`               |
| `Dim_Lender_Categories`            | table | profiled, review-needed | 1          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Lender_Categories`            |
| `DimApplicationSource`             | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimApplicationSource`             |
| `DimFinanceDecision`               | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimFinanceDecision`               |
| `DimFinanceSource`                 | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimFinanceSource`                 |
| `DimGMBMetric`                     | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimGMBMetric`                     |
| `DimIVROption`                     | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimIVROption`                     |
| `DimLineOfBusiness`                | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimLineOfBusiness`                |
| `DimServiceAppointment`            | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimServiceAppointment`            |
| `DimServiceAppointmentDetail`      | table | profiled, review-needed | 1          | 70      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimServiceAppointmentDetail`      |
| `DimStatusType`                    | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimStatusType`                    |
| `DimVehicleSoughtXref`             | table | profiled, review-needed | 1          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleSoughtXref`             |
| `DM_FORCE_SUMMARY_Dev`             | table | profiled, review-needed | 1          | 88      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FORCE_SUMMARY_Dev`             |
| `Doc_Booked_Historical`            | table | profiled, review-needed | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_Booked_Historical`            |
| `Doc_RVPProjection`                | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_RVPProjection`                |
| `FacebookCustomerExport`           | table | profiled, review-needed | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FacebookCustomerExport`           |
| `Fact_AccountingSummary`           | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AccountingSummary`           |
| `Fact_elead_projections`           | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_elead_projections`           |
| `Fact_PartsSalesDetail`            | table | profiled, review-needed | 1          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_PartsSalesDetail`            |
| `Fact_ReconAging_TXN`              | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_ReconAging_TXN`              |
| `Fact_StopSaleUsed`                | table | profiled, review-needed | 2          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_StopSaleUsed`                |
| `Fact_TemplateData`                | table | profiled, review-needed | 2          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_TemplateData`                |
| `Fact_TradeAppraisal`              | table | profiled, review-needed | 2          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_TradeAppraisal`              |
| `Fact_TrafficManagement`           | table | profiled, review-needed | 2          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_TrafficManagement`           |
| `Fact_TrafficManagementATIM`       | table | profiled, review-needed | 2          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_TrafficManagementATIM`       |
| `FactCBAMarketTarget`              | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactCBAMarketTarget`              |
| `FactGSCAppearanceDaily`           | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactGSCAppearanceDaily`           |
| `FactGSCPagesDaily`                | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactGSCPagesDaily`                |
| `FactGSCQueryDaily`                | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactGSCQueryDaily`                |
| `FactMSCTasksDept`                 | table | profiled, review-needed | 1          | 30      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactMSCTasksDept`                 |
| `FactRMReviewMonthly`              | table | profiled, review-needed | 1          | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactRMReviewMonthly`              |
| `FactServiceAppointment`           | table | profiled, review-needed | 1          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactServiceAppointment`           |
| `FactTrafficSummary`               | table | profiled, review-needed | 2          | 55      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummary`               |
| `FactVehiclePurchase`              | table | profiled, review-needed | 1          | 53      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactVehiclePurchase`              |
| `MSEntity`                         | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MSEntity`                         |
| `MSSurvey`                         | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MSSurvey`                         |
| `OpsReview`                        | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / OpsReview`                        |
| `PlaybookEntityRel`                | table | profiled, review-needed | 2          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookEntityRel`                |
| `PlaybookScoreCode`                | table | profiled, review-needed | 2          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookScoreCode`                |
| `PlaybookStatus`                   | table | profiled, review-needed | 2          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookStatus`                   |
| `PROCESS_AUDIT_DETAILS`            | table | profiled, review-needed | 2          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PROCESS_AUDIT_DETAILS`            |
| `QuartileOpportunityMart`          | table | profiled, review-needed | 1          | 73      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / QuartileOpportunityMart`          |
| `RegionAssociate`                  | table | profiled, review-needed | 2          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / RegionAssociate`                  |
| `SamCoraAccount`                   | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SamCoraAccount`                   |
| `SoxReview`                        | table | profiled, review-needed | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SoxReview`                        |
| `SoxReviewItem`                    | table | profiled, review-needed | 2          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SoxReviewItem`                    |
| `StartMORSource`                   | table | profiled, review-needed | 2          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / StartMORSource`                   |
| `SurveyGizmoEGMapping`             | table | profiled, review-needed | 2          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SurveyGizmoEGMapping`             |
| `Syndicate_BoA_Dashboard`          | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_BoA_Dashboard`          |
| `TRN_LY`                           | table | profiled, review-needed | 2          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TRN_LY`                           |
| `vw_Dim_Inventory_Vehicle_Staging` | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_Dim_Inventory_Vehicle_Staging` |
| `vw_GA_Combined`                   | table | profiled, review-needed | 2          | 44      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GA_Combined`                   |
| `vw_GA_Service_Combined`           | table | profiled, review-needed | 2          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GA_Service_Combined`           |
| `vw_GA_Social_Combined`            | table | profiled, review-needed | 2          | 34      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GA_Social_Combined`            |
| `vw_GPA_PettyCash_SRC`             | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GPA_PettyCash_SRC`             |
| `vw_GPA_PettyCashAccounting_SRC`   | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GPA_PettyCashAccounting_SRC`   |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-006:publish
```
