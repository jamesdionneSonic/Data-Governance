---
name: DimUserCDK
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DimFocusCustomer
  - DimServiceAppointmentDetail
  - DimServiceAppointmentDetail_BKP
row_count: 0
size_kb: 0
column_count: 8
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

| Name                     | Type      | Nullable | Identity | Default | Description |
| ------------------------ | --------- | -------- | -------- | ------- | ----------- |
| `DimUserCDKID`           | int       |          | ✓        |         |             |
| `CDKUserID`              | int       |          |          |         |             |
| `CDKCompanyID`           | int       |          |          |         |             |
| `LastName`               | varchar   | ✓        |          |         |             |
| `MiddleName`             | varchar   | ✓        |          |         |             |
| `FirstName`              | varchar   | ✓        |          |         |             |
| `Meta_LoadDate`          | datetime2 |          |          |         |             |
| `Meta_RowLastChangeDate` | datetime2 | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_DimUserCDK_1
  - Columns: DimUserCDKID

## Indexes

- **PK_DimUserCDK_1** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DimUserCDKID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DimFocusCustomer → dbo.DimUserCDK
  - Confidence: 80%
  - Evidence: Exact column name match: "middlename" in both tables
  - Column: `MiddleName` → `MiddleName`
- **column_match**: dbo.DimServiceAppointmentDetail → dbo.DimUserCDK
  - Confidence: 80%
  - Evidence: Exact column name match: "middlename" in both tables
  - Column: `MiddleName` → `MiddleName`
- **column_match**: dbo.DimServiceAppointmentDetail_BKP → dbo.DimUserCDK
  - Confidence: 80%
  - Evidence: Exact column name match: "middlename" in both tables
  - Column: `MiddleName` → `MiddleName`
- **column_match**: dbo.DimUserCDK → dbo.DimUserDepartmentMapCDK
  - Confidence: 80%
  - Evidence: Exact column name match: "dimusercdkid" in both tables
  - Column: `DimUserCDKID` → `DimUserCDKID`
- **column_match**: dbo.DimUserCDK → dbo.FactMSCTasksDept
  - Confidence: 80%
  - Evidence: Exact column name match: "dimusercdkid" in both tables
  - Column: `DimUserCDKID` → `DimUserCDKID`
- **column_match**: dbo.DimUserCDK → dbo.FactTrafficSummaryDailyDept
  - Confidence: 80%
  - Evidence: Exact column name match: "dimusercdkid" in both tables
  - Column: `DimUserCDKID` → `DimUserCDKID`
- **column_match**: dbo.DimUserCDK → dbo.DimUserDepartmentMapCDK
  - Confidence: 80%
  - Evidence: Exact column name match: "cdkuserid" in both tables
  - Column: `CDKUserID` → `CDKUserID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
