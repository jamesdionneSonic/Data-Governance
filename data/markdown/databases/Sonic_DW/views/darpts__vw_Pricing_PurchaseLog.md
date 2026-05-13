---
name: vw_Pricing_PurchaseLog
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Definition

```sql

CREATE VIEW [darpts].[vw_Pricing_PurchaseLog]
AS
SELECT [RECEIVING_MARKET]
	,[ENTRY]
	,[VIN]
	,[STK_NBR]
	,[YR]
	,[MAKE]
	,[MODEL]
	,[TRIM]
	,[DT]
	,[PURCHASING_DEALER]
	,[BUYER]
	,[SOURCE]
	,[AUCTION_VEHICLE_LOCATION]
	,[Meta_File_Date]
FROM [D1-DASQL-01,11010].DA_Group.rpt.Pricing_Report_Not_In_SIMS


```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
