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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
