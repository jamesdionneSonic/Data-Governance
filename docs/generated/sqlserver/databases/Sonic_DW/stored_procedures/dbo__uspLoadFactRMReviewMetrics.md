---
name: uspLoadFactRMReviewMetrics
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
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
		ON cast(a.Star
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
