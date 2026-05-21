---
name: usp_Update_Survey
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql


CREATE PROCEDURE [dbo].[usp_Update_Survey]

@SurveyComments varchar(2000),
@SurveyApproval tinyint,
@ApprovalUserID varchar(100),
@ReviewSignoffID varchar(100),
@CommentUserID varchar(100),
@PlaybookSurveyID int

AS

SET NOCOUNT ON
BEGIN TRY

DECLARE @SurveyStatusID int

CREATE TABLE #SurveyApproval
(PlaybookSurveyID INT,
CompletionPct DECIMAL(19,2),
SurveyStatusID INT
)
INSERT INTO #SurveyApproval

SELECT Qry_Playbook_Stats.PlaybookSurveyID
      ,CAST(Qry_Playbook_Stats.Valid_Answer_Count AS REAL) / CAST(Qry_Playbook_Stats.Total_Questions AS REAL) Completion_Pct
      ,CASE WHEN 1=1
                 AND Qry_Playbook_Stats.Valid_Answer_Count = Qry_Playbook_Stats.Total_Questions
            THEN 4
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
           ,dbo.PlaybookEntityRel
           ,( SELECT PlaybookQuestions.PlaybookID
                    ,COUNT(PlaybookQuestions.QuestionID) Total_Questions
                    ,SUM(PlaybookQuestions.PointsPossible) Total_Points_Possible
              FROM dbo.PlaybookQuestions
              GROUP BY PlaybookQuestions.PlaybookID
            ) Qry_Playbook_Totals
       WHERE (1=1
              AND PlaybookSurvey.PlaybookSurveyID = @PlaybookSurveyID
              AND PlaybookAnswer.ScoreCodeID = PlaybookScoreCode.ScoreCodeID
              AND PlaybookSurvey.EntityRelID = PlaybookEntityRel.PbeEntityRelID
              AND PlaybookEntityRel.PbePlaybookID = Qry_Playbook_Totals.PlaybookID
             )
       GROUP BY PlaybookAnswer.PlaybookSurveyID
               ,Qry_Playbook_Totals.Total_Questions
               ,Qry_Playbook_Totals.Total_Points_Possible
     ) Qry_Playbook_Stats



     SELECT @SurveyStatusID = (SELECT SurveyStatusID FROM #SurveyApproval)


UPDATE dbo.PlaybookSurvey
   SET SurveyComments = @SurveyComments-- Procedure INPUT user comment
      ,SurveyApproval = @SurveyApproval -- Procedure INPUT approval int
      ,ApprovalUserID = @ApprovalUserID -- Procedure INPUT keyed user id
      ,ReviewSignoffID = @ReviewSignoffID -- Procedure INPUT user login system prompt
      ,ApprovalDate = GETDATE()
      ,CommentUserID = @CommentUserID
      ,PlaybookStatusID = @SurveyStatusID
   WHERE (1=1
       AND PlaybookSurveyID = @PlaybookSurveyID
      );

END TRY


BEGIN CATCH
 SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

SET NOCOUNT OFF




```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
