---
name: Syndicate_BoA_Dashboard
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - ControllerPoints
  - CustomerMatchResult
  - CustomerMatchResult_bak
  - Dim_Lender_Additions
  - Dim_Lender_Categories
  - Dim_Lender_FICO_Tiers
  - Dim_Lender_Type
  - Dim_Operator
  - DimTextPerformance
  - Fact_ASI
  - Fact_CustomerSatisfactionIndex
  - Fact_FixedOps
  - Fact_GridPenentration
  - Fact_HROverTime
  - Fact_HRTurnOver
  - Fact_StopSale
  - Fact_StopSaleUsed
  - Fact_TemplateData
  - Fact_TradeAppraisal
  - Fact_TrafficManagement
  - Fact_TrafficManagementATIM
  - factFIRE
  - factFIRE_BMWMini
  - GLDetail_ MissingAcctInfo
  - StartTotalMORMetrics
row_count: 0
size_kb: 0
column_count: 6
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

| Name            | Type     | Nullable | Identity | Default | Description |
| --------------- | -------- | -------- | -------- | ------- | ----------- |
| `DashboardDate` | date     | ✓        |          |         |             |
| `Payoff`        | int      | ✓        |          |         |             |
| `Funding`       | int      | ✓        |          |         |             |
| `userID`        | varchar  | ✓        |          |         |             |
| `userID2`       | varchar  | ✓        |          |         |             |
| `Meta_LoadDate` | datetime | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.ControllerPoints → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.CustomerMatchResult → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Dim_Lender_Additions → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Dim_Lender_Categories → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Dim_Lender_Type → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Dim_Operator → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `Userid` → `userID`
- **column_match**: dbo.DimTextPerformance → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_ASI → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_CustomerSatisfactionIndex → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_FixedOps → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_GridPenentration → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_HROverTime → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_HRTurnOver → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_StopSale → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_StopSaleUsed → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_TemplateData → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_TradeAppraisal → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_TrafficManagement → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Fact_TrafficManagementATIM → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.factFIRE → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `userid` → `userID`
- **column_match**: dbo.factFIRE_BMWMini → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `userid` → `userID`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `userid` → `userID`
- **column_match**: dbo.StartTotalMORMetrics → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
