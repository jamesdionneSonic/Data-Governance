---
name: uspLoadRMDimEntityRelationship
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

CREATE   PROCEDURE [dbo].[uspLoadRMDimEntityRelationship] ( @RelationshipTypeGuid varchar(255), @Date datetime)
AS
BEGIN TRY
 BEGIN TRANSACTION
	BEGIN
		-- For EchoPark dealership
			;with exception as(
			Select distinct locationid from ETL_Staging.stage.StgDimRMStoreNames with (nolock)
			where company like '%EchoPark%' and isactive=1
			except
			select distinct BigIntegerField 
			from dbo.DimEntityRelationship with (nolock) 
			where RelationshipTypeGuid = @RelationshipTypeGui
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
