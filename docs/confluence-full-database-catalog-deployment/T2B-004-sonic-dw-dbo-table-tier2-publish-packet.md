# T2B-004 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-004`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                        | Type  | Tags                                     | Downstream | Columns | Confidence | Path                                                                                                |
| ----------------------------- | ----- | ---------------------------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `BT_ChecklistRecord`          | table | profiled, review-needed                  | 4          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / BT_ChecklistRecord`          |
| `BT_RequestsRecord`           | table | profiled, review-needed                  | 4          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / BT_RequestsRecord`           |
| `Dim_AccountMgmtGrouping`     | table | profiled, review-needed                  | 4          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_AccountMgmtGrouping`     |
| `Dim_ADUsers`                 | table | profiled, review-needed                  | 4          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ADUsers`                 |
| `Dim_DateEvent`               | table | profiled, review-needed                  | 3          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DateEvent`               |
| `Dim_DMSCustomer_temp`        | table | profiled, review-needed                  | 0          | 61      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DMSCustomer_temp`        |
| `Dim_DocType`                 | table | profiled, review-needed                  | 5          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DocType`                 |
| `Dim_InterfaceCode`           | table | profiled, review-needed                  | 10         | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_InterfaceCode`           |
| `Dim_Journal`                 | table | profiled, review-needed                  | 9          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Journal`                 |
| `Dim_MailPiece`               | table | profiled, review-needed                  | 3          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_MailPiece`               |
| `Dim_OpCode_Transact`         | table | profiled, review-needed                  | 3          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_OpCode_Transact`         |
| `Dim_Part`                    | table | profiled, review-needed                  | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Part`                    |
| `Dim_PowersportCMF2Entity`    | table | profiled, review-needed                  | 4          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_PowersportCMF2Entity`    |
| `Dim_ScheduleException`       | table | profiled, review-needed                  | 6          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ScheduleException`       |
| `Dim_ServiceCapacity`         | table | profiled, review-needed                  | 5          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ServiceCapacity`         |
| `Dim_States`                  | table | profiled, review-needed                  | 2          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_States`                  |
| `Dim_Step`                    | table | profiled, review-needed                  | 3          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Step`                    |
| `Dim_StepSource`              | table | profiled, review-needed                  | 4          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_StepSource`              |
| `Dim_StepTarget`              | table | profiled, review-needed                  | 3          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_StepTarget`              |
| `DimAdSource`                 | table | profiled, review-needed                  | 5          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAdSource`                 |
| `DimFBCampaign`               | table | profiled, review-needed                  | 5          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimFBCampaign`               |
| `DimFocusCustomer`            | table | profiled, review-needed                  | 5          | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimFocusCustomer`            |
| `DimGSCSearchType`            | table | profiled, review-needed                  | 5          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimGSCSearchType`            |
| `DimMarket`                   | table | profiled, review-needed                  | 4          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimMarket`                   |
| `DimReportingSource`          | table | profiled, review-needed                  | 4          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimReportingSource`          |
| `DimResult`                   | table | profiled, review-needed                  | 4          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimResult`                   |
| `DimRMDepartment`             | table | profiled, review-needed                  | 4          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimRMDepartment`             |
| `DimStatus`                   | table | profiled, review-needed                  | 2          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimStatus`                   |
| `DimSurvey`                   | table | profiled, review-needed                  | 4          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimSurvey`                   |
| `DimSurveyAssociate`          | table | profiled, review-needed                  | 4          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimSurveyAssociate`          |
| `DimSurveyQuestion`           | table | profiled, review-needed                  | 4          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimSurveyQuestion`           |
| `DimTextPerformance`          | table | profiled, review-needed                  | 3          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimTextPerformance`          |
| `DimTrafficManagementNewUsed` | table | profiled, review-needed                  | 5          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimTrafficManagementNewUsed` |
| `DimUserCDK`                  | table | profiled, review-needed                  | 4          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimUserCDK`                  |
| `DimVehicleBodyStyle`         | table | profiled, review-needed                  | 4          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleBodyStyle`         |
| `DimVehicleCab`               | table | profiled, review-needed                  | 3          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleCab`               |
| `DimVehicleCategory`          | table | profiled, review-needed                  | 3          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleCategory`          |
| `DimVehicleChassis`           | table | profiled, review-needed                  | 3          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleChassis`           |
| `DimVehicleCylinders`         | table | profiled, review-needed                  | 4          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleCylinders`         |
| `DimVehicleDMVCategory`       | table | profiled, review-needed                  | 3          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleDMVCategory`       |
| `DimVehicleDriveType`         | table | profiled, review-needed                  | 4          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleDriveType`         |
| `DimVehicleEngine`            | table | profiled, review-needed                  | 3          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleEngine`            |
| `DimVehicleExteriorColor`     | table | profiled, review-needed                  | 4          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleExteriorColor`     |
| `DimVehicleFuelType`          | table | profiled, review-needed                  | 5          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleFuelType`          |
| `DimVehicleInteriorColor`     | table | profiled, review-needed                  | 4          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleInteriorColor`     |
| `DimVehicleModelNumber`       | table | profiled, review-needed                  | 3          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleModelNumber`       |
| `DimVehicleRestraints`        | table | profiled, review-needed                  | 3          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleRestraints`        |
| `DimVehicleSeries`            | table | profiled, review-needed                  | 5          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleSeries`            |
| `DimVehicleSought`            | table | profiled, review-needed                  | 6          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleSought`            |
| `DimVehicleTransmission`      | table | profiled, review-needed                  | 4          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleTransmission`      |
| `DimWorkflow`                 | table | profiled, review-needed                  | 5          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimWorkflow`                 |
| `DM_AdvertisingExpense`       | table | profiled, review-needed                  | 3          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_AdvertisingExpense`       |
| `DM_FORCE_SUMMARY`            | table | profiled, review-needed                  | 3          | 91      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FORCE_SUMMARY`            |
| `Doc_AccountGrouping`         | table | profiled, review-needed                  | 5          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_AccountGrouping`         |
| `Doc_Actual`                  | table | profiled, review-needed                  | 3          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_Actual`                  |
| `Doc_ActualPS`                | table | profiled, review-needed                  | 3          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_ActualPS`                |
| `Doc_SubProjection`           | table | profiled, review-needed                  | 5          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_SubProjection`           |
| `Doc_TXN_Login`               | table | profiled, review-needed                  | 4          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_TXN_Login`               |
| `Fact_DateEvent`              | table | profiled, review-needed                  | 5          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_DateEvent`              |
| `Fact_GLScheduleSummary`      | table | profiled, review-needed                  | 4          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_GLScheduleSummary`      |
| `Fact_HFM`                    | table | profiled, review-needed                  | 4          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM`                    |
| `FactCallSource`              | table | profiled, review-needed                  | 3          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactCallSource`              |
| `factFIREBookingsWeOwe`       | table | profiled, review-needed                  | 1          | 55      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factFIREBookingsWeOwe`       |
| `FactTrafficSummaryDaily`     | table | profiled, lineage-hotspot, review-needed | 6          | 55      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummaryDaily`     |
| `OpsReviewItem`               | table | profiled, review-needed                  | 5          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / OpsReviewItem`               |
| `OpsReviewItemDetail`         | table | profiled, review-needed                  | 3          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / OpsReviewItemDetail`         |
| `OpsService`                  | table | profiled, review-needed                  | 4          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / OpsService`                  |
| `OpsServiceDealership`        | table | profiled, review-needed                  | 4          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / OpsServiceDealership`        |
| `PlaybookName`                | table | profiled, review-needed                  | 5          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookName`                |
| `PlaybookSurvey`              | table | profiled, review-needed                  | 4          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookSurvey`              |
| `SalesTranAssociate_Inbound`  | table | profiled, review-needed                  | 2          | 56      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAssociate_Inbound`  |
| `SSMS`                        | table | profiled, review-needed                  | 1          | 105     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SSMS`                        |
| `Syndicate_Floorplan_Funding` | table | profiled, review-needed                  | 4          | 43      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_Funding` |
| `Syndicate_FPAccounts`        | table | profiled, review-needed                  | 3          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_FPAccounts`        |
| `xrfCoraCompanyPrefix`        | table | profiled, review-needed                  | 6          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrfCoraCompanyPrefix`        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-004:publish
```
