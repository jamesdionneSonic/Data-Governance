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
extracted_at: 2026-05-09T12:34:14.349Z
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
                   
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
