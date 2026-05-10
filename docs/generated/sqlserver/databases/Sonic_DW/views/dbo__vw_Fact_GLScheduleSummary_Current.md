---
name: vw_Fact_GLScheduleSummary_Current
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql


CREATE VIEW [dbo].[vw_Fact_GLScheduleSummary_Current]
AS
SELECT        glss.GLSchedSummaryKey, glss.CurrentMonthKey, glss.EntityKey, glss.AccountKey, 
                         glss.SchedTypeKey, glss.ControlTypeKey, glss.ExceptionAccountKey, glss.GLSchedSumDegenKey, 
                         glss.ExceptionKey, glss.DoosiKey, glss.DMSCustomerKey, glss.DMSVendorKey, 
                         glss.AssociateKey, glss.VehicleKey, glss.Days_MonthEnd, glss.Amount, 
                         gl
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
