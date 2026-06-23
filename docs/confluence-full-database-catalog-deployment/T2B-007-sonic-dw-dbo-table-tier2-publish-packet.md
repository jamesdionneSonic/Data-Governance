# T2B-007 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-007`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                               | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                       |
| ------------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| `Dim_ECStatusText`                   | table | profiled, review-needed | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ECStatusText`                   |
| `Dim_EPTNotificationType`            | table | profiled, review-needed | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_EPTNotificationType`            |
| `Dim_GECGroup`                       | table | profiled, review-needed | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_GECGroup`                       |
| `Dim_GeoLocation`                    | table | profiled, review-needed | 3          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_GeoLocation`                    |
| `Dim_HRTurnoverGroups`               | table | profiled, review-needed | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_HRTurnoverGroups`               |
| `DIM_JMA_CONDITION_TBL`              | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DIM_JMA_CONDITION_TBL`              |
| `DIM_JMA_COVERAGE_LENGTH_TBL`        | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DIM_JMA_COVERAGE_LENGTH_TBL`        |
| `DIM_JMA_COVERAGE_PLAN_TYPE_TBL`     | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DIM_JMA_COVERAGE_PLAN_TYPE_TBL`     |
| `DIM_JMA_FINANCE_TYPE_TBL`           | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DIM_JMA_FINANCE_TYPE_TBL`           |
| `DIM_JMA_REFUND_METHOD_TBL`          | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DIM_JMA_REFUND_METHOD_TBL`          |
| `DIM_JMA_TRANSACTION_TYPE_TBL`       | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DIM_JMA_TRANSACTION_TYPE_TBL`       |
| `Dim_LeadSource`                     | table | profiled, review-needed | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_LeadSource`                     |
| `Dim_Lender_FICO_Tiers`              | table | profiled, review-needed | 1          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Lender_FICO_Tiers`              |
| `Dim_Lender_Type`                    | table | profiled, review-needed | 1          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Lender_Type`                    |
| `Dim_MailCoupon`                     | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_MailCoupon`                     |
| `Dim_OffenseLevel`                   | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_OffenseLevel`                   |
| `Dim_Referrer`                       | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Referrer`                       |
| `Dim_RRisk_ForecastAccounts`         | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_RRisk_ForecastAccounts`         |
| `Dim_SECRollupSort`                  | table | profiled, review-needed | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SECRollupSort`                  |
| `Dim_SecurityAssetClass`             | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SecurityAssetClass`             |
| `Dim_SecurityAssetGroup`             | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SecurityAssetGroup`             |
| `Dim_SecurityModule`                 | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SecurityModule`                 |
| `Dim_SecurityOffense`                | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SecurityOffense`                |
| `Dim_SEMCampaign`                    | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SEMCampaign`                    |
| `Dim_SubletVendor`                   | table | profiled, review-needed | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SubletVendor`                   |
| `Dim_TSDTemp`                        | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_TSDTemp`                        |
| `Dim_TurnoverGroup`                  | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_TurnoverGroup`                  |
| `Dim_TurnoverReports`                | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_TurnoverReports`                |
| `Dim_Validation`                     | table | profiled, review-needed | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Validation`                     |
| `Dim_VendorAssociates`               | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_VendorAssociates`               |
| `Dim_WebPage`                        | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_WebPage`                        |
| `DimCategory`                        | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimCategory`                        |
| `DimLeadUpTypeTier`                  | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimLeadUpTypeTier`                  |
| `DimRemedyUser`                      | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimRemedyUser`                      |
| `DimRemedyUserGroup`                 | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimRemedyUserGroup`                 |
| `DimReviewStatus`                    | table | profiled, review-needed | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimReviewStatus`                    |
| `DimService`                         | table | profiled, review-needed | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimService`                         |
| `DimVehicleModelCategory`            | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleModelCategory`            |
| `DM_CVLA`                            | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_CVLA`                            |
| `DM_CVLAInv`                         | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_CVLAInv`                         |
| `DM_FixedOpsAvgRR`                   | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FixedOpsAvgRR`                   |
| `DM_FORCE_Summary_LI`                | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FORCE_Summary_LI`                |
| `DM_FORCE_Summary_short_dev`         | table | profiled, review-needed | 1          | 88      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FORCE_Summary_short_dev`         |
| `DM_FUEL_Dashboard`                  | table | profiled, review-needed | 1          | 43      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FUEL_Dashboard`                  |
| `DMR_Distemail`                      | table | profiled, review-needed | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DMR_Distemail`                      |
| `Doc_AccountGroupingPS`              | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_AccountGroupingPS`              |
| `Fact_AccountingDetailCurrent`       | table | profiled, review-needed | 1          | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AccountingDetailCurrent`       |
| `Fact_AuditGrade`                    | table | profiled, review-needed | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AuditGrade`                    |
| `Fact_CallBright`                    | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_CallBright`                    |
| `Fact_CorporateUnionOverride`        | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_CorporateUnionOverride`        |
| `Fact_EmployeesActiveByMonth`        | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_EmployeesActiveByMonth`        |
| `Fact_Inventory`                     | table | profiled, review-needed | 1          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Inventory`                     |
| `Fact_Merchandising`                 | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Merchandising`                 |
| `Fact_Opportunity`                   | table | profiled, review-needed | 1          | 50      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Opportunity`                   |
| `Fact_PowersportsSoldUnits`          | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_PowersportsSoldUnits`          |
| `Fact_PromoMailing`                  | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_PromoMailing`                  |
| `Fact_SEM`                           | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_SEM`                           |
| `Fact_TrafficManagementGoals`        | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_TrafficManagementGoals`        |
| `Fact_TSDTemp`                       | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_TSDTemp`                       |
| `factFIRE_A_BMWMini`                 | table | profiled, review-needed | 1          | 46      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factFIRE_A_BMWMini`                 |
| `FactVehiclePriceChangeNotification` | table | profiled, review-needed | 1          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactVehiclePriceChangeNotification` |
| `HFM_Account_Corp_Dim`               | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / HFM_Account_Corp_Dim`               |
| `HFM_Account_MGMT_Dim`               | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / HFM_Account_MGMT_Dim`               |
| `HiringProcess_Slides`               | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / HiringProcess_Slides`               |
| `HR_Brand_Jobcode_Login`             | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / HR_Brand_Jobcode_Login`             |
| `Jobcode_Totalcost`                  | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Jobcode_Totalcost`                  |
| `MetricAccountXref`                  | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MetricAccountXref`                  |
| `MetricReport`                       | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MetricReport`                       |
| `MetricReportGroup`                  | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MetricReportGroup`                  |
| `MetricReportSubGrouping`            | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MetricReportSubGrouping`            |
| `MicroStrategyContact`               | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MicroStrategyContact`               |
| `MicroStrategyContactGrouping`       | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MicroStrategyContactGrouping`       |
| `MSQuestion`                         | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MSQuestion`                         |
| `OpsAssociate`                       | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / OpsAssociate`                       |
| `OpsStatus`                          | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / OpsStatus`                          |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-007:publish
```
