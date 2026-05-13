---
name: uspLoadFactGSCDevicesCountryDaily
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Date
  - DimGSCCountry
  - DimGSCDevice
  - DimGSCSearchType
  - DimGSCSite
  - FactGSCDevicesCountryDaily
dependency_count: 6
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
- **dbo.DimGSCCountry** (U )
- **dbo.DimGSCDevice** (U )
- **dbo.DimGSCSearchType** (U )
- **dbo.DimGSCSite** (U )
- **dbo.FactGSCDevicesCountryDaily** (U )

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
/* Script name    |   [dbo].[uspLoadFactGSCDevicesCountryDaily]                                    */
/* Purpose        |   This sp inserts data into FactGSCDevicesCountryDaily table               */
/* Date           |   2021-05-11	Change: Creation					                */
/* Author         |   Sandeepak Ghosh	                                                */
/* Tables loaded  |   dbo.FactGSCDevicesCountryDaily                                           */
/* Date Modified  |                                                                     */
/* 2021-05-11     |    TLC Initial                                                      */
/* ************************************************************************************ */
CREATE PROCEDURE [dbo].[uspLoadFactGSCDevicesCountryDaily]
(@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaComputerName varchar(100), @MetaSrcSysID varchar(100)
 , @ETLExecutionID varchar(100), @MetaLoadDate varchar(100),@RelationshipTypeGuid varchar(255))
AS
BEGIN TRY
	BEGIN TRANSACTION;

	with DeleteOldData as
	(
		select distinct d.datekey  datekey
		from ETL_Staging.stage.stgGSCDevicesCountryDaily a (nolock) JOIN dbo.dim_date d (nolock)
		ON a.date=d.fulldate
	)
	delete from dbo.FactGSCDevicesCountryDaily
	where EventDateKey in (select datekey from DeleteOldData)

		-- inserting data into FactGSCDevicesCountryDaily
		insert into  dbo.FactGSCDevicesCountryDaily
		(
          EntityKey
		 ,DimSiteKey
         ,DimSearchTypeKey
         ,DimCountryKey
         ,DimDeviceKey
         ,EventDateKey
         ,Clicks
         ,CTR
         ,Impressions
         ,AveragePosition
         ,MetaNaturalKey
         ,MetaLoaddate
         ,MetaComputerName
         ,MetaUserId
         ,MetaSourceSystemName
         ,MetaSrcSysID
         ,ETLExecutionID
		)
		Select 	ISNULL(DER.EntityKey, -1)
		,c.DimSiteKey
		,d.DimSearchTypeKey
		,a.DimCountryKey
		,b.DimDeviceKey
		,e.DateKey
		,f.Clicks
		,f.CTR
		,f.Impressions
		,f.AveragePosition
		,MetaNaturalKey=f.GSCDevicesCountryDailyID
		,MetaLoadDate = @MetaLoadDate
		,MetaComputerName = @MetaComputerName
		,MetaUserId = @MetaUserId
		,MetaSourceSystemName = @MetaSourceSystemName
		,MetaSrcSysID = @MetaSrcSysID
		,ETLExecutionID = @ETLExecutionID
		from ETL_Staging.stage.stgGSCDevicesCountryDaily f (nolock)
			inner join dbo.DimGSCCountry a (nolock)
				on f.CountryCode = a.CountryCode
				AND f.Country = a.CountryName
			inner join dbo.DimGSCDevice b (nolock)
				on f.Device = b.DeviceName
			inner join dbo.DimGSCSite c (nolock)
			on f.site = c.SiteURL
			inner join Sonic_DW.dbo.DimEntityRelationship DER (nolock)
			on c.SiteURL = DER.AttributeField
			and DER.RelationshipTypeGuid = @RelationshipTypeGuid
			inner join dbo.DimGSCSearchType  d (nolock)
			on f.SearchType = d.SearchTypeName
			inner join  dbo.dim_date e
				ON f.date=e.fulldate

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
