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
extracted_at: 2026-05-09T12:34:14.349Z
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
    
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
