---
name: Doc_SubProjection
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Doc_Projection
  - Doc_ProjectionPS
  - Doc_ProjectionPS_History
  - Doc_Projection
  - Doc_ProjectionPS
  - Doc_ProjectionPS_History
  - Doc_Record
row_count: 0
size_kb: 0
column_count: 12
index_count: 5
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

| Name                 | Type     | Nullable | Identity | Default | Description |
| -------------------- | -------- | -------- | -------- | ------- | ----------- |
| `DocSubProjectionID` | int      |          | ✓        |         |             |
| `EntityKey`          | int      |          |          |         |             |
| `DateKey`            | int      |          |          |         |             |
| `GroupElementSort`   | int      |          |          |         |             |
| `GroupElement`       | varchar  | ✓        |          |         |             |
| `GroupSubElement`    | varchar  | ✓        |          |         |             |
| `Amount`             | numeric  | ✓        |          |         |             |
| `StatCount`          | money    | ✓        |          |         |             |
| `MetricTypeKey`      | int      |          |          | ((4))   |             |
| `ControllerUserID`   | varchar  | ✓        |          |         |             |
| `UpdateDate`         | datetime | ✓        |          |         |             |
| `DocID`              | int      |          |          |         |             |

## Constraints

- **Primary Key**: PK_DocSubProjection
  - Columns: DocSubProjectionID

## Indexes

- **IX_Doc_SubProjection_DocId** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DocID ASC
- **IX_Doc_SubProjection_EntityKey_GroupElementSort** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC, GroupElementSort ASC
  - Included Columns: DocSubProjectionID, Amount, DocID, StatCount
- **IX_Doc_SubProjection_EntityKey_GroupElementSort_DateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC, GroupElementSort ASC, DateKey ASC
  - Included Columns: DocSubProjectionID, StatCount
- **IX_Doc_SubProjection_GroupElementSort_DocId** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: GroupElementSort ASC, DocID ASC
  - Included Columns: EntityKey, StatCount, DocSubProjectionID, Amount
- **PK_DocSubProjection** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DocSubProjectionID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Doc_Projection → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_ProjectionPS_History → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_SubProjection → dbo.Doc_SubProjectionOld
  - Confidence: 80%
  - Evidence: Exact column name match: "controlleruserid" in both tables
  - Column: `ControllerUserID` → `ControllerUserID`
- **column_match**: dbo.Doc_Projection → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_ProjectionPS_History → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_Record → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_SubProjection → dbo.Doc_SubProjectionOld
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_SubProjection → dbo.Doc_SubProjectionOld
  - Confidence: 80%
  - Evidence: Exact column name match: "docsubprojectionid" in both tables
  - Column: `DocSubProjectionID` → `DocSubProjectionID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
