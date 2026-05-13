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
depends_on:
  - Dim_Entity
  - DimCustomer
  - DimVehicleSoughtXref
  - FactOpportunity
  - FactVehiclePriceChangeNotification
dependency_count: 5
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.DimCustomer** (U )
- **dbo.DimVehicleSoughtXref** (U )
- **dbo.FactOpportunity** (U )
- **dbo.FactVehiclePriceChangeNotification** (U )

## Columns

| Name                        | Type    | Nullable | Description |
| --------------------------- | ------- | -------- | ----------- |
| `PriceChangeNotificationId` | int     |          |             |
| `ldealid`                   | int     | ✓        |             |
| `VINSought`                 | varchar |          |             |

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
		inner join dbo.DimVehicleSoughtXref xref on pcn.Meta_NaturalKey = xref.VehicleSoughtXrefKey
		inner join dbo.FactOpportunity opp on xref.factopportunitykey = opp.factopportunitykey
		inner join dbo.dimcustomer cus on opp.FocusCustomerKey = cus.customerkey
where	pcn.meta_loaddate >= getdate()-2
		and pcn.activityname = 'Price Change Decrease'
		and pcn.pricechangeamount >= pcn.pricedecreasethreshold
		and pcn.hasbeensent = 0
		and pcn.activitytype = 14 -- email
		and de.entlineofbusiness = 'EchoPark'
		--and coalesce(cus.email1, cus.email2) is not null





```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
