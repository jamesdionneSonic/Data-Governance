---
name: usp_Update_SOXReview
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-09T12:34:14.349Z
