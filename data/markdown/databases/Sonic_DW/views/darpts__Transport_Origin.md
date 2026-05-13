---
name: Transport_Origin
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





CREATE VIEW [darpts].[Transport_Origin]
AS
SELECT  [entry]
      ,[vin]
      ,[vendor]
      ,[status]
      ,[destination_name]
      ,[origin_name]
      ,[Auction_Vehicle_Location]
      ,[buyer]
  FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[Transport_Origin]





```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
