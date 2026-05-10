---
name: uspRMUpdateOrphanStores
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

CREATE   PROCEDURE [dbo].[uspRMUpdateOrphanStores]( @RelationshipTypeGuid varchar(255))
AS
BEGIN TRY
	BEGIN TRANSACTION
		BEGIN
		if 0!=(select count(1) from Sonic_DW.dbo.DimEntityRelationship(nolock) where
		 RelationshipTypeGuid= @RelationshipTypeGuid AND entitykey=-1)
		    BEGIN
			
			-- Updating EP Stores	

			UPDATE der 
			SET der.entitykey=de.entitykey
			FROM Sonic_DW.dbo.DimEntityRelationship der
			join Sonic_DW.dbo.Dim_Entity de
			ON  de.EntSIMSStoreID=der.BigInteg
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
