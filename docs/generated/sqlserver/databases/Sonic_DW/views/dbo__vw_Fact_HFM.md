---
name: vw_Fact_HFM
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



CREATE VIEW [dbo].[vw_Fact_HFM]
AS
SELECT        dbo.Fact_HFM.Fact_HFM_Key, dbo.Fact_HFM.DateKey, dbo.Fact_HFM.HFMBrandKey, dbo.Fact_HFM.ScenarioKey, dbo.Fact_HFM.EntityKey, dbo.Fact_HFM.DepartmentKey, dbo.Fact_HFM.AccountMgmtKey, 
                         dbo.Fact_HFM.Amount, dbo.Fact_HFM.StatCount, dbo.Fact_HFM.Meta_SourceSystemName, dbo.Dim_Date.FiscalMonthKey, CAST(dbo.Fact_HFM.ScenarioKey AS varchar(2)) 
                         + '.' + CAST(dbo.Fact_HFM.Fact_HFM_Key AS varchar(50
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
