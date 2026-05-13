---
name: usp_DOC_Update_NVL
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




CREATE PROCEDURE [dbo].[usp_DOC_Update_NVL]
@EntityID INT,
@NewUnitsIncCM varchar(50),
@NewUnitsPreSoldCM varchar(50),
@NewUnitsIncNM varchar(50),
@NewSalesVolumeNM varchar(50),
@UserLogin varchar(50)



As

DECLARE @DDTempUnits table(MetricID INT, MetricNum varchar(50))
DECLARE @DocID INT = (SELECT DocID FROM [dbo].[Doc_Record] WITH (NOLOCK) WHERE EntityKey = @EntityID AND DocDateKey = (SELECT CONVERT(varchar(10),getdate(),112)))


--Insert Amounts into Temp Table
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (13, @NewUnitsIncCM)
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (14, @NewUnitsPreSoldCM)
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (15, @NewUnitsIncNM)
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (16, @NewSalesVolumeNM)


SET NOCOUNT ON

BEGIN TRY

 IF @DocID IS NOT NULL

    BEGIN

	;with tUnits as (
		SELECT MetricID, MetricNum FROM @DDTempUnits
	)
	UPDATE dbo.Doc_Projection

	SET StatCount = MetricNum,
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tUnits
		INNER JOIN dbo.Doc_Projection b WITH (NOLOCK)
			ON (b.GroupElementSort = tUnits.MetricID)
	WHERE
		DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> ''

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
