---
name: BT_ChecklistFact
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - BT_ChecklistDimAnswers
  - BT_ChecklistDimQuestions
row_count: 0
size_kb: 0
column_count: 8
index_count: 2
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

| Name                  | Type     | Nullable | Identity | Default     | Description |
| --------------------- | -------- | -------- | -------- | ----------- | ----------- |
| `ChecklistFactKey`    | int      |          | ✓        |             |             |
| `ChecklistKey`        | int      |          |          |             |             |
| `ChecklistQuestionID` | int      |          |          |             |             |
| `ChecklistAnswer`     | varchar  | ✓        |          | ((0))       |             |
| `ChecklistComment`    | varchar  | ✓        |          |             |             |
| `DateLastModified`    | datetime | ✓        |          | (getdate()) |             |
| `ModifierName`        | varchar  | ✓        |          |             |             |
| `ChecklistAnswerID`   | int      | ✓        |          |             |             |

## Constraints

- **Primary Key**: PK_BT_FactChecklist
  - Columns: ChecklistFactKey
- **Unique**: UQ_ChecklistFact
  - Columns: ChecklistKey, ChecklistQuestionID

## Indexes

- **PK_BT_FactChecklist** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ChecklistFactKey ASC
- **UQ_ChecklistFact** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: No
  - Key Columns: ChecklistKey ASC, ChecklistQuestionID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.BT_ChecklistDimAnswers → dbo.BT_ChecklistFact
  - Confidence: 80%
  - Evidence: Exact column name match: "checklistanswerid" in both tables
  - Column: `ChecklistAnswerID` → `ChecklistAnswerID`
- **column_match**: dbo.BT_ChecklistDimQuestions → dbo.BT_ChecklistFact
  - Confidence: 80%
  - Evidence: Exact column name match: "checklistquestionid" in both tables
  - Column: `ChecklistQuestionID` → `ChecklistQuestionID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
