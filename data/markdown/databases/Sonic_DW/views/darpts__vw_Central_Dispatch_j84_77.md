---
name: vw_Central_Dispatch_j84_77
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

CREATE VIEW [darpts].[vw_Central_Dispatch_j84_77]
AS
SELECT [company]
      ,[stock_no]
      ,[accountnumber]
      ,[date_84]
      ,[count_84]
      ,[amount_84]
      ,[date_77]
      ,[count_77]
      ,[amount_77]
      ,[Duplicate]
      ,[timeperiod]
      ,[meta_load_date]
  FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[vw_Central_Dispatch_j84_77]

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
