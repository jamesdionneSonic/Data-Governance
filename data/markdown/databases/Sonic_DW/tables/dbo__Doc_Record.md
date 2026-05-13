---
name: Doc_Record
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
row_count: 0
size_kb: 0
column_count: 9
index_count: 4
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

| Name                  | Type     | Nullable | Identity | Default | Description |
| --------------------- | -------- | -------- | -------- | ------- | ----------- |
| `DocID`               | int      |          | ✓        |         |             |
| `EntityKey`           | int      | ✓        |          |         |             |
| `DocStartDate`        | datetime | ✓        |          |         |             |
| `ControllerName`      | varchar  | ✓        |          |         |             |
| `DocReviewDate`       | datetime |          |          |         |             |
| `DocReviewBy`         | varchar  | ✓        |          |         |             |
| `DocStatusID`         | int      | ✓        |          |         |             |
| `DocDateKey`          | int      | ✓        |          |         |             |
| `DocReviewSubmitDate` | datetime | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_DocID
  - Columns: DocID

## Indexes

- **IDX_Record_DocDateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DocDateKey ASC
  - Included Columns: EntityKey
- **IDX_RecordStatus** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DocStatusID ASC, DocDateKey ASC
  - Included Columns: DocID
- **IX_Doc_Record_EntityKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC
  - Included Columns: DocID
- **PK_DocID** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DocID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Doc_Projection → dbo.Doc_Record
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_ProjectionPS → dbo.Doc_Record
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_ProjectionPS_History → dbo.Doc_Record
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_Record → dbo.Doc_SubProjection
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_Record → dbo.Doc_SubProjectionOld
  - Confidence: 80%
  - Evidence: Exact column name match: "docid" in both tables
  - Column: `DocID` → `DocID`
- **column_match**: dbo.Doc_Record → dbo.Doc_RVPRecord
  - Confidence: 80%
  - Evidence: Exact column name match: "docstatusid" in both tables
  - Column: `DocStatusID` → `DocStatusID`
- **column_match**: dbo.Doc_Record → dbo.Doc_Status
  - Confidence: 80%
  - Evidence: Exact column name match: "docstatusid" in both tables
  - Column: `DocStatusID` → `DocStatusID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
