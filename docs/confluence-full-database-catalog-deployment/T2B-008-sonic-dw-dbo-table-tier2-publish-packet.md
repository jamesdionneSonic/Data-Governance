# T2B-008 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-008`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                     | Type  | Tags                                     | Downstream | Columns | Confidence | Path                                                                                                             |
| ------------------------------------------ | ----- | ---------------------------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `ControllerPoints`                         | table | profiled, review-needed                  | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / ControllerPoints`                         |
| `Date_FixedOps_SameLastMonth`              | table | profiled, review-needed                  | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Date_FixedOps_SameLastMonth`              |
| `Date_FixedOps_SameMonthLastYear`          | table | profiled, review-needed                  | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Date_FixedOps_SameMonthLastYear`          |
| `Date_Variable_SameLastMonth`              | table | profiled, review-needed                  | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Date_Variable_SameLastMonth`              |
| `Date_Variable_SameMonthLastYear`          | table | profiled, review-needed                  | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Date_Variable_SameMonthLastYear`          |
| `Dim_FIProduct`                            | table | profiled, review-needed                  | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_FIProduct`                            |
| `Dim_Lender_Additions`                     | table | profiled, review-needed                  | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Lender_Additions`                     |
| `Dim_MgmtRollup`                           | table | profiled, review-needed                  | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_MgmtRollup`                           |
| `Dim_Operator`                             | table | profiled, review-needed                  | 5          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Operator`                             |
| `Dim_RegionalTechnologyManager`            | table | profiled, review-needed                  | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_RegionalTechnologyManager`            |
| `DimDepartmentCDK`                         | table | profiled, review-needed                  | 1          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimDepartmentCDK`                         |
| `DimDMSCoraAccount`                        | table | profiled, review-needed                  | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimDMSCoraAccount`                        |
| `DimDMSLegacyDealXREF`                     | table | profiled, review-needed                  | 0          | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimDMSLegacyDealXREF`                     |
| `DimEmployeeEleadDepartments`              | table | profiled, review-needed                  | 0          | 49      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimEmployeeEleadDepartments`              |
| `DimLearnUponAuditDetail`                  | table | profiled, review-needed                  | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimLearnUponAuditDetail`                  |
| `DimOpportunityPositionXREF`               | table | profiled, review-needed                  | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimOpportunityPositionXREF`               |
| `DimPosition`                              | table | profiled, review-needed                  | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimPosition`                              |
| `DimRemedyUnmappedSites`                   | table | profiled, review-needed                  | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimRemedyUnmappedSites`                   |
| `DimUserDepartmentMapCDK`                  | table | profiled, review-needed                  | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimUserDepartmentMapCDK`                  |
| `DimVehicleSoughtXref_UAT`                 | table | profiled, review-needed                  | 0          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleSoughtXref_UAT`                 |
| `Doc_TXN_BulkPermissionAdd`                | table | profiled, review-needed                  | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_TXN_BulkPermissionAdd`                |
| `Error_Log`                                | table | profiled, review-needed                  | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Error_Log`                                |
| `Fact_DDCVehicleViews`                     | table | profiled, review-needed                  | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_DDCVehicleViews`                     |
| `Fact_GLBalances`                          | table | profiled, review-needed                  | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_GLBalances`                          |
| `Fact_GLChecks`                            | table | profiled, review-needed                  | 0          | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_GLChecks`                            |
| `FACT_JMA_CLAIMS_TBL`                      | table | profiled, review-needed                  | 0          | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FACT_JMA_CLAIMS_TBL`                      |
| `FACT_JMA_CONTRACT_TBL`                    | table | profiled, review-needed                  | 0          | 60      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FACT_JMA_CONTRACT_TBL`                    |
| `Fact_SAAR`                                | table | profiled, review-needed                  | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_SAAR`                                |
| `Fact_Service_WIP_Snapshot`                | table | profiled, review-needed                  | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Service_WIP_Snapshot`                |
| `FactCBABuyerTarget`                       | table | profiled, review-needed                  | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactCBABuyerTarget`                       |
| `FactCollisionCSI`                         | table | profiled, review-needed                  | 0          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactCollisionCSI`                         |
| `FactCreditApp`                            | table | profiled, review-needed                  | 0          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactCreditApp`                            |
| `FactFireSummary_update`                   | table | profiled, review-needed                  | 0          | 157     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactFireSummary_update`                   |
| `FactFocusBudget`                          | table | profiled, review-needed                  | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactFocusBudget`                          |
| `FactGMB`                                  | table | profiled, review-needed                  | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactGMB`                                  |
| `FactRMReviewMetrics`                      | table | profiled, review-needed                  | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactRMReviewMetrics`                      |
| `FactServiceAppointmentDetail`             | table | profiled, review-needed                  | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactServiceAppointmentDetail`             |
| `Facttrafficsummary_TMR_Export`            | table | profiled, review-needed                  | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Facttrafficsummary_TMR_Export`            |
| `FactTrafficSummaryDailyDept`              | table | profiled, lineage-hotspot, review-needed | 0          | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummaryDailyDept`              |
| `FactVehicleInventory`                     | table | profiled, review-needed                  | 1          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactVehicleInventory`                     |
| `FBAudienceUnsoldShowroom`                 | table | profiled, review-needed                  | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FBAudienceUnsoldShowroom`                 |
| `FOCUS_Elead_ActivityTypeChange`           | table | profiled, review-needed                  | 0          | 71      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FOCUS_Elead_ActivityTypeChange`           |
| `Historical_darpts_Sims`                   | table | profiled, review-needed                  | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Historical_darpts_Sims`                   |
| `Historical_transport_purchases`           | table | profiled, review-needed                  | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Historical_transport_purchases`           |
| `MSAnswer`                                 | table | profiled, review-needed                  | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MSAnswer`                                 |
| `MSPhoto`                                  | table | profiled, review-needed                  | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MSPhoto`                                  |
| `MSTR_EventAudit`                          | table | profiled, review-needed                  | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MSTR_EventAudit`                          |
| `PettyCashMisuse`                          | table | profiled, review-needed                  | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PettyCashMisuse`                          |
| `PlaybookEntity`                           | table | profiled, review-needed                  | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookEntity`                           |
| `PlaybookValidValues`                      | table | profiled, review-needed                  | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookValidValues`                      |
| `ProrationReport`                          | table | profiled, review-needed                  | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / ProrationReport`                          |
| `QuartileOpportunityExcludeDealership`     | table | profiled, review-needed                  | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / QuartileOpportunityExcludeDealership`     |
| `RouteOne_Daily_Mart`                      | table | profiled, review-needed                  | 0          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / RouteOne_Daily_Mart`                      |
| `SalesTranAssociate_Outbound`              | table | profiled, review-needed                  | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAssociate_Outbound`              |
| `Sonic_Dim_CarsLeadType`                   | table | profiled, review-needed                  | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Sonic_Dim_CarsLeadType`                   |
| `Sonic_Dim_CarsStockType`                  | table | profiled, review-needed                  | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Sonic_Dim_CarsStockType`                  |
| `Sonic_Dim_CarsTimeZone`                   | table | profiled, review-needed                  | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Sonic_Dim_CarsTimeZone`                   |
| `Sonic_Dim_CarsVehicleStatus`              | table | profiled, review-needed                  | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Sonic_Dim_CarsVehicleStatus`              |
| `SoxReviewStatus`                          | table | profiled, review-needed                  | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SoxReviewStatus`                          |
| `stg_OneStream`                            | table | profiled, review-needed                  | 1          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / stg_OneStream`                            |
| `Syndicate_Floorplan_BoA_Dont_Fund`        | table | profiled, review-needed                  | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_BoA_Dont_Fund`        |
| `Syndicate_Floorplan_BoA_Response`         | table | profiled, review-needed                  | 1          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_BoA_Response`         |
| `Syndicate_Floorplan_BoA_Response_Success` | table | profiled, review-needed                  | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_BoA_Response_Success` |
| `Syndicate_Floorplan_Payoff_up`            | table | profiled, review-needed                  | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_Payoff_up`            |
| `Syndicate_Floorplan_Summary`              | table | profiled, review-needed                  | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_Summary`              |
| `Syndicate_MaxPayoff`                      | table | profiled, review-needed                  | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_MaxPayoff`                      |
| `tbl_FIRE_Thresholds_BrandGroup`           | table | profiled, review-needed                  | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / tbl_FIRE_Thresholds_BrandGroup`           |
| `tbl_PlayBookSummary_All_Diffwtd`          | table | profiled, review-needed                  | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / tbl_PlayBookSummary_All_Diffwtd`          |
| `tblQuartile`                              | table | profiled, review-needed                  | 2          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / tblQuartile`                              |
| `vw_eleads_goals`                          | table | profiled, review-needed                  | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_eleads_goals`                          |
| `vw_facebook_metricsdaily_social`          | table | profiled, review-needed                  | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_facebook_metricsdaily_social`          |
| `vw_GA_WebPerformance_Segments`            | table | profiled, review-needed                  | 1          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GA_WebPerformance_Segments`            |
| `vw_GoogleAds`                             | table | profiled, review-needed                  | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GoogleAds`                             |
| `vw_GoogleAds_Advertising`                 | table | profiled, review-needed                  | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GoogleAds_Advertising`                 |
| `xrefQuartileDealership`                   | table | profiled, review-needed                  | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrefQuartileDealership`                   |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-008:publish
```
