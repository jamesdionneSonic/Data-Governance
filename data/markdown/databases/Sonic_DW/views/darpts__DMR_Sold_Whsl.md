---
name: DMR_Sold_Whsl
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

CREATE  VIEW [darpts].[DMR_Sold_Whsl]
AS
SELECT w.[Region_Name]
,w.[Store_Name]
,w.[DealNumber]
,w.[Stock_No]
,w.[VIN]
,w.[TotalGross]
,w.[Purchase_Date]
,w.[Sold_Date]
,w.[Meta_Load_Date]
,w.[Curr_Store_ID]
,d.entitykey
FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[DMR_Sold_Whsl] w
join sonic_dw.dbo.vw_dim_entityep d
on w.curr_store_id=d.entsimsstoreid



```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
