---
name: usp_Update_MS_Answer
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



CREATE PROCEDURE [dbo].[usp_Update_MS_Answer]

--exec usp_Update_PB_Answer 11,Null,'Doug Morgan','Testing Null Value2'

@MSAnswerID INT,
@MSQuestionScore INT,
@MSScoreUserId VARCHAR(50),
@MSAnswerComment VARCHAR(2000)

AS

SET NOCOUNT ON

       
BEGIN TRY


    UPDATE Sonic_DW.dbo.MSAnswer
    SET MSQuestionScore = @MSQuestionScore
       ,MSScoreUserId = @MSScoreUserId
       ,MSScoreSubmitDate = GETDATE()
       ,MSAnswerComment = @MSAnswerComment
    WHERE MSAnswe
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
