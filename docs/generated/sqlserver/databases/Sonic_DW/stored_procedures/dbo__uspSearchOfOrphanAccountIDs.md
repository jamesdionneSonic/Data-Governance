---
name: uspSearchOfOrphanAccountIDs
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
/* ************************************************************************************ */
/* Script name    |   [dbo].[uspSearchOfOrphanAccountIDs]                               */
/* Purpose        |   This sp search for missing AccountIDs                             */
/* Date           |   2021-05-11	Change: Creation					                */
/* Author         |   Akshata Shetty	                                                */
/* Tables loaded  |   dbo.FactFBCampaignDaily/ dbo.FactFBCampaignMonthly                */
/* Date Modified  |                                                                     */
/* 2021-05-11     |    TLC Initial                                                      */
/* ************************************************************************************ */
CREATE   PROCEDURE [dbo].[uspSearchOfOrphanAccountIDs](@LoadType varchar(50), @RelationshipTypeGuid varchar(255), @Output INT OUT)
AS
BEGIN TRY
	BEGIN TRANSACTION
		if @LoadType = 'Daily'
			BEGIN
				if 0!=(select count(1) from dbo.FactFBCampaignDaily where entitykey=-1)
					BEGIN
					--Update FactFBCampaignDaily
						;with reqdata as
						(
							select *, left(metanaturalkey,patindex('%[^0-9]%',metanaturalkey)-1) as MetaKey
							from dbo.FactFBCampaignDaily
							where entitykey=-1
						)
						update fact
						set fact.entitykey=de.entitykey
						from reqdata fact
								  join dbo.DimEntityRelationship de on de.bigintegerfield=fact.MetaKey
						and RelationshipTypeGuid= @RelationshipTypeGuid
					END
				select @Output = count(1) from dbo.FactFBCampaignDaily where entitykey=-1
				SELECT @Output AS Count
			END
		else
			BEGIN
				if 0!=(select count(1) from dbo.FactFBCampaignMonthly where entitykey=-1)
					BEGIN
					--Update FactFBCampaignMonthly
						;with reqdata as
						(
							select *, left(metanaturalkey,patindex('%[^0-9]%',metanaturalkey)-1) as MetaKey
							from dbo.FactFBCampaignMonthly
							where entitykey=-1
						)
						update fact
						set fact.entitykey=de.entitykey
						from reqdata fact
								  join dbo.DimEntityRelationship de on de.bigintegerfield=fact.MetaKey
						and RelationshipTypeGuid= @RelationshipTypeGuid
					END
				select @Output = count(1) from dbo.FactFBCampaignMonthly where entitykey=-1
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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
