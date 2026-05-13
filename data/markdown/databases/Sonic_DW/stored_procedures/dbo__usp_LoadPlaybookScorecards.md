---
name: usp_LoadPlaybookScorecards
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Parameters

| Name          | Type | Output | Default |
| ------------- | ---- | ------ | ------- |
| `@EntityKey`  | int  | No     | No      |
| `@PlaybookID` | int  | No     | No      |
| `@Quarter`    | int  | No     | No      |

## Definition

```sql

/*--------------------------------------------------------
*
*  CreatedBy			ModifiedBy			ModificationDate    Mod#		Notes
*  Doug Morgan
*						Doug Morgan			06082017			MOD0001		Update to ensure that only approved questions get generated on scorecards.
*  Example call:  exec [dbo].[usp_LoadPlaybookScorecards] 103,100,1
*
*------------------------------------------------------------------------*/

--exec [dbo].[usp_LoadPlaybookScorecards] 47,106,1

CREATE Procedure [dbo].[usp_LoadPlaybookScorecards]
@EntityKey int
,@PlaybookID int
,@Quarter int


AS

SET NOCOUNT ON



--When migrating to TEST, UAT and PROD, we need to make sure we set identity seed values.
--Insert Data into the scorecard table

INSERT INTO Scorecard.[dbo].[Scorecard]
           (--ID
		   [PlaybookId]
           ,[Quarter]
           ,[DealershipId]
           ,[Name]
           ,[Status]
           ,[IsPublished]
           ,[IsRemediation])

	 VALUES ( --10001
		   @Playbookid
           ,@Quarter
		   ,@entitykey--<DealershipId, int,>
           ,'Name'
           ,2  --<Status, int,>
           ,1 --<IsPublished, bit,>
           ,0 --<IsRemediation, bit,>
		   )


--Insert data into the legacy PlaybookSurvey

Set Identity_Insert Sonic_DW.dbo.PlaybookSurvey ON

INSERT INTO Sonic_DW.[dbo].[PlaybookSurvey]
           (PlaybookSurveyID
		   ,[EntityKey]
           ,[PlaybookID]
           ,[EntityRelID]
           ,[SurveyComments]
           ,[CommentUserID]
           ,[SurveyApproval]
           ,[ApprovalUserID]
           ,[SurveyQuarter]
           ,[CreateDate]
           ,[PlaybookStatusID]
           ,[ReviewSignoffID]
           ,[ApprovalDate])
     Select
			ID
           ,@entitykey
           ,@PlaybookID
           ,'' --<EntityRelID, int,>
           ,Null --<SurveyComments, varchar(2000),>
           ,'' as [CommentUserID]
		   ,2 as [SurveyApproval]
		   ,'' as [ApprovalUserID]
		   ,@Quarter -- as SurveyQuarter
		   ,Getdate() as [CreateDate]
		   ,1 as [PlaybookStatusID]
		   ,'' as [ReviewSignoffID]
		   ,Getdate() as [ApprovalDate]

		   From Scorecard.dbo.Scorecard
		   where Dealershipid = @EntityKey
		   and PlaybookID = @PlaybookID
		   and [Quarter] = @Quarter



Set Identity_Insert Sonic_DW.dbo.PlaybookSurvey OFF



--Insert ScorecardQuestion/PlaybookAnswer records

INSERT INTO Scorecard.[dbo].[ScorecardQuestion]
           ([ScorecardId]
           ,[QuestionId]
           ,[Position]
           ,[Unscored])


SELECT TOP 6
      s.id as scid
      ,q.Id as qid
	  ,q.id as Position
	  ,0 as Unscored

  FROM [Scorecard].[dbo].[Question] q
  JOIN Scorecard.dbo.Scorecard s
  ON s.PlaybookId = q.PlaybookId
  WHERE q.PlaybookId = @PlaybookID
  AND s.[Quarter] = @Quarter
  AND s.DealershipId = @EntityKey
  AND q.id not in (

  SELECT questionid FROM scorecard.dbo.scorecardquestion sq
  JOIN Scorecard.dbo.Scorecard s
  ON s.id = sq.scorecardid
  WHERE PlaybookId = @PlaybookID
  AND DealershipId = @EntityKey
  AND q.Status = 2 -- MOD001:  Added Status Condition to only pull Approved questions into the scorecard.
  --and s.[Quarter] = 1
  )

  ORDER BY NEWID()


  --Now insert into Sonic_DW.dbo.PlaybookAnswer

  Set Identity_Insert Sonic_DW.dbo.PlaybookAnswer ON

  INSERT INTO Sonic_DW.[dbo].[PlaybookAnswer]
           (AnswerId
		   ,[PlaybookID]
           ,[EntityKey]
           ,[QuestionID]
           ,[PlaybookSurveyID]
           ,[QuestionScore]
           ,[ScoreSubmitDate]
           ,[ScoreUserId]
           ,[UpdateDate]
           ,[ScoreCodeID]
           ,[AnswerComment])

SELECT
	  scq.id
	  ,p.id as PlaybookID
	  ,sc.DealershipId
	  ,q.id as QuestionID
	  ,sc.id as SurveyID
	  ,NULL as QuestionScore
	  ,NULL as ScoreSubmitDate
	  ,NULL as ScoreUserID
	  ,NULL as UpdateDate
	  ,1 as ScoreCodeID
	  ,NULL as AnswerComment

  FROM [Scorecard].[dbo].[Playbook] p
  JOIN Scorecard.dbo.question q
  ON p.id = q.PlaybookId
  JOIN Scorecard.dbo.Scorecard sc
  ON sc.PlaybookId = p.id
  JOIN Scorecard.dbo.ScorecardQuestion scq
  ON scq.ScorecardId = sc.Id
  AND scq.QuestionId = q.id
  WHERE p.id = @PlaybookID
  AND sc.DealershipId = @EntityKey
  AND sc.[Quarter] = @Quarter


 Set Identity_Insert Sonic_DW.dbo.PlaybookAnswer OFF




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
