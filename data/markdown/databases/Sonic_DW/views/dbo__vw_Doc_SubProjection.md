---
name: vw_Doc_SubProjection
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Doc_SubProjection
dependency_count: 1
column_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Doc_SubProjection** (U )

## Columns

| Name                 | Type     | Nullable | Description |
| -------------------- | -------- | -------- | ----------- |
| `DocSubProjectionID` | int      |          |             |
| `EntityKey`          | int      |          |             |
| `DateKey`            | int      |          |             |
| `GroupElementSort`   | int      |          |             |
| `GroupElement`       | varchar  | ✓        |             |
| `GroupSubElement`    | varchar  | ✓        |             |
| `Amount`             | numeric  | ✓        |             |
| `StatCount`          | money    | ✓        |             |
| `MetricTypeKey`      | int      |          |             |
| `ControllerUserID`   | varchar  | ✓        |             |
| `UpdateDate`         | datetime | ✓        |             |
| `DocID`              | int      |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_DOC_SubProjection
AS
SELECT        DocSubProjectionID, EntityKey, DateKey, GroupElementSort, GroupElement, GroupSubElement, Amount, StatCount, MetricTypeKey, ControllerUserID, UpdateDate, DocID
FROM            dbo.Doc_SubProjection WITH (NOLOCK)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
