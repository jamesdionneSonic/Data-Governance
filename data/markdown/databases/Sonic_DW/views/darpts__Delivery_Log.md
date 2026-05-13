---
name: Delivery_Log
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
CREATE VIEW [darpts].[Delivery_Log]
AS
SELECT  [Sold]
      ,[Delivered]
      ,[DEAL_NO]
      ,[Customer_Name]
      ,[STK#]
      ,[UNIT]
      ,[BANK]
      ,[FRONT]
      ,[BACK]
      ,[TOTAL]
      ,[E]
      ,[G]
      ,[D]
      ,[P]
      ,[TRADE]
      ,[F]
      ,[SENT]
      ,[DATE_FUNDED]
      ,[EXPERIENCE_GUIDE]
      ,[FileName]
      ,[Meta_File_Date]
      ,[Meta_Load_Date]
      ,[MetaComputerName]
      ,[MetaUserId]
      ,[ETLExecutionID]
  FROM [D1-DASQL-01,11010].[DA_Group].[dbo].[Delivery_Log]
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
