---
name: usp_Update_PB_Answer
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql



--Script Updated in TEST on 3/5 to handle additional ScoreCode value to identify required training.  DRM



CREATE PROCEDURE [dbo].[usp_Update_PB_Answer]

--exec usp_Update_PB_Answer 11,5,'Doug Morgan','Testing Null Value2',1

@AnswerID INT,
@QuestionScore INT,
@ScoreUserId VARCHAR(50),
@AnswerComment VARCHAR(2000),
@CoachingRequired INT

AS

SET NOCOUNT ON

DECLARE @ValidValues VARCHAR(100)
       ,@strSelect VARCHAR(1000)
       ,@ScoreCodeID INT
       ,@PlaybookSur
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
