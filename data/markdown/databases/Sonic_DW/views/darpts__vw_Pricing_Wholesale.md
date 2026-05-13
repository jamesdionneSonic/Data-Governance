---
name: vw_Pricing_Wholesale
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

CREATE VIEW [darpts].[vw_Pricing_Wholesale]
AS
SELECT [Region_Name]
	,[Vehicle_ID]
	,[Invtr_ID]
	,[Store_Name]
	,[Stock_Type]
	,[Stock_No]
	,[VIN]
	,[UVC]
	,[Year]
	,[Make]
	,[Model]
	,[Trim]
	,[Mileage]
	,[Extr_Color]
	,[Drivetrain]
	,[Transmission]
	,[Age]
	,[Days_on_Lot]
	,[Purchase_Date]
	,[Status_Name]
	,[status_last_changed_date]
	,[status_last_changed_by]
	,[days_in_stat]
	,[group_age]
	,[days_in_stat_group]
	,[Sonic_Buyer]
	,[GL_Balance]
	,[Acquired_Value]
	,[Price]
	,[KBB_Wholesale]
	,[NADA_Trade]
	,[NADA_Retail]
	,[NADA_Valuation_Date]
	,[MMR]
	,[Bad_Carfax]
	,[photo_count]
	,[Manager_Notes]
FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[Pricing_Report_Pend_WS]
WHERE region_name <> 'Tactical'


```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
