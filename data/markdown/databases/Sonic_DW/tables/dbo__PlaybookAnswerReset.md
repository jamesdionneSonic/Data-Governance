---
name: PlaybookAnswerReset
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DimSurveyQuestion
  - FactSurveyAuditDetail
  - FactSurveyAuditDetail__BK_20211018
  - PlaybookAnswer
  - PlaybookAnswer_SonicPriceReplacement
  - PlaybookAnswer
  - PlaybookAnswer_SonicPriceReplacement
  - PlaybookAnswer
  - PlaybookAnswer
  - PlaybookAnswer_SonicPriceReplacement
  - PlaybookAnswer
  - PlaybookAnswer_SonicPriceReplacement
  - PlaybookAnswer
  - PlaybookAnswer_SonicPriceReplacement
row_count: 0
size_kb: 0
column_count: 12
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
| `AnswerId`         | int      |          |          |         |             |
| `QuestionID`       | int      |          |          |         |             |
| `PlaybookSurveyID` | int      |          |          |         |             |
| `QuestionScore`    | int      | ✓        |          |         |             |
| `ScoreSubmitDate`  | datetime | ✓        |          |         |             |
| `ScoreUserId`      | varchar  | ✓        |          |         |             |
| `UpdateDate`       | datetime | ✓        |          |         |             |
| `ScoreCodeID`      | int      | ✓        |          |         |             |
| `AnswerComment`    | varchar  | ✓        |          |         |             |
| `ResetDate`        | datetime | ✓        |          |         |             |
| `EntityKey`        | int      | ✓        |          |         |             |
| `PlaybookID`       | int      | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DimSurveyQuestion → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.FactSurveyAuditDetail → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.FactSurveyAuditDetail\_\_BK_20211018 → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.PlaybookAnswer_SonicPriceReplacement → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookQuestions_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "answerid" in both tables
  - Column: `AnswerId` → `AnswerId`
- **column_match**: dbo.PlaybookAnswer_SonicPriceReplacement → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "answerid" in both tables
  - Column: `AnswerId` → `AnswerId`
- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookName
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookPhotoReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookQuestions_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookSurvey
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbooksurveyid" in both tables
  - Column: `PlaybookSurveyID` → `PlaybookSurveyID`
- **column_match**: dbo.PlaybookAnswer_SonicPriceReplacement → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbooksurveyid" in both tables
  - Column: `PlaybookSurveyID` → `PlaybookSurveyID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookSurvey
  - Confidence: 80%
  - Evidence: Exact column name match: "playbooksurveyid" in both tables
  - Column: `PlaybookSurveyID` → `PlaybookSurveyID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookSurveyReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbooksurveyid" in both tables
  - Column: `PlaybookSurveyID` → `PlaybookSurveyID`
- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "scoreuserid" in both tables
  - Column: `ScoreUserId` → `ScoreUserId`
- **column_match**: dbo.PlaybookAnswer_SonicPriceReplacement → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "scoreuserid" in both tables
  - Column: `ScoreUserId` → `ScoreUserId`
- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "scorecodeid" in both tables
  - Column: `ScoreCodeID` → `ScoreCodeID`
- **column_match**: dbo.PlaybookAnswer_SonicPriceReplacement → dbo.PlaybookAnswerReset
  - Confidence: 80%
  - Evidence: Exact column name match: "scorecodeid" in both tables
  - Column: `ScoreCodeID` → `ScoreCodeID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookScoreCode
  - Confidence: 80%
  - Evidence: Exact column name match: "scorecodeid" in both tables
  - Column: `ScoreCodeID` → `ScoreCodeID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
