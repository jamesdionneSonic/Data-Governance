---
name: uspGSCSearchOfOrphanWebsites
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimEntityRelationship
  - DimGSCSite
  - FactGSCDevicesCountryDaily
dependency_count: 3
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimEntityRelationship** (U )
- **dbo.DimGSCSite** (U )
- **dbo.FactGSCDevicesCountryDaily** (U )

## Parameters

| Name                    | Type    | Output | Default |
| ----------------------- | ------- | ------ | ------- |
| `@RelationshipTypeGuid` | varchar | No     | No      |
| `@Output`               | int     | Yes    | No      |

## Definition

```sql


/* ************************************************************************************ */
/* Script name    |   [dbo].[uspSearchOfOrphanWebsites]                                 */
/* Purpose        |   This sp search for missing Websites                               */
/* Date           |   2021-08-11	Change: Creation					                */
/* Author         |   Sandeepak Ghosh	                                                */
/* Tables loaded  |   dbo.FactGSCDevicesCountryDaily					                */
/* Date Modified  |                                                                     */
/* 2021-08-11     |    TLC Initial                                                      */
/* ************************************************************************************ */
CREATE   PROCEDURE [dbo].[uspGSCSearchOfOrphanWebsites]( @RelationshipTypeGuid varchar(255), @Output INT OUT)
AS
BEGIN TRY
	BEGIN TRANSACTION
		BEGIN
				if 0!=(select count(1) from dbo.FactGSCDevicesCountryDaily (nolock) where entitykey=-1)
					BEGIN
					--Update FactGSCDevicesCountryDaily
						;with reqdata as
						(
							select *
							from dbo.FactGSCDevicesCountryDaily (nolock)
							where EntityKey=-1
						)
						update fact
						set fact.entitykey=der.entitykey
						from reqdata fact
						join dbo.DimGSCSite ds on fact.DimSiteKey= ds.DimSiteKey
						join dbo.DimEntityRelationship der on der.attributefield=ds.SiteURL
						and RelationshipTypeGuid= @RelationshipTypeGuid
					END
				select @Output = count(1) from dbo.FactGSCDevicesCountryDaily where entitykey=-1
				SELECT @Output AS Count
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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
