---
name: uspLoadFactGSCQueryDaily
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

/* Script name    |   [dbo].[uspLoadFactGSCQueryDaily]                                    */

/* Purpose        |   This sp inserts data into FactGSCQueryDaily table               */

/* Date           |   2021-08-17	Change: Creation					                */

/* Author         |   Sandeepak Ghosh	                                                */

/* Tables loaded  |   dbo.FactGSCQueryDaily                                           */

/* Date Modified  |                                                                     */

/* 2021-05-11     |    TLC Initial                                                      */

/* ************************************************************************************ */

CREATE PROCEDURE [dbo].[uspLoadFactGSCQueryDaily]

(@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaComputerName varchar(100), @MetaSrcSysID varchar(100)

 , @ETLExecutionID varchar(100), @MetaLoadDate varchar(100),@RelationshipTypeGuid varchar(255))

AS

BEGIN TRY

	BEGIN TRANSACTION;



	with DeleteOldData as

	(
		select distinct d.datekey  datekey
		from ETL_Staging.stage.stgGSCQueryDaily a JOIN dbo.dim_date d
		ON a.date=d.fulldate
	)
	delete from dbo.FactGSCQueryDaily
	where EventDateKey in (select datekey from DeleteOldData)

		-- inserting data into FactGSCQueryDaily

		INSERT INTO  dbo.FactGSCQueryDaily
		(
		EntityKey
	   ,DimSiteKey
	   ,DimSearchTypeKey
	   ,DimSearchQueryKey
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

		Select  ISNULL(DER.EntityKey, -1)
		,a.DimSiteKey
		,b.DimSearchTypeKey
		,c.DimSearchQueryKey
		,d.DateKey
		,f.Clicks
		,f.CTR
		,f.Impressions
		,f.AveragePosition
		,MetaNaturalKey=f.GSCQueryDailyID
		,MetaLoadDate = @MetaLoadDate
		,MetaComputerName = @MetaComputerName
		,MetaUserId = @MetaUserId
		,MetaSourceSystemName = @MetaSourceSystemName
		,MetaSrcSysID = @MetaSrcSysID
		,ETLExecutionID = @ETLExecutionID
		from ETL_Staging.stage.stgGSCQueryDaily f (nolock)
			inner join Sonic_DW.dbo.DimGSCSite a (nolock)
			on f.site = a.SiteURL
			inner join Sonic_DW.dbo.DimEntityRelationship DER (nolock)
			on a.SiteURL = DER.AttributeField
			and DER.RelationshipTypeGuid = @RelationshipTypeGuid
			inner join Sonic_DW.dbo.DimGSCSearchType  b (nolock)
			on f.SearchType = b.SearchTypeName
			inner join Sonic_DW.dbo.DimGSCSearchQuery  c (nolock)
			on f.SearchQuery = c.SearchQuery
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
