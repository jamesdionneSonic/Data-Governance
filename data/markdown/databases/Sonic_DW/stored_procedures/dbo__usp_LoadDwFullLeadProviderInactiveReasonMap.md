---
name: usp_LoadDwFullLeadProviderInactiveReasonMap
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

| Name              | Type | Output | Default |
| ----------------- | ---- | ------ | ------- |
| `@ETLExecutionID` | int  | No     | No      |

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
           ,[szInactiveReason]
           ,[bActive]
           ,[dtEntry]
           ,[dtLastEdit]
		   ,[ETLExecution_ID])

SELECT [lLeadProviderInactiveReasonMapID]
      ,[lCompanyID]
      ,[lSourceID]
      ,[lDealSubstatusID]
      ,[szDealSubStatus]
      ,[szInactiveReason]
      ,[bActive]
      ,[dtEntry]
      ,[dtLastEdit]
	  ,@ETLExecutionID
FROM [dbo].[dwDiffLeadProviderInactiveReasonMap_I];

SELECT @rowsinserted = @@ROWCOUNT;


-- Delete Rows to be Updated
DELETE DwFullLeadProviderInactiveReasonMap where [lLeadProviderInactiveReasonMapID] in ( select [lLeadProviderInactiveReasonMapID] from [dwDiffLeadProviderInactiveReasonMap_U]);

-- InsertUpdatedRows
INSERT INTO [dbo].[dwFullLeadProviderInactiveReasonMap]
           ([lLeadProviderInactiveReasonMapID]
           ,[lCompanyID]
           ,[lSourceID]
           ,[lDealSubstatusID]
           ,[szDealSubStatus]
           ,[szInactiveReason]
           ,[bActive]
           ,[dtEntry]
           ,[dtLastEdit]
		   ,[ETLExecution_ID])

SELECT [lLeadProviderInactiveReasonMapID]
      ,[lCompanyID]
      ,[lSourceID]
      ,[lDealSubstatusID]
      ,[szDealSubStatus]
      ,[szInactiveReason]
      ,[bActive]
      ,[dtEntry]
      ,[dtLastEdit]
	  ,@ETLExecutionID
FROM [dbo].[dwDiffLeadProviderInactiveReasonMap_U];

SELECT @rowsupdated = @@ROWCOUNT;

  		--Deletes should follow one of these options:
		--Either hard delete rows
DELETE DwFullLeadProviderInactiveReasonMap WHERE [lLeadProviderInactiveReasonMapID] in ( SELECT [lLeadProviderInactiveReasonMapID] FROM [dwDiffLeadProviderInactiveReasonMap_D]);
		--or soft delete the rows using dwActive.   In order to do this we'd need to add a column for dwactive.
		 --UPDATE dwFullCompanySource
		 --SET dwActive = 0
		 --WHERE lCompanySourceID in ( SELECT lCompanySourceID FROM dwDiffCompanySource_D)

SELECT @rowsdeleted = @@ROWCOUNT;

  		-- generate a time stamp for this Activity load
INSERT INTO dbo.eLeads_Load_UDI_status (ExecutionDate, InsertedCount, DeletedCount, UpdateCount, TableName,StartDateTime, EndDateTime, CompletionStatus, ETLExecution_ID)
SELECT @ExecutionDate, @rowsinserted, @rowsdeleted, @rowsupdated, 'daily load - dwFullLeadProviderInactiveReasonMap', null, getdate(), 'Y', @ETLExecutionID;

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
