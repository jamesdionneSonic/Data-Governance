---
name: usp_BTRequestRecord
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
-- Author:		Jonathan Henin
-- Create date: 8/31/2016
-- Description:	Insert Record for DBTRequestsRecord
-- =============================================
CREATE PROCEDURE [dbo].[usp_BTRequestRecord]
	@EntityKey INT,
	@MicroStrategyLogin NVARCHAR(250),
	@GMName NVARCHAR(250)

AS

SET NOCOUNT ON

BEGIN TRY

DECLARE @BTKey INT = (SELECT BTKey FROM dbo.BT_RequestsRecord WHERE EntityKey = @EntityKey AND DateKey = (CONVERT([varchar](10),getdate(),(112))))

IF @BTKey IS NULL

INSERT INTO [dbo].[BT_RequestsRecord]
           ([EntityKey]
           ,[Login]
		   ,[GMName])
     VALUES
           (@EntityKey
           ,@MicroStrategyLogin
		   ,@GMName)

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

SET NOCOUNT OFF



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
