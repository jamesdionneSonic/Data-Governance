---
name: usp_BTChecklist
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - BT_ChecklistDimQuestions
  - BT_ChecklistFact
  - BT_ChecklistRecord
  - Dim_Entity
  - usp_BTChecklistRecord
dependency_count: 5
parameter_count: 5
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.BT_ChecklistDimQuestions** (U )
- **dbo.BT_ChecklistFact** (U )
- **dbo.BT_ChecklistRecord** (U )
- **dbo.Dim_Entity** (U )
- **dbo.usp_BTChecklistRecord** (P )

## Parameters

| Name                | Type    | Output | Default |
| ------------------- | ------- | ------ | ------- |
| `@EntityKey`        | int     | No     | No      |
| `@ChecklistFactKey` | int     | No     | No      |
| `@ChecklistAnswer`  | varchar | No     | No      |
| `@ChecklistComment` | varchar | No     | No      |
| `@ModifierName`     | varchar | No     | No      |

## Definition

```sql




-- =============================================
-- Author:		Jonathan Henin
-- Create date: 8/31/2016
-- Description:	Insert Record for BTRequests
-- =============================================
CREATE PROCEDURE [dbo].[usp_BTChecklist]
	--@ChecklistKey INT,
	@EntityKey INT,
	@ChecklistFactKey INT,
	@ChecklistAnswer varchar(50),
	@ChecklistComment varchar(250),
	@ModifierName varchar(100)



AS

SET NOCOUNT ON

BEGIN TRY

DECLARE @ChecklistKey INT
DECLARE @DateCheck Datetime

SELECT @ChecklistKey = (SELECT ChecklistKey FROM dbo.BT_ChecklistRecord WHERE EntityKey = @EntityKey AND FORMAT(CONVERT(date, DateStarted), 'MM-yyyy') = FORMAT(CONVERT(date, GETDATE()), 'MM-yyyy'))
SELECT @DateCheck = (SELECT DateFinished FROM dbo.BT_ChecklistRecord WHERE ChecklistKey = @ChecklistKey)
SELECT @ModifierName = (SELECT UPPER(@ModifierName))


IF @ChecklistFactKey IS NULL
	BEGIN

		-- Start a new Checklist
		IF @ChecklistKey IS NULL
			BEGIN
				EXECUTE [dbo].[usp_BTChecklistRecord] @EntityKey, @ModifierName, 0

				--Grab new Checklist Key
				SELECT @ChecklistKey = (SELECT ChecklistKey FROM dbo.BT_ChecklistRecord WHERE EntityKey = @EntityKey AND FORMAT(CONVERT(date, DateStarted), 'MM-yyyy') = FORMAT(CONVERT(date, GETDATE()), 'MM-yyyy'))


				--Insert Dummy Fact Values
				INSERT INTO [dbo].[BT_ChecklistFact]
					([ChecklistKey]
					,[ChecklistQuestionID]
					,[ChecklistAnswer]
					,[ChecklistComment]
					,[DateLastModified]
					,[ModifierName])

				SELECT DISTINCT @ChecklistKey
					,q.ChecklistQuestionID
					,-1 --Answer
					,'' --Comment
					,GETDATE() --DateLastModified
					,@ModifierName

				FROM [dbo].[Dim_Entity] r
				CROSS JOIN [dbo].[BT_ChecklistDimQuestions] q
				WHERE r.entitykey = @EntityKey
					AND q.IsActive = 1

			END

		-- Close a Checklist
		ELSE

			BEGIN

				EXECUTE [dbo].[usp_BTChecklistRecord] @EntityKey, @ModifierName, 1

			END

	END

ELSE

BEGIN

	IF @DateCheck IS NULL
		BEGIN
			UPDATE [dbo].[BT_ChecklistFact]
			   SET [ChecklistAnswer] = @ChecklistAnswer
					,[ChecklistComment] = @ChecklistComment
					,[DateLastModified] = GETDATE()
					,[ModifierName] = @ModifierName
			 WHERE [ChecklistFactKey] = @ChecklistFactKey
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
