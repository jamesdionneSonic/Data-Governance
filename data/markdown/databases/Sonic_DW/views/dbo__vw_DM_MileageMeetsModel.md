---
name: vw_DM_MileageMeetsModel
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DM_MileageMeetsModel
dependency_count: 1
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DM_MileageMeetsModel** (U )

## Columns

| Name                  | Type     | Nullable | Description |
| --------------------- | -------- | -------- | ----------- |
| `ModelMeetsMileage`   | int      |          |             |
| `ServiceKey`          | int      |          |             |
| `Meta_SystemLoadDate` | datetime | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_DM_MileageMeetsModel
AS
SELECT        ModelMeetsMileage, ServiceKey, Meta_SystemLoadDate
FROM            dbo.DM_MileageMeetsModel WITH (NOLOCK)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
