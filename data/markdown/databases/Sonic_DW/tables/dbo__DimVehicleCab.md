---
name: DimVehicleCab
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
  - DimSourceSystem
  - DimVehicleBodyStyle
  - DimVehicle
row_count: 0
size_kb: 0
column_count: 9
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
| `VehicleCabId`           | int       |          | ✓        |         |             |
| `CabDescription`         | varchar   | ✓        |          |         |             |
| `StandardCabDescription` | varchar   | ✓        |          |         |             |
| `SourceCabCode`          | varchar   | ✓        |          |         |             |
| `SourceSystemId`         | int       |          |          |         |             |
| `Meta_ComputerName`      | varchar   |          |          |         |             |
| `Meta_LoadDate`          | datetime2 |          |          |         |             |
| `Meta_RowLastChangeDate` | datetime2 |          |          |         |             |
| `Meta_UserID`            | varchar   |          |          |         |             |

## Constraints

- **Primary Key**: PK_DimVehicleCab_VehicleCabId
  - Columns: VehicleCabId

## Indexes

- **PK_DimVehicleCab_VehicleCabId** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: VehicleCabId ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.DimVehicle → dbo.DimVehicleCab
  - Confidence: 95%
  - Evidence: undefined
  - Column: `VehicleCabId` → `VehicleCabId`
- **column_match**: dbo.CSI_Email_Change_Tracking → dbo.DimVehicleCab
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Dim_EPOpCodeBucket_Transact → dbo.DimVehicleCab
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimFocusCustomer → dbo.DimVehicleCab
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserId` → `Meta_UserID`
- **column_match**: dbo.DimGMBMetric → dbo.DimVehicleCab
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicle → dbo.DimVehicleCab
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleBodyStyle → dbo.DimVehicleCab
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleCategory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleChassis
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleCylinders
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleDMVCategory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleDriveType
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleEngine
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleExteriorColor
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleFuelType
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleHistory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleInteriorColor
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleMake
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleModel
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleModelNumber
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleRestraints
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleSeries
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleTrim
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVin
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.DimVinHistory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Doc_TXN_BulkPermissionAdd
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Fact_ReconAging_TXN
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Fact_TrafficManagementGoals
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactGMB
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactMSCTasks
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactMSCTasksDept
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummary_06102022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummary_06132022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummary_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummary_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummary_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummary_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Facttrafficsummary_TMR_Export
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Facttrafficsummary_TMR_Export_06142022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummary_TMR_Export_1006
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Facttrafficsummary_TMR_Export_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Facttrafficsummary_TMR_Export_old 0610
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummary_TMR_Export_zz
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummaryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummaryDaily_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummaryDaily_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummaryDaily_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummaryDailyDept
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummarySubSource
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummarySubSource_05032024
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummarySubSource_20240404
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactTrafficSummarySubSourcebkp
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactVehicleInventory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactVehiclePriceChangeNotification
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.SalesTranAssociate_Outbound
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_BoA_Dont_Fund
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_BoA_Dont_Fund_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_BoA_Response
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_BoA_Response_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_BoA_Response_Old2
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_BoA_Response_tmp
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_Payoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_Payoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_Payoffs_Skip
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_Payoffs_Skip_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_MaxPayoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_MaxPayoff_History
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.Syndicate_MaxPayoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimSourceSystem → dbo.DimVehicleCab
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemID` → `SourceSystemId`
- **column_match**: dbo.DimVehicleBodyStyle → dbo.DimVehicleCab
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleCategory
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleChassis
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleCylinders
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleDMVCategory
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleDriveType
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleEngine
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleExteriorColor
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleFuelType
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleInteriorColor
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleModelNumber
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleRestraints
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleSeries
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleTransmission
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleTrim
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemId`
- **column_match**: dbo.DimVehicleCab → dbo.Metric
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicleCab → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "sourcesystemid" in both tables
  - Column: `SourceSystemId` → `SourceSystemID`
- **column_match**: dbo.DimVehicle → dbo.DimVehicleCab
  - Confidence: 80%
  - Evidence: Exact column name match: "vehiclecabid" in both tables
  - Column: `VehicleCabId` → `VehicleCabId`
- **column_match**: dbo.DimVehicleCab → dbo.DimVehicleHistory
  - Confidence: 80%
  - Evidence: Exact column name match: "vehiclecabid" in both tables
  - Column: `VehicleCabId` → `VehicleCabId`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
