---
name: usp_DOC_Insert_Projection
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
  - usp_DOC_Insert_ProjectionPS
  - vw_Dim_date
dependency_count: 9
parameter_count: 3
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
- **dbo.usp_DOC_Insert_ProjectionPS** (P )
- **dbo.vw_Dim_date** (V )

## Parameters

| Name         | Type    | Output | Default |
| ------------ | ------- | ------ | ------- |
| `@EntityID`  | int     | No     | No      |
| `@UserLogin` | varchar | No     | No      |
| `@LoadDate`  | int     | No     | No      |

## Definition

```sql


CREATE PROCEDURE [dbo].[usp_DOC_Insert_Projection]
@EntityID INT,
@UserLogin varchar(50),
@LoadDate INT -- Amrendra : Added LoadDate for SSIS Package to handle older dated loaddate
As


DECLARE @DocDateOld INT = (SELECT MAX(DocDateKey) FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID and DocDateKey <= @LoadDate)--Amrendra : Added to check whether any entries against older date
DECLARE @DocIDOld INT = (SELECT MAX(DocID) FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID AND DocDateKey = @DocDateOld)
DECLARE @DocIDNew INT
DECLARE @RolloverDate INT = (SELECT DocRolloverDate FROM [dbo].[Dim_Date] WHERE DateKey = @LoadDate)--(SELECT CONVERT(char(8),getdate(),112))) --Amrendra: Commented as we request for any middle date as well
DECLARE @BudgetDate INT = (SELECT MonthStartDateKey FROM [dbo].[vw_Dim_date] WHERE DateKey = @RolloverDate)

SET NOCOUNT ON

BEGIN TRY

	IF ((SELECT EntLineOfBusiness FROM Sonic_DW.dbo.Dim_Entity WHERE EntityKey = @EntityID) = 'Powersports' AND @EntityID NOT IN (519, 564, 569))
	BEGIN
		EXECUTE [dbo].[usp_DOC_Insert_ProjectionPS] @EntityID, @UserLogin ,@LoadDate

	END
	ELSE
		--Do not create a new entry if there is already an entry today / Or older date
		IF @DocDateOld <> @LoadDate -- (SELECT CONVERT(char(8),getdate(),112))  --Amrendra : Commented because we needed older date and if no entry then..@DocDateOld will be NULL
		OR @DocDateOld IS NULL
		BEGIN

			INSERT INTO dbo.Doc_Record

			SELECT 	@EntityID
					,GetDate() --Amrendra : Kept as it is
					,@UserLogin
					,'1900-01-01 00:00:00.000'
					,'Not Reviewed'
					,1
					,@LoadDate -- (SELECT CONVERT(char(8),getdate(),112)) --Amrendra : Commented
					,'1900-01-01 00:00:00.000'

			SET @DocIDNew = (SELECT Max(DocID) FROM dbo.Doc_Record WHERE EntityKey = @EntityID)

				--INSERT for first entry of new month or ever
				IF @DocIDOld IS NULL OR (@DocDateOld < @RolloverDate)
				BEGIN

					--NULL entries for transaction metrics
					INSERT INTO dbo.Doc_Projection

					SELECT 	@EntityID
							,@LoadDate--(SELECT CONVERT(char(8),getdate(),112)) --Amrendra : Commented
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
							,@LoadDate --(SELECT CONVERT(char(8),getdate(),112)) --Amrendra : Commented
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
					WHERE dm.GroupElementSort in (10, 11, 31, 34)
						and (de.EntDOCReportFlag = 'Active' AND de.EntDefaultDlrshpLvl0 = 1 AND de.EntDealerLvl2 = (SELECT EntDealerLvl2 FROM Dim_Entity WHERE EntityKey = @EntityID))

					--PVR Calculations from budget
					INSERT INTO dbo.Doc_Projection

					SELECT 	@EntityID
							,@LoadDate --(SELECT CONVERT(char(8),getdate(),112))--Amrendra : Commented
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

					--Update Pack & Doc fees with last month numbers if they exist --Added 10/3/2017

					IF @DocIDOld IS NOT NULL
					BEGIN
						UPDATE [dbo].[Doc_Projection]
						SET [Amount] = (SELECT Amount FROM Doc_Projection WHERE DocID = @DocIDOld AND GroupElementSort = 33)
						WHERE DocID = @DocIDNew AND GroupElementSort = 33

						UPDATE [dbo].[Doc_Projection]
						SET [Amount] = (SELECT Amount FROM Doc_Projection WHERE DocID = @DocIDOld AND GroupElementSort = 53)
						WHERE DocID = @DocIDNew AND GroupElementSort = 53
					END

				END


				--Every other scenario should be copying the previous projection
				ELSE
				BEGIN

					-- Copy over Projection
					INSERT INTO dbo.Doc_Projection

					SELECT 	@EntityID
							,@LoadDate --(SELECT CONVERT(char(8),getdate(),112)) --Amrendra : Commented
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


					-- Add new NULL records if missing
					INSERT INTO dbo.Doc_Projection

					SELECT 	@EntityID
							,@LoadDate--(SELECT CONVERT(char(8),getdate(),112)) --Amrendra : Commented
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
					WHERE dm.TXNMetric = 1 and GroupElementSort NOT IN (SELECT GroupElementSort FROm Doc_Projection WHERE DocID = @DocIDNew)

					-- Copy over SubProjection
					INSERT INTO dbo.Doc_SubProjection

					SELECT 	EntityKey
							,@LoadDate -- (SELECT CONVERT(char(8),getdate(),112))--Amrendra : Commented
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
