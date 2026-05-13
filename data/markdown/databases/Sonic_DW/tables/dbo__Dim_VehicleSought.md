---
name: Dim_VehicleSought
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on:
  - Dim_ActivityStatus
  - Dim_Application
  - Dim_AutoTrader
  - Dim_EPTContactStatus
  - Dim_EPTEmailURL
  - Dim_HFM
  - Dim_HFMBrand
  - Dim_KeyWord
  - Dim_LeadStatus
  - Dim_OffenseLevel
  - Dim_Operator
  - Dim_OpportunitySource
  - Dim_Referrer
  - Dim_SearchPhrase
  - Dim_SecurityAssetClass
  - Dim_SecurityAssetGroup
  - Dim_SecurityModule
  - Dim_SecurityOffense
  - Dim_SEMCampaign
  - Dim_StockType
row_count: 0
size_kb: 0
column_count: 28
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

| Name                     | Type     | Nullable | Identity | Default | Description |
| ------------------------ | -------- | -------- | -------- | ------- | ----------- |
| `VehicleSoughtKey`       | int      |          | ✓        |         |             |
| `Make`                   | varchar  | ✓        |          |         |             |
| `Model`                  | varchar  | ✓        |          |         |             |
| `Style`                  | varchar  | ✓        |          |         |             |
| `Trim`                   | varchar  | ✓        |          |         |             |
| `NewUsed`                | varchar  | ✓        |          |         |             |
| `AmountFrom`             | money    | ✓        |          |         |             |
| `AmountTo`               | money    | ✓        |          |         |             |
| `AmtIsPmntOrPrice`       | varchar  | ✓        |          |         |             |
| `ModelYear`              | int      | ✓        |          |         |             |
| `ModelYearFrom`          | varchar  |          |          |         |             |
| `ModelYearTo`            | varchar  |          |          |         |             |
| `StockNumberSought`      | varchar  | ✓        |          |         |             |
| `VINSought`              | varchar  | ✓        |          |         |             |
| `IsActive`               | int      | ✓        |          |         |             |
| `MaxMileage`             | int      | ✓        |          |         |             |
| `Meta_SrcSysID`          | int      | ✓        |          |         |             |
| `Meta_SourceSystemName`  | varchar  | ✓        |          |         |             |
| `Meta_RowEffectiveDate`  | datetime | ✓        |          |         |             |
| `Meta_RowExpiredDate`    | datetime | ✓        |          |         |             |
| `Meta_RowIsCurrent`      | varchar  | ✓        |          |         |             |
| `Meta_RowLastChangeDate` | datetime | ✓        |          |         |             |
| `Meta_AuditKey`          | int      | ✓        |          |         |             |
| `Meta_AuditScore`        | int      | ✓        |          |         |             |
| `Meta_NaturalKey`        | varchar  | ✓        |          |         |             |
| `Meta_CheckSum`          | int      | ✓        |          |         |             |
| `Meta_LoadDate`          | datetime | ✓        |          |         |             |
| `ETLExecution_ID`        | char     | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_VehicleSoughtKey
  - Columns: VehicleSoughtKey

## Indexes

- **PK_VehicleSoughtKey** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: VehicleSoughtKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_ActivityStatus → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_Application → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_AutoTrader → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_EPTContactStatus → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_EPTEmailURL → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_HFM → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_HFMBrand → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_KeyWord → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_LeadStatus → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_OffenseLevel → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_Operator → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_OpportunitySource → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_Referrer → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_SearchPhrase → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_SecurityAssetClass → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_SecurityAssetGroup → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_SecurityModule → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_SecurityOffense → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_SEMCampaign → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_StockType → dbo.Dim_VehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.Dim_WebPage
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimActivityStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimActivityType
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate_0418
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate_07282023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate_0816
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate_914_new
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate_bk_0413
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate_FULL
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate_newfile
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate0711
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate0829
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate1010
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimAssociate110724
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimDealType
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimDMSLegacyDealXREF
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimFocusCustomer
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimLeadSource
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimLeadSource_Backup
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimLeadStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimLeadSubSource
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimOpportunityPositionXREF
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimOpportunitySource
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimPosition
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimSourceSystem
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimUpType
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimVehicleSought
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimVehicleSoughtXref
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimVehicleSoughtXref_UAT
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.DimWorkflow
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.FactActivity
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.FactActivity_0805
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.FactFocusBudget
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.FactOpportunity
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.FactOpportunity_0805
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.FactOpportunity_10032023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.FactOpportunity_10042023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.FactOpportunity_20250109
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.FOCUS_Elead_ActivityTypeChange
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.FOCUS_Elead_ActivityTypeChange_UAT
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.testassociate
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`
- **column_match**: dbo.Dim_VehicleSought → dbo.zzzzDimAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_srcsysid" in both tables
  - Column: `Meta_SrcSysID` → `Meta_SrcSysID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
