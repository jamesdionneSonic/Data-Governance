---
name: vw_Fact_CVLALoaner
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

2- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Fact_CVLALoaner
AS
SELECT        ISNULL(C.hostitemid, '') + '.' + CAST(C.cora_acct_id AS varchar(10)) AS CVLALoanerKey, C.rostatus, C.agmtno, C.customername, C.custnum, C.fuelin, C.fuelout, C.loaneddate2, C.loanedtime, C.hostitemid, C.cora_acct_id, 
                         C.odomin, C.odomout, C.ro AS RONumber, C.returneddate2, C.returnedtime, C.VIN AS vehVIN, CASE WHEN c.EntityKey = 170 THEN 401 ELSE c.EntityKey END AS EntityKey, e.EntDealerLvl1, DATEDIFF(dd, C.loaneddate
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
