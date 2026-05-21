---
name: vw_FUEL_FORCE
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

CREATE VIEW [dbo].[vw_FUEL_FORCE]
AS
SELECT     A.AccountingDateKey, A.AccountMgmtKey, A.EntityKey, SUM(A.StatCount) AS StatCount, SUM(A.PostingAmount * - 1) AS PostingAmount, 1 AS FORCE_LOAD
FROM         dbo.Fact_AccountingDetail AS A INNER JOIN
                      dbo.Dim_AccountMgmt ON A.AccountMgmtKey = dbo.Dim_AccountMgmt.AccountMgmtKey
WHERE     (dbo.Dim_AccountMgmt.Level4 IN ('Body Shop Cost', 'Parts Cost', 'Service Cost', 'Body Shop Revenue', 'Parts Revenue', 'Service Revenue'))
GROUP BY A.AccountingDateKey, A.AccountMgmtKey, A.EntityKey


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
