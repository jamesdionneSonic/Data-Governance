---
name: uspRMUpdateOrphanStores
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
			ON  de.EntSIMSStoreID=der.BigIntegerField
			where der.EntityKey=-1 and der.RelationshipTypeGuid= @RelationshipTypeGuid


			-- Updating RT Stores
			UPDATE der
			SET der.entitykey=de.entitykey
			FROM Sonic_DW.dbo.DimEntityRelationship der
			join [L2-RTSIMSSQL-04 ,12011].[SIMS6200Retail].dbo.Organization b
			ON der.AttributeField = Replace(replace(b.Web_URL,'//www.','//'),'://','s://www.')
			AND RelationshipTypeGuid= @RelationshipTypeGuid
			AND EntityKey=-1
			join Sonic_DW.dbo.Dim_Entity de
			ON  de.EntSIMSStoreID=b.Org_ID;

			END
			END
		COMMIT TRANSACTION
END TRY
BEGIN CATCH
	DECLARE @Message varchar(MAX) = ERROR_MESSAGE(),
        @Severity int = ERROR_SEVERITY(),
        @State smallint = ERROR_STATE();

    RAISERROR (@Message, @Severity, @State)
	ROLLBACK TRANSACTION
END CATCH
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
