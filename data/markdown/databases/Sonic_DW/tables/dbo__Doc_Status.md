---
name: Doc_Status
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Doc_Record
  - Doc_RVPRecord
row_count: 0
size_kb: 0
column_count: 3
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

| Name             | Type    | Nullable | Identity | Default | Description |
| ---------------- | ------- | -------- | -------- | ------- | ----------- |
| `DocStatusID`    | int     |          |          |         |             |
| `DocStatusDESC`  | varchar | ✓        |          |         |             |
| `DocStatusImage` | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_Doc_Status
  - Columns: DocStatusID

## Indexes

- **PK_Doc_Status** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DocStatusID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Doc_Record → dbo.Doc_Status
  - Confidence: 80%
  - Evidence: Exact column name match: "docstatusid" in both tables
  - Column: `DocStatusID` → `DocStatusID`
- **column_match**: dbo.Doc_RVPRecord → dbo.Doc_Status
  - Confidence: 80%
  - Evidence: Exact column name match: "docstatusid" in both tables
  - Column: `DocStatusID` → `DocStatusID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
