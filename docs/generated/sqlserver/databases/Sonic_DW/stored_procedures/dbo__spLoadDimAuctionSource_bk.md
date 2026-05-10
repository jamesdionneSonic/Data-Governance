---
name: spLoadDimAuctionSource_bk
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

/******************** CHANGE LOG **********************************************************
05/12/2020:  Derrick Davis - Create stored proc for type 2 insert/update

*******************************************************************************************/

CREATE PROC [dbo].[spLoadDimAuctionSource]
AS 

IF OBJECT_ID ('tempdb..#stage') is not null drop table #stage;

CREATE TABLE #stage
	(	
		AuctionSourceName VARCHAR(500)
		,IsActive BIT
		,IsEchoParkActive BIT
		,IsSonicActi
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
