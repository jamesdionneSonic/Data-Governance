---
name: vwPCNBottleRocket
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql
--USE [Sonic_DW]
--GO

--/****** Object:  View [dbo].[vwPCNBottleRocket]    Script Date: 8/18/2023 11:29:33 AM ******/
--SET ANSI_NULLS ON
--GO

--SET QUOTED_IDENTIFIER ON
--GO




CREATE view [dbo].[vwPCNBottleRocket] as 
select 
	pcn.PriceChangeNotificationId
,convert(int,opp.meta_originaldealid) as ldealid
, xref.VINSought		
from	dbo.FactVehiclePriceChangeNotification pcn
		inner join dbo.Dim_Entity de on pcn.entitykey = de.entitykey
		inner join dbo.DimVehicleSoughtXref x
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
