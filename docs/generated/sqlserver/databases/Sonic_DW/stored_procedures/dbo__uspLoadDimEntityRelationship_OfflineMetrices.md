---
name: uspLoadDimEntityRelationship_OfflineMetrices
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
/* Script name    |   [dbo].[uspLoadDimEntityRelationship_OfflineMetrices]              */
/* Purpose        |   This sp inserts data into DimEntityRelationship table             */
/* Date           |   2023-01-12	Change: Creation					                */
/* Author         |	  Manish Prasad	                                                    */
/* Tables loaded  |   dbo.DimEntityRelationship                                         */
/* Date Modified  |                                                                     */
/* ************************************************************************************ */
CREATE PROCEDURE [dbo].[uspLoadDimEntityRelationship_OfflineMetrices] (@RelationshipTypeGuid varchar(255), @Date datetime)
AS
BEGIN TRY
 BEGIN TRANSACTION
	BEGIN
		;with exception as(
			Select distinct [AccountId] from ETL_Staging.stage.StgFBAdsOfflineMetrices with (nolock)
			except
			select distinct BigIntegerField
			from dbo.DimEntityRelationship with (nolock)
			where RelationshipTypeGuid = @RelationshipTypeGuid
		),
		reqData as(
			select distinct replace([AccountName],'SAH - ','') as reqName,[AccountName],[AccountId]
			from  ETL_Staging.stage.StgFBAdsOfflineMetrices with (nolock)
			where [AccountId] in (select [AccountId] from exception)
		)
		insert into dbo.DimEntityRelationship(
			RelationshipTypeGuid,EntityKey,BigIntegerField,[RelationshipGuid],[StartDate],[EndDate],[IsActive],[CreatedDate],[UpdatedDate],[CreatedBy],[UpdatedBy]
		)
		select distinct @RelationshipTypeGuid, e.EntityKey, rd.[AccountId]
			,NEWID(), @Date, '2099-12-31', '1', @Date, @Date, USER_NAME() , USER_NAME()
		from reqData rd
			join dbo.Dim_Entity e with (nolock)
				on rd.reqName=EntDealerLvl1
		where e.EntEntityType !='Corporate'
			and e.EntLineOfBusiness in('Sonic','EchoPark')
			and e.EntActive='Active'
			and e.CurrentPrefixFlag='Active'
			and e.EntDefaultDlrshpLvl1=1
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
