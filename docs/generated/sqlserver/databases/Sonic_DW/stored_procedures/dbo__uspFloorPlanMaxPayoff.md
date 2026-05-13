---
name: uspFloorPlanMaxPayoff
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
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspFloorPlanMaxPayoff]
	@MaxPayoffStockType varchar(10),
	@MaxPayoffAmount numeric(18,0),
	@Meta_UserID varchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	CREATE TABLE #MaxTemp (
		MaxPayoffStockType varchar(10),
		MaxPayoffAmount numeric(18,0),
		Meta_UserID varchar(50),
	);

	BEGIN
		INSERT INTO #MaxTemp
		(MaxPayoffStockType,
		MaxPayoffAmount,
		Meta_UserID)
		SELECT
		@MaxPayoffStockType,
		@MaxPayoffAmount,
		@Meta_UserID
	END


	MERGE [dbo].[Syndicate_MaxPayoff] AS T
	USING #MaxTemp AS S
	ON (T.MaxPayoffStockType = S.MaxPayoffStockType)
	WHEN MATCHED THEN
	UPDATE SET
           [MaxPayoffAmount] = S.MaxPayoffAmount
           ,[Meta_UserID] = S.Meta_UserID
    WHEN NOT MATCHED BY TARGET
	THEN INSERT
		(MaxPayoffStockType,
		MaxPayoffAmount,
		Meta_UserID)
	VALUES
		(S.MaxPayoffStockType,
		S.MaxPayoffAmount,
		S.Meta_UserID);

END

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
