---
name: vw_Doc_UnionPS
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - vw_Dim_date
  - vw_Doc_ActualPS
  - vw_Doc_BudgetPS
  - vw_Doc_ProjectionPS
dependency_count: 4
column_count: 28
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_Dim_date** (V )
- **dbo.vw_Doc_ActualPS** (V )
- **dbo.vw_Doc_BudgetPS** (V )
- **dbo.vw_Doc_ProjectionPS** (V )

## Columns

| Name                   | Type    | Nullable | Description |
| ---------------------- | ------- | -------- | ----------- |
| `EntityKey`            | int     |          |             |
| `DateKey`              | int     | ✓        |             |
| `GroupElementSort`     | int     |          |             |
| `GroupElement`         | varchar | ✓        |             |
| `GroupSubElement`      | varchar | ✓        |             |
| `Amount`               | numeric | ✓        |             |
| `StatCount`            | money   | ✓        |             |
| `MetricTypeKey`        | int     |          |             |
| `DocActiveDate`        | int     | ✓        |             |
| `DocLYDate`            | int     | ✓        |             |
| `FiscalMonthKeyLY`     | int     | ✓        |             |
| `DocTableID`           | varchar | ✓        |             |
| `FOpsDaysMonth`        | int     | ✓        |             |
| `VOpsDaysMonth`        | int     | ✓        |             |
| `DaysAlignedFullKey`   | int     | ✓        |             |
| `AmountFinalized`      | numeric | ✓        |             |
| `AmountBooked`         | numeric | ✓        |             |
| `AmountBudget`         | numeric | ✓        |             |
| `AmountProjection`     | numeric | ✓        |             |
| `AmountActuals`        | numeric | ✓        |             |
| `DOCMonthKey`          | int     | ✓        |             |
| `StatCountFinalized`   | money   | ✓        |             |
| `StatCountBooked`      | money   | ✓        |             |
| `StatCountBudget`      | money   | ✓        |             |
| `StatCountProjection`  | money   | ✓        |             |
| `StatCountActuals`     | money   | ✓        |             |
| `PowersportsDaysMonth` | int     | ✓        |             |
| `FiscalMonthKey`       | int     | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Doc_UnionPS
AS
SELECT        U.EntityKey, U.DateKey, U.GroupElementSort, U.GroupElement, U.GroupSubElement, U.Amount, U.StatCount, U.MetricTypeKey, U.DocActiveDate, U.DocLYDate, U.FiscalMonthKeyLY, U.DocTableID, D.FOpsDaysMonth,
                         D.VOpsDaysMonth, CAST(CAST(D.FiscalMonthKey AS char(6)) + CAST(CAST(CEILING(CAST(D.DayNumberOfMonth AS FLOAT) / 7) AS char(1)) + CAST(D.DayNumberOfWeek_Sun_Start AS char(1)) AS Char(2)) AS INT)
                         AS DaysAlignedFullKey, (CASE WHEN MetricTypeKey = 1 THEN Amount ELSE 0 END) AS AmountFinalized, (CASE WHEN MetricTypeKey = 2 THEN Amount ELSE 0 END) AS AmountBooked,
                         (CASE WHEN MetricTypeKey = 3 THEN Amount ELSE 0 END) AS AmountBudget, (CASE WHEN MetricTypeKey = 4 THEN Amount ELSE 0 END) AS AmountProjection, (CASE WHEN MetricTypeKey <= 2 THEN Amount ELSE 0 END)
                         AS AmountActuals, U.DOCMonthKey, (CASE WHEN MetricTypeKey = 1 THEN StatCount ELSE 0 END) AS StatCountFinalized, (CASE WHEN MetricTypeKey = 2 THEN StatCount ELSE 0 END) AS StatCountBooked,
                         (CASE WHEN MetricTypeKey = 3 THEN StatCount ELSE 0 END) AS StatCountBudget, (CASE WHEN MetricTypeKey = 4 THEN StatCount ELSE 0 END) AS StatCountProjection,
                         (CASE WHEN MetricTypeKey <= 2 THEN StatCount ELSE 0 END) AS StatCountActuals, D.PowersportsDaysMonth, D.FiscalMonthKey
FROM            (SELECT        EntityKey, DateKey, GroupElementSort, GroupElement, GroupSubElement, Amount, StatCount, MetricTypeKey, DocActiveDate, DocLYDate, FiscalMonthKeyLY, DocTableID, DOCMonthKey
                          FROM            dbo.vw_Doc_ActualPS
                          UNION ALL
                          SELECT        EntityKey, DateKey, GroupElementSort, GroupElement, GroupSubElement, Amount, StatCount, MetricTypeKey, DocActiveDate, DocLYDate, FiscalMonthKeyLY, DocTableID, DOCMonthKey
                          FROM            dbo.vw_Doc_BudgetPS
                          UNION ALL
                          SELECT        EntityKey, DateKey, GroupElementSort, GroupElement, GroupSubElement, Amount, StatCount, MetricTypeKey, DocActiveDate, DocLYDate, FiscalMonthKeyLY, DocTableID, DOCMonthKey
                          FROM            dbo.vw_Doc_ProjectionPS WITH (NOLOCK)) AS U INNER JOIN
                         dbo.vw_Dim_date AS D ON U.DateKey = D.DateKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
