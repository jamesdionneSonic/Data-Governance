---
name: usp_Load_MSEntity
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - MSAnswer
  - MSEntity
  - MSQuestion
  - MSSurvey
dependency_count: 4
parameter_count: 4
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.MSAnswer** (U )
- **dbo.MSEntity** (U )
- **dbo.MSQuestion** (U )
- **dbo.MSSurvey** (U )

## Parameters

| Name        | Type    | Output | Default |
| ----------- | ------- | ------ | ------- |
| `@MSState`  | varchar | No     | No      |
| `@MSCity`   | varchar | No     | No      |
| `@MSStore`  | varchar | No     | No      |
| `@MSUserID` | varchar | No     | No      |

## Definition

```sql


CREATE PROCEDURE [dbo].[usp_Load_MSEntity]

@MSState varchar(50),
@MSCity varchar(50),
@MSStore varchar(50),
@MSUserID varchar(50)

--@MSComments varchar(1000)

AS

DECLARE @MSEntityID int
SET NOCOUNT ON
BEGIN TRY




--@MSEntityID, @MSCreatedUserID, @MSComments

Insert into dbo.MSEntity
   Select
      -- Procedure INPUT keyed user id
 @MSState as MSState
,@MSCity as MSCity
,@MSStore as MSStore
,@MSUserID as MSEntityCreatedBy
,GETDATE() as MSEntityCreatedOn

   WHERE (1=1
      );

  SELECT @MSEntityID = (SELECT MSEntityID from MSEntity where
	MSState = @MSState
	AND MSCity = @MSCity
	AND MSStore = @MSStore)


  INSERT INTO dbo.MSSurvey
   SELECT
      @MSUserID AS MSSurveyCreatedBy -- Procedure INPUT keyed user id
      ,GETDATE() AS MSSurveyCreateDate
      ,NULL  AS MSSurveyComments
      ,e.MSEntityID AS MSEntityID
   FROM Sonic_DW.dbo.MSEntity e
   WHERE (1=1
       AND e.MSEntityID = @MSEntityID

      );


INSERT INTO dbo.MSAnswer

SELECT 0 AS QuestionScore
	,NULL AS MSScoreSubmitDate
	,NULL AS MSScoreUserID
	,NULL AS MSUpdateDate
	,NULL AS MSAnswerComment
	,q.[MSQuestionID]
	,s.MSSurveyID
	,e.MSEntityID
	,1 as MSValidValuesID
FROM [dbo].[MSQuestion] q
  CROSS JOIN MSEntity e
  LEFT JOIN MSSurvey s
  on s.msentityID = e.msentityID
  WHERE (1=1
       AND e.MSEntityID = @MSEntityID

      );


END TRY


BEGIN CATCH
 SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH




SET NOCOUNT OFF



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
