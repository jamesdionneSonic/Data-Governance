---
name: uspLoadDimFBAdName
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



CREATE PROCEDURE [dbo].[uspLoadDimFBAdName] ( @MetaLoadDate varchar(100)
	, @MetaComputerName varchar(100),@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaSrcSysID varchar(100), @ETLExecutionID varchar(100))
AS
BEGIN TRY
 BEGIN TRANSACTION
	
	 BEGIN
		insert into dbo.DimFBAdName
		(
		 AdName
		,MetaLoadDate
		,MetaComputerName
		,MetaUserId
		,MetaSourceSystemName
		,MetaSrcSysID
		,ETLExecutionID
		)
    SELECT a.*,@MetaLoadDate, @MetaComputerName,@Met
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
