---
name: vw_Fact_AccountingSummary
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
CREATE VIEW dbo.vw_Fact_AccountingSummary
AS
SELECT        dbo.Fact_AccountingSummary.FactAccountingSummaryKey, dbo.Fact_AccountingSummary.AccountKey, dbo.Fact_AccountingSummary.AccountMgmtKey, dbo.Fact_AccountingSummary.EntityKey, 
                         dbo.Fact_AccountingSummary.FiscalMonthKey, dbo.Fact_AccountingSummary.Amount, dbo.Fact_AccountingSummary.StatCount, 31 AS ScenarioKey, dbo.Fact_AccountingSummary.Meta_SourceSystemName, 
                         CAST(31 AS varchar(2)) + '.
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
