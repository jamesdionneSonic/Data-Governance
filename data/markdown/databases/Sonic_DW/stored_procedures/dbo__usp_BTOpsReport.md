---
name: usp_BTOpsReport
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 1
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Parameters

| Name    | Type | Output | Default |
| ------- | ---- | ------ | ------- |
| `@BTID` | int  | No     | No      |

## Definition

```sql



CREATE PROCEDURE [dbo].[usp_BTOpsReport]
@BTID INT

AS

SET NOCOUNT ON

BEGIN TRY

--Trigger Operations Report
IF @BTID = 1 BEGIN

	--EXECUTE xp_cmdshell 'C:\psexec \\d1-ustrat-02a CMDMGR -n ProdLDAP -u svcEventUser -p k1ck0ff123! -f "\\d1-ustrat-02a\Command Manager\BTOps.scp" -showoutput 2> errorlog.txt'
	--EXECUTE xp_cmdshell '"C:\Program Files (x86)\MicroStrategy\Command Manager\CMDMGR" -n ProdLDAP -u svcEventUser -p k1ck0ff123! -f "C:\Program Files (x86)\MicroStrategy\Command Manager\CmdTest.scp" -showoutput'
	--EXECUTE xp_cmdshell 'C:\MSBatch\BTOps'
	EXEC msdb.dbo.sp_start_job N'DBA MorningReport BTOps' ;
END

--Trigger Database Report
ELSE IF @BTID = 2 BEGIN

	--EXECUTE xp_cmdshell 'C:\psexec \\d1-ustrat-02a CMDMGR -n ProdLDAP -u svcEventUser -p k1ck0ff123! -f "\\d1-ustrat-02a\Command Manager\BTDB.scp" -showoutput 2> errorlog.txt'
	--EXECUTE xp_cmdshell 'C:\MSBatch\BTDB'
	EXEC msdb.dbo.sp_start_job N'DBA MorningReport BTDB' ;
END

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
