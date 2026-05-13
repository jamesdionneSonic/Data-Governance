---
name: CustomerXREF_KeyLU
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 9
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

| Name               | Type     | Nullable | Identity | Default | Description |
| ------------------ | -------- | -------- | -------- | ------- | ----------- |
| `CustomerXREFID`   | int      |          | ✓        |         |             |
| `acxiomid`         | varchar  | ✓        |          |         |             |
| `cora_acct_id`     | int      | ✓        |          |         |             |
| `custno`           | varchar  | ✓        |          |         |             |
| `lPersonID`        | int      | ✓        |          |         |             |
| `CustomerImportID` | int      | ✓        |          |         |             |
| `SonicCustID`      | int      | ✓        |          |         |             |
| `DimCustomerID`    | int      | ✓        |          |         |             |
| `Meta_LoadDate`    | datetime | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_CustomerXREF_KeyLU_1
  - Columns: CustomerXREFID

## Indexes

- **PK_CustomerXREF_KeyLU_1** (CLUSTERED)
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
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Dim_DMSEmployee
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Dim_GLChecks_Degen
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.dim_GLSchedule_degen
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `Cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Dim_Lender
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Dim_PartSaleType
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.DM_CVLAInv
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Fact_DQValidation
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `Cora_Acct_ID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.factFIREBookingsWeOwe
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF*KeyLU → dbo.GLDetail* MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_ID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.VendorMRXREF_Keys
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.VendorXREFID_Key_LU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.xrfCoraCompanyPrefix
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "lpersonid" in both tables
  - Column: `lPersonID` → `lPersonID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Fact_Opportunity
  - Confidence: 80%
  - Evidence: Exact column name match: "lpersonid" in both tables
  - Column: `lPersonID` → `lpersonid`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "soniccustid" in both tables
  - Column: `SonicCustID` → `SonicCustID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "soniccustid" in both tables
  - Column: `SonicCustID` → `SonicCustID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Dim_Customer
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Fact_EPTNotification
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Fact_Opportunity
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Fact_PromoMailing
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.xDim_Customer
  - Confidence: 80%
  - Evidence: Exact column name match: "dimcustomerid" in both tables
  - Column: `DimCustomerID` → `DimCustomerID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
