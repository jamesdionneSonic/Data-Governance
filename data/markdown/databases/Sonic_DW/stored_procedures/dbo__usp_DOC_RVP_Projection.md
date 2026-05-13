---
name: usp_DOC_RVP_Projection
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_DOCMetrics
  - Doc_RVPProjection
  - Doc_RVPRecord
dependency_count: 3
parameter_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_DOCMetrics** (U )
- **dbo.Doc_RVPProjection** (U )
- **dbo.Doc_RVPRecord** (U )

## Parameters

| Name         | Type    | Output | Default |
| ------------ | ------- | ------ | ------- |
| `@RVPKey`    | int     | No     | No      |
| `@UserLogin` | varchar | No     | No      |
| `@LoadDate`  | int     | No     | No      |

## Definition

```sql



CREATE PROCEDURE [dbo].[usp_DOC_RVP_Projection]
@RVPKey INT,
@UserLogin varchar(50),
@LoadDate INT
AS

DECLARE @DocDateOld INT = (SELECT MAX(DocDateKey) FROM [dbo].[Doc_RVPRecord] WHERE RVPKey = @RVPKey and DocDateKey <= @LoadDate)
DECLARE @RVPDocIDNew INT

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
SET NOCOUNT ON;

BEGIN TRY

	-- Do not create a new entry if there is already an entry today / Or older date
	IF @DocDateOld <> @LoadDate -- (SELECT CONVERT(char(8),getdate(),112))
	OR @DocDateOld IS NULL
	BEGIN

    -- Insert Record into RVP Record
	INSERT INTO dbo.Doc_RVPRecord

	SELECT @RVPKey
			,GETDATE()
			,@UserLogin
			,1
			,@LoadDate
			,'1900-01-01 00:00:00.000'

	SET @RVPDocIDNew = (SELECT Max(RVPDocID) FROM dbo.Doc_RVPRecord WHERE RVPKey = @RVPKey)


	-- Insert Dummy values into RVP Projection
	INSERT INTO [dbo].[Doc_RVPProjection]

	SELECT 	@RVPKey
			,@LoadDate--(SELECT CONVERT(char(8),getdate(),112)) --Amrendra : Commented
			,dm.GroupElementSort
			,dm.GroupElement
			,dm.GroupSubElement
			,NULL
			,NULL
			,4
			,@UserLogin
			,'1900-01-01 00:00:00.000'
			,@RVPDocIDNew
	FROM  dbo.Dim_DOCMetrics dm
	WHERE dm.TXNMetric = 1 and dm.RVPMetric = 1

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
