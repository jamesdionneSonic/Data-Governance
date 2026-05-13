---
name: Syndicate_Floorplan_Funding
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
row_count: 0
size_kb: 0
column_count: 43
index_count: 3
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

| Name                    | Type     | Nullable | Identity | Default                     | Description |
| ----------------------- | -------- | -------- | -------- | --------------------------- | ----------- |
| `SourceGroup`           | varchar  |          |          |                             |             |
| `EntityKey`             | int      | ✓        |          |                             |             |
| `CDK_Box`               | varchar  | ✓        |          |                             |             |
| `LineofBusiness`        | varchar  | ✓        |          |                             |             |
| `CompanyID`             | varchar  | ✓        |          |                             |             |
| `Dealership`            | varchar  | ✓        |          |                             |             |
| `StockType`             | varchar  | ✓        |          |                             |             |
| `Prefix`                | varchar  | ✓        |          |                             |             |
| `InvAccount`            | varchar  | ✓        |          |                             |             |
| `FP_Account`            | varchar  | ✓        |          |                             |             |
| `FP_FullAccount`        | varchar  | ✓        |          |                             |             |
| `StockNo`               | varchar  |          |          |                             |             |
| `ModelYear`             | int      | ✓        |          |                             |             |
| `Make`                  | varchar  | ✓        |          |                             |             |
| `Model`                 | varchar  | ✓        |          |                             |             |
| `Mileage`               | numeric  | ✓        |          |                             |             |
| `VIN`                   | varchar  | ✓        |          |                             |             |
| `StockInDate`           | date     | ✓        |          |                             |             |
| `InventoryBalance`      | money    | ✓        |          |                             |             |
| `FloorplanBalance`      | money    |          |          |                             |             |
| `ACV`                   | money    | ✓        |          |                             |             |
| `InvServiceTotal`       | money    | ✓        |          |                             |             |
| `SaleMatch`             | varchar  |          |          |                             |             |
| `DealType`              | varchar  | ✓        |          |                             |             |
| `DealStatus`            | varchar  | ✓        |          |                             |             |
| `DealNo`                | varchar  | ✓        |          |                             |             |
| `ContractDate`          | datetime | ✓        |          |                             |             |
| `VIN_count`             | int      | ✓        |          |                             |             |
| `VIN_RN`                | bigint   | ✓        |          |                             |             |
| `FP_Eligible`           | varchar  |          |          |                             |             |
| `FND_File_LoadFlag`     | int      |          |          |                             |             |
| `SSC_Entry_LoadFlag`    | int      |          |          |                             |             |
| `TRN_File_LoadFlag`     | int      |          |          |                             |             |
| `Meta_LoadDate`         | datetime |          |          |                             |             |
| `FND_Bank_SentFlag`     | int      | ✓        |          |                             |             |
| `FND_Bank_SentDate`     | date     | ✓        |          |                             |             |
| `GLSchedKey`            | bigint   | ✓        |          |                             |             |
| `PostingAmt`            | money    | ✓        |          |                             |             |
| `Same_Store_TRN_Flag`   | int      | ✓        |          |                             |             |
| `Debit_TRN_Flag`        | int      | ✓        |          |                             |             |
| `SSC_FND_File_LoadFlag` | int      | ✓        |          |                             |             |
| `SSC_Manual_Amount`     | money    | ✓        |          |                             |             |
| `FP_Date`               | date     | ✓        |          | (CONVERT([date],getdate())) |             |

## Indexes

- **IX_Funding_FP_Date** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FP_Date ASC, StockType ASC
- **IX_Syndicate_Floorplan_Funding_StockType_SSCFndFileLoadFlag_MetaLoadDate_SSCManualAmount** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: StockType ASC, SSC_FND_File_LoadFlag ASC, Meta_LoadDate ASC, SSC_Manual_Amount ASC
  - Included Columns: VIN
- **IX_Syndicate_Floorplan_Funding_VIN_FndBankSentDate** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: VIN ASC, FND_Bank_SentDate ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_GLChecks_Degen → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.DimDMSCoraAccount → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Fact_Inventory → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factCIT → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.FandI_DMS → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.QuartileOpportunityMart → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.ServiceCustomerDetail → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.Syndicate_Floorplan_Funding → dbo.Syndicate_Floorplan_Funding_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Syndicate_Floorplan_Funding → dbo.Syndicate_Floorplan_Payoff
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Syndicate_Floorplan_Funding → dbo.Syndicate_Floorplan_Payoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Syndicate_Floorplan_Funding → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Syndicate_Floorplan_Funding → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Funding → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Funding → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
