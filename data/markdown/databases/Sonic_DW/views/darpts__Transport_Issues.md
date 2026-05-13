---
name: Transport_Issues
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




CREATE VIEW [darpts].[Transport_Issues]
AS
SELECT  [Correct_Row]
      ,[Vendor]
      ,[VIN]
      ,[Status]
      ,[load_log_at]
      ,[origin_name]
      ,[destination_name]
      ,[destination_city]
      ,[year]
      ,[make]
      ,[model]
      ,[pickup_date]
      ,[eta_date]
      ,[Metro_Age]
      ,[buyer]
  FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[Transport_Issues]




```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
