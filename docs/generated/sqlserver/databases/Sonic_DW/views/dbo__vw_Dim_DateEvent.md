---
name: vw_Dim_DateEvent
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE   VIEW [dbo].[vw_Dim_DateEvent]
AS
SELECT [DateEventID]
      ,[EventDescription]
      ,[IsSonic]
      ,[IsEchoPark]
      ,[IsPowersports]
      ,[IsActive]
      ,[Meta_LoadDate]
      ,[Meta_LastModifiedDate]
      ,[Meta_User]
      ,[DateGUID]
  FROM [Sonic_DW].[dbo].[Dim_DateEvent]
UNION ALL
SELECT 0, 'Normal Day', 1, 1, 1, 1, NULL, NULL, 'System', NULL

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
