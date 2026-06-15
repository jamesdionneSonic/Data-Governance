# GL - Open Stores

Generated: 2026-06-15  
SSRS path: `/Controllers/GL - Open Stores`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports controller and accounting review by showing general ledger or store accounting information needed for period-end, reconciliation, or operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `GL - Open Stores`                               |
| SSRS path           | `/Controllers/GL - Open Stores`                  |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-08-04 17:00:39                              |
| Modified            | 2014-08-04 17:00:39                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource             | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------------------- | ---------------------------- | --------------- | ------- |
| `DMS`             | `/Controllers/DataSource/DMS` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt | Type     | Notes                                                |
| --------- | ------ | -------- | ---------------------------------------------------- |
| `Month`   | Month  | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): SELECT DISTINCT glcalendar.cora_acct_id, glcalendar.hostitemid, glcalendar.companyid, glcalendar.companyidright, glcalendar.glcutoffdate, glcalendar.glcutofftime, glcalendar.glfirstdayofmonth, glcalendar.glmonthstatus, glcalendar.glmthclosedate, glcalendar.glmthclosetime, orgname.companyname, CASE WHEN d .DateSold IS N...
2. Dataset `DefaultDate` (Text): SELECT cast(CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(getdate())),getdate()),101) as date) as Date , 'Last Day of Previous Month'AS Date_Type

## Backend Dependencies

| Object or command hint                | Notes                                     |
| ------------------------------------- | ----------------------------------------- |
| `glcalendar`                          | Referenced by one or more report datasets |
| `orgname`                             | Referenced by one or more report datasets |
| `BI_WorkDB.dbo.TblDealershipEntities` | Referenced by one or more report datasets |
| `dm_cora_account`                     | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/Controllers/GL - Open Stores`.
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
SELECT DISTINCT                        glcalendar.cora_acct_id, glcalendar.hostitemid, glcalendar.companyid, glcalendar.companyidright, glcalendar.glcutoffdate, glcalendar.glcutofftime,                        glcalendar.glfirstdayofmonth, glcalendar.glmonthstatus, glcalendar.glmthclosedate, glcalendar.glmthclosetime, orgname.companyname,                        CASE WHEN d .DateSold IS NULL THEN d .Region WHEN d .DateSold IS NOT NULL THEN 'Sold' END AS Region                       ,glcalendar.rowlastupdated FROM         glcalendar INNER JOIN                       orgname ON glcalendar.companyid = orgname.companyid AND glcalendar.cora_acct_id = orgname.cora_acct_id LEFT OUTER JOIN                       BI_WorkDB.dbo.TblDealershipEntities AS d ON orgname.companyid = d.CompanyID                       inner join dm_cora_account dca on dca.cora_acct_id = glcalendar.cora_acct_id WHERE     (CASE WHEN d .DateSold IS NULL THEN d .Region WHEN d .DateSold IS NOT NULL THEN 'Sold' END <> 'Sold')  AND (glcalendar.glfirstdayofmonth = CONVERT(VARCHAR(25), DATEADD(dd, - (DAY(@Month) - 1), @Month), 101))  --AND (glcalendar.glfirstdayofmonth = '6/1/2011')  AND (glcalendar.glmthclosedate IS NULL)                        AND (glcalendar.glmonthstatus = 1) AND (glcalendar.cora_acct_id <> 3726) AND (glcalendar.cora_acct_id <> 3742) AND (glcalendar.cora_acct_id <> 208) AND                        (glcalendar.cora_acct_id <> 1210) AND (glcalendar.companyid <> '424') AND (glcalendar.companyid not in('318','418','455','217'))                        and dca.dwnld_acct_sw = 1 ORDER BY orgname.companyname
```

#### DefaultDate

Type: `Text`

```sql
SELECT cast(CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(getdate())),getdate()),101) as date) as Date , 'Last Day of Previous Month'AS Date_Type
```
