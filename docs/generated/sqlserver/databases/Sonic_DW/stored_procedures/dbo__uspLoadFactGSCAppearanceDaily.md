---
name: uspLoadFactGSCAppearanceDaily
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
/* Script name    |   [dbo].[[uspLoadFactGSCAppearanceDaily]]                                    */
/* Purpose        |   This sp inserts data into FactGSCAppearanceDaily table               */
/* Date           |   2021-05-11	Change: Creation					                */
/* Author         |   Sandeepak Ghosh	                                                */
/* Tables loaded  |   dbo.FactGSCAppearanceDaily                                           */
/* Date Modified  |                                                                     */
/* 2021-05-11     |    TLC Initial                                                      */
/* ************************************************************************************ */
CREATE PROCEDURE [dbo].[uspLoadFactGSCAppearanceDaily]
(@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaComputerName varchar(100), @MetaSrcSysID varchar(100)
 , @ETLExecutionID varchar(100), @MetaLoadDate varchar(100),@RelationshipTypeGuid varchar(255)
 )
AS
BEGIN TRY
	BEGIN TRANSACTION;
	---deleting old data
	with DeleteOldData as
	(
		select distinct d.datekey  datekey
		from ETL_Staging.stage.stgGSCAppearanceDaily a (nolock) JOIN dbo.dim_date d (nolock)
		ON a.date=d.fulldate
	)
	delete from dbo.FactGSCAppearanceDaily
	where EventDateKey in (select datekey from DeleteOldData)
		-- inserting data into FactGSCAppearanceDaily
		insert into  dbo.FactGSCAppearanceDaily
		(
		  EntityKey
		 ,DimSiteKey
		 ,DimSearchTypeKey
		 ,DimAppearanceKey
		 ,EventDateKey
		 ,Clicks
		 ,CTR
		 ,Impressions
		 ,AveragePosition
		 ,MetaNaturalKey
		 ,MetaLoadDate
		 ,MetaComputerName
		 ,MetaUserID
		 ,MetaSourceSystemName
		 ,MetaSrcSysID
		 ,ETLExecutionID
		)
		Select 	ISNULL(DER.EntityKey, -1)
		,b.DimSiteKey
		,c.DimSearchTypeKey
		,a.DimAppearanceKey
		,d.DateKey
		,f.Clicks
		,f.CTR
		,f.Impressions
		,f.AveragePosition
		,MetaNaturalKey=f.GSCAppearanceDailyID
		,MetaLoadDate = @MetaLoadDate
		,MetaComputerName = @MetaComputerName
		,MetaUserId = @MetaUserId
		,MetaSourceSystemName = @MetaSourceSystemName
		,MetaSrcSysID = @MetaSrcSysID
		,ETLExecutionID = @ETLExecutionID
		from ETL_Staging.stage.stgGSCAppearanceDaily f (nolock)
			inner join dbo.DimGSCAppearance a (nolock)
				on f.SearchAppearance = a.SearchAppearance
			inner join sonic_dw.dbo.DimGSCSite b (nolock)
			on f.site = b.SiteURL
			inner join Sonic_DW.dbo.DimEntityRelationship DER (nolock)
			on b.SiteURL = DER.AttributeField
			and DER.RelationshipTypeGuid = @RelationshipTypeGuid
			inner join sonic_dw.dbo.DimGSCSearchType  c (nolock)
			on f.SearchType = c.SearchTypeName
			inner join  dbo.dim_date d
				ON f.date=d.fulldate

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
