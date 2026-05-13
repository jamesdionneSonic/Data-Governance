---
name: vw_DimLeadSource
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DimLeadSource
dependency_count: 1
column_count: 11
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimLeadSource** (U )

## Columns

| Name                     | Type     | Nullable | Description |
| ------------------------ | -------- | -------- | ----------- |
| `LeadSourceKey`          | int      |          |             |
| `LeadSourceName`         | varchar  |          |             |
| `StandardLeadSourceID`   | int      |          |             |
| `ETLExecution_ID`        | int      |          |             |
| `Meta_ComputerName`      | varchar  |          |             |
| `Meta_LoadDate`          | datetime |          |             |
| `StandardLeadSourceEPID` | int      |          |             |
| `LeadSourceTierEPID`     | int      | ✓        |             |
| `UpTypeTierEPID`         | int      | ✓        |             |
| `StandardLeadSourcePSID` | int      | ✓        |             |
| `LeadSourceTierPSID`     | int      | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_DimLeadSource
AS
SELECT        LeadSourceKey, LeadSourceName, StandardLeadSourceID, ETLExecution_ID, Meta_ComputerName, Meta_LoadDate, COALESCE (StandardLeadSourceEPID, - 1) AS StandardLeadSourceEPID, COALESCE (LeadSourceTierEPID,
                         - 1) AS LeadSourceTierEPID, UpTypeTierEPID, COALESCE (StandardLeadSourcePSID, - 1) AS StandardLeadSourcePSID, COALESCE (LeadSourceTierPSID, - 1) AS LeadSourceTierPSID
FROM            dbo.DimLeadSource

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
