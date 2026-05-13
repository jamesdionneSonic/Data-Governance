---
name: vw_Dim_DaysAligned
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_DaysAligned
dependency_count: 1
column_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_DaysAligned** (U )

## Columns

| Name                 | Type     | Nullable | Description |
| -------------------- | -------- | -------- | ----------- |
| `DaysAlignedFullKey` | int      |          |             |
| `DaysAlignedKey`     | smallint |          |             |
| `DaysAlignedDesc`    | varchar  |          |             |
| `FiscalMonth`        | tinyint  |          |             |
| `FiscalYear`         | smallint |          |             |
| `FiscalMonthKey`     | int      |          |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_DaysAligned]
AS
SELECT        dbo.Dim_DaysAligned.*
FROM            dbo.Dim_DaysAligned


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
