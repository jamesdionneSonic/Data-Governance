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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
