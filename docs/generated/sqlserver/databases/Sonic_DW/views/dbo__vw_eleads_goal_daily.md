---
name: vw_eleads_goal_daily
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

/****** Script for SelectTopNRows command from SSMS  ******/

CREATE view [dbo].[vw_eleads_goal_daily] as 

SELECT [entitykey]
      ,[dealership]
      ,[region]
      ,[storebrand]
      ,[uptype]
      ,[newused]
      ,[LeadProvider]
      ,[Make]
      ,[Model]
      ,[FiscalMonthKey]
      ,[daysinmonth]
      ,[LeadsTargetCM]
	  ,leadstargetcm/daysinmonth DailyeLeadGoal
	  ,d.fulldate
	  ,d.datekey
  FROM [Sonic_DW].[dbo].[vw_eleads_goals]
  join (  select fulldate,d
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
