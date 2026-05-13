---
name: usp_Update_SOXReviewResult
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





CREATE PROCEDURE [dbo].[usp_Update_SOXReviewResult]
@ReviewID INT,
@ReviewItemID INT,
@ReviewDate datetime,
@ReviewedBy VARCHAR(50),
@ReviewResult int,
@ReviewComment VARCHAR(1000),
@ControllerReviewed int,
@ControllerReviewDate datetime,
@TrainingComment varchar(1000)


As


SET NOCOUNT ON

BEGIN TRY
 IF @ControllerReviewed is null
    BEGIN

	UPDATE SoxReviewResult

	SET ReviewDate = GETDATE(),
		ReviewedBy = @ReviewedBy,
		ReviewResult = @ReviewResult,
		ReviewComment = @ReviewComment,
		ControllerReviewed = @ControllerReviewed,
		ControllerReviewDate = @ControllerReviewDate,
		TrainingComment = @TrainingComment
	WHERE
		ReviewID = @ReviewID
		and ReviewItemID = @ReviewItemID
	END

	ELSE BEGIN

	UPDATE SoxReviewResult

	SET ControllerReviewed = @ControllerReviewed,
		ControllerReviewDate = @ControllerReviewDate,
		TrainingComment = @TrainingComment
	WHERE
		ReviewID = @ReviewID
		and ReviewItemID = @ReviewItemID
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
