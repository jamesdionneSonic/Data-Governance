---
name: usp_MS_Insert_Photo
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


CREATE PROCEDURE [dbo].[usp_MS_Insert_Photo]


@MSPhotoLocation VARCHAR(1000),
@MSPhotoDescription VARCHAR(100),
@MSPhotoCreationDate Datetime,
@MSUserID VARCHAR(2000),
@MSAnswerID INT

AS

SET NOCOUNT ON

BEGIN TRY


    INSERT INTO dbo.MSPhoto (MSPhotoLocation,MSPhotoDescription,MSPhotoCreateDate,MSPhotoUserID,MSAnswerID)
    Values(@MSPhotoLocation,@MSPhotoDescription,@MSPhotoCreationDate,@MSUserID,@MSAnswerID)
    
    
END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER(
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
