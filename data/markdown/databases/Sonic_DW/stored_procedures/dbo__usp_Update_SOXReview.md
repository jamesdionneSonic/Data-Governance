---
name: usp_Update_SOXReview
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - SoxReview
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

- **dbo.SoxReview** (U )

## Parameters

| Name                 | Type    | Output | Default |
| -------------------- | ------- | ------ | ------- |
| `@ReviewID`          | int     | No     | No      |
| `@ReviewCompletedBy` | varchar | No     | No      |
| `@ReviewStatusID`    | int     | No     | No      |

## Definition

```sql






CREATE PROCEDURE [dbo].[usp_Update_SOXReview]
@ReviewID INT,
@ReviewCompletedBy VARCHAR(50),
@ReviewStatusID int



As


SET NOCOUNT ON

BEGIN TRY


	UPDATE SoxReview

	SET ReviewCompletedBy = @ReviewCompletedBy,
		ReviewCompleteDate = Getdate(),
		ReviewStatusID = @ReviewStatusID
	WHERE
		ReviewID = @ReviewID

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


SET NOCOUNT OFF









```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
