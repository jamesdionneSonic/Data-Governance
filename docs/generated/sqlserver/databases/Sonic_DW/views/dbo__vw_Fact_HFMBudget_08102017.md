---
name: vw_Fact_HFMBudget_08102017
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
CREATE VIEW dbo.vw_Fact_HFMBudget
AS
SELECT        Fact_HFM_Key, DateKey, HFMBrandKey, EntityKey, DepartmentKey, AccountMgmtKey, Amount, StatCount, Meta_Src_Sys_ID
FROM            dbo.Fact_HFM
WHERE        (ScenarioKey = 7)

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
