---
name: uspSearchOfOrphanAccountIDs_OfflineMetrices
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
/* Date           |   2023-01-13	Change: Creation					                */
/* Author         |   Manish Prasad	                                                */
/* Tables loaded  |   dbo.FactFBOfflineMetrices										    */
/* Date Modified  |                                                                     */
/* 2023-01-13     |    TLC Initial                                                      */
/* ************************************************************************************ */
CREATE PROCEDURE [dbo].[uspSearchOfOrphanAccountIDs_OfflineMetrices](@RelationshipTypeGuid varchar(255), @Output INT OUT)
AS


			BEGIN
				if 0!=(select count(1) from dbo.FactFBOfflineMetrices where entitykey=-1)
					BEGIN
					--Update FactFBCampaignDaily
						;with reqdata as
						(
							select *, left(metanaturalkey,patindex('%[^0-9]%',metanaturalkey)-1) as MetaKey
							from dbo.FactFBOfflineMetrices
							where entitykey=-1
						)
						update fact
						set fact.entitykey=de.entitykey
						from reqdata fact
								  join dbo.DimEntityRelationship de on de.bigintegerfield=fact.MetaKey
						and RelationshipTypeGuid= @RelationshipTypeGuid
					END
				select @Output = count(1) from dbo.FactFBOfflineMetrices where entitykey=-1
				SELECT @Output AS Count
			END





```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
