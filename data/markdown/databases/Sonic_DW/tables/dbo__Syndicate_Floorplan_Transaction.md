---
name: Syndicate_Floorplan_Transaction
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - CSI_Email_Change_Tracking
  - Dim_EPOpCodeBucket_Transact
  - DimFocusCustomer
  - DimGMBMetric
  - DimVehicle
  - DimVehicleBodyStyle
  - DimVehicleCab
  - DimVehicleCategory
  - DimVehicleChassis
  - DimVehicleCylinders
  - DimVehicleDMVCategory
  - DimVehicleDriveType
  - DimVehicleEngine
  - DimVehicleExteriorColor
  - DimVehicleFuelType
  - DimVehicleHistory
  - DimVehicleInteriorColor
  - DimVehicleMake
  - DimVehicleModel
  - DimVehicleModelNumber
  - DimVehicleRestraints
  - DimVehicleSeries
  - DimVehicleTransmission
  - DimVehicleTrim
  - DimVin
  - DimVinHistory
  - Doc_TXN_BulkPermissionAdd
  - Fact_ReconAging_TXN
  - Fact_TrafficManagementGoals
  - FactFireSummary
  - FactFireSummary_update
  - FactGMB
  - FactMSCTasks
  - FactMSCTasksDept
  - FactTrafficSummary
  - FactTrafficSummary_06102022
  - FactTrafficSummary_06132022
  - FactTrafficSummary_07292023
  - FactTrafficSummary_20230706
  - FactTrafficSummary_20230727
  - FactTrafficSummary_bk02172022
  - Facttrafficsummary_TMR_Export
  - Facttrafficsummary_TMR_Export_06142022
  - FactTrafficSummary_TMR_Export_1006
  - Facttrafficsummary_TMR_Export_bk02172022
  - Facttrafficsummary_TMR_Export_old 0610
  - FactTrafficSummary_TMR_Export_zz
  - FactTrafficSummaryDaily
  - FactTrafficSummaryDaily_07292023
  - FactTrafficSummaryDaily_20230706
  - FactTrafficSummaryDaily_20230727
  - FactTrafficSummaryDailyDept
  - FactTrafficSummarySubSource
  - FactTrafficSummarySubSource_05032024
  - FactTrafficSummarySubSource_20240404
  - FactTrafficSummarySubSourcebkp
  - FactVehicleInventory
  - FactVehiclePriceChangeNotification
  - SalesTranAssociate_Outbound
  - Syndicate_Floorplan_BoA_Dont_Fund
  - Syndicate_Floorplan_BoA_Dont_Fund_Old
  - Syndicate_Floorplan_BoA_Response
  - Syndicate_Floorplan_BoA_Response_Old
  - Syndicate_Floorplan_BoA_Response_Old2
  - Syndicate_Floorplan_BoA_Response_tmp
  - Syndicate_Floorplan_Payoff
  - Syndicate_Floorplan_Payoff_Old
  - Syndicate_Floorplan_Payoffs_Skip
  - Syndicate_Floorplan_Payoffs_Skip_Old
row_count: 0
size_kb: 0
column_count: 65
index_count: 0
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: table
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Columns

