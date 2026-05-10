---
name: usp_BoAFloorplanTrigger_Step3
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





CREATE PROCEDURE [dbo].[usp_BoAFloorplanTrigger_Step3]
@Input INT = 0,
@User varchar(100) = 'SYSTEM'

AS

SET NOCOUNT ON

BEGIN TRY

--Trigger MicroStrategy System Manager package for Bank of America Floorplan File
IF @Input = 1

	BEGIN
		EXEC msdb.dbo.sp_start_job N'BI_BoAFloorplan_Step3';
	END

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
