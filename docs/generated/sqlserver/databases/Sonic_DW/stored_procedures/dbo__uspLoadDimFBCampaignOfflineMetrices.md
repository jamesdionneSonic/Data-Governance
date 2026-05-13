---
name: uspLoadDimFBCampaignOfflineMetrices
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
/* Script name    |   [dbo].[uspLoadDimFBCampaign]                                      */
/* Purpose        |   This sp inserts data into DimFBCampaign table                     */
/* Date           |   2023-01-12	Change: Creation					                */
/* Author         |   Manish Prasad														*/
/* Tables loaded  |   dbo.DimFBCampaign                                                 */
/* Date Modified  |                                                                     */
/* ************************************************************************************ */
CREATE    PROCEDURE [dbo].[uspLoadDimFBCampaignOfflineMetrices] (@MetaLoadDate varchar(100),
        @MetaComputerName varchar(100),@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaSrcSysID varchar(100), @ETLExecutionID varchar(100))
AS
BEGIN TRY
 BEGIN TRANSACTION

	 BEGIN
		insert into dbo.DimFBcampaign
		(
		CampaignID
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
		Select Distinct [CampaignID],[CampaignName],[CampaignObjective] from ETL_Staging.stage.StgFBAdsOfflineMetrices with (nolock)
		except
		Select Distinct [CampaignID],[CampaignName],[CampaignObjective] from dbo.DimFBcampaign  with (nolock)
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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
