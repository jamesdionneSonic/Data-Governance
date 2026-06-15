# DailyCashSummary_TEST

Generated: 2026-06-15  
SSRS path: `/Test/DailyCashSummary_TEST`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report summarizes daily cash activity so Cash Management and accounting users can review store cash movement, spot balance issues, and reconcile activity for a selected business date or dealership scope.

## Executive Summary

| Field               | Value                         |
| ------------------- | ----------------------------- |
| Report name         | `DailyCashSummary_TEST`       |
| SSRS path           | `/Test/DailyCashSummary_TEST` |
| Status signal       | Test or non-production review |
| Created             | 2018-01-09 11:17:20           |
| Modified            | 2018-01-09 11:17:20           |
| Modified by         | SONIC\Mike.Kurn               |
| Last 6 months usage | 0 executions by 0 users       |
| Last execution      | NULL                          |
| Subscriptions       | 0                             |

## Shared Data Sources

| Report datasource | Shared datasource       | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------------- | ---------------------------- | --------------- | ------- |
| `CMS_DimDate`     | `/Test/DataSource_TEST` | `Not available from catalog` |                 |         |
| `CMSDatasource1`  | `/Test/DataSource_TEST` | `Not available from catalog` |                 |         |

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

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/Test/DailyCashSummary_TEST`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

- This report appears to be test or non-production based on its path or name.

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
