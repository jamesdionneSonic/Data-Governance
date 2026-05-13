---
name: MSAnswer
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
column_count: 10
index_count: 0
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

| Name                | Type     | Nullable | Identity | Default | Description |
| ------------------- | -------- | -------- | -------- | ------- | ----------- |
| `MSAnswerID`        | int      |          | ✓        |         |             |
| `MSQuestionScore`   | int      | ✓        |          |         |             |
| `MSScoreSubmitDate` | datetime | ✓        |          |         |             |
| `MSScoreUserID`     | varchar  | ✓        |          |         |             |
| `MSUpdateDate`      | datetime | ✓        |          |         |             |
| `MSAnswerComment`   | varchar  | ✓        |          |         |             |
| `MSQuestionID`      | int      |          |          |         |             |
| `MSSurveyID`        | int      |          |          |         |             |
| `MSEntityID`        | int      |          |          |         |             |
| `MSValidValuesID`   | int      |          |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.MSAnswer → dbo.MSPhoto
  - Confidence: 80%
  - Evidence: Exact column name match: "msanswerid" in both tables
  - Column: `MSAnswerID` → `MSAnswerID`
- **column_match**: dbo.MSAnswer → dbo.MSQuestion
  - Confidence: 80%
  - Evidence: Exact column name match: "msquestionid" in both tables
  - Column: `MSQuestionID` → `MSQuestionID`
- **column_match**: dbo.MSAnswer → dbo.MSSurvey
  - Confidence: 80%
  - Evidence: Exact column name match: "mssurveyid" in both tables
  - Column: `MSSurveyID` → `MSSurveyID`
- **column_match**: dbo.MSAnswer → dbo.MSEntity
  - Confidence: 80%
  - Evidence: Exact column name match: "msentityid" in both tables
  - Column: `MSEntityID` → `MSEntityID`
- **column_match**: dbo.MSAnswer → dbo.MSSurvey
  - Confidence: 80%
  - Evidence: Exact column name match: "msentityid" in both tables
  - Column: `MSEntityID` → `MSEntityID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
