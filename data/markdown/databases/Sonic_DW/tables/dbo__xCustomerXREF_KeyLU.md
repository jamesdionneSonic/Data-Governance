---
name: xCustomerXREF_KeyLU
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - CustomerXREF_KeyLU
  - CustomerXREF_KeyLU
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
  - VS_Cust2
  - CustomerXREF_KeyLU
  - ServiceCustomerDetail
  - CustomerXREF_KeyLU
  - Dim_Customer
  - Fact_EPTNotification
  - Fact_Opportunity
  - Fact_PromoMailing
  - VS_CUST
  - VS_Cust2
row_count: 0
size_kb: 0
column_count: 6
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

| Name             | Type    | Nullable | Identity | Default | Description |
| ---------------- | ------- | -------- | -------- | ------- | ----------- |
| `CustomerXREFID` | int     |          | ✓        |         |             |
| `acxiomid`       | varchar | ✓        |          |         |             |
| `cora_acct_id`   | int     | ✓        |          |         |             |
| `custno`         | varchar | ✓        |          |         |             |
| `SonicCustID`    | int     | ✓        |          |         |             |
| `DimCustomerID`  | int     | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_SonciCustKeyLU
  - Columns: CustomerXREFID

## Indexes

- **PK_SonciCustKeyLU** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: CustomerXREFID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerXREF_KeyLU → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "customerxrefid" in both tables
  - Column: `CustomerXREFID` → `CustomerXREFID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "acxiomid" in both tables
  - Column: `acxiomid` → `acxiomid`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_DMSEmployee → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.dim_GLSchedule_degen → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `Cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_Lender → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLAInv → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Fact_DQValidation → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `Cora_Acct_ID` → `cora_acct_id`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.FandI_DMS → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_ID` → `cora_acct_id`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.VendorMRXREF_Keys → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.VendorXREFID_Key_LU → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.VS_CUST → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.VS_Cust2 → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.xCustomerXREF_KeyLU → dbo.xrfCoraCompanyPrefix
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "soniccustid" in both tables
  - Column: `SonicCustID` → `SonicCustID`
- **column_match**: dbo.ServiceCustomerDetail → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "soniccustid" in both tables
  - Column: `SonicCustID` → `SonicCustID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.Dim_Customer → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.Fact_EPTNotification → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.Fact_Opportunity → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.Fact_PromoMailing → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.VS_CUST → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.VS_Cust2 → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.xCustomerXREF_KeyLU → dbo.xDim_Customer
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
