# WeekendApptsOld

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Retail Strategy/WeekendApptsOld`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the BI - Retail Strategy reporting area. It retrieves data through embedded report dataset queries and presents the result as the WeekendApptsOld report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                                                                                         |
| Asset type            | Report                                                                                                                                                                                                                                                                                                                       |
| Native path           | `/BI - Retail Strategy/WeekendApptsOld`                                                                                                                                                                                                                                                                                      |
| Support role          | Review candidate report                                                                                                                                                                                                                                                                                                      |
| Business process      | Use this report for BI - Retail Strategy business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Region. It reads or calls cho-lab-01a, vw_WeeklyAppointments_de, so support should validate those sources when results look wrong. |
| Primary source        | /BI - Retail Strategy/DataSource/eLeadDW_DWA                                                                                                                                                                                                                                                                                 |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                                                                                           |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                                                                                                    |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                                                                                                                                 |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                                                                                                                             |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                                                                             |
| Report name           | `WeekendApptsOld`                                                                                                                                                                                                                                                                                                            |
| Created               | 2016-05-04 10:42:33                                                                                                                                                                                                                                                                                                          |
| Modified              | 2018-07-20 16:42:40                                                                                                                                                                                                                                                                                                          |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                                                                                                                                           |

## Business Use

Use this report for BI - Retail Strategy business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Region. It reads or calls cho-lab-01a, vw_WeeklyAppointments_de, so support should validate those sources when results look wrong.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/WeekendApptsOld`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

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
2. Dataset `WeekendAppts` (Text): select entregion,entdealerlvl1, lCompanyID,Friday ,Saturday, Sunday,Friday +Saturday+ Sunday as Total from vw_WeeklyAppointments_de a where entregion not in ('SouthernCALMidwest','NotSonicRegion') and entregion in (@Region)

## Backend Dependencies

| Object or command hint     | Notes                                     |
| -------------------------- | ----------------------------------------- |
| `cho-lab-01a`              | Referenced by one or more report datasets |
| `vw_WeeklyAppointments_de` | Referenced by one or more report datasets |

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
select entregion,entdealerlvl1, lCompanyID,Friday ,Saturday, Sunday,Friday +Saturday+ Sunday as Total from vw_WeeklyAppointments_de a where entregion not in ('SouthernCALMidwest','NotSonicRegion') and entregion in (@Region)
```
