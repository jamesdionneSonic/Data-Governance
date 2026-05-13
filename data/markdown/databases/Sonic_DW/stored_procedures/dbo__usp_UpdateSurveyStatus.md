---
name: usp_UpdateSurveyStatus
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - PlaybookAnswer
  - PlaybookQuestions
  - PlaybookScoreCode
  - PlaybookSurvey
dependency_count: 4
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.PlaybookAnswer** (U )
- **dbo.PlaybookQuestions** (U )
- **dbo.PlaybookScoreCode** (U )
- **dbo.PlaybookSurvey** (U )

## Parameters

| Name                | Type    | Output | Default |
| ------------------- | ------- | ------ | ------- |
| `@PlaybookSurveyID` | int     | No     | No      |
| `@ScoreUserID`      | varchar | No     | No      |

## Definition

```sql

/*---------------------------------
*
*
*MOD001:  Remove reference to PlaybookEntityRel.  -Doug Morgan 03/21/2017
*--------------------------------*/
CREATE PROCEDURE [dbo].[usp_UpdateSurveyStatus]

--exec usp_UpdateSurveyStatus @PlaybookSurveyID, @ScoreUserID
--select * from PlaybookSurvey

@PlaybookSurveyID INT,
@ScoreUserID varchar(100)

AS

SET NOCOUNT ON

DECLARE

@SurveyStatusID INT,
@CreateDate DATETIME


CREATE TABLE #SurveyStatus
(PlaybookSurveyID INT,
CompletionPct DECIMAL(19,2),
SurveyStatusID INT
)
INSERT INTO #SurveyStatus

SELECT Qry_Playbook_Stats.PlaybookSurveyID
      ,CAST(Qry_Playbook_Stats.Valid_Answer_Count AS REAL) / CAST(Qry_Playbook_Stats.Total_Questions AS REAL) Completion_Pct
      ,CASE WHEN 1=1
                 AND Qry_Playbook_Stats.Valid_Answer_Count = Qry_Playbook_Stats.Total_Questions
            THEN 3
            ELSE 2
       END Survey_Complete_Flag
FROM ( SELECT PlaybookAnswer.PlaybookSurveyID
             ,Qry_Playbook_Totals.Total_Questions
             ,SUM(CASE WHEN 1=1
                            AND PlaybookScoreCode.ScoreIsValid = 1
                       THEN 1
                       ELSE 0
                  END
                 ) Valid_Answer_Count

       FROM dbo.PlaybookAnswer
           ,dbo.PlaybookScoreCode
           ,dbo.PlaybookSurvey
--MOD001 - Remove ref to PlaybookEntityRel
          -- ,dbo.PlaybookEntityRel
           ,( SELECT PlaybookQuestions.PlaybookID
                    ,COUNT(PlaybookQuestions.QuestionID) Total_Questions
                    ,SUM(PlaybookQuestions.PointsPossible) Total_Points_Possible
              FROM dbo.PlaybookQuestions
              GROUP BY PlaybookQuestions.PlaybookID
            ) Qry_Playbook_Totals
       WHERE (1=1
              AND PlaybookSurvey.PlaybookSurveyID = @PlaybookSurveyID
              AND PlaybookAnswer.ScoreCodeID = PlaybookScoreCode.ScoreCodeID
--MOD001 - remove reference to PlaybookEntityRel
              --AND PlaybookSurvey.EntityRelID = PlaybookEntityRel.PbeEntityRelID
              --AND PlaybookEntityRel.PbePlaybookID = Qry_Playbook_Totals.PlaybookID
			  AND PlaybookSurvey.PlaybookID = Qry_Playbook_Totals.PlaybookID
             )
       GROUP BY PlaybookAnswer.PlaybookSurveyID
               ,Qry_Playbook_Totals.Total_Questions
               ,Qry_Playbook_Totals.Total_Points_Possible
     ) Qry_Playbook_Stats
     where Qry_Playbook_Stats.PlaybookSurveyID = @PlaybookSurveyID

     --SELECT * FROM #SurveyStatus

     SELECT @SurveyStatusID = (SELECT SurveyStatusID FROM #SurveyStatus)
     --Select @SurveyStatusID

     UPDATE PlaybookSurvey
     SET
		PlaybookStatusID = @SurveyStatusID,
		SurveyApproval = @SurveyStatusID,
		CreateDate = GETDATE()
		Where PlaybookSurveyID = @PlaybookSurveyID

	--Select * from PlaybookSurvey where PlaybookSurveyID = @PlaybookSurveyID

    DROP TABLE #SurveyStatus





```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
