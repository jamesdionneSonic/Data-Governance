---
name: usp_DOC_Update_Record
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






CREATE PROCEDURE [dbo].[usp_DOC_Update_Record]
@DocID INT,
@DocStatusID INT,
@UserLogin varchar(50)


As


SET NOCOUNT ON

BEGIN TRY

	--Status code of 2 is only to allow MicroStrategy to know which iPhones need to be alerted, hence why the status is updated to 3 after 
IF @DocID IS NOT NULL BEGIN
	IF @DocStatusID = 2
	BEGIN
				
		UPDATE [Sonic_DW].[dbo].[Doc_Record] 
		SET [DocStatusID] = @DocStatusID
			,[DocReviewSubmitDate] = GetDate()
		WHERE DocID = @DocID
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
