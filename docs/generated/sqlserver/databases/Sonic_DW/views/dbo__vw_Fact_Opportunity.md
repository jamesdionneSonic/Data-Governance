---
name: vw_Fact_Opportunity
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

CREATE VIEW [dbo].[vw_Fact_Opportunity]
AS
SELECT        O.EntityKey, O.SourceKey, O.DateProspectInKey, O.LastActivityDateKey, O.DateSoldKey, O.InactiveDateKey, O.VehicleKey, O.TradeInVehicleKey, O.LeadStatusKey, O.DealTypeKey, O.NewVehicleFlag, 
                         O.LeadCount, O.DuplicateLeadCount, O.LeadCost, O.DaysActive, O.SoldCount, O.ApptShowCount, O.ApptNoShowCount, O.ApptSetCount, O.ApptSoldCount, O.PhoneCallCount, O.CompletedActivityCount, 
                         O.FutureA
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
