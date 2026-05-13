---
name: vw_HiringProcess_Slides
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - HiringProcess_Slides
dependency_count: 1
column_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.HiringProcess_Slides** (U )

## Columns

| Name                      | Type    | Nullable | Description |
| ------------------------- | ------- | -------- | ----------- |
| `Hire_ID`                 | int     |          |             |
| `Hire_SlideNum`           | int     | ✓        |             |
| `Hire_SlideCategory`      | varchar | ✓        |             |
| `Hire_SlideCategoryOrder` | int     | ✓        |             |
| `Hire_SlideDesc`          | varchar | ✓        |             |
| `Hire_SlideLocation`      | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_HiringProcess_Slides
AS
SELECT        Hire_ID, Hire_SlideNum, Hire_SlideCategory, Hire_SlideCategoryOrder, Hire_SlideDesc, '\images\shared\hiring\slides\slide' + CAST(Hire_SlideNum AS varchar(10)) + '.jpg' AS Hire_SlideLocation
FROM            dbo.HiringProcess_Slides

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
