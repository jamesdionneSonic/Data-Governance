---
name: usp_CreateOpsReview
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





--exec usp_CreateOpsReview_Test 'Doug.Morgan',1



CREATE PROCEDURE [dbo].[usp_CreateOpsReview]
@UserName varchar(30),
@DummyValue int

as
	
Declare @ServiceType varchar(30)

Select @ServiceType = (select ServiceType from OpsAssociate where Username = @Username)


INSERT INTO [dbo].[OpsReview]
           ([CreatedByUserName]
           ,[ModifiedByUserName]
           ,[CreatedOnDateTime]
           ,[ModifiedOnDateTime]
		   ,ServiceType)
     
	 Select @UserName
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
