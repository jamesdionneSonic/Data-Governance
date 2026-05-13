---
name: Dim_PartSaleType
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on:
  - CustomerXREF_KeyLU
  - Dim_DMSEmployee
  - Dim_GLChecks_Degen
  - dim_GLSchedule_degen
  - Dim_Lender
  - Dim_DMSEmployee
  - dim_GLSchedule_degen
  - dim_GLSchedule_degen_arc
  - Dim_Lender
row_count: 0
size_kb: 0
column_count: 7
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

| Name               | Type    | Nullable | Identity | Default | Description |
| ------------------ | ------- | -------- | -------- | ------- | ----------- |
| `PartSalesTypeKey` | int     |          | ✓        |         |             |
| `cora_acct_id`     | int     |          |          |         |             |
| `hostitemid`       | varchar |          |          |         |             |
| `description`      | varchar |          |          |         |             |
| `saleaccount`      | varchar |          |          |         |             |
| `saletype`         | varchar |          |          |         |             |
| `category`         | varchar |          |          |         |             |

## Constraints

- **Primary Key**: PK_Dim_PartSaleType
  - Columns: PartSalesTypeKey

## Indexes

- **PK_Dim_PartSaleType** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: PartSalesTypeKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerXREF_KeyLU → dbo.Dim_PartSaleType
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_DMSEmployee → dbo.Dim_PartSaleType
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.Dim_PartSaleType
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.dim_GLSchedule_degen → dbo.Dim_PartSaleType
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `Cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_Lender → dbo.Dim_PartSaleType
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.DM_CVLAInv
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.Fact_DQValidation
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `Cora_Acct_ID`
- **column_match**: dbo.Dim_PartSaleType → dbo.factFIREBookingsWeOwe
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim*PartSaleType → dbo.GLDetail* MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_ID`
- **column_match**: dbo.Dim_PartSaleType → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.VendorMRXREF_Keys
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.VendorXREFID_Key_LU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.xrfCoraCompanyPrefix
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_DMSEmployee → dbo.Dim_PartSaleType
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `hostitemid` → `hostitemid`
- **column_match**: dbo.dim_GLSchedule_degen → dbo.Dim_PartSaleType
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `HostItemID` → `hostitemid`
- **column_match**: dbo.dim_GLSchedule_degen_arc → dbo.Dim_PartSaleType
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `HostItemID` → `hostitemid`
- **column_match**: dbo.Dim_Lender → dbo.Dim_PartSaleType
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `hostitemid` → `hostitemid`
- **column_match**: dbo.Dim_PartSaleType → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `hostitemid` → `hostitemid`
- **column_match**: dbo.Dim_PartSaleType → dbo.DM_CVLAInv
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `hostitemid` → `hostitemid`
- **column_match**: dbo.Dim_PartSaleType → dbo.Fact_DQValidation
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `hostitemid` → `HostItemID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
