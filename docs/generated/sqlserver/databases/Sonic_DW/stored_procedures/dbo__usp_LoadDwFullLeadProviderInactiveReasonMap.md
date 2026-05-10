---
name: usp_LoadDwFullLeadProviderInactiveReasonMap
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

Create Procedure dbo.usp_LoadDwFullLeadProviderInactiveReasonMap (@ETLExecutionID int)
as 
--exec usp_LoadDwFullCompanySource 999

DECLARE @rowsdeleted int , @rowsInserted int , @rowsUpdated int;
DECLARE @ExecutionDate datetime, @rowid int;

--Insert new rows

INSERT INTO [dbo].[dwFullLeadProviderInactiveReasonMap]
           ([lLeadProviderInactiveReasonMapID]
           ,[lCompanyID]
           ,[lSourceID]
           ,[lDealSubstatusID]
           ,[szDealSubStatus]
         
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
