---
name: uspLoadDimFBCampaign
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimFBCampaign
dependency_count: 1
parameter_count: 7
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimFBCampaign** (U )

## Parameters

| Name                    | Type    | Output | Default |
| ----------------------- | ------- | ------ | ------- |
| `@LoadType`             | varchar | No     | No      |
| `@MetaLoadDate`         | varchar | No     | No      |
| `@MetaComputerName`     | varchar | No     | No      |
| `@MetaUserId`           | varchar | No     | No      |
| `@MetaSourceSystemName` | varchar | No     | No      |
| `@MetaSrcSysID`         | varchar | No     | No      |
| `@ETLExecutionID`       | varchar | No     | No      |

## Definition

```sql
/* ************************************************************************************ */
/* Script name    |   [dbo].[uspLoadDimFBCampaign]                                      */
/* Purpose        |   This sp inserts data into DimFBCampaign table                     */
/* Date           |   2021-05-11	Change: Creation					                */
/* Author         |   Akshata Shetty	                                                */
/* Tables loaded  |   dbo.DimFBCampaign                                                 */
/* Date Modified  |                                                                     */
/* 2021-05-11     |    TLC Initial                                                      */
/* ************************************************************************************ */
CREATE   PROCEDURE [dbo].[uspLoadDimFBCampaign] (@LoadType varchar(20)
, @MetaLoadDate varchar(100), @MetaComputerName varchar(100),@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaSrcSysID varchar(100), @ETLExecutionID varchar(100))
AS
BEGIN TRY
 BEGIN TRANSACTION
	if @LoadType = 'Daily'
	 BEGIN
		insert into dbo.DimFBCampaign
		(
		CampaignId
		,CampaignName
		,CampaignObjective
		,MetaLoadDate
		,MetaComputerName
		,MetaUserId
		,MetaSourceSystemName
		,MetaSrcSysID
		,ETLExecutionID
		)
    SELECT a.*,@MetaLoadDate, @MetaComputerName,@MetaUserId,@MetaSourceSystemName,@MetaSrcSysID,@ETLExecutionID
	FROM (
		Select Distinct CampaignId, campaignName, CampaignObjective from ETL_Staging.stage.StgFBAdsByCampaignDaily with (nolock)
		except
		Select Distinct CampaignId, campaignName, CampaignObjective from dbo.DimFBCampaign  with (nolock)
		) a;
	END
   ELSE
	BEGIN
		insert into dbo.DimFBCampaign
		(
		CampaignId
		,CampaignName
		,CampaignObjective
		,MetaLoadDate
		,MetaComputerName
		,MetaUserId
		,MetaSourceSystemName
		,MetaSrcSysID
		,ETLExecutionID
		)
    SELECT a.*,@MetaLoadDate, @MetaComputerName,@MetaUserId,@MetaSourceSystemName,@MetaSrcSysID,@ETLExecutionID
	FROM (
		Select Distinct CampaignId, campaignName, CampaignObjective from ETL_Staging.stage.StgFBAdsByCampaignMonthly with (nolock)
		except
		Select Distinct CampaignId, campaignName, CampaignObjective from dbo.DimFBCampaign  with (nolock)
		) a;
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
