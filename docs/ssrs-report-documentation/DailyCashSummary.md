# DailyCashSummary

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/CMA/DailyCashSummary`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report summarizes daily cash activity so Cash Management and accounting users can review store cash movement, spot balance issues, and reconcile activity for a selected business date or dealership scope. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                    |
| Asset type            | Report                                                                                                                                                                                  |
| Native path           | `/CMA/DailyCashSummary`                                                                                                                                                                 |
| Support role          | User-facing report                                                                                                                                                                      |
| Business process      | Use this for Cash Management review when accounting users need transaction detail, daily activity, cash summary, or exception follow-up. The report is filtered by Company, Year Month. |
| Primary source        | /CMA/DataSource/CMA                                                                                                                                                                     |
| Primary target/output | SSRS report output                                                                                                                                                                      |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                               |
| Runtime/usage signal  | 856 executions by 68 users; last used 2026-04-10 10:38:18                                                                                                                               |
| Status signal         | Active                                                                                                                                                                                  |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                        |
| Report name           | `DailyCashSummary`                                                                                                                                                                      |
| Created               | 2014-08-05 09:53:45                                                                                                                                                                     |
| Modified              | 2014-08-05 09:53:45                                                                                                                                                                     |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                      |

## Business Use

Use this for Cash Management review when accounting users need transaction detail, daily activity, cash summary, or exception follow-up. The report is filtered by Company, Year Month.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/CMA/DailyCashSummary`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource     | Connection                   | Credential mode | Enabled |
| ----------------- | --------------------- | ---------------------------- | --------------- | ------- |
| `CMS_DimDate`     | `/CMA/DataSource/CMA` | `Not available from catalog` |                 |         |
| `CMSDatasource1`  | `/CMA/DataSource/CMA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter   | Prompt     | Type   | Notes                                                |
| ----------- | ---------- | ------ | ---------------------------------------------------- |
| `Company`   | Company    | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `YearMonth` | Year Month | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (StoredProcedure): Calls stored procedure `pDailyCashSummaryRpt`.
2. Dataset `DataSet2` (Text): select dlr_dealership from CMS.cmag.tbldealershipinfo order by dlr_dealership
3. Dataset `DataSet3` (Text): select distinct CalendarYearMonth from CMS.dbo.dimDate Where FullDate between '01/01/1990' and Getdate() order by CalendarYearMonth Desc
4. Dataset `DataSet4` (StoredProcedure): Calls stored procedure `cmag.usp_dearlerinfo`.

## Backend Dependencies

| Object or command hint       | Notes                                     |
| ---------------------------- | ----------------------------------------- |
| `pDailyCashSummaryRpt`       | Referenced by one or more report datasets |
| `CMS.cmag.tbldealershipinfo` | Referenced by one or more report datasets |
| `CMS.dbo.dimDate`            | Referenced by one or more report datasets |
| `cmag.usp_dearlerinfo`       | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `StoredProcedure`

```sql
pDailyCashSummaryRpt
```

#### DataSet2

Type: `Text`

```sql
select dlr_dealership from CMS.cmag.tbldealershipinfo order by dlr_dealership
```

#### DataSet3

Type: `Text`

```sql
select distinct CalendarYearMonth from CMS.dbo.dimDate Where FullDate between '01/01/1990' and Getdate()  order by CalendarYearMonth Desc
```

#### DataSet4

Type: `StoredProcedure`

```sql
cmag.usp_dearlerinfo
```
