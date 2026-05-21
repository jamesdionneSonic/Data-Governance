---
name: usp_Load_SoxReview
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




CREATE Procedure [dbo].[usp_Load_SoxReview]
	@EntityKey int,
	@ReviewerUserID varchar(50),
	@ControllerName varchar(50)

	As

SET NOCOUNT ON
BEGIN TRY

DECLARE @IsEchoParkStore INT = CASE (SELECT EntLineOfBusiness FROM dbo.Dim_Entity WHERE EntityKey = @EntityKey) WHEN 'EchoPark' THEN 1 ELSE 0 END

INSERT INTO [Sonic_DW].[dbo].[SoxReview]

     SELECT

           @EntityKey
           ,GETDATE()
           ,@ControllerName
           ,''
           ,@ReviewerUserID
           ,1
           ,datepart(mm,dateadd(m,-1,GETDATE()))
    --Section Commented out.  Proc updated to take the controller name as a variable from the app.  DRM 9/12/2013
    --FROM Dim_Entity e
    --       join Dim_Associate a
    --       ON e.entadpcompanyid = ASOLocation
    --WHERE AsoJobCode = 'ADCONT'-- '%CONT%'
		  -- and AsoEmployeeStatus <> 'T'
		  -- and Meta_RowIsCurrent = 'Y'
		  -- and E.EntDefaultDlrshpLvl1 = 1
		  -- and e.EntityKey = EntityKey
		  -- and e.EntityKey = @EntityKey




IF @IsEchoParkStore = 1

	--EchoPark Insert Questions
	INSERT INTO Sonic_dw.dbo.SoxReviewResult
	 ([ReviewID]
			   ,[ReviewItemID]
			   ,[EntityKey]
			   ,[ReviewDate]
			   ,[ReviewedBy]
			   ,[ReviewResult]
			   ,[ReviewComment]
			   ,[ControllerReviewed]
			   ,[ControllerReviewDate]
			   ,[TrainingComment]
			   ,[RowCreateDate])

	  Select r.ReviewID
	  ,i.reviewItemID
	  ,@EntityKey
	  ,'' --ReviewDate
	  ,Null --ReviewedBy
	  ,Null  --i.[ReviewItemDefaultResult] --ReviewResult Removed default answers.
	  ,''--ReviewComment
	  ,Null --ControllerReviewed
	  ,''--ControllerReviewDate
	  ,Null
	  ,GETDATE()

	  from sonic_dw.dbo.SoxReview r
	  Cross join sonic_dw.dbo.SoxReviewItem i
	  where r.entitykey = @EntityKey
	  and r.ReviewStatusID = 1
	  and i.Meta_IsEchoPark = 1

ELSE

	--Sonic Automotive Insert Questions
	INSERT INTO Sonic_dw.dbo.SoxReviewResult
	 ([ReviewID]
			   ,[ReviewItemID]
			   ,[EntityKey]
			   ,[ReviewDate]
			   ,[ReviewedBy]
			   ,[ReviewResult]
			   ,[ReviewComment]
			   ,[ControllerReviewed]
			   ,[ControllerReviewDate]
			   ,[TrainingComment]
			   ,[RowCreateDate])

	  Select r.ReviewID
	  ,i.reviewItemID
	  ,@EntityKey
	  ,'' --ReviewDate
	  ,Null --ReviewedBy
	  ,Null  --,i.[ReviewItemDefaultResult] --ReviewResult Removed default answers.
	  ,''--ReviewComment
	  ,Null --ControllerReviewed
	  ,''--ControllerReviewDate
	  ,Null
	  ,GETDATE()

	  from sonic_dw.dbo.SoxReview r
	  Cross join sonic_dw.dbo.SoxReviewItem i
	  where r.entitykey = @EntityKey
	  and r.ReviewStatusID = 1
	  and i.Meta_IsActive = 1




 END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

SET NOCOUNT OFF










```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
