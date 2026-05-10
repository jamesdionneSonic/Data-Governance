---
name: usp_Load_MSEntity
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


CREATE PROCEDURE [dbo].[usp_Load_MSEntity]

@MSState varchar(50),
@MSCity varchar(50),
@MSStore varchar(50),
@MSUserID varchar(50)

--@MSComments varchar(1000)

AS

DECLARE @MSEntityID int
SET NOCOUNT ON
BEGIN TRY




--@MSEntityID, @MSCreatedUserID, @MSComments

Insert into dbo.MSEntity
   Select 
      -- Procedure INPUT keyed user id
 @MSState as MSState
,@MSCity as MSCity
,@MSStore as MSStore
,@MSUserID as MSEntityCreatedBy
,GETDATE() as MSEntityCreatedOn

  
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
