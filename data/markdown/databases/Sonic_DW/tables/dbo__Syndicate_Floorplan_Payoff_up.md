---
name: Syndicate_Floorplan_Payoff_up
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
  - factCIT
  - factFIREBookingsWeOwe
  - FandI_DMS
  - GLDetail_ MissingAcctInfo
  - QuartileOpportunityMart
  - ServiceCustomerDetail
  - Syndicate_Floorplan_Funding
  - Syndicate_Floorplan_Funding_Old
  - Syndicate_Floorplan_Payoff
  - Syndicate_Floorplan_Payoff_Old
row_count: 0
size_kb: 0
column_count: 35
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

| Name                   | Type     | Nullable | Identity | Default | Description |
| ---------------------- | -------- | -------- | -------- | ------- | ----------- |
| `CDK_Box`              | varchar  | ✓        |          |         |             |
| `CompanyID`            | varchar  | ✓        |          |         |             |
| `entitykey`            | int      | ✓        |          |         |             |
| `Dealership`           | varchar  | ✓        |          |         |             |
| `Account`              | varchar  | ✓        |          |         |             |
| `FullAccount`          | varchar  | ✓        |          |         |             |
| `StockType`            | varchar  | ✓        |          |         |             |
| `FloorplanBalance`     | money    | ✓        |          |         |             |
| `InventoryBalance`     | money    |          |          |         |             |
| `ScheduleMonth`        | date     |          |          |         |             |
| `Control`              | varchar  | ✓        |          |         |             |
| `vin`                  | varchar  | ✓        |          |         |             |
| `make`                 | varchar  | ✓        |          |         |             |
| `model`                | varchar  | ✓        |          |         |             |
| `modelyear`            | int      | ✓        |          |         |             |
| `custno`               | varchar  | ✓        |          |         |             |
| `CustomerName`         | varchar  | ✓        |          |         |             |
| `SaleMatch`            | varchar  |          |          |         |             |
| `DealType`             | varchar  | ✓        |          |         |             |
| `DealStatus`           | varchar  | ✓        |          |         |             |
| `dealno`               | varchar  | ✓        |          |         |             |
| `contractdate`         | datetime | ✓        |          |         |             |
| `financesource`        | varchar  | ✓        |          |         |             |
| `saletype`             | varchar  | ✓        |          |         |             |
| `fundeddate`           | date     | ✓        |          |         |             |
| `FundedAmt`            | money    | ✓        |          |         |             |
| `CIT_Balance`          | money    | ✓        |          |         |             |
| `CIT_DealCount`        | int      | ✓        |          |         |             |
| `days_until_due`       | int      | ✓        |          |         |             |
| `duedate`              | date     | ✓        |          |         |             |
| `duedate_old`          | date     | ✓        |          |         |             |
| `Payoff_File_Loadflag` | int      |          |          |         |             |
| `TRN_File_Loadflag`    | int      |          |          |         |             |
| `Meta_LoadDate`        | datetime |          |          |         |             |
| `FPnoINV`              | varchar  | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_GLChecks_Degen → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.DimDMSCoraAccount → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Fact_Inventory → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factCIT → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.FandI_DMS → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.QuartileOpportunityMart → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.ServiceCustomerDetail → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.Syndicate_Floorplan_Funding → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Syndicate_Floorplan_Funding_Old → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Syndicate_Floorplan_Payoff → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Syndicate_Floorplan_Payoff_Old → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Syndicate_Floorplan_Payoff_up → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Payoff_up → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Payoff_up → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
