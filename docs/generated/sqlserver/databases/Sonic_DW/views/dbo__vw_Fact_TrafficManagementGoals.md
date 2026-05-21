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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
FROM            (SELECT        TMGoalsKey,LineOfBusiness,Brand, MetricName, szUpType, GEC, GECVehClass, GreenBand, YellowBand AS YellowBandManual, RedBand AS RedBandManual, Meta_UserID, Meta_RowLastChangeDate, ROUND(GreenBand * .8, 2)
                                                    AS YellowBandCalc, ROUND(GreenBand * .8, 2) - .01 AS RedBandCalc
                          FROM            dbo.Fact_TrafficManagementGoals) AS tmg

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
