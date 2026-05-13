---
name: VS_Cust2
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
  - FandI_DMS
  - GLDetail_ MissingAcctInfo
  - UnclaimedProperty_2026
  - VendorMRXREF_Keys
  - VendorXREFID_Key_LU
  - VS_CUST
  - CustomerXREF_KeyLU
  - Dim_Customer
  - Fact_EPTNotification
  - Fact_Opportunity
  - Fact_PromoMailing
  - VS_CUST
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
  - Syndicate_Floorplan_Payoff_up
  - UnclaimedProperty_2026
  - VS_CUST
row_count: 0
size_kb: 0
column_count: 8
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

| Name            | Type    | Nullable | Identity | Default | Description |
| --------------- | ------- | -------- | -------- | ------- | ----------- |
| `cora_acct_id`  | int     | ✓        |          |         |             |
| `companyid`     | varchar | ✓        |          |         |             |
| `Refer`         | varchar | ✓        |          |         |             |
| `custno`        | varchar | ✓        |          |         |             |
| `stocknumber2`  | varchar | ✓        |          |         |             |
| `SaleAmt`       | numeric | ✓        |          |         |             |
| `cosamt`        | numeric | ✓        |          |         |             |
| `DimCustomerID` | int     | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerXREF_KeyLU → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_DMSEmployee → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.dim_GLSchedule_degen → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `Cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_Lender → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLAInv → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Fact_DQValidation → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `Cora_Acct_ID` → `cora_acct_id`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.FandI_DMS → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_ID` → `cora_acct_id`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.VendorMRXREF_Keys → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.VendorXREFID_Key_LU → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.VS_CUST → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.VS_Cust2 → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.VS_Cust2 → dbo.xrfCoraCompanyPrefix
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.Dim_Customer → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.Fact_EPTNotification → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.Fact_Opportunity → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.Fact_PromoMailing → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.VS_CUST → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.VS_Cust2 → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.VS_Cust2 → dbo.xDim_Customer
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.DimDMSCoraAccount → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Fact_Inventory → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factCIT → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.FandI_DMS → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.QuartileOpportunityMart → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.ServiceCustomerDetail → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Funding → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Funding_Old → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Payoff → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Payoff_Old → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Payoff_up → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.VS_CUST → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
