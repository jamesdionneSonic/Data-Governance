---
name: vw_FUEL_FORCE
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_AccountMgmt
  - Fact_AccountingDetail
dependency_count: 2
column_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_AccountMgmt** (U )
- **dbo.Fact_AccountingDetail** (U )

## Columns

| Name                | Type  | Nullable | Description |
| ------------------- | ----- | -------- | ----------- |
| `AccountingDateKey` | int   |          |             |
| `AccountMgmtKey`    | int   | ✓        |             |
| `EntityKey`         | int   |          |             |
| `StatCount`         | int   | ✓        |             |
| `PostingAmount`     | money | ✓        |             |
| `FORCE_LOAD`        | int   |          |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_FUEL_FORCE]
AS
SELECT     A.AccountingDateKey, A.AccountMgmtKey, A.EntityKey, SUM(A.StatCount) AS StatCount, SUM(A.PostingAmount * - 1) AS PostingAmount, 1 AS FORCE_LOAD
FROM         dbo.Fact_AccountingDetail AS A INNER JOIN
                      dbo.Dim_AccountMgmt ON A.AccountMgmtKey = dbo.Dim_AccountMgmt.AccountMgmtKey
WHERE     (dbo.Dim_AccountMgmt.Level4 IN ('Body Shop Cost', 'Parts Cost', 'Service Cost', 'Body Shop Revenue', 'Parts Revenue', 'Service Revenue'))
GROUP BY A.AccountingDateKey, A.AccountMgmtKey, A.EntityKey


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
