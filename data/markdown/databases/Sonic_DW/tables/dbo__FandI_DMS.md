---
name: FandI_DMS
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - CustomerXREF_KeyLU
  - Dim_DMSEmployee
  - Dim_GLChecks_Degen
  - dim_GLSchedule_degen
  - Dim_Lender
  - Dim_PartSaleType
  - DM_CVLA
  - DM_CVLAInv
  - Fact_DQValidation
  - factFIREBookingsWeOwe
  - Dim_GLChecks_Degen
  - DimDMSCoraAccount
  - Fact_Inventory
  - factCIT
  - factFIREBookingsWeOwe
row_count: 0
size_kb: 0
column_count: 61
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

| Name                 | Type     | Nullable | Identity | Default | Description |
| -------------------- | -------- | -------- | -------- | ------- | ----------- |
| `fimgr`              | varchar  | ✓        |          |         |             |
| `fimgr2`             | varchar  | ✓        |          |         |             |
| `Sales1`             | varchar  | ✓        |          |         |             |
| `Sales2`             | varchar  | ✓        |          |         |             |
| `Sales3`             | varchar  | ✓        |          |         |             |
| `SalesA`             | varchar  | ✓        |          |         |             |
| `BillingClerk`       | varchar  | ✓        |          |         |             |
| `ClosingMgr`         | varchar  | ✓        |          |         |             |
| `SalesMgr`           | varchar  | ✓        |          |         |             |
| `Customer`           | varchar  | ✓        |          |         |             |
| `AccountingName`     | varchar  | ✓        |          |         |             |
| `Region`             | varchar  | ✓        |          |         |             |
| `EsscodePrimBrand`   | varchar  | ✓        |          |         |             |
| `salesaccount`       | varchar  | ✓        |          |         |             |
| `dealno`             | varchar  | ✓        |          |         |             |
| `stockno`            | varchar  | ✓        |          |         |             |
| `year`               | int      | ✓        |          |         |             |
| `makename`           | varchar  | ✓        |          |         |             |
| `modelname`          | varchar  | ✓        |          |         |             |
| `totalgross`         | numeric  | ✓        |          |         |             |
| `grossprofit`        | numeric  | ✓        |          |         |             |
| `frontgross`         | numeric  | ✓        |          |         |             |
| `backgross`          | numeric  | ✓        |          |         |             |
| `apr`                | float    | ✓        |          |         |             |
| `cora_acct_id`       | int      |          |          |         |             |
| `FinReserve`         | numeric  | ✓        |          |         |             |
| `TotalCommGross`     | numeric  | ✓        |          |         |             |
| `totalcommissionsp1` | numeric  | ✓        |          |         |             |
| `totalcommissionsp2` | numeric  | ✓        |          |         |             |
| `totaloptionsfees`   | numeric  | ✓        |          |         |             |
| `DealerIncentive`    | numeric  | ✓        |          |         |             |
| `accountingdate`     | datetime | ✓        |          |         |             |
| `BookDate`           | datetime | ✓        |          |         |             |
| `fiwipstatuscode`    | varchar  | ✓        |          |         |             |
| `Product`            | varchar  | ✓        |          |         |             |
| `saleamount`         | numeric  | ✓        |          |         |             |
| `costamount`         | numeric  | ✓        |          |         |             |
| `grossamount`        | numeric  | ✓        |          |         |             |
| `unitamount`         | int      | ✓        |          |         |             |
| `Program`            | varchar  | ✓        |          |         |             |
| `LimitMiles`         | int      | ✓        |          |         |             |
| `term`               | int      | ✓        |          |         |             |
| `financeamt`         | numeric  | ✓        |          |         |             |
| `financesource`      | nvarchar | ✓        |          |         |             |
| `paymentamt`         | numeric  | ✓        |          |         |             |
| `payments`           | int      | ✓        |          |         |             |
| `sellrateapr`        | float    | ✓        |          |         |             |
| `sellrateaddon`      | float    | ✓        |          |         |             |
| `vehiclemileage`     | int      | ✓        |          |         |             |
| `waqnumber`          | varchar  | ✓        |          |         |             |
| `accountingaccount`  | varchar  | ✓        |          |         |             |
| `cora_acct_code`     | varchar  | ✓        |          |         |             |
| `fidealtype`         | varchar  | ✓        |          |         |             |
| `dealtype`           | varchar  | ✓        |          |         |             |
| `saletype`           | varchar  | ✓        |          |         |             |
| `trade1vin`          | varchar  | ✓        |          |         |             |
| `trade2vin`          | varchar  | ✓        |          |         |             |
| `vin`                | varchar  | ✓        |          |         |             |
| `CompanyID`          | varchar  | ✓        |          |         |             |
| `Prefix`             | varchar  | ✓        |          |         |             |
| `EntityKey`          | int      | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerXREF_KeyLU → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_DMSEmployee → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.dim_GLSchedule_degen → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `Cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_Lender → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLAInv → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Fact_DQValidation → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `Cora_Acct_ID` → `cora_acct_id`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.FandI*DMS → dbo.GLDetail* MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_ID`
- **column_match**: dbo.FandI_DMS → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.FandI_DMS → dbo.VendorMRXREF_Keys
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.FandI_DMS → dbo.VendorXREFID_Key_LU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.FandI_DMS → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.FandI_DMS → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.FandI_DMS → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.FandI_DMS → dbo.xrfCoraCompanyPrefix
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.DimDMSCoraAccount → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.Fact_Inventory → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factCIT → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.FandI*DMS → dbo.GLDetail* MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.FandI_DMS → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.FandI_DMS → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.FandI_DMS → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.FandI_DMS → dbo.Syndicate_Floorplan_Funding_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.FandI_DMS → dbo.Syndicate_Floorplan_Payoff
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.FandI_DMS → dbo.Syndicate_Floorplan_Payoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.FandI_DMS → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `CompanyID`
- **column_match**: dbo.FandI_DMS → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.FandI_DMS → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.FandI_DMS → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
