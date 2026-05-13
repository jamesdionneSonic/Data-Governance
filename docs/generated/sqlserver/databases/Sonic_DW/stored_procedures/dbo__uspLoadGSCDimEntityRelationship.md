---
name: uspLoadGSCDimEntityRelationship
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
/* Script name    |   [dbo].[uspLoadGSCDimEntityRelationship]			                */
/* Purpose        |   This sp inserts data into DimEntityRelationship table for GSC     */
/* Date           |   2021-05-11	Change: Creation					                */
/* Author         |   Sandeepak Ghosh	                                                */
/* Tables loaded  |   dbo.DimEntityRelationship                                         */
/* Date Modified  |                                                                     */
/* 2021-05-11     |    TLC Initial                                                      */
/* ************************************************************************************ */
CREATE   PROCEDURE [dbo].[uspLoadGSCDimEntityRelationship] ( @RelationshipTypeGuid varchar(255), @Date datetime)
AS
BEGIN TRY
 BEGIN TRANSACTION
	BEGIN
		;with exception as(
			Select distinct site from ETL_Staging.stage.StgGSCDevicesCountryDaily with (nolock)
			except
			select distinct attributefield
			from dbo.DimEntityRelationship with (nolock)
			where RelationshipTypeGuid = @RelationshipTypeGuid
		),
		reqData as(
			select distinct ORG.Org_ID as reqName,
                            GSCD.SiteURL
			from  dbo.dimGSCSite GSCD (NOLOCK)
            JOIN [L2-RTSIMSSQL-04 ,12011].[SIMS6200Retail].dbo.Organization ORG
			ON SUBSTRING(SiteURL,1,LEN(SiteURL)-1) =Replace(replace(ORG.Web_URL,'//www.','//'),'://','s://www.')
			where siteURL in (select site from exception)
		)
		insert into dbo.DimEntityRelationship(
			RelationshipTypeGuid,EntityKey,attributefield,[RelationshipGuid],[StartDate],[EndDate],[IsActive],[CreatedDate],[UpdatedDate],[CreatedBy],[UpdatedBy]
		)
		select distinct @RelationshipTypeGuid, e.EntityKey, rd.siteURL
			,NEWID(), @Date, '2049-12-31', '1', @Date, @Date, SUSER_NAME() , SUSER_NAME()
		from reqData rd
			join dbo.Dim_Entity e (nolock)
				on rd.reqName=e.EntSIMSStoreID
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
