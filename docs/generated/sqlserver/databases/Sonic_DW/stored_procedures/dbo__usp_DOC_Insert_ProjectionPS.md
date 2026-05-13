---
name: usp_DOC_Insert_ProjectionPS
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


CREATE PROCEDURE [dbo].[usp_DOC_Insert_ProjectionPS]
@EntityID INT,
@UserLogin varchar(50),
@LoadDate INT
As

DECLARE @DocDateOld INT = (SELECT MAX(DocDateKey) FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID and DocDateKey <= @LoadDate)
DECLARE @DocIDOld INT = (SELECT MAX(DocID) FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID AND DocDateKey = @DocDateOld)
DECLARE @DocIDNew INT
DECLARE @RolloverDate INT = (SELECT DocRolloverDate FROM [dbo].[Dim_Date] WHERE DateKey = @LoadDate)
DECLARE @BudgetDate INT = (SELECT MonthStartDateKey FROM [dbo].[vw_Dim_date] WHERE DateKey = @RolloverDate)

SET NOCOUNT ON

BEGIN TRY

	--Do not create a new entry if there is already an entry today / Or older date
	IF @DocDateOld <> @LoadDate
	OR @DocDateOld IS NULL
	BEGIN

		INSERT INTO dbo.Doc_Record (EntityKey, DocStartDate, ControllerName, DocReviewDate, DocReviewBy, DocStatusID, DocDateKey, DocReviewSubmitDate)

		SELECT 	@EntityID
				,GetDate()
				,@UserLogin
				,'1900-01-01 00:00:00.000'
				,'Not Reviewed'
				,1
				,@LoadDate
				,'1900-01-01 00:00:00.000'

		SET @DocIDNew = (SELECT Max(DocID) FROM dbo.Doc_Record WHERE EntityKey = @EntityID)

			--INSERT for first entry of new month or ever
			IF @DocIDOld IS NULL OR (@DocDateOld < @RolloverDate)
			BEGIN

				--NULL entries for transaction metrics
				INSERT INTO dbo.Doc_ProjectionPS ([EntityKey]
					,[DocDateKey]
					,[DateKey]
					,[GroupElementSort]
					,[Amount]
					,[StatCount]
					,[MetricTypeKey]
					,[ControllerUserID]
					,[UpdateDate]
					,[DocID])

				SELECT 	@EntityID
						,@RolloverDate
						,@LoadDate
						,dm.GroupElementSort
						,NULL
						,NULL
						,4
						,@UserLogin
						,'1900-01-01 00:00:00.000'
						,@DocIDNew
				FROM  dbo.Doc_MetricsPS dm
				WHERE dm.TXNMetric = 1

			END


			--Every other scenario should be copying the previous projection
			ELSE
			BEGIN

				-- Copy over Projection
				--INSERT INTO dbo.Doc_ProjectionPS ([EntityKey]
				--	,[DocDateKey]
				--	,[DateKey]
				--	,[GroupElementSort]
				--	,[Amount]
				--	,[StatCount]
				--	,[MetricTypeKey]
				--	,[ControllerUserID]
				--	,[UpdateDate]
				--	,[DocID])

				--SELECT 	@EntityID
				--		,@RolloverDate
				--		,@LoadDate
				--		,GroupElementSort
				--		,COALESCE(Amount,0)
				--		,COALESCE(StatCount,0)
				--		,4
				--		,@UserLogin
				--		,'1900-01-01 00:00:00.000'
				--		,@DocIDNew
				--FROM  dbo.Doc_ProjectionPS
				--WHERE DocID = @DocIDOld

				UPDATE dbo.Doc_ProjectionPS
				SET [DateKey] = @LoadDate
					,[ControllerUserID] = @UserLogin
					,[UpdateDate] = '1900-01-01 00:00:00.000'
					,[DocID] = @DocIDNew
				FROM  dbo.Doc_ProjectionPS
				WHERE DocID = @DocIDOld


				-- Add new NULL records if missing
				INSERT INTO dbo.Doc_ProjectionPS ([EntityKey]
					,[DocDateKey]
					,[DateKey]
					,[GroupElementSort]
					,[Amount]
					,[StatCount]
					,[MetricTypeKey]
					,[ControllerUserID]
					,[UpdateDate]
					,[DocID])

				SELECT 	@EntityID
						,@RolloverDate
						,@LoadDate
						,dm.GroupElementSort
						,NULL
						,NULL
						,4
						,@UserLogin
						,'1900-01-01 00:00:00.000'
						,@DocIDNew
				FROM  dbo.Doc_MetricsPS dm
				WHERE dm.TXNMetric = 1 and GroupElementSort NOT IN (SELECT GroupElementSort FROM Doc_ProjectionPS WHERE DocID = @DocIDNew)

			END
		END


END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


SET NOCOUNT OFF

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
