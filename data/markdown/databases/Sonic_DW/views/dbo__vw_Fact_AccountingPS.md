---
name: vw_Fact_AccountingPS
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_PowersportCMF2Entity
  - Fact_AccountingPS
dependency_count: 2
column_count: 16
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_PowersportCMF2Entity** (U )
- **dbo.Fact_AccountingPS** (U )

## Columns

| Name                 | Type      | Nullable | Description |
| -------------------- | --------- | -------- | ----------- |
| `AccountingPSKey`    | varchar   |          |             |
| `Dealership`         | nvarchar  | ✓        |             |
| `CMFID`              | int       | ✓        |             |
| `AcctCode`           | varchar   | ✓        |             |
| `DeptCode`           | int       | ✓        |             |
| `DebitCredit`        | varchar   | ✓        |             |
| `ConsAcctNum`        | varchar   | ✓        |             |
| `FiscalYear`         | int       | ✓        |             |
| `MonthKey`           | int       | ✓        |             |
| `Amount`             | decimal   | ✓        |             |
| `ValidFrom`          | datetime2 |          |             |
| `ValidTo`            | datetime2 |          |             |
| `EntityKey`          | int       |          |             |
| `SIMSDealershipName` | varchar   | ✓        |             |
| `AmountDisplay`      | decimal   | ✓        |             |
| `DateKey`            | char      | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Fact_AccountingPS
AS
SELECT        dbo.Fact_AccountingPS.AccountingPSKey, dbo.Fact_AccountingPS.Dealership, dbo.Fact_AccountingPS.CMFID, dbo.Fact_AccountingPS.AcctCode, dbo.Fact_AccountingPS.DeptCode, dbo.Fact_AccountingPS.DebitCredit,
                         dbo.Fact_AccountingPS.ConsAcctNum, dbo.Fact_AccountingPS.FiscalYear, dbo.Fact_AccountingPS.MonthKey, dbo.Fact_AccountingPS.Amount, dbo.Fact_AccountingPS.ValidFrom, dbo.Fact_AccountingPS.ValidTo,
                         dbo.Dim_PowersportCMF2Entity.EntityKey, dbo.Dim_PowersportCMF2Entity.SIMSDealershipName, CASE WHEN DebitCredit = 'Debit' THEN Amount * - 1 ELSE Amount END AS AmountDisplay, CONVERT(CHAR(8),
                         DATEFROMPARTS(dbo.Fact_AccountingPS.FiscalYear, dbo.Fact_AccountingPS.MonthKey, 1), 112) AS DateKey
FROM            dbo.Fact_AccountingPS INNER JOIN
                         dbo.Dim_PowersportCMF2Entity ON dbo.Fact_AccountingPS.CMFID = dbo.Dim_PowersportCMF2Entity.CMFID

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
