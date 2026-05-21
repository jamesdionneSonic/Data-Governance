---
name: uspLoadFactRMReviewMetrics
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

CREATE   PROCEDURE [dbo].[uspLoadFactRMReviewMetrics]

(@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaComputerName varchar(100), @MetaSrcSysID varchar(100)

 , @ETLExecutionID varchar(100), @MetaLoadDate varchar(100),@RelationshipTypeGuid varchar(255))

AS

BEGIN TRY

	BEGIN TRANSACTION;



/*	with DeleteOldData as

	(
		select distinct d.datekey  datekey
		from ETL_Staging.stage.StgRMReviewMetrics(nolock) a JOIN dbo.dim_date(nolock) d
		ON cast(a.StartDate as date)=d.fulldate
	)
	delete from dbo.FactRMReviewMetrics
	where EventDateKey in (select datekey from DeleteOldData)

	*/

        TRUNCATE TABLE dbo.FactRMReviewMetrics;
		-- inserting data into FactRMReviewMetrics

		INSERT INTO  dbo.FactRMReviewMetrics
		(
		RMStoreKey,
		EventDateKey,
		Failures,
		Unsubscribes,
		Dropped,
		Delivered,
		Opened,
		Received,
		UniqueOpened,
		Bounced,
		Clicked,
		Sent,
		Unsubscribed,
		Spammed,
		UniqueClicked,
		Deduped,
		MetaNaturalKey,
		MetaLoadDate,
		MetaComputerName,
		MetaUserId,
		MetaSourceSystemName,
		MetaSrcSysID,
		ETLExecutionID
	    )

		select
		c.RMStoreKey,
		d.DateKey,
		a.Failures,
		a.Unsubscribes,
		a.Dropped,
		a.Delivered,
		a.Opened,
		a.Received,
		a.UniqueOpened,
		a.Bounced,
		a.Clicked,
		a.Sent,
		a.Unsubscribed,
		a.Spammed,
		a.UniqueClicked,
		a.Deduped,
		a.RMMetricID,
		MetaLoadDate = @MetaLoadDate,
		MetaComputerName = @MetaComputerName,
		MetaUserId = @MetaUserId,
		MetaSourceSystemName = @MetaSourceSystemName,
		MetaSrcSysID = @MetaSrcSysID,
		ETLExecutionID = @ETLExecutionID
		from ETL_Staging.stage.StgRMReviewMetrics(nolock) a
		join Sonic_DW.dbo.DimEntityRelationship(nolock) b
		on a.LocationID = b.Bigintegerfield
		and b.RelationshipTypeGuid = @RelationshipTypeGuid
		join Sonic_DW.dbo.DimRMStoreNames(nolock) c
		on b.EntityKey = c.EntityKey and b.IntegerField = c.RMDepartmentKey
		and b.AttributeField=c.PrimaryWebsite
		and c.IsActive = 1
		join  dbo.dim_date(nolock) d
		on cast(a.StartDate as date) = d.fulldate



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
