---
name: Keys_to_delete
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Dim_GLDetail
  - Dim_GLDetail_arch
  - Dim_GLDetail_ToBeDeleted
  - Dim_GLDetail
  - Dim_GLDetail_arch
  - Dim_GLDetail_ToBeDeleted
  - GLDetail_ MissingAcctInfo
  - Dim_GLDetail
  - Dim_GLDetail_arch
  - Dim_GLDetail_ToBeDeleted
  - Dim_GLDetail
  - Dim_GLDetail_arch
  - Dim_GLDetail_ToBeDeleted
  - GLDetail_ MissingAcctInfo
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

| Name                   | Type    | Nullable | Identity | Default | Description |
| ---------------------- | ------- | -------- | -------- | ------- | ----------- |
| `DetailKey`            | int     | ✓        |          |         |             |
| `DetCora_Acct_ID`      | int     | ✓        |          |         |             |
| `DetHostitemID`        | varchar | ✓        |          |         |             |
| `DetCompanyID`         | varchar | ✓        |          |         |             |
| `DetShortHostItemID`   | varchar | ✓        |          |         |             |
| `DetAccountingDateKey` | int     | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_GLDetail → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "detcora_acct_id" in both tables
  - Column: `DetCora_Acct_ID` → `DetCora_Acct_ID`
- **column_match**: dbo.Dim_GLDetail_arch → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "detcora_acct_id" in both tables
  - Column: `DetCora_Acct_ID` → `DetCora_Acct_ID`
- **column_match**: dbo.Dim_GLDetail_ToBeDeleted → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "detcora_acct_id" in both tables
  - Column: `DetCora_Acct_ID` → `DetCora_Acct_ID`
- **column_match**: dbo.Dim_GLDetail → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "dethostitemid" in both tables
  - Column: `DetHostitemID` → `DetHostitemID`
- **column_match**: dbo.Dim_GLDetail_arch → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "dethostitemid" in both tables
  - Column: `DetHostitemID` → `DetHostitemID`
- **column_match**: dbo.Dim_GLDetail_ToBeDeleted → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "dethostitemid" in both tables
  - Column: `DetHostitemID` → `DetHostitemID`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "dethostitemid" in both tables
  - Column: `DetHostItemID` → `DetHostitemID`
- **column_match**: dbo.Dim_GLDetail → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "detcompanyid" in both tables
  - Column: `DetCompanyID` → `DetCompanyID`
- **column_match**: dbo.Dim_GLDetail_arch → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "detcompanyid" in both tables
  - Column: `DetCompanyID` → `DetCompanyID`
- **column_match**: dbo.Dim_GLDetail_ToBeDeleted → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "detcompanyid" in both tables
  - Column: `DetCompanyID` → `DetCompanyID`
- **column_match**: dbo.Dim_GLDetail → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "detshorthostitemid" in both tables
  - Column: `DetShortHostItemID` → `DetShortHostItemID`
- **column_match**: dbo.Dim_GLDetail_arch → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "detshorthostitemid" in both tables
  - Column: `DetShortHostItemID` → `DetShortHostItemID`
- **column_match**: dbo.Dim_GLDetail_ToBeDeleted → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "detshorthostitemid" in both tables
  - Column: `DetShortHostItemID` → `DetShortHostItemID`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.Keys_to_delete
  - Confidence: 80%
  - Evidence: Exact column name match: "detshorthostitemid" in both tables
  - Column: `DetShortHostItemID` → `DetShortHostItemID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
