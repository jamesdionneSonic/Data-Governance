---
name: PlaybookQuestions
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
  - PlaybookAnswerReset
  - PlaybookAnswer
  - PlaybookAnswerReset
  - PlaybookName
  - PlaybookPhotoReset
row_count: 0
size_kb: 0
column_count: 12
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

| Name                | Type    | Nullable | Identity | Default | Description |
| ------------------- | ------- | -------- | -------- | ------- | ----------- |
| `QuestionID`        | int     |          | ✓        |         |             |
| `PlaybookID`        | int     |          |          |         |             |
| `ValidValuesID`     | int     |          |          |         |             |
| `QuestionNumber`    | int     |          |          |         |             |
| `SubQuestionNumber` | varchar | ✓        |          |         |             |
| `SectionNumber`     | int     | ✓        |          |         |             |
| `Section`           | varchar | ✓        |          |         |             |
| `SubSectionNumber`  | int     | ✓        |          |         |             |
| `SubSection`        | varchar | ✓        |          |         |             |
| `Question`          | varchar | ✓        |          |         |             |
| `PointsPossible`    | int     | ✓        |          |         |             |
| `ReviewGuideLines`  | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_PlaybookQuestions
  - Columns: QuestionID, PlaybookID

## Indexes

- **PK_PlaybookQuestions** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: QuestionID ASC, PlaybookID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DimSurveyQuestion → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.FactSurveyAuditDetail → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.FactSurveyAuditDetail\_\_BK_20211018 → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.PlaybookAnswer_SonicPriceReplacement → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.PlaybookQuestions → dbo.PlaybookQuestions_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "questionid" in both tables
  - Column: `QuestionID` → `QuestionID`
- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookName → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookPhotoReset → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookQuestions → dbo.PlaybookQuestions_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookQuestions → dbo.PlaybookSurvey
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookQuestions → dbo.PlaybookQuestions_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "validvaluesid" in both tables
  - Column: `ValidValuesID` → `ValidValuesID`
- **column_match**: dbo.PlaybookQuestions → dbo.PlaybookValidValues
  - Confidence: 80%
  - Evidence: Exact column name match: "validvaluesid" in both tables
  - Column: `ValidValuesID` → `ValidValuesID`
- **column_match**: dbo.PlaybookQuestions → dbo.PlaybookQuestions_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "reviewguidelines" in both tables
  - Column: `ReviewGuideLines` → `ReviewGuideLines`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
