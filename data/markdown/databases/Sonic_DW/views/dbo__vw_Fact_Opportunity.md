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
depends_on:
  - Dim_Date
  - FactOpportunity
dependency_count: 2
column_count: 47
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.FactOpportunity** (U )

## Columns

| Name                       | Type     | Nullable | Description |
| -------------------------- | -------- | -------- | ----------- |
| `EntityKey`                | int      |          |             |
| `SourceKey`                | int      |          |             |
| `DateProspectInKey`        | int      |          |             |
| `LastActivityDateKey`      | int      |          |             |
| `DateSoldKey`              | int      |          |             |
| `InactiveDateKey`          | int      |          |             |
| `VehicleKey`               | int      |          |             |
| `TradeInVehicleKey`        | int      |          |             |
| `LeadStatusKey`            | int      |          |             |
| `DealTypeKey`              | int      |          |             |
| `NewVehicleFlag`           | smallint |          |             |
| `LeadCount`                | int      | ✓        |             |
| `DuplicateLeadCount`       | int      | ✓        |             |
| `LeadCost`                 | float    |          |             |
| `DaysActive`               | int      | ✓        |             |
| `SoldCount`                | int      |          |             |
| `ApptShowCount`            | int      | ✓        |             |
| `ApptNoShowCount`          | int      | ✓        |             |
| `ApptSetCount`             | int      | ✓        |             |
| `ApptSoldCount`            | int      | ✓        |             |
| `PhoneCallCount`           | int      | ✓        |             |
| `CompletedActivityCount`   | int      | ✓        |             |
| `FutureActivityCount`      | int      | ✓        |             |
| `InShowRoomFlag`           | smallint | ✓        |             |
| `BeBackFlag`               | smallint | ✓        |             |
| `ActivityCount`            | int      | ✓        |             |
| `NewProspectFlag`          | smallint | ✓        |             |
| `AgentID`                  | int      |          |             |
| `FactOpportunityKey`       | bigint   |          |             |
| `LastActivityTimeKey`      | int      |          |             |
| `DMSDateSoldKey`           | int      |          |             |
| `DMSSoldCount`             | int      |          |             |
| `TotalSurveyCount`         | int      | ✓        |             |
| `TotalSurveySoldCount`     | int      | ✓        |             |
| `FocusCustomerKey`         | bigint   |          |             |
| `PrimarySalesAssociateKey` | int      |          |             |
| `TradeinCount`             | int      | ✓        |             |
| `IncompleteActivityCount`  | int      | ✓        |             |
| `EmailSentCount`           | int      | ✓        |             |
| `DaysToFirstAppt`          | int      | ✓        |             |
| `OpportunityDateKey`       | int      |          |             |
| `DemoFlag`                 | int      | ✓        |             |
| `WriteUpFlag`              | int      | ✓        |             |
| `TOFlag`                   | int      | ✓        |             |
| `ApptIsConfirmedFlag`      | int      | ✓        |             |
| `LeadState`                | varchar  | ✓        |             |
| `LeadAge`                  | int      | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_Opportunity]
AS
SELECT        O.EntityKey, O.SourceKey, O.DateProspectInKey, O.LastActivityDateKey, O.DateSoldKey, O.InactiveDateKey, O.VehicleKey, O.TradeInVehicleKey, O.LeadStatusKey, O.DealTypeKey, O.NewVehicleFlag,
                         O.LeadCount, O.DuplicateLeadCount, O.LeadCost, O.DaysActive, O.SoldCount, O.ApptShowCount, O.ApptNoShowCount, O.ApptSetCount, O.ApptSoldCount, O.PhoneCallCount, O.CompletedActivityCount,
                         O.FutureActivityCount, O.InShowRoomFlag, O.BeBackFlag, O.ActivityCount, O.NewProspectFlag, - 1 AS AgentID, O.FactOpportunityKey, O.LastActivityTimeKey, O.DMSDateSoldKey, O.DMSSoldCount,
                         O.TotalSurveyCount, O.TotalSurveySoldCount, O.FocusCustomerKey, O.PrimarySalesAssociateKey, O.TradeinCount, O.IncompleteActivityCount, O.EmailSentCount, O.DaysToFirstAppt,
                         CASE WHEN DMSDateSoldKey = 19000101 THEN DateProspectInKey ELSE DMSDateSoldKey END AS OpportunityDateKey, O.DemoFlag, O.WriteUpFlag, O.TOFlag, O.ApptIsConfirmedFlag, O.LeadState,
                         DATEDIFF(d, P.FullDate, GETDATE()) AS LeadAge
FROM            dbo.FactOpportunity AS O INNER JOIN
                         dbo.Dim_Date AS P ON O.DateProspectInKey = P.DateKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
