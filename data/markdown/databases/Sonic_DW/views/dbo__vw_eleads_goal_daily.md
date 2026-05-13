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
depends_on:
  - Dim_Date
dependency_count: 1
column_count: 15
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )

## Columns

| Name             | Type    | Nullable | Description |
| ---------------- | ------- | -------- | ----------- |
| `entitykey`      | int     | ✓        |             |
| `dealership`     | varchar | ✓        |             |
| `region`         | varchar | ✓        |             |
| `storebrand`     | varchar | ✓        |             |
| `uptype`         | varchar | ✓        |             |
| `newused`        | varchar | ✓        |             |
| `LeadProvider`   | varchar | ✓        |             |
| `Make`           | varchar | ✓        |             |
| `Model`          | varchar | ✓        |             |
| `FiscalMonthKey` | varchar | ✓        |             |
| `daysinmonth`    | int     | ✓        |             |
| `LeadsTargetCM`  | decimal | ✓        |             |
| `DailyeLeadGoal` | decimal | ✓        |             |
| `fulldate`       | date    |          |             |
| `datekey`        | int     |          |             |

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
  join (  select fulldate,datekey
  from Dim_Date
  where month(fulldate)=month(getdate()) and year(fulldate)=year(getdate()))d
  on 1=1




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
