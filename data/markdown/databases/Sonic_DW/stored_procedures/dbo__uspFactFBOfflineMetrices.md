---
name: uspFactFBOfflineMetrices
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
  - DimFBAdName
  - DimFBCampaign
  - FactFBOfflineMetrices
dependency_count: 5
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
- **dbo.DimFBAdName** (U )
- **dbo.DimFBCampaign** (U )
- **dbo.FactFBOfflineMetrices** (U )

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
/* Purpose        |   This sp inserts data into FactFBOfflineMetrices table             */
/* Date           |   2023-01-12	Change: Creation					                */
/* Author         |   Manish Prasad	                                                    */
/* Tables loaded  |   dbo.FactFBOfflineMetrices                                         */
/* Date Modified  |                                                                     */
/* ************************************************************************************ */
CREATE   PROCEDURE [dbo].[uspFactFBOfflineMetrices]
(@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaComputerName varchar(100), @MetaSrcSysID varchar(100)
 , @ETLExecutionID varchar(100), @MetaLoadDate varchar(100),@RelationshipTypeGuid varchar(255))
AS
BEGIN TRY
	BEGIN TRANSACTION
	---deleting old data
	;with DeleteOldData as
	(
		select distinct [Datadate]
		from ETL_Staging.stage.StgFBAdsOfflineMetrices
	)
	delete from dbo.FactFBOfflineMetrices
	where [Datadate] in (select [Datadate] from DeleteOldData)

		-- inserting data into FactFBOfflineMetrices
		insert into  dbo.FactFBOfflineMetrices(EntityKey,AdKey,CampaignKey,[Offlineaddstocart],[Uniqueaddstowishlist],[Offlinepurchases],FileDate,[Datadate],MetaNaturalKey,
			MetaSourceFileName,MetaFileModifiedDate,MetaComputerName,MetaUserId,MetaSourceSystemName,MetaSrcSysID,ETLExecutionID, MetaLoadDate,DateKey)
		Select ISNULL(B.EntityKey, -1)
		,Ad.AdKey
		,C.CampaignKey
		,A.[Offlineaddstocart]
		,A.[Uniqueaddstowishlist]
		,A.[Offlinepurchases]
		,A.Filedate
		,A.[Datadate]
		,MetaNaturalKey=concat(
			cast(A.[AccountID] as varchar(100))
			,'*',cast(A.[CampaignID] as varchar(100))
			,'*',replace(convert(varchar, A.[DataDate],112),' ',''))
		,A.MetaSourceFileName
		,MetaFileModifiedDate = getdate()
		,MetaComputerName = @MetaComputerName
		,MetaUserId = @MetaUserId
		,MetaSourceSystemName = @MetaSourceSystemName
		,MetaSrcSysID = @MetaSrcSysID
		,ETLExecutionID = @ETLExecutionID
		,MetaLoadDate = @MetaLoadDate
		,d.datekey
		from ETL_Staging.stage.StgFBAdsOfflineMetrices A with (nolock)
			inner join dbo.DimFBCampaign C with (nolock)
				on A.[CampaignID] = C.[CampaignID]
					and A.[CampaignName] = C.[CampaignName]
					and A.[CampaignObjective] = c.[CampaignObjective]
			inner join dbo.DimFBAdName Ad with (nolock)
			    on A.[AdName] = Ad.AdName OR ( A.[AdName] IS NULL AND Ad.AdName IS NULL)
			inner join  dbo.dim_date d
				ON a.[Datadate]=d.fulldate
			left join dbo.DimEntityRelationship B with (nolock)
				on A.[AccountID] = B.BigIntegerField
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
