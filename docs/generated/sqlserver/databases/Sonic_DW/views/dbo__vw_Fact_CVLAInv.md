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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
