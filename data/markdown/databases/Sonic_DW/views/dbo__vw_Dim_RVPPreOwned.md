---
name: vw_Dim_RVPPreOwned
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Entity
dependency_count: 1
column_count: 1
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )

## Columns

| Name        | Type    | Nullable | Description |
| ----------- | ------- | -------- | ----------- |
| `EntRegion` | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_RVPPreOwned
AS
SELECT        EntRegion
FROM            dbo.Dim_Entity
WHERE        (EntActive = 'Active') AND (EntLineOfBusiness = 'EchoPark') OR
                         (EntLineOfBusiness = 'Driversselect')
GROUP BY EntRegion

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
