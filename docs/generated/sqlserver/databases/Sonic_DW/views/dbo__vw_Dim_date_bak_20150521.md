---
name: vw_Dim_date_bak_20150521
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

CREATE VIEW [dbo].[vw_Dim_date_bak_20150521]
AS
SELECT        dbo.Dim_Date.DateKey, dbo.Dim_Date.FullDate, dbo.Dim_Date.MonthNumberOfYear, dbo.Dim_Date.MonthNumberOfQuarter, 
                         dbo.Dim_Date.ISOYearAndWeekNumber, dbo.Dim_Date.ISOWeekNumberOfYear, dbo.Dim_Date.SSWeekNumberOfYear, 
                         dbo.Dim_Date.ISOWeekNumberOfQuarter_454_Pattern, dbo.Dim_Date.SSWeekNumberOfQuarter_454_Pattern, dbo.Dim_Date.SSWeekNumberOfMonth, 
                         dbo.Dim_
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
