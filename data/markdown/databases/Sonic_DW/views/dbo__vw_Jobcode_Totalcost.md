---
name: vw_Jobcode_Totalcost
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Jobcode_Totalcost
dependency_count: 1
column_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Jobcode_Totalcost** (U )

## Columns

| Name         | Type     | Nullable | Description |
| ------------ | -------- | -------- | ----------- |
| `JobCode`    | nvarchar |          |             |
| `Total_Cost` | decimal  | ✓        |             |

## Definition

```sql

	CREATE VIEW [dbo].[vw_Jobcode_Totalcost]
AS
SELECT        JobCode, Total_Cost
FROM            dbo.Jobcode_Totalcost

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
