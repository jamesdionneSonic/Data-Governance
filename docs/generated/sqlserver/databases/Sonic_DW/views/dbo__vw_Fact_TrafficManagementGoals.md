---
name: vw_Fact_TrafficManagementGoals
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
CREATE   VIEW [dbo].[vw_Fact_TrafficManagementGoals]
AS
SELECT        TMGoalsKey,LineOfBusiness,Brand, MetricName, szUpType, GEC, GECVehClass, Meta_UserID, Meta_RowLastChangeDate, YellowBandManual, RedBandManual, YellowBandCalc, RedBandCalc, GreenBand, ISNULL(YellowBandManual, 
                         YellowBandCalc) AS YellowBand, ISNULL(RedBandManual, RedBandCalc) AS RedBand
FROM            (SELECT        TMGoalsKey,LineOfBusiness,Brand, MetricName, szUpType, GEC, GECVehClass, GreenBand, 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
