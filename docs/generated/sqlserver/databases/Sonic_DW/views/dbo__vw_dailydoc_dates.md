---
name: vw_dailydoc_dates
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
CREATE view [dbo].[vw_dailydoc_dates] as
SELECT
a11.DateKey  DateKey, a11.FullDate FullDate, a11.DateKey  DummyDate
FROM
vw_Dim_date	a11, dbo.vw_dailydoc_start_date a12,dbo.vw_dailydoc_end_date A13
WHERE
a11.[FullDate] BETWEEN a12.[FullFirstDate] AND a13.[FullLastDate]

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
