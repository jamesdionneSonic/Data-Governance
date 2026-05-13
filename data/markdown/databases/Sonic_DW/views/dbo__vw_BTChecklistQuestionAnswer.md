---
name: vw_BTChecklistQuestionAnswer
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - BT_ChecklistDimAnswers
  - BT_ChecklistDimQuestions
  - BT_ChecklistFact
  - BT_ChecklistRecord
dependency_count: 4
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.BT_ChecklistDimAnswers** (U )
- **dbo.BT_ChecklistDimQuestions** (U )
- **dbo.BT_ChecklistFact** (U )
- **dbo.BT_ChecklistRecord** (U )

## Columns

| Name                         | Type    | Nullable | Description |
| ---------------------------- | ------- | -------- | ----------- |
| `SectionID`                  | int     | ✓        |             |
| `ChecklistKey`               | int     |          |             |
| `ChecklistQuestionID`        | int     |          |             |
| `SectionName`                | varchar | ✓        |             |
| `Question`                   | varchar | ✓        |             |
| `QuestionNumber`             | int     | ✓        |             |
| `IsActive`                   | bit     |          |             |
| `ChecklistAnswerQuestionKey` | int     | ✓        |             |
| `ChecklistAnswerDesc`        | varchar | ✓        |             |
| `ChecklistAnswerSort`        | int     | ✓        |             |
| `ChecklistAnswerID`          | int     |          |             |
| `ChecklistUserAnswer`        | int     | ✓        |             |
| `ChecklistFactKey`           | int     |          |             |
| `QuestionType`               | int     | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_BTChecklistQuestionAnswer]
AS
SELECT        dbo.BT_ChecklistDimQuestions.SectionID, dbo.BT_ChecklistRecord.ChecklistKey, dbo.BT_ChecklistDimQuestions.ChecklistQuestionID, dbo.BT_ChecklistDimQuestions.SectionName, dbo.BT_ChecklistDimQuestions.Question,
                         dbo.BT_ChecklistDimQuestions.QuestionNumber, dbo.BT_ChecklistDimQuestions.IsActive, dbo.BT_ChecklistDimQuestions.ChecklistAnswerQuestionKey, dbo.BT_ChecklistDimAnswers.ChecklistAnswerDesc,
                         dbo.BT_ChecklistDimAnswers.ChecklistAnswerSort, dbo.BT_ChecklistDimAnswers.ChecklistAnswerID, dbo.BT_ChecklistFact.ChecklistAnswerID AS ChecklistUserAnswer, dbo.BT_ChecklistFact.ChecklistFactKey,
                         dbo.BT_ChecklistDimQuestions.QuestionType
FROM            dbo.BT_ChecklistDimQuestions INNER JOIN
                         dbo.BT_ChecklistDimAnswers ON dbo.BT_ChecklistDimQuestions.ChecklistAnswerQuestionKey = dbo.BT_ChecklistDimAnswers.ChecklistAnswerQuestionKey INNER JOIN
                         dbo.BT_ChecklistFact ON dbo.BT_ChecklistDimQuestions.ChecklistQuestionID = dbo.BT_ChecklistFact.ChecklistQuestionID INNER JOIN
                         dbo.BT_ChecklistRecord ON dbo.BT_ChecklistFact.ChecklistKey = dbo.BT_ChecklistRecord.ChecklistKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
