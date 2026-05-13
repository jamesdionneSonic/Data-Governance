---
name: usp_Update_MS_Answer
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 4
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Parameters

| Name               | Type    | Output | Default |
| ------------------ | ------- | ------ | ------- |
| `@MSAnswerID`      | int     | No     | No      |
| `@MSQuestionScore` | int     | No     | No      |
| `@MSScoreUserId`   | varchar | No     | No      |
| `@MSAnswerComment` | varchar | No     | No      |

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
    WHERE MSAnswerID = @MSAnswerID


END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH



SET NOCOUNT OFF




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
