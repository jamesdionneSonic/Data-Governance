---
name: Dim_Lender_FICO_Tiers
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

| Name                | Type     | Nullable | Identity | Default     | Description |
| ------------------- | -------- | -------- | -------- | ----------- | ----------- |
| `LenderFICOTierKey` | int      |          | ✓        |             |             |
| `FICO_Tier`         | varchar  | ✓        |          |             |             |
| `UserID`            | varchar  | ✓        |          |             |             |
| `Meta_LoadDate`     | datetime | ✓        |          | (getdate()) |             |

## Constraints

- **Primary Key**: PK**Dim_Lend**A6AE52D76F8B621D
  - Columns: LenderFICOTierKey

## Indexes

- **PK**Dim_Lend**A6AE52D76F8B621D** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: LenderFICOTierKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.Dim_Lender → dbo.Dim_Lender_FICO_Tiers
  - Confidence: 100%
  - Evidence: undefined
  - Column: `LenderFICOTierKey` → `LenderFICOTierKey`
- **column_match**: dbo.ControllerPoints → dbo.Dim_Lender_FICO_Tiers
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.CustomerMatchResult → dbo.Dim_Lender_FICO_Tiers
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.Dim_Lender_FICO_Tiers
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Additions → dbo.Dim_Lender_FICO_Tiers
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Categories → dbo.Dim_Lender_FICO_Tiers
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Dim_Lender_Type
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Dim_Operator
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `Userid`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_ASI
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_CustomerSatisfactionIndex
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_FixedOps
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_GridPenentration
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_HROverTime
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_HRTurnOver
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_StopSale
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_StopSaleUsed
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_TemplateData
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_TradeAppraisal
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_TrafficManagement
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Fact_TrafficManagementATIM
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.factFIRE
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userid`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.factFIRE_BMWMini
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userid`
- **column_match**: dbo.Dim*Lender_FICO_Tiers → dbo.GLDetail* MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userid`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
