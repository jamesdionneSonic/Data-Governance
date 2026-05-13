---
name: DMR_DownPmt_Issues
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
CREATE VIEW [darpts].[DMR_DownPmt_Issues]
AS
SELECT  [Market]
      ,[Deal_Number]
      ,[Cust_No]
      ,[Customer]
      ,[Sold_Date]
      ,[Deal_Status]
      ,[Bank]
      ,[Sales_Person]
      ,[Total_Gross]
      ,[Down_Pmt]
      ,[In_House]
      ,[PNote]
  FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[DMR_DownPmt_Issues]
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
