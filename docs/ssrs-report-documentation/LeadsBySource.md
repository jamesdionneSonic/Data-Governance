# LeadsBySource

Generated: 2026-06-15  
SSRS path: `/BI - Retail Strategy/LeadsBySource`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the BI - Retail Strategy reporting area. It retrieves data through embedded report dataset queries and presents the result as the LeadsBySource report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `LeadsBySource`                                  |
| SSRS path           | `/BI - Retail Strategy/LeadsBySource`            |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2016-05-04 10:42:31                              |
| Modified            | 2018-07-20 16:42:37                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource                              | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------------------- | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `/BI - Retail Strategy/DataSource/eLeadDW_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter       | Prompt         | Type     | Notes                                                |
| --------------- | -------------- | -------- | ---------------------------------------------------- |
| `Dealership`    | Dealership     | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `EndDate`       | End Date       | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `PrefFranchise` | Pref Franchise | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `Source`        | Source         | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `StartDate`     | Start Date     | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Uptype`        | Uptype         | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |

## Data Logic

1. Dataset `DataSet1` (Text): select \* from tblCompanyOrg (nolock) order by dealership
2. Dataset `DataSet2` (Text): Select distinct szUpSource from OppTypeAndSource (nolock) order by szUpSource
3. Dataset `DataSet3` (Text): SELECT distinct[szUpType] FROM [eLeadDW].[dbo].dwFullOpportunity (nolock) where dtProspectin between @StartDate and @EndDate order by szUpType
4. Dataset `DataSet4` (Text): select distinct preffranchise from BI_WorkDB.dbo.tblDealershipEntities (nolock)
5. Dataset `LeadsBySource` (Text): select Region, Dealership, PrefFranchise, szUpSource, szUpType, Sum(LeadCount) as LeadCount, SUM(SoldCount) as SoldCount, SUM(TotalAppointments) as TotalAppts, Sum(CompletedAppts) as CompletedAppts, SUM(MissedAppts) as MissedAppts from vw_leadanalysis (nolock) where dtprospectin between @StartDate and @EndDate and szUp...

## Backend Dependencies

| Object or command hint                | Notes                                     |
| ------------------------------------- | ----------------------------------------- |
| `tblCompanyOrg`                       | Referenced by one or more report datasets |
| `OppTypeAndSource`                    | Referenced by one or more report datasets |
| `eLeadDW.dbo.dwFullOpportunity`       | Referenced by one or more report datasets |
| `BI_WorkDB.dbo.tblDealershipEntities` | Referenced by one or more report datasets |
| `vw_leadanalysis`                     | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/LeadsBySource`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
select * from tblCompanyOrg (nolock) order by dealership
```

#### DataSet2

Type: `Text`

```sql
Select distinct szUpSource from OppTypeAndSource (nolock) order by szUpSource
```

#### DataSet3

Type: `Text`

```sql
SELECT distinct[szUpType]   FROM [eLeadDW].[dbo].dwFullOpportunity (nolock)   where dtProspectin between @StartDate and @EndDate  order by szUpType
```

#### DataSet4

Type: `Text`

```sql
select distinct preffranchise from BI_WorkDB.dbo.tblDealershipEntities  (nolock)
```

#### LeadsBySource

Type: `Text`

```sql
select  Region, Dealership, PrefFranchise, szUpSource, szUpType, Sum(LeadCount) as LeadCount, SUM(SoldCount) as SoldCount, SUM(TotalAppointments) as TotalAppts, Sum(CompletedAppts) as CompletedAppts, SUM(MissedAppts) as MissedAppts  from vw_leadanalysis (nolock)  where dtprospectin between @StartDate and @EndDate  and szUpSource in (@Source)  and Dealership in (@Dealership)  and szUpType in (@Uptype)  and PrefFranchise in(@PrefFranchise) group by  Region, Dealership, PrefFranchise, szUpSource, szUpType
```
