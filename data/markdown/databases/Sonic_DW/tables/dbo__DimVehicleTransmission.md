---
name: DimVehicleTransmission
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
  - DimVehicleModel
  - DimVehicleModelNumber
  - DimVehicleRestraints
  - DimVehicleSeries
  - DimSourceSystem
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
  - DimVehicleInteriorColor
  - DimVehicleModelNumber
  - DimVehicleRestraints
  - DimVehicleSeries
  - DimVehicle
  - DimVehicleHistory
row_count: 0
size_kb: 0
column_count: 9
index_count: 2
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

| Name                              | Type      | Nullable | Identity | Default | Description |
| --------------------------------- | --------- | -------- | -------- | ------- | ----------- |
| `VehicleTransmissionId`           | int       |          | ✓        |         |             |
| `TransmissionDescription`         | varchar   | ✓        |          |         |             |
| `StandardTransmissionDescription` | varchar   | ✓        |          |         |             |
| `SourceTransmissionCode`          | varchar   | ✓        |          |         |             |
| `SourceSystemId`                  | int       |          |          |         |             |
| `Meta_ComputerName`               | varchar   |          |          |         |             |
| `Meta_LoadDate`                   | datetime2 |          |          |         |             |
| `Meta_RowLastChangeDate`          | datetime2 |          |          |         |             |
| `Meta_UserID`                     | varchar   |          |          |         |             |

## Constraints

- **Primary Key**: PK_DimVehicleTransmission_VehicleTransmissionId
  - Columns: VehicleTransmissionId

## Indexes

- **IX_DimVehicleTransmission_SourceSystemId_SourceTransmissionCode** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: SourceSystemId ASC, SourceTransmissionCode ASC
- **PK_DimVehicleTransmission_VehicleTransmissionId** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: VehicleTransmissionId ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleTransmission
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleTransmissionId` → `VehicleTransmissionId`
- **column_match**: dbo.CSI_Email_Change_Tracking → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Dim_EPOpCodeBucket_Transact → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimFocusCustomer → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserId` → `Meta_UserID`
- **column_match**: dbo.DimGMBMetric → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicle → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleBodyStyle → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCategory → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleChassis → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCylinders → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleDMVCategory → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleDriveType → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleEngine → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleExteriorColor → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleFuelType → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleHistory → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleInteriorColor → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleMake → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModelNumber → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleRestraints → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleSeries → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.DimVehicleTrim
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.DimVin
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.DimVinHistory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Doc_TXN_BulkPermissionAdd
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Fact_ReconAging_TXN
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Fact_TrafficManagementGoals
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactGMB
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactMSCTasks
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactMSCTasksDept
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummary_06102022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummary_06132022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummary_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummary_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummary_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummary_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Facttrafficsummary_TMR_Export
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Facttrafficsummary_TMR_Export_06142022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummary_TMR_Export_1006
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Facttrafficsummary_TMR_Export_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Facttrafficsummary_TMR_Export_old 0610
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummary_TMR_Export_zz
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummaryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummaryDaily_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummaryDaily_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummaryDaily_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummaryDailyDept
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummarySubSource
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummarySubSource_05032024
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummarySubSource_20240404
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactTrafficSummarySubSourcebkp
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactVehicleInventory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactVehiclePriceChangeNotification
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.SalesTranAssociate_Outbound
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_BoA_Dont_Fund
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_BoA_Dont_Fund_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_BoA_Response
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_BoA_Response_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_BoA_Response_Old2
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_BoA_Response_tmp
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_Payoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_Payoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_Payoffs_Skip
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_Payoffs_Skip_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_MaxPayoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_MaxPayoff_History
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.Syndicate_MaxPayoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimSourceSystem → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemID` → `SourceSystemId`
- **column_match**: dbo.DimVehicleBodyStyle → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCategory → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleChassis → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCylinders → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleDMVCategory → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleDriveType → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleEngine → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleExteriorColor → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleFuelType → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleInteriorColor → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleModelNumber → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleRestraints → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleSeries → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleTransmission → dbo.DimVehicleTrim
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleTransmission → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleTransmission → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicle → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "vehicletransmissionid" in both tables
  - Column: `VehicleTransmissionId` → `VehicleTransmissionId`
- **column_match**: dbo.DimVehicleHistory → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "vehicletransmissionid" in both tables
  - Column: `VehicleTransmissionId` → `VehicleTransmissionId`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
