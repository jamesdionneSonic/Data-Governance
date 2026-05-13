---
name: usp_BoAFloorplanTrigger
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Parameters

| Name     | Type    | Output | Default |
| -------- | ------- | ------ | ------- |
| `@Input` | int     | No     | No      |
| `@User`  | varchar | No     | No      |

## Definition

```sql




CREATE PROCEDURE [dbo].[usp_BoAFloorplanTrigger]
@Input INT = 0,
@User varchar(100) = 'SYSTEM'

AS

SET NOCOUNT ON

BEGIN TRY

--Trigger MicroStrategy System Manager package for Bank of America Floorplan File
IF @Input = 1

	BEGIN
		EXEC msdb.dbo.sp_start_job N'BI_BoAFloorplan';
	END

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
