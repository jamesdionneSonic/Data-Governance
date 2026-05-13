---
name: usp_MS_Insert_Photo
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - MSPhoto
dependency_count: 1
parameter_count: 5
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.MSPhoto** (U )

## Parameters

| Name                   | Type     | Output | Default |
| ---------------------- | -------- | ------ | ------- |
| `@MSPhotoLocation`     | varchar  | No     | No      |
| `@MSPhotoDescription`  | varchar  | No     | No      |
| `@MSPhotoCreationDate` | datetime | No     | No      |
| `@MSUserID`            | varchar  | No     | No      |
| `@MSAnswerID`          | int      | No     | No      |

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
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

SET NOCOUNT OFF



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
