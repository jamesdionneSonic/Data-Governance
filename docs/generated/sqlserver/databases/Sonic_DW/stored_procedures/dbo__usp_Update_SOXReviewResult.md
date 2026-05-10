---
name: usp_Update_SOXReviewResult
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
		ReviewResult = @ReviewResult
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
