---
name: Dim_Lender_Type
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on:
  - Dim_Lender
  - ControllerPoints
  - CustomerMatchResult
  - CustomerMatchResult_bak
  - Dim_Lender_Additions
  - Dim_Lender_Categories
  - Dim_Lender_FICO_Tiers
row_count: 0
size_kb: 0
column_count: 4
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

| Name            | Type     | Nullable | Identity | Default     | Description |
| --------------- | -------- | -------- | -------- | ----------- | ----------- |
| `LenderTypeKey` | int      |          | ✓        |             |             |
| `LenderType`    | varchar  | ✓        |          |             |             |
| `UserID`        | varchar  | ✓        |          |             |             |
| `Meta_LoadDate` | datetime | ✓        |          | (getdate()) |             |

## Constraints

- **Primary Key**: PK**Dim_Lend**586B8B88724560B6
  - Columns: LenderTypeKey

## Indexes

- **PK**Dim_Lend**586B8B88724560B6** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: LenderTypeKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.Dim_Lender → dbo.Dim_Lender_Type
  - Confidence: 100%
  - Evidence: undefined
  - Column: `LenderTypeKey` → `LenderTypeKey`
- **column_match**: dbo.ControllerPoints → dbo.Dim_Lender_Type
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.CustomerMatchResult → dbo.Dim_Lender_Type
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.Dim_Lender_Type
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Additions → dbo.Dim_Lender_Type
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Categories → dbo.Dim_Lender_Type
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Dim_Lender_Type
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Dim_Operator
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `Userid`
- **column_match**: dbo.Dim_Lender_Type → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_ASI
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_CustomerSatisfactionIndex
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_FixedOps
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_GridPenentration
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_HROverTime
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_HRTurnOver
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_StopSale
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_StopSaleUsed
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_TemplateData
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_TradeAppraisal
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_TrafficManagement
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Fact_TrafficManagementATIM
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.factFIRE
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userid`
- **column_match**: dbo.Dim_Lender_Type → dbo.factFIRE_BMWMini
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userid`
- **column_match**: dbo.Dim*Lender_Type → dbo.GLDetail* MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userid`
- **column_match**: dbo.Dim_Lender_Type → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
