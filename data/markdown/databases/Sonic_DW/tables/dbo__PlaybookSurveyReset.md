---
name: PlaybookSurveyReset
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - PlaybookAnswer
  - PlaybookAnswer_SonicPriceReplacement
  - PlaybookAnswerReset
  - PlaybookSurvey
  - PlaybookSurvey
  - PlaybookSurvey
  - PlaybookSurvey
  - PlaybookSurvey
  - PlaybookSurvey
row_count: 0
size_kb: 0
column_count: 11
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

| Name               | Type     | Nullable | Identity | Default | Description |
| ------------------ | -------- | -------- | -------- | ------- | ----------- |
| `PlaybookSurveyID` | int      |          |          |         |             |
| `EntityRelID`      | int      |          |          |         |             |
| `SurveyComments`   | varchar  | ✓        |          |         |             |
| `CommentUserID`    | varchar  | ✓        |          |         |             |
| `SurveyApproval`   | tinyint  | ✓        |          |         |             |
| `ApprovalUserID`   | varchar  | ✓        |          |         |             |
| `CreateDate`       | datetime | ✓        |          |         |             |
| `PlaybookStatusID` | int      |          |          |         |             |
| `ReviewSignoffID`  | varchar  | ✓        |          |         |             |
| `ApprovalDate`     | datetime | ✓        |          |         |             |
| `ResetDate`        | datetime | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookSurveyReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbooksurveyid" in both tables
  - Column: `PlaybookSurveyID` → `PlaybookSurveyID`
- **column_match**: dbo.PlaybookAnswer_SonicPriceReplacement → dbo.PlaybookSurveyReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbooksurveyid" in both tables
  - Column: `PlaybookSurveyID` → `PlaybookSurveyID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookSurveyReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbooksurveyid" in both tables
  - Column: `PlaybookSurveyID` → `PlaybookSurveyID`
- **column_match**: dbo.PlaybookSurvey → dbo.PlaybookSurveyReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbooksurveyid" in both tables
  - Column: `PlaybookSurveyID` → `PlaybookSurveyID`
- **column_match**: dbo.PlaybookSurvey → dbo.PlaybookSurveyReset
  - Confidence: 80%
  - Evidence: Exact column name match: "entityrelid" in both tables
  - Column: `EntityRelID` → `EntityRelID`
- **column_match**: dbo.PlaybookSurvey → dbo.PlaybookSurveyReset
  - Confidence: 80%
  - Evidence: Exact column name match: "commentuserid" in both tables
  - Column: `CommentUserID` → `CommentUserID`
- **column_match**: dbo.PlaybookSurvey → dbo.PlaybookSurveyReset
  - Confidence: 80%
  - Evidence: Exact column name match: "approvaluserid" in both tables
  - Column: `ApprovalUserID` → `ApprovalUserID`
- **column_match**: dbo.PlaybookSurvey → dbo.PlaybookSurveyReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookstatusid" in both tables
  - Column: `PlaybookStatusID` → `PlaybookStatusID`
- **column_match**: dbo.PlaybookSurvey → dbo.PlaybookSurveyReset
  - Confidence: 80%
  - Evidence: Exact column name match: "reviewsignoffid" in both tables
  - Column: `ReviewSignoffID` → `ReviewSignoffID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
