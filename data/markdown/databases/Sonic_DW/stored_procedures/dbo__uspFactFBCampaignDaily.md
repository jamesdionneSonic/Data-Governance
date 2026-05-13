---
name: uspFactFBCampaignDaily
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Date
  - DimEntityRelationship
  - DimFBCampaign
  - FactFBCampaignDaily
dependency_count: 4
parameter_count: 7
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_Date** (U )
- **dbo.DimEntityRelationship** (U )
- **dbo.DimFBCampaign** (U )
- **dbo.FactFBCampaignDaily** (U )

## Parameters

| Name                    | Type    | Output | Default |
| ----------------------- | ------- | ------ | ------- |
| `@MetaUserId`           | varchar | No     | No      |
| `@MetaSourceSystemName` | varchar | No     | No      |
| `@MetaComputerName`     | varchar | No     | No      |
| `@MetaSrcSysID`         | varchar | No     | No      |
| `@ETLExecutionID`       | varchar | No     | No      |
| `@MetaLoadDate`         | varchar | No     | No      |
| `@RelationshipTypeGuid` | varchar | No     | No      |

## Definition

```sql
/* ************************************************************************************ */
/* Script name    |   [dbo].[uspFactFBCampaignDaily]                                    */
/* Purpose        |   This sp inserts data into FactFBCampaignDaily table               */
/* Date           |   2021-05-11	Change: Creation					                */
/* Author         |   Akshata Shetty	                                                */
/* Tables loaded  |   dbo.FactFBCampaignDaily                                           */
/* Date Modified  |                                                                     */
/* 2021-05-11     |    TLC Initial                                                      */
/* ************************************************************************************ */
CREATE   PROCEDURE [dbo].[uspFactFBCampaignDaily]
(@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaComputerName varchar(100), @MetaSrcSysID varchar(100)
 , @ETLExecutionID varchar(100), @MetaLoadDate varchar(100),@RelationshipTypeGuid varchar(255))
AS
BEGIN TRY
	BEGIN TRANSACTION
	---deleting old data
	;with DeleteOldData as
	(
		select distinct datadate
		from ETL_Staging.stage.StgFBAdsByCampaignDaily
	)
	delete from dbo.FactFBCampaignDaily
	where datadate in (select datadate from DeleteOldData)

		-- inserting data into FactFBCampaignDaily
		insert into  dbo.FactFBCampaignDaily(EntityKey,CampaignKey,LinkClicks,Clicks,Cost,CPC,CTR,Impressions,Reach,FileDate,Datadate,MetaNaturalKey,
			MetaSourceFileName,MetaFileModifiedDate,MetaComputerName,MetaUserId,MetaSourceSystemName,MetaSrcSysID,ETLExecutionID, MetaLoadDate,DateKey)
		Select ISNULL(B.EntityKey, -1)
		,C.CampaignKey
		,A.LinkClicks
		,A.Clicks
		,A.Cost
		,A.CPC
		,A.CTR
		,A.Impressions
		,A.Reach
		,A.Filedate
		,A.Datadate
		,MetaNaturalKey=concat(
			cast(A.accountid as varchar(100))
			,'*',cast(A.campaignID as varchar(100))
			,'*',replace(convert(varchar, A.datadate,112),' ',''))
		,A.MetaSourceFileName
		,MetaFileModifiedDate = getdate()
		,MetaComputerName = @MetaComputerName
		,MetaUserId = @MetaUserId
		,MetaSourceSystemName = @MetaSourceSystemName
		,MetaSrcSysID = @MetaSrcSysID
		,ETLExecutionID = @ETLExecutionID
		,MetaLoadDate = @MetaLoadDate
		,d.datekey
		from ETL_Staging.stage.StgFBAdsbyCampaignDaily A with (nolock)
			inner join dbo.DimFBCampaign C with (nolock)
				on A.CampaignID = C.CampaignID
					and A.CampaignName = C.CampaignName
					and A.CampaignObjective = c.CampaignObjective
			inner join  dbo.dim_date d
				ON a.datadate=d.fulldate
			left join dbo.DimEntityRelationship B with (nolock)
				on A.AccountID = B.BigIntegerField
					and RelationshipTypeGuid = @RelationshipTypeGuid
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
