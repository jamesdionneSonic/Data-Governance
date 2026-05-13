---
name: vw_Fact_CVLAInv
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DM_CVLAInv
dependency_count: 1
column_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DM_CVLAInv** (U )

## Columns

| Name            | Type    | Nullable | Description |
| --------------- | ------- | -------- | ----------- |
| `hostitemid`    | varchar | ✓        |             |
| `cora_acct_id`  | int     | ✓        |             |
| `mileage`       | int     | ✓        |             |
| `vehVIN`        | varchar | ✓        |             |
| `EntityKey`     | int     | ✓        |             |
| `CVLAInvKey`    | varchar | ✓        |             |
| `UnitStatus`    | varchar | ✓        |             |
| `VehLoanerStat` | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Fact_CVLAInv
AS
SELECT        hostitemid, cora_acct_id, try_cast(mileagev AS INT) AS mileage, CAST(vin AS varchar(17)) AS vehVIN, EntityKey, Right(VIN,8) + '.' + CAST(cora_acct_id AS varchar(10)) AS CVLAInvKey, CAST(unitstatus AS varchar(5))
                         AS UnitStatus, CAST(vehloanerstat AS varchar(15)) AS VehLoanerStat
FROM            dbo.DM_CVLAInv
WHERE vin IS NOT NULL

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
