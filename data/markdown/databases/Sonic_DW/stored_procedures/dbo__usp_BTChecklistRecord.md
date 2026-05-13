---
name: usp_BTChecklistRecord
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - BT_ChecklistRecord
dependency_count: 1
parameter_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.BT_ChecklistRecord** (U )

## Parameters

| Name               | Type    | Output | Default |
| ------------------ | ------- | ------ | ------- |
| `@EntityKey`       | int     | No     | No      |
| `@Reviewer`        | varchar | No     | No      |
| `@StartFinishFlag` | int     | No     | No      |

## Definition

```sql



-- =============================================
-- Author:		Jonathan Henin
-- Create date: 12/13/2018
-- Description:	Insert/Update Record for BTChecklistRecord
-- =============================================
CREATE PROCEDURE [dbo].[usp_BTChecklistRecord]
	@EntityKey INT,
	@Reviewer VARCHAR(50),
	@StartFinishFlag INT -- 0 = Insert a New Record, 1 = Update Existing Record

AS

SET NOCOUNT ON

BEGIN TRY

--Check to see if a Record exists for selected store and date
DECLARE @ChecklistKey INT = (SELECT ChecklistKey FROM dbo.BT_ChecklistRecord WHERE EntityKey = @EntityKey AND FORMAT(CONVERT(date, DateStarted), 'MM-yyyy') = FORMAT(CONVERT(date, GETDATE()), 'MM-yyyy'))

IF @StartFinishFlag = 0
	BEGIN
		-- Prevent duplicates
		IF @ChecklistKey IS NULL
			BEGIN
				INSERT INTO [dbo].[BT_ChecklistRecord]
					([EntityKey]
					,[Reviewer]
					,[DateStarted])
				VALUES
					(@EntityKey
					,@Reviewer
					,GetDate())
			END
	END

ELSE IF @StartFinishFlag = 1
	BEGIN
		DECLARE @DateCheck Datetime
		SELECT @DateCheck = (SELECT DateFinished FROM dbo.BT_ChecklistRecord WHERE ChecklistKey = @ChecklistKey)

		-- Check to make sure record exists
		IF @ChecklistKey IS NOT NULL AND @DateCheck IS NULL
			BEGIN
				UPDATE [dbo].[BT_ChecklistRecord]
				SET [DateFinished] = GetDate()
				WHERE [ChecklistKey] = @ChecklistKey AND [DateFinished] IS NULL
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
