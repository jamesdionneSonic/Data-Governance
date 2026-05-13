---
name: Dim_AccountPort
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on:
  - Dim_Account
  - Dim_Account_20250618
  - Dim_Account_20250918_Clone
  - Dim_Account_Bk
  - Dim_Account_BKP_20250709
  - Dim_Account_old
  - Dim_Account_testing
  - Dim_Account
  - Dim_Account_20250618
  - Dim_Account_20250918_Clone
  - Dim_Account_Bk
  - Dim_Account_BKP_20250709
  - Dim_Account_old
  - Dim_Account_testing
  - Dim_Account
  - Dim_Account_20250618
  - Dim_Account_20250918_Clone
  - Dim_Account_Bk
  - Dim_Account_BKP_20250709
  - Dim_Account_old
  - Dim_Account_testing
row_count: 0
size_kb: 0
column_count: 16
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

| Name                  | Type    | Nullable | Identity | Default | Description |
| --------------------- | ------- | -------- | -------- | ------- | ----------- |
| `AccountKey`          | int     |          |          |         |             |
| `AccCoraAcctId`       | int     |          |          |         |             |
| `AccCompanyId`        | int     | ✓        |          |         |             |
| `AccDeptId`           | varchar | ✓        |          |         |             |
| `AccAccountNumber`    | varchar | ✓        |          |         |             |
| `DepartmentRollKey`   | int     | ✓        |          |         |             |
| `AccHFMAccount`       | varchar | ✓        |          |         |             |
| `AccHFMDepartment`    | varchar | ✓        |          |         |             |
| `AccEntityType`       | varchar | ✓        |          |         |             |
| `AccCOAType`          | varchar | ✓        |          |         |             |
| `AccActiveFlag`       | bit     | ✓        |          |         |             |
| `AccPrefix`           | varchar | ✓        |          |         |             |
| `AccAccount`          | varchar | ✓        |          |         |             |
| `AccDepartmentLookup` | varchar | ✓        |          |         |             |
| `AccDepartment`       | varchar | ✓        |          |         |             |
| `AccDepartmentName`   | varchar | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_Account → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccoraacctid" in both tables
  - Column: `AccCoraAcctId` → `AccCoraAcctId`
- **column_match**: dbo.Dim_Account_20250618 → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccoraacctid" in both tables
  - Column: `AccCoraAcctId` → `AccCoraAcctId`
- **column_match**: dbo.Dim_Account_20250918_Clone → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccoraacctid" in both tables
  - Column: `AccCoraAcctId` → `AccCoraAcctId`
- **column_match**: dbo.Dim_Account_Bk → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccoraacctid" in both tables
  - Column: `AccCoraAcctId` → `AccCoraAcctId`
- **column_match**: dbo.Dim_Account_BKP_20250709 → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccoraacctid" in both tables
  - Column: `AccCoraAcctId` → `AccCoraAcctId`
- **column_match**: dbo.Dim_Account_old → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccoraacctid" in both tables
  - Column: `AccCoraAcctId` → `AccCoraAcctId`
- **column_match**: dbo.Dim_Account_testing → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccoraacctid" in both tables
  - Column: `AccCoraAcctId` → `AccCoraAcctId`
- **column_match**: dbo.Dim_Account → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccompanyid" in both tables
  - Column: `AccCompanyId` → `AccCompanyId`
- **column_match**: dbo.Dim_Account_20250618 → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccompanyid" in both tables
  - Column: `AccCompanyId` → `AccCompanyId`
- **column_match**: dbo.Dim_Account_20250918_Clone → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccompanyid" in both tables
  - Column: `AccCompanyId` → `AccCompanyId`
- **column_match**: dbo.Dim_Account_Bk → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccompanyid" in both tables
  - Column: `AccCompanyId` → `AccCompanyId`
- **column_match**: dbo.Dim_Account_BKP_20250709 → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccompanyid" in both tables
  - Column: `AccCompanyId` → `AccCompanyId`
- **column_match**: dbo.Dim_Account_old → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccompanyid" in both tables
  - Column: `AccCompanyId` → `AccCompanyId`
- **column_match**: dbo.Dim_Account_testing → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "acccompanyid" in both tables
  - Column: `AccCompanyId` → `AccCompanyId`
- **column_match**: dbo.Dim_Account → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "accdeptid" in both tables
  - Column: `AccDeptId` → `AccDeptId`
- **column_match**: dbo.Dim_Account_20250618 → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "accdeptid" in both tables
  - Column: `AccDeptId` → `AccDeptId`
- **column_match**: dbo.Dim_Account_20250918_Clone → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "accdeptid" in both tables
  - Column: `AccDeptId` → `AccDeptId`
- **column_match**: dbo.Dim_Account_Bk → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "accdeptid" in both tables
  - Column: `AccDeptId` → `AccDeptId`
- **column_match**: dbo.Dim_Account_BKP_20250709 → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "accdeptid" in both tables
  - Column: `AccDeptId` → `AccDeptId`
- **column_match**: dbo.Dim_Account_old → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "accdeptid" in both tables
  - Column: `AccDeptId` → `AccDeptId`
- **column_match**: dbo.Dim_Account_testing → dbo.Dim_AccountPort
  - Confidence: 80%
  - Evidence: Exact column name match: "accdeptid" in both tables
  - Column: `AccDeptId` → `AccDeptId`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
