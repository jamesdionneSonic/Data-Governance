---
name: DimVehicleModel
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DimVehicle
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
  - DimVehicle
  - DimVehicleHistory
row_count: 0
size_kb: 0
column_count: 10
index_count: 1
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

| Name                     | Type      | Nullable | Identity | Default | Description |
| ------------------------ | --------- | -------- | -------- | ------- | ----------- |
| `VehicleModelId`         | int       |          | ✓        |         |             |
| `ModelDescription`       | varchar   | ✓        |          |         |             |
| `ModelCategory`          | varchar   | ✓        |          |         |             |
| `ModelSubCategory`       | varchar   | ✓        |          |         |             |
| `SourceMakeCode`         | varchar   | ✓        |          |         |             |
| `SourceModelCode`        | varchar   | ✓        |          |         |             |
| `Meta_ComputerName`      | varchar   |          |          |         |             |
| `Meta_LoadDate`          | datetime2 |          |          |         |             |
| `Meta_RowLastChangeDate` | datetime2 |          |          |         |             |
| `Meta_UserID`            | varchar   |          |          |         |             |

## Constraints

- **Primary Key**: PK_DimVehicleModel_VehicleModelId
  - Columns: VehicleModelId

## Indexes

- **PK_DimVehicleModel_VehicleModelId** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: VehicleModelId ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleModel
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleModelId` → `VehicleModelId`
- **column_match**: dbo.CSI_Email_Change_Tracking → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Dim_EPOpCodeBucket_Transact → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimFocusCustomer → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserId` → `Meta_UserID`
- **column_match**: dbo.DimGMBMetric → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicle → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleBodyStyle → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCategory → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleChassis → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCylinders → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleDMVCategory → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleDriveType → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleEngine → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleExteriorColor → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleFuelType → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleHistory → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleInteriorColor → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleMake → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.DimVehicleModelNumber
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.DimVehicleRestraints
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.DimVehicleSeries
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.DimVehicleTrim
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.DimVin
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.DimVinHistory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Doc_TXN_BulkPermissionAdd
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Fact_ReconAging_TXN
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Fact_TrafficManagementGoals
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactGMB
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactMSCTasks
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactMSCTasksDept
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummary_06102022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummary_06132022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummary_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummary_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummary_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummary_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Facttrafficsummary_TMR_Export
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Facttrafficsummary_TMR_Export_06142022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummary_TMR_Export_1006
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Facttrafficsummary_TMR_Export_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Facttrafficsummary_TMR_Export_old 0610
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummary_TMR_Export_zz
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummaryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummaryDaily_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummaryDaily_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummaryDaily_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummaryDailyDept
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummarySubSource
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummarySubSource_05032024
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummarySubSource_20240404
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactTrafficSummarySubSourcebkp
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactVehicleInventory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactVehiclePriceChangeNotification
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.SalesTranAssociate_Outbound
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_BoA_Dont_Fund
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_BoA_Dont_Fund_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_BoA_Response
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_BoA_Response_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_BoA_Response_Old2
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_BoA_Response_tmp
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_Payoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_Payoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_Payoffs_Skip
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_Payoffs_Skip_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_MaxPayoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_MaxPayoff_History
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.Syndicate_MaxPayoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicle → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "vehiclemodelid" in both tables
  - Column: `VehicleModelId` → `VehicleModelId`
- **column_match**: dbo.DimVehicleHistory → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "vehiclemodelid" in both tables
  - Column: `VehicleModelId` → `VehicleModelId`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
