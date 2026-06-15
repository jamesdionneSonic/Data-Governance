# Copy of WeekendAppts

Generated: 2026-06-15  
SSRS path: `/BI - Retail Strategy/Copy of WeekendAppts`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the BI - Retail Strategy reporting area. It retrieves data through embedded report dataset queries and presents the result as the Copy of WeekendAppts report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `Copy of WeekendAppts`                           |
| SSRS path           | `/BI - Retail Strategy/Copy of WeekendAppts`     |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2016-05-04 10:42:25                              |
| Modified            | 2018-07-20 16:42:33                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource                              | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------------------- | ---------------------------- | --------------- | ------- |
| `eLeads`          | `/BI - Retail Strategy/DataSource/eLeadDW_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt | Type   | Notes                                                |
| --------- | ------ | ------ | ---------------------------------------------------- |
| `Region`  | Region | String | Nullable: NULL; Allow blank: NULL; Multi-value: true |

## Data Logic

1. Dataset `Regions` (Text): select distinct e.entregion region from [cho-lab-01a\choa2008r2].sonic_dw.dbo.dim_entity e where e.entregion not in ('NotSonicRegion','SouthernCALMidwest','UKN')
2. Dataset `WeekendAppts` (Text): select entregion,subregion entsubregion,entdealerlvl1, lCompanyID,Friday ,Saturday, Sunday,Friday +Saturday+ Sunday as Total from vw_WeeklyAppointments_de a where entregion not in ('SouthernCALMidwest','NotSonicRegion') and entregion in (@Region)

## Backend Dependencies

| Object or command hint     | Notes                                     |
| -------------------------- | ----------------------------------------- |
| `cho-lab-01a`              | Referenced by one or more report datasets |
| `vw_WeeklyAppointments_de` | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/Copy of WeekendAppts`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### Regions

Type: `Text`

```sql
select distinct e.entregion region from  [cho-lab-01a\choa2008r2].sonic_dw.dbo.dim_entity e where e.entregion not in ('NotSonicRegion','SouthernCALMidwest','UKN')
```

#### WeekendAppts

Type: `Text`

```sql
select entregion,subregion entsubregion,entdealerlvl1, lCompanyID,Friday ,Saturday, Sunday,Friday +Saturday+ Sunday as Total from vw_WeeklyAppointments_de a where entregion not in ('SouthernCALMidwest','NotSonicRegion') and entregion in (@Region)
```
