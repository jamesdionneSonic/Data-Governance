---
name: uspLoadDimEntityRelationship
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
/* Script name    |   [dbo].[uspLoadDimEntityRelationship]                              */
/* Purpose        |   This sp inserts data into DimEntityRelationship table             */
/* Date           |   2021-05-11	Change: Creation					                */
/* Author         |   Akshata Shetty	                                                */
/* Tables loaded  |   dbo.DimEntityRelationship                                         */
/* Date Modified  |                                                                     */
/* 2021-05-11     |    TLC Initial                                                      */
/* ************************************************************************************ */
CREATE   PROCEDURE [dbo].[uspLoadDimEntityRelationship] (@LoadType varchar(50), @RelationshipTypeGuid varchar(255), @Date datetime)
AS
BEGIN TRY
 BEGIN TRANSACTION
	if @LoadType = 'Daily'
	BEGIN
		;with exception as(
			Select distinct AccountID from ETL_Staging.stage.StgFBAdsByCampaignDaily with (nolock)
			except
			select distinct BigIntegerField
			from dbo.DimEntityRelationship with (nolock)
			where RelationshipTypeGuid = @RelationshipTypeGuid
		),
		reqData as(
			select distinct replace(accountname,'SAH - ','') as reqName,accountname,accountid
			from  ETL_Staging.stage.StgFBAdsByCampaignDaily with (nolock)
			where AccountID in (select AccountID from exception)
		)
		insert into dbo.DimEntityRelationship(
			RelationshipTypeGuid,EntityKey,BigIntegerField,[RelationshipGuid],[StartDate],[EndDate],[IsActive],[CreatedDate],[UpdatedDate],[CreatedBy],[UpdatedBy]
		)
		select distinct @RelationshipTypeGuid, e.EntityKey, rd.AccountId
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
	ELSE
		BEGIN
		;with exception as(
			Select distinct AccountID from ETL_Staging.stage.StgFBAdsByCampaignMonthly with (nolock)
			except
			select distinct BigIntegerField
			from dbo.DimEntityRelationship with (nolock)
			where RelationshipTypeGuid = @RelationshipTypeGuid
		),
		reqData as(
			select distinct replace(accountname,'SAH - ','') as reqName,accountname,accountid
			from  ETL_Staging.stage.StgFBAdsByCampaignMonthly with (nolock)
			where AccountID in (select AccountID from exception)
		)
		insert into dbo.DimEntityRelationship(
			RelationshipTypeGuid,EntityKey,BigIntegerField,[RelationshipGuid],[StartDate],[EndDate],[IsActive],[CreatedDate],[UpdatedDate],[CreatedBy],[UpdatedBy]
		)
		select distinct @RelationshipTypeGuid,e.EntityKey,rd.AccountId
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
