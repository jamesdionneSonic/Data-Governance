---
name: vw_FixedOpsAvgRunRate
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
CREATE VIEW dbo.vw_FixedOpsAvgRunRate
AS
SELECT        EntDealerLvl1, SUM(FixedOpsGross) / SUM(FixedOpsDaysMonth) AS AvgRunRate
FROM            dbo.DM_FixedOpsAvgRR
GROUP BY EntDealerLvl1

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
