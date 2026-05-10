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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_DimLeadSource
AS
SELECT        LeadSourceKey, LeadSourceName, StandardLeadSourceID, ETLExecution_ID, Meta_ComputerName, Meta_LoadDate, COALESCE (StandardLeadSourceEPID, - 1) AS StandardLeadSourceEPID, COALESCE (LeadSourceTierEPID, 
                         - 1) AS LeadSourceTierEPID, UpTypeTierEPID, COALESCE (StandardLeadSourcePSID, - 1) AS StandardLeadSourcePSID, COALESCE (LeadSourceTierPSID, - 1) AS LeadSourceTierPSID
FROM            dbo.DimLeadSource

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
