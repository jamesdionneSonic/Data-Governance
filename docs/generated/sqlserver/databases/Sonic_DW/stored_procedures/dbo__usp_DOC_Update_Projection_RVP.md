---
name: usp_DOC_Update_Projection_RVP
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




CREATE PROCEDURE [dbo].[usp_DOC_Update_Projection_RVP]
@RVPID INT,
@NewUnits varchar(50),
@NewPVR varchar(50),
@UsedUnits varchar(50),
@UsedPVR varchar(50),
@FixedGross varchar(50),
@FIPVR varchar(50),
@TotalGross varchar(50),
@Profit varchar(50),
@UserLogin varchar(50)


As

DECLARE @DDTempUnits table(MetricID INT, MetricNum varchar(50))
DECLARE @DDTempAmount table(MetricID INT, MetricNum varchar(50))
DECLARE @RVPDocID INT = (SELECT RVPDocID FROM [dbo].[Doc_RVPRecord] WHERE RVPKey = @RVPID AND DocDateKey = (SELECT CONVERT(varchar(10),getdate(),112)))


--Insert Units
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (10, @NewUnits)
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (20, @UsedUnits)

--Insert Amounts
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (12, @NewPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (22, @UsedPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (101, @FixedGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (111, @FIPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (119, @TotalGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (500, @Profit)


SET NOCOUNT ON

BEGIN TRY

 IF @RVPDocID IS NOT NULL

	--Update unit metrics.
    BEGIN

	;with tUnits as (
		SELECT MetricID, MetricNum FROM @DDTempUnits
	)
	UPDATE dbo.Doc_RVPProjection

	SET StatCount = MetricNum,
		RVPUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tUnits
		INNER JOIN dbo.Doc_RVPProjection b
			ON (b.GroupElementSort = tUnits.MetricID)
	WHERE
		RVPDocID = @RVPDocID AND MetricNum IS NOT NULL AND MetricNum <> ''


	--Update amount metrics.

	;with tAmount as (
		SELECT MetricID, MetricNum FROM @DDTempAmount
	)
	UPDATE dbo.Doc_RVPProjection

	SET Amount = MetricNum,
		RVPUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tAmount
		INNER JOIN dbo.Doc_RVPProjection b
			ON (b.GroupElementSort = tAmount.MetricID)
	WHERE
		RVPDocID = @RVPDocID AND MetricNum IS NOT NULL AND MetricNum <> ''

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
