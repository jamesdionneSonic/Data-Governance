---
name: vw_DimLeadSubSource
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DimLeadSubSource
dependency_count: 1
column_count: 9
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimLeadSubSource** (U )

## Columns

| Name                  | Type     | Nullable | Description |
| --------------------- | -------- | -------- | ----------- |
| `LeadSubSourceKey`    | int      |          |             |
| `LeadSubSourceName`   | varchar  |          |             |
| `eLeadSubSourceID`    | int      |          |             |
| `eLeadChildCompanyID` | int      |          |             |
| `ETLExecution_ID`     | int      |          |             |
| `Meta_ComputerName`   | varchar  |          |             |
| `Meta_LoadDate`       | datetime |          |             |
| `Meta_Naturalkey`     | varchar  |          |             |
| `MaxLeadSubSourceKey` | int      |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_DimLeadSubSource
AS
SELECT        ss.LeadSubSourceKey, CASE WHEN ss.LeadSubSourceName = 'Unknown' THEN 'No Sub-Source' ELSE ss.LeadSubSourceName END AS LeadSubSourceName, ss.eLeadSubSourceID, ss.eLeadChildCompanyID,
                         ss.ETLExecution_ID, ss.Meta_ComputerName, ss.Meta_LoadDate, ss.Meta_Naturalkey, ISNULL(m.MaxLeadSubSourceKey, - 1) AS MaxLeadSubSourceKey
FROM            dbo.DimLeadSubSource AS ss LEFT OUTER JOIN
                             (SELECT DISTINCT MAX(eLeadSubSourceID) AS MaxLeadSubSourceKey, LeadSubSourceName
                               FROM            dbo.DimLeadSubSource
                               GROUP BY LeadSubSourceName) AS m ON ss.LeadSubSourceName = m.LeadSubSourceName

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
