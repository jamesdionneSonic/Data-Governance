---
name: vw_Dim_TurnoverGroup
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_TurnoverGroup
dependency_count: 1
column_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_TurnoverGroup** (U )

## Columns

| Name                       | Type     | Nullable | Description |
| -------------------------- | -------- | -------- | ----------- |
| `TurnoverGroupKey`         | int      |          |             |
| `ReportNumber`             | int      | ✓        |             |
| `ReportCategoryID`         | int      | ✓        |             |
| `ReportCategory`           | nvarchar | ✓        |             |
| `ReportGroupID`            | int      | ✓        |             |
| `ReportGroup`              | nvarchar | ✓        |             |
| `JobCode`                  | nvarchar | ✓        |             |
| `JobCodeDesc`              | nvarchar | ✓        |             |
| `Company`                  | nvarchar | ✓        |             |
| `JobSort`                  | int      | ✓        |             |
| `ReportCategoryNaturalKey` | varchar  | ✓        |             |
| `ReportGroupNaturalKey`    | varchar  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_TurnoverGroup
AS
SELECT        TurnoverGroupKey, ReportNumber, ReportCategoryID, ReportCategory, ReportGroupID, ReportGroup, JobCode, JobCodeDesc, Company, JobSort, CONVERT(varchar(100), ReportNumber) + '.' + CONVERT(varchar(100),
                         ReportCategoryID) AS ReportCategoryNaturalKey, CONVERT(varchar(100), ReportNumber) + '.' + CONVERT(varchar(100), ReportCategoryID) + '.' + CONVERT(varchar(100), ReportGroupID) AS ReportGroupNaturalKey
FROM            dbo.Dim_TurnoverGroup

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
