---
name: DM_CVLA
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
  - Dim_DMSEmployee
  - dim_GLSchedule_degen
  - dim_GLSchedule_degen_arc
  - Dim_Lender
  - Dim_PartSaleType
row_count: 0
size_kb: 0
column_count: 19
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

| Name            | Type    | Nullable | Identity | Default | Description |
| --------------- | ------- | -------- | -------- | ------- | ----------- |
| `EntityKey`     | int     | ✓        |          |         |             |
| `agmtno`        | varchar | ✓        |          |         |             |
| `customername`  | varchar | ✓        |          |         |             |
| `custnum`       | varchar | ✓        |          |         |             |
| `fuelin`        | varchar | ✓        |          |         |             |
| `fuelout`       | varchar | ✓        |          |         |             |
| `loaneddate2`   | date    | ✓        |          |         |             |
| `loanedtime`    | varchar | ✓        |          |         |             |
| `hostitemid`    | varchar | ✓        |          |         |             |
| `cora_acct_id`  | int     | ✓        |          |         |             |
| `odomin`        | varchar | ✓        |          |         |             |
| `odomout`       | varchar | ✓        |          |         |             |
| `ro`            | varchar | ✓        |          |         |             |
| `rostatus`      | varchar | ✓        |          |         |             |
| `returneddate2` | date    | ✓        |          |         |             |
| `returnedtime`  | varchar | ✓        |          |         |             |
| `cora_acct_id0` | int     | ✓        |          |         |             |
| `status`        | varchar | ✓        |          |         |             |
| `Vin`           | varchar | ✓        |          |         |             |

## Indexes

- **IDX_EntityKeyLoanDate** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC, loaneddate2 ASC
  - Included Columns: agmtno, ro, Vin

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerXREF_KeyLU → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_DMSEmployee → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.dim_GLSchedule_degen → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `Cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_Lender → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.DM_CVLAInv
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.Fact_DQValidation
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `Cora_Acct_ID`
- **column_match**: dbo.DM_CVLA → dbo.factFIREBookingsWeOwe
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.FandI_DMS
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM*CVLA → dbo.GLDetail* MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_ID`
- **column_match**: dbo.DM_CVLA → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.VendorMRXREF_Keys
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.VendorXREFID_Key_LU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.xrfCoraCompanyPrefix
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_DMSEmployee → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `hostitemid` → `hostitemid`
- **column_match**: dbo.dim_GLSchedule_degen → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `HostItemID` → `hostitemid`
- **column_match**: dbo.dim_GLSchedule_degen_arc → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `HostItemID` → `hostitemid`
- **column_match**: dbo.Dim_Lender → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `hostitemid` → `hostitemid`
- **column_match**: dbo.Dim_PartSaleType → dbo.DM_CVLA
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `hostitemid` → `hostitemid`
- **column_match**: dbo.DM_CVLA → dbo.DM_CVLAInv
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `hostitemid` → `hostitemid`
- **column_match**: dbo.DM_CVLA → dbo.Fact_DQValidation
  - Confidence: 80%
  - Evidence: Exact column name match: "hostitemid" in both tables
  - Column: `hostitemid` → `HostItemID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
