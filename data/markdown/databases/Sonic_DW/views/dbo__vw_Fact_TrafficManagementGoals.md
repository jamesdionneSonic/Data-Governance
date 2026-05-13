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
depends_on:
  - Fact_TrafficManagementGoals
dependency_count: 1
column_count: 16
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Fact_TrafficManagementGoals** (U )

## Columns

| Name                     | Type     | Nullable | Description |
| ------------------------ | -------- | -------- | ----------- |
| `TMGoalsKey`             | int      |          |             |
| `LineOfBusiness`         | varchar  | ✓        |             |
| `Brand`                  | varchar  | ✓        |             |
| `MetricName`             | varchar  | ✓        |             |
| `szUpType`               | varchar  | ✓        |             |
| `GEC`                    | varchar  | ✓        |             |
| `GECVehClass`            | varchar  | ✓        |             |
| `Meta_UserID`            | varchar  |          |             |
| `Meta_RowLastChangeDate` | datetime |          |             |
| `YellowBandManual`       | numeric  | ✓        |             |
| `RedBandManual`          | numeric  | ✓        |             |
| `YellowBandCalc`         | numeric  | ✓        |             |
| `RedBandCalc`            | numeric  | ✓        |             |
| `GreenBand`              | numeric  | ✓        |             |
| `YellowBand`             | numeric  | ✓        |             |
| `RedBand`                | numeric  | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
