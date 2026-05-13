---
name: factCIT
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Dim_GLChecks_Degen
  - DimDMSCoraAccount
  - Fact_Inventory
row_count: 0
size_kb: 0
column_count: 15
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

| Name                    | Type     | Nullable | Identity | Default | Description |
| ----------------------- | -------- | -------- | -------- | ------- | ----------- |
| `refer`                 | varchar  | ✓        |          |         |             |
| `Indate`                | datetime | ✓        |          |         |             |
| `outdate`               | datetime | ✓        |          |         |             |
| `indollars`             | numeric  | ✓        |          |         |             |
| `outdollars`            | numeric  | ✓        |          |         |             |
| `companyid`             | varchar  | ✓        |          |         |             |
| `control`               | varchar  | ✓        |          |         |             |
| `dealno`                | varchar  | ✓        |          |         |             |
| `stockno`               | varchar  | ✓        |          |         |             |
| `vehiclekey`            | int      | ✓        |          |         |             |
| `EntityKey`             | int      | ✓        |          |         |             |
| `LenderKey`             | int      | ✓        |          |         |             |
| `MetaNaturalEntityKey`  | varchar  | ✓        |          |         |             |
| `MetaNaturalLenderKey`  | varchar  | ✓        |          |         |             |
| `MetaNaturalVehicleKey` | varchar  | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_GLChecks_Degen → dbo.factCIT
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.DimDMSCoraAccount → dbo.factCIT
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Fact_Inventory → dbo.factCIT
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factCIT → dbo.factFIREBookingsWeOwe
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factCIT → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factCIT → dbo.GLDetail\_ MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factCIT → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factCIT → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factCIT → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factCIT → dbo.Syndicate_Floorplan_Funding_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factCIT → dbo.Syndicate_Floorplan_Payoff
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factCIT → dbo.Syndicate_Floorplan_Payoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factCIT → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factCIT → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factCIT → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factCIT → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
