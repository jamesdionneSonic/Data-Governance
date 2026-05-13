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
depends_on: []
dependency_count: 0
column_count: 10
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name                    | Type     | Nullable | Description |
| ----------------------- | -------- | -------- | ----------- |
| `DateEventID`           | int      |          |             |
| `EventDescription`      | varchar  | ✓        |             |
| `IsSonic`               | int      | ✓        |             |
| `IsEchoPark`            | int      | ✓        |             |
| `IsPowersports`         | int      | ✓        |             |
| `IsActive`              | int      |          |             |
| `Meta_LoadDate`         | datetime | ✓        |             |
| `Meta_LastModifiedDate` | datetime | ✓        |             |
| `Meta_User`             | varchar  | ✓        |             |
| `DateGUID`              | varchar  | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
