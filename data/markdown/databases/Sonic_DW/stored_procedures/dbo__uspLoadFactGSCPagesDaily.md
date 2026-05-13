---
name: uspLoadFactGSCPagesDaily
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Date
  - DimGSCSearchType
  - DimGSCSite
  - FactGSCPagesDaily
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
- **dbo.DimGSCSearchType** (U )
- **dbo.DimGSCSite** (U )
- **dbo.FactGSCPagesDaily** (U )

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

/* Script name    |   [dbo].[uspLoadFactGSCPagesDaily]                                    */

/* Purpose        |   This sp inserts data into FactGSCPagesDaily table               */

/* Date           |   2021-05-11	Change: Creation					                */

/* Author         |   Sandeepak Ghosh	                                                */

/* Tables loaded  |   dbo.FactGSCPagesDaily                                           */

/* Date Modified  |                                                                     */

/* 2021-05-11     |    TLC Initial                                                      */

/* ************************************************************************************ */

CREATE PROCEDURE [dbo].[uspLoadFactGSCPagesDaily]

(@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaComputerName varchar(100), @MetaSrcSysID varchar(100)

 , @ETLExecutionID varchar(100), @MetaLoadDate varchar(100),@RelationshipTypeGuid varchar(255))

AS

BEGIN TRY

	BEGIN TRANSACTION;



	with DeleteOldData as
	(
		select distinct d.datekey  datekey
		from ETL_Staging.stage.stgGSCPagesDaily a JOIN dbo.dim_date d
		ON a.date=d.fulldate
	)
	delete from dbo.FactGSCPagesDaily
	where EventDateKey in (select datekey from DeleteOldData);

	-- inserting data into FactGSCPagesDaily

		insert into  dbo.FactGSCPagesDaily
		(
          EntityKey
		 ,DimSiteKey
         ,DimSearchTypeKey
         ,DimLandingPageKey
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
		,c.DimLandingPageKey
		,d.DateKey
		,f.Clicks
		,f.CTR
		,f.Impressions
		,f.AveragePosition
		,MetaNaturalKey=f.GSCPagesDailyID
		,MetaLoadDate = @MetaLoadDate
		,MetaComputerName = @MetaComputerName
		,MetaUserId = @MetaUserId
		,MetaSourceSystemName = @MetaSourceSystemName
		,MetaSrcSysID = @MetaSrcSysID
		,ETLExecutionID = @ETLExecutionID
		from ETL_Staging.stage.stgGSCPagesDaily f (nolock)
			inner join dbo.DimGSCSite a (nolock)
			on f.site = a.SiteURL
			inner join Sonic_DW.dbo.DimEntityRelationship DER (nolock)
			on a.SiteURL = DER.AttributeField
			and DER.RelationshipTypeGuid = @RelationshipTypeGuid
			inner join dbo.DimGSCSearchType  b (nolock)
			on f.SearchType = b.SearchTypeName
			inner join Sonic_DW.dbo.DimGSCLandingPage  c (nolock)
			on f.LandingPage = c.LandingPage
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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
