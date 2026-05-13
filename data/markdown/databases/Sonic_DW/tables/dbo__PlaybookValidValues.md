---
name: PlaybookValidValues
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - PlaybookQuestions
  - PlaybookQuestions_Stage
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

| Name              | Type    | Nullable | Identity | Default | Description |
| ----------------- | ------- | -------- | -------- | ------- | ----------- |
| `ValidValuesID`   | int     |          | ✓        |         |             |
| `ValidValues`     | varchar | ✓        |          |         |             |
| `ValidValuesDesc` | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_PlaybookValidValues
  - Columns: ValidValuesID

## Indexes

- **PK_PlaybookValidValues** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ValidValuesID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.PlaybookQuestions → dbo.PlaybookValidValues
  - Confidence: 80%
  - Evidence: Exact column name match: "validvaluesid" in both tables
  - Column: `ValidValuesID` → `ValidValuesID`
- **column_match**: dbo.PlaybookQuestions_Stage → dbo.PlaybookValidValues
  - Confidence: 80%
  - Evidence: Exact column name match: "validvaluesid" in both tables
  - Column: `ValidValuesID` → `ValidValuesID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