| Name                                       | Type    | Nullable | Identity | Default | Description |
| ------------------------------------------ | ------- | -------- | -------- | ------- | ----------- |
| `Combined_type`                            | varchar |          |          |         |             |
| `Combined_CDK_Box`                         | varchar | ✓        |          |         |             |
| `Combined_CompanyID`                       | varchar | ✓        |          |         |             |
| `Combined_entitykey`                       | int     | ✓        |          |         |             |
| `Combined_Dealership`                      | varchar | ✓        |          |         |             |
| `Combined_Account`                         | varchar | ✓        |          |         |             |
| `Combined_FullAccount`                     | varchar | ✓        |          |         |             |
| `Combined_StockType`                       | varchar | ✓        |          |         |             |
| `Combined_FloorplanBalance`                | money   | ✓        |          |         |             |
| `Combined_FloorplanBalance_Metric`         | money   | ✓        |          |         |             |
| `Combined_InventoryBalance`                | money   | ✓        |          |         |             |
| `Combined_InventoryBalance_Metric`         | money   | ✓        |          |         |             |
| `Combined_Control`                         | varchar | ✓        |          |         |             |
| `Combined_VIN`                             | varchar | ✓        |          |         |             |
| `Combined_Make`                            | varchar | ✓        |          |         |             |
| `Combined_Model`                           | varchar | ✓        |          |         |             |
| `Combined_ModelYear`                       | int     | ✓        |          |         |             |
| `Combined_Payoff_or_Fund_File_Loadflag`    | int     |          |          |         |             |
| `Combined_TRN_File_LoadFlag`               | int     |          |          |         |             |
| `Combined_Same_Store_TRN_Flag`             | int     | ✓        |          |         |             |
| `Combined_Debit_TRN_Flag`                  | int     | ✓        |          |         |             |
| `Combined_SSC_Manual_Payoff_Flag`          | int     | ✓        |          |         |             |
| `Combined_SSC_Manual_Payoff_Flag_Metric`   | int     | ✓        |          |         |             |
| `Combined_SSC_Manual_Payoff_Amount`        | money   | ✓        |          |         |             |
| `Combined_SSC_Manual_Payoff_Amount_Metric` | money   | ✓        |          |         |             |
| `Combined_GLSchedKey`                      | int     |          |          |         |             |
| `Combined_DATE`                            | date    | ✓        |          |         |             |
| `Combined_From_Account`                    | varchar | ✓        |          |         |             |
| `Combined_To_CIN`                          | varchar | ✓        |          |         |             |
| `Combined_To_Account`                      | varchar | ✓        |          |         |             |
| `Combined_KickedBack`                      | int     |          |          |         |             |
| `Combined_Days_Until_Due`                  | int     | ✓        |          |         |             |
| `Combined_Days_Until_Due_Attribute`        | int     | ✓        |          |         |             |
| `Combined_From_CIN`                        | varchar | ✓        |          |         |             |
| `Combined_Incoming/Outgoing`               | varchar | ✓        |          |         |             |
| `Combined_Transfer_Balance`                | money   | ✓        |          |         |             |
| `Combined_not_paidoff_or_funded_prior_day` | int     |          |          |         |             |
| `Combined_date_flag`                       | bigint  | ✓        |          |         |             |
| `Combined_Error Metric Placeholder`        | varchar |          |          |         |             |
| `Combined Comment Metric Placeholder`      | varchar |          |          |         |             |
| `Combined DueDate Attribute Placeholder`   | varchar |          |          |         |             |
| `duedate`                                  | date    | ✓        |          |         |             |
| `Max_PayoffDate`                           | date    | ✓        |          |         |             |
| `FP_Date`                                  | date    | ✓        |          |         |             |
| `Skip`                                     | int     | ✓        |          |         |             |
| `Meta_UserID`                              | varchar | ✓        |          |         |             |
| `PayoffEarlyDate`                          | date    | ✓        |          |         |             |
| `Business Line Code`                       | varchar |          |          |         |             |
| `Transaction Amount`                       | money   | ✓        |          |         |             |
| `Plant ID`                                 | varchar |          |          |         |             |
| `Product Descriptor`                       | varchar |          |          |         |             |
| `Original Amount`                          | money   | ✓        |          |         |             |
| `CurrentDate`                              | date    | ✓        |          |         |             |
| `Combined_TRN_File_LoadFlag_Metric`        | int     |          |          |         |             |
| `Combined_Same_Store_TRN_Flag_Metric`      | int     | ✓        |          |         |             |
| `Combined_date_flag_Metric`                | bigint  | ✓        |          |         |             |
| `Combined_GLSchedKey_Metric`               | int     |          |          |         |             |
| `Combined_type_Metric`                     | varchar |          |          |         |             |
| `Combined_KickedBack_Metric`               | int     |          |          |         |             |
| `BoA_File_Flag`                            | int     |          |          |         |             |
| `Record_Type`                              | varchar |          |          |         |             |
| `Record_Type_Metric`                       | varchar |          |          |         |             |
| `Skip_Payoffs`                             | int     |          |          |         |             |
| `days_until_due_group`                     | varchar | ✓        |          |         |             |
| `Running_FloorPlan`                        | money   | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CSI_Email_Change_Tracking → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Dim_EPOpCodeBucket_Transact → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimFocusCustomer → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserId` → `Meta_UserID`
- **column_match**: dbo.DimGMBMetric → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicle → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleBodyStyle → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCategory → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleChassis → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCylinders → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleDMVCategory → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleDriveType → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleEngine → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleExteriorColor → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleFuelType → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleHistory → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleInteriorColor → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleMake → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModelNumber → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleRestraints → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleSeries → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTrim → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVin → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVinHistory → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Doc_TXN_BulkPermissionAdd → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Fact_ReconAging_TXN → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Fact_TrafficManagementGoals → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactGMB → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactMSCTasks → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactMSCTasksDept → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummary → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummary_06102022 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummary_06132022 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummary_07292023 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummary_20230706 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummary_20230727 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummary_bk02172022 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Facttrafficsummary_TMR_Export → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Facttrafficsummary_TMR_Export_06142022 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummary_TMR_Export_1006 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Facttrafficsummary_TMR_Export_bk02172022 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Facttrafficsummary_TMR_Export_old 0610 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummary_TMR_Export_zz → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummaryDaily → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummaryDaily_07292023 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummaryDaily_20230706 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummaryDaily_20230727 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummaryDailyDept → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummarySubSource → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummarySubSource_05032024 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummarySubSource_20240404 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactTrafficSummarySubSourcebkp → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactVehicleInventory → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactVehiclePriceChangeNotification → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.SalesTranAssociate_Outbound → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_BoA_Dont_Fund → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_BoA_Dont_Fund_Old → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_BoA_Response → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_BoA_Response_Old → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_BoA_Response_Old2 → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_BoA_Response_tmp → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_Payoff → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_Payoff_Old → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_Payoffs_Skip → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_Payoffs_Skip_Old → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_Transaction → dbo.Syndicate_MaxPayoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_Transaction → dbo.Syndicate_MaxPayoff_History
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Syndicate_Floorplan_Transaction → dbo.Syndicate_MaxPayoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
