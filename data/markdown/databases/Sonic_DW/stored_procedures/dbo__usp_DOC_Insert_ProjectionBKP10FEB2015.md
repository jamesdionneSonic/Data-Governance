---
name: usp_DOC_Insert_ProjectionBKP10FEB2015
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Date
  - Dim_DOCMetrics
  - Dim_Entity
  - Doc_Budget
  - Doc_Projection
  - Doc_Record
  - Doc_SubProjection
  - vw_Dim_date
dependency_count: 8
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_DOCMetrics** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Doc_Budget** (U )
- **dbo.Doc_Projection** (U )
- **dbo.Doc_Record** (U )
- **dbo.Doc_SubProjection** (U )
- **dbo.vw_Dim_date** (V )

## Parameters

| Name         | Type    | Output | Default |
| ------------ | ------- | ------ | ------- |
| `@EntityID`  | int     | No     | No      |
| `@UserLogin` | varchar | No     | No      |

## Definition

```sql




CREATE PROCEDURE [dbo].[usp_DOC_Insert_Projection]
@EntityID INT,
@UserLogin varchar(50)


As

DECLARE @DocIDOld INT = (SELECT MAX(DocID) FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID)
DECLARE @DocIDNew INT
DECLARE @RolloverDate INT = (SELECT DocRolloverDate FROM [dbo].[Dim_Date] WHERE DateKey = (SELECT CONVERT(char(8),getdate(),112)))
DECLARE @BudgetDate INT = (SELECT MonthStartDateKey FROM [dbo].[vw_Dim_date] WHERE DateKey = @RolloverDate)
DECLARE @DocDateOld INT = (SELECT MAX(DocDateKey) FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID)

SET NOCOUNT ON

BEGIN TRY

	--Do not create a new entry if there is already an entry today
	IF @DocDateOld <> (SELECT CONVERT(char(8),getdate(),112)) OR @DocDateOld IS NULL
	BEGIN

		INSERT INTO dbo.Doc_Record

		SELECT 	@EntityID
				,GetDate()
				,@UserLogin
				,'1900-01-01 00:00:00.000'
				,'Not Reviewed'
				,1
				,(SELECT CONVERT(char(8),getdate(),112))
				,'1900-01-01 00:00:00.000'

		SET @DocIDNew = (SELECT Max(DocID) FROM dbo.Doc_Record WHERE EntityKey = @EntityID)

			--INSERT for first entry of new month or ever
			IF @DocIDOld IS NULL OR (@DocDateOld < @RolloverDate)
			BEGIN

				--NULL entries for transaction metrics
				INSERT INTO dbo.Doc_Projection

				SELECT 	@EntityID
						,(SELECT CONVERT(char(8),getdate(),112))
						,dm.GroupElementSort
						,dm.GroupElement
						,dm.GroupSubElement
						,NULL
						,NULL
						,4
						,@UserLogin
						,'1900-01-01 00:00:00.000'
						,@DocIDNew
				FROM  dbo.Dim_DOCMetrics dm
				WHERE dm.TXNMetric = 1

				--NULL entries for subtransaction metrics
				INSERT INTO dbo.Doc_SubProjection

				SELECT 	de.EntityKey
						,(SELECT CONVERT(char(8),getdate(),112))
						,dm.GroupElementSort
						,dm.GroupElement
						,dm.GroupSubElement
						,NULL
						,NULL
						,4
						,@UserLogin
						,'1900-01-01 00:00:00.000'
						,@DocIDNew
				FROM  dbo.Dim_DOCMetrics dm
					CROSS JOIN dbo.Dim_Entity de
				WHERE dm.GroupElementSort in (10, 11, 31)
					and (de.EntDOCReportFlag = 'Active' AND de.EntDefaultDlrshpLvl0 = 1 AND de.EntDealerLvl2 = (SELECT EntDealerLvl2 FROM Dim_Entity WHERE EntityKey = @EntityID))

				--PVR Calculations from budget
				INSERT INTO dbo.Doc_Projection

				SELECT 	@EntityID
						,(SELECT CONVERT(char(8),getdate(),112))
						,dm.GroupElementSort
						,dm.GroupElement
						,dm.GroupSubElement
						,COALESCE(db.Amount,0)
						,0
						,4
						,@UserLogin
						,'1900-01-01 00:00:00.000'
						,@DocIDNew
				FROM  dbo.Dim_DOCMetrics dm
						LEFT OUTER JOIN (SELECT * FROM dbo.Doc_Budget WHERE EntityKey = @EntityID AND DateKey = @BudgetDate) db ON dm.groupelementsort = db.groupelementsort
				WHERE dm.GroupElementSort IN (33, 53, 172, 173)


			END


			--Every other scenario should be copying the previous projection
			ELSE
			BEGIN

				INSERT INTO dbo.Doc_Projection

				SELECT 	@EntityID
						,(SELECT CONVERT(char(8),getdate(),112))
						,GroupElementSort
						,GroupElement
						,GroupSubElement
						,COALESCE(Amount,0)
						,COALESCE(StatCount,0)
						,4
						,@UserLogin
						,'1900-01-01 00:00:00.000'
						,@DocIDNew
				FROM  dbo.Doc_Projection
				WHERE DocID = @DocIDOld

				INSERT INTO dbo.Doc_SubProjection

				SELECT 	EntityKey
						,(SELECT CONVERT(char(8),getdate(),112))
						,GroupElementSort
						,GroupElement
						,GroupSubElement
						,COALESCE(Amount,0)
						,COALESCE(StatCount,0)
						,4
						,@UserLogin
						,'1900-01-01 00:00:00.000'
						,@DocIDNew
				FROM  dbo.Doc_SubProjection
				WHERE DocID = @DocIDOld


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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
