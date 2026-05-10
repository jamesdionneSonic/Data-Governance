---
name: vw_ServiceAppts_ROType
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

CREATE VIEW [dbo].[vw_ServiceAppts_ROType]
AS
SELECT        D.DEALERSHIP_NAME, D.ENTITY_KEY, M.METRIC_CAPTURE_DATE, CAST(CONVERT(varchar(10), CONVERT(datetime, M.METRIC_CAPTURE_DATE, 126), 112) AS INT) AS METRIC_DATEKEY, MT.METRIC_DESC, 
                         (CASE WHEN [METRIC_DESC] = 'Service Appointment - Warranty Pay - Total' THEN 'Warranty' WHEN [METRIC_DESC] = 'Service Appointment - Customer Pay - Total' THEN 'Customer Pay' WHEN [METRIC_DESC] = 'Service Appointment - Internal Pay -
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
