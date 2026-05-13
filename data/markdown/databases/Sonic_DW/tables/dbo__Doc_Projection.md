---
name: Doc_Projection
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
column_count: 12
index_count: 7
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
| `DocProjectionID`  | int      |          | ✓        |         |             |
| `EntityKey`        | int      |          |          |         |             |
| `DateKey`          | int      |          |          |         |             |
| `GroupElementSort` | int      |          |          |         |             |
| `GroupElement`     | varchar  | ✓        |          |         |             |
| `GroupSubElement`  | varchar  | ✓        |          |         |             |
| `Amount`           | numeric  | ✓        |          |         |             |
| `StatCount`        | money    | ✓        |          |         |             |
| `MetricTypeKey`    | int      |          |          |         |             |
| `ControllerUserID` | varchar  | ✓        |          |         |             |
| `UpdateDate`       | datetime | ✓        |          |         |             |
| `DocID`            | int      |          |          |         |             |

## Constraints

- **Primary Key**: PK_DocProjectionID
  - Columns: DocProjectionID

## Indexes

- **IDX_Proj_DateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DateKey ASC
  - Included Columns: EntityKey, UpdateDate, DocID, GroupElementSort, GroupElement, Amount, StatCount, MetricTypeKey
- **IDX_Proj_EntityKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC
  - Included Columns: DocProjectionID, DateKey, GroupElementSort, GroupElement, GroupSubElement, Amount, StatCount, MetricTypeKey, ControllerUserID, UpdateDate, DocID
- **IDX_Proj_SortDate** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: GroupElementSort ASC, DateKey ASC
  - Included Columns: DocProjectionID, GroupElement, MetricTypeKey, EntityKey, Amount, StatCount
- **IX_Doc_Projection_DocId** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DocID ASC
  - Included Columns: GroupElementSort, GroupElement, GroupSubElement, Amount, StatCount
- **IX_Doc_Projection_EntityKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC, DocID ASC
  - Included Columns: DateKey, GroupElementSort, GroupSubElement, Amount, StatCount
- **IX_Doc_Projection_GroupElementSort_DocId** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: GroupElementSort ASC, DocID ASC
- **PK_DocProjectionID** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DocProjectionID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Doc_Projection → dbo.Doc_ProjectionPS
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_Projection → dbo.Doc_ProjectionPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_Projection → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_Projection → dbo.Doc_SubProjectionOld
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_Projection → dbo.Doc_ProjectionPS
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_Projection → dbo.Doc_ProjectionPS_History
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_Projection → dbo.Doc_Record
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_Projection → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_Projection → dbo.Doc_SubProjectionOld
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
