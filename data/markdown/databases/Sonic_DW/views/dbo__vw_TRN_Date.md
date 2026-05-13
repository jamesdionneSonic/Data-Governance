---
name: vw_TRN_Date
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - vw_Dim_date
dependency_count: 1
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_Dim_date** (V )

## Columns

| Name         | Type | Nullable | Description |
| ------------ | ---- | -------- | ----------- |
| `DateKey`    | int  |          |             |
| `DATEKEY_LY` | int  | ✓        |             |
| `DATEKEY_LM` | int  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_TRN_Date
AS
SELECT     DateKey, DATEKEY_LY, DATEKEY_LM
FROM         dbo.vw_Dim_date

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
