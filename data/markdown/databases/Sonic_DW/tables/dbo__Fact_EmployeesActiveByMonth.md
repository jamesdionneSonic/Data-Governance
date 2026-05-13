---
name: Fact_EmployeesActiveByMonth
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - fact-table
  - core-schema
depends_on:
  - DimAssociate
  - DimAssociate_0418
  - DimAssociate_07282023
  - DimAssociate_0816
  - DimAssociate_914_new
  - DimAssociate_bk_0413
  - DimAssociate_FULL
  - DimAssociate_newfile
  - DimAssociate0711
  - DimAssociate0829
  - DimAssociate1010
  - DimAssociate110724
row_count: 0
size_kb: 0
column_count: 14
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

| Name                | Type    | Nullable | Identity | Default | Description |
| ------------------- | ------- | -------- | -------- | ------- | ----------- |
| `FiscalMonthKey`    | int     |          |          |         |             |
| `EndDateKey`        | int     | ✓        |          |         |             |
| `AsoEmployeeNumber` | int     |          |          |         |             |
| `EntityKey`         | int     | ✓        |          |         |             |
| `AsoDepartmentCode` | varchar |          |          |         |             |
| `OriginalHireDate`  | int     |          |          |         |             |
| `TerminationDate`   | int     |          |          |         |             |
| `ThroughDate`       | int     | ✓        |          |         |             |
| `AsoJobCode`        | varchar | ✓        |          |         |             |
| `IsActive`          | int     |          |          |         |             |
| `IsTerm`            | int     |          |          |         |             |
| `Department`        | varchar |          |          |         |             |
| `AsoSupervisorID`   | int     |          |          |         |             |
| `AsoSupervisorName` | varchar |          |          |         |             |

## Indexes

- **IDX_AsoEmployeeNumber** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: AsoEmployeeNumber ASC, AsoDepartmentCode ASC, OriginalHireDate ASC, TerminationDate ASC, AsoJobCode ASC
  - Included Columns: FiscalMonthKey, EntityKey, IsActive, IsTerm
- **IDX_FiscalMonthEntityKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalMonthKey ASC, EntityKey ASC
  - Included Columns: AsoEmployeeNumber, AsoDepartmentCode, OriginalHireDate, TerminationDate, AsoJobCode, IsActive, IsTerm
- **IDX_FiscalMonthKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalMonthKey ASC
  - Included Columns: AsoEmployeeNumber, AsoJobCode, IsActive, IsTerm

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DimAssociate → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate_0418 → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate_07282023 → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate_0816 → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate_914_new → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate_bk_0413 → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate_FULL → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate_newfile → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate0711 → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate0829 → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate1010 → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.DimAssociate110724 → dbo.Fact_EmployeesActiveByMonth
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.Fact_EmployeesActiveByMonth → dbo.testassociate
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`
- **column_match**: dbo.Fact_EmployeesActiveByMonth → dbo.zzzzDimAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "asosupervisorid" in both tables
  - Column: `AsoSupervisorID` → `AsoSupervisorID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
