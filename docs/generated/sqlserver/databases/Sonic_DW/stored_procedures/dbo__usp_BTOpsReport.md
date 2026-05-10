---
name: usp_BTOpsReport
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



CREATE PROCEDURE [dbo].[usp_BTOpsReport]
@BTID INT

AS

SET NOCOUNT ON

BEGIN TRY

--Trigger Operations Report
IF @BTID = 1 BEGIN

	--EXECUTE xp_cmdshell 'C:\psexec \\d1-ustrat-02a CMDMGR -n ProdLDAP -u svcEventUser -p k1ck0ff123! -f "\\d1-ustrat-02a\Command Manager\BTOps.scp" -showoutput 2> errorlog.txt'
	--EXECUTE xp_cmdshell '"C:\Program Files (x86)\MicroStrategy\Command Manager\CMDMGR" -n ProdLDAP -u svcEventUser -p k1ck0ff123! -f "C:\Program Files (x86)\MicroStrategy\Comm
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
