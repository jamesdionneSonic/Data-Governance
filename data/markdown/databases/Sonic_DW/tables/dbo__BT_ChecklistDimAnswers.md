---
name: BT_ChecklistDimAnswers
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
column_count: 4
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

| Name                         | Type    | Nullable | Identity | Default | Description |
| ---------------------------- | ------- | -------- | -------- | ------- | ----------- |
| `ChecklistAnswerID`          | int     |          | ✓        |         |             |
| `ChecklistAnswerQuestionKey` | int     |          |          |         |             |
| `ChecklistAnswerDesc`        | varchar | ✓        |          |         |             |
| `ChecklistAnswerSort`        | int     | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_BT_ChecklistDimAnswers
  - Columns: ChecklistAnswerID

## Indexes

- **PK_BT_ChecklistDimAnswers** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ChecklistAnswerID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.BT_ChecklistDimAnswers → dbo.BT_ChecklistFact
  - Confidence: 80%
  - Evidence: Exact column name match: "checklistanswerid" in both tables
  - Column: `ChecklistAnswerID` → `ChecklistAnswerID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
