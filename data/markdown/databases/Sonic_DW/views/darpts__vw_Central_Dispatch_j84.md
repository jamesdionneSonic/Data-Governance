---
name: vw_Central_Dispatch_j84
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

CREATE VIEW [darpts].[vw_Central_Dispatch_j84]
AS
SELECT [cora_acct_id]
      ,[companyid]
      ,[accountnumber]
      ,[accountingdate]
      ,[AccDateKey]
      ,[control]
      ,[control2]
      ,[detaildescription]
      ,[journalid]
      ,[postingamount]
      ,[statcount]
      ,[src_Meta_LoadDate]
      ,[meta_load_date]
  FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[vw_Central_Dispatch_j84]

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
