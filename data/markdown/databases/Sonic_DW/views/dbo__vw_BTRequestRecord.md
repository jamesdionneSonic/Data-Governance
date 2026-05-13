---
name: vw_BTRequestRecord
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - BT_RequestsRecord
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

- **dbo.BT_RequestsRecord** (U )

## Columns

| Name              | Type     | Nullable | Description |
| ----------------- | -------- | -------- | ----------- |
| `BTKey`           | int      |          |             |
| `EntityKey`       | int      |          |             |
| `Login`           | nvarchar |          |             |
| `DateKey`         | int      |          |             |
| `SurveyStartTime` | datetime |          |             |
| `GMName`          | nvarchar | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_BTRequestRecord]
AS
SELECT        BTKey, EntityKey, Login, DateKey, SurveyStartTime, GMName
FROM            dbo.BT_RequestsRecord


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
