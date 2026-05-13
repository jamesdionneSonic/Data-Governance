---
name: vw_Dim_TableName
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_StepSource
dependency_count: 1
column_count: 1
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_StepSource** (U )

## Columns

| Name        | Type    | Nullable | Description |
| ----------- | ------- | -------- | ----------- |
| `TableName` | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW [dbo].[vw_Dim_TableName]
AS
SELECT     LOWER(SourceName) AS TableName
FROM         dbo.Dim_StepSource
GROUP BY LOWER(SourceName)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
