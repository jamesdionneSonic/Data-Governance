---
name: vw_Dim_RRisk_Budget
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


CREATE VIEW [dbo].[vw_Dim_RRisk_Budget]
AS
SELECT * FROM
(SELECT *, ROW_NUMBER() OVER (
        PARTITION BY AccHFMAccount, DepartmentKey, EntityKey
        ORDER BY EntityKey ASC
    ) AS RankByAccHFMAccount
FROM
(SELECT        dbo.Dim_RRisk_ForecastAccounts.store_name, dbo.Dim_RRisk_ForecastAccounts.account_number_dms, dbo.Dim_RRisk_ForecastAccounts.AccountNum, dbo.Dim_RRisk_ForecastAccounts.account_description, 
                         dbo.Dim_RRisk_ForecastAccounts.account_type
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
