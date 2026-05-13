---
name: Doc_ProjectionPS
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Doc_Projection
  - Doc_Projection
row_count: 0
size_kb: 0
column_count: 12
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

| Name               | Type      | Nullable | Identity | Default | Description |
| ------------------ | --------- | -------- | -------- | ------- | ----------- |
| `EntityKey`        | int       |          |          |         |             |
| `DateKey`          | int       |          |          |         |             |
| `DocDateKey`       | int       |          |          |         |             |
| `GroupElementSort` | int       |          |          |         |             |
| `Amount`           | numeric   | ✓        |          |         |             |
| `StatCount`        | money     | ✓        |          |         |             |
| `MetricTypeKey`    | int       |          |          |         |             |
| `ControllerUserID` | varchar   | ✓        |          |         |             |
| `UpdateDate`       | datetime  | ✓        |          |         |             |
| `DocID`            | int       |          |          |         |             |
| `ValidFrom`        | datetime2 |          |          |         |             |
| `ValidTo`          | datetime2 |          |          |         |             |

## Constraints

- **Primary Key**: PK**Doc_Proj**C60E8CA811E6741D
  - Columns: EntityKey, DocDateKey, GroupElementSort

## Indexes

- **PK**Doc_Proj**C60E8CA811E6741D** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: EntityKey ASC, DocDateKey ASC, GroupElementSort ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Doc_Projection → dbo.Doc_ProjectionPS
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_ProjectionPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_SubProjectionOld
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_Projection → dbo.Doc_ProjectionPS
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_ProjectionPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_Record
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_SubProjectionOld
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_ProjectionPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "validfrom" in both tables
  - Column: `ValidFrom` → `ValidFrom`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Fact_AccountingPS
  - Confidence: 80%
  - Evidence: Exact column name match: "validfrom" in both tables
  - Column: `ValidFrom` → `ValidFrom`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Fact_AccountingPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "validfrom" in both tables
  - Column: `ValidFrom` → `ValidFrom`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_ProjectionPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "validto" in both tables
  - Column: `ValidTo` → `ValidTo`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Fact_AccountingPS
  - Confidence: 80%
  - Evidence: Exact column name match: "validto" in both tables
  - Column: `ValidTo` → `ValidTo`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Fact_AccountingPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "validto" in both tables
  - Column: `ValidTo` → `ValidTo`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
