---
name: usp_Update_PB_Answer
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - PlaybookAnswer
dependency_count: 1
parameter_count: 5
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.PlaybookAnswer** (U )

## Parameters

| Name                | Type    | Output | Default |
| ------------------- | ------- | ------ | ------- |
| `@AnswerID`         | int     | No     | No      |
| `@QuestionScore`    | int     | No     | No      |
| `@ScoreUserId`      | varchar | No     | No      |
| `@AnswerComment`    | varchar | No     | No      |
| `@CoachingRequired` | int     | No     | No      |

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
       ,@PlaybookSurveyID INT

BEGIN TRY

    SET @ValidValues = (SELECT v.ValidValues
                        FROM Sonic_DW.dbo.PlaybookQuestions q
                        JOIN Sonic_DW.dbo.PlaybookValidValues v
                            ON q.ValidValuesID = v.ValidValuesID
                        JOIN Sonic_DW.dbo.PlaybookAnswer a
                            ON a.QuestionID = q.QuestionID
                        WHERE a.AnswerId = @AnswerID)


    CREATE TABLE #TempScoreCode
    (ScoreCodeID int)

    IF @QuestionScore is null
    BEGIN
		INSERT INTO #TempScoreCode values (1) END
	ELSE BEGIN

     --Insert Into #TempScoreCode SELECT case when  RTRIM(@QuestionScore) is null then 1 when RTRIM(@QuestionScore) in ( rtrim(@ValidValues)) then 3 else 2 end
    SET @strSelect = 'Insert into #TempScoreCode SELECT case when ' + RTRIM(@QuestionScore) + ' in ('  + rtrim(@ValidValues)  + ') and ' + RTRIM(@CoachingRequired) + ' = 1 then 4
					when ' + RTRIM(@QuestionScore) + ' in ('  + rtrim(@ValidValues)  + ') and ' + RTRIM(@CoachingRequired) + ' = 0 then 3
					else 2 end'
    EXEC(@strSelect);
	END
    SELECT @ScoreCodeID = (SELECT ScoreCodeID FROM #TempScoreCode)
    SELECT @PlaybookSurveyID = (SELECT PlaybookSurveyID from dbo.PlaybookAnswer where AnswerID = @AnswerID)

    UPDATE dbo.PlaybookAnswer
    SET QuestionScore = @QuestionScore
       ,ScoreUserId = @ScoreUserId
       ,UpdateDate = GETDATE()
       ,ScoreCodeID = @ScoreCodeID
       ,AnswerComment = @AnswerComment
    WHERE AnswerId = @AnswerID


--update survey from ready to in progress
exec usp_UpdateSurveyStatus @PlaybookSurveyID, @ScoreUserID
    --at the end check to see if all answers are completed if so, update as ready for review
      --N=2, Y=3

    --separate sp for the approval with Approvaluserid, reviewsignoffid  1, approved; 2, contested
END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

DROP TABLE #TempScoreCode

SET NOCOUNT OFF









```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
