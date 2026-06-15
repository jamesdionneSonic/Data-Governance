# PayrollEntry_CoID_UserID

Generated: 2026-06-15  
SSRS path: `/BI - Payroll/PayrollEntry_CoID_UserID`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports payroll review by summarizing payroll entry or payroll activity information for the selected company, user, or reporting scope.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `PayrollEntry_CoID_UserID`                       |
| SSRS path           | `/BI - Payroll/PayrollEntry_CoID_UserID`         |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-09-25 15:39:27                              |
| Modified            | 2014-09-25 15:39:27                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource                  | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------- | ---------------------------- | --------------- | ------- |
| `DMS`             | `/BI - Payroll/DataSource/DMS_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt                              | Type     | Notes                                                |
| --------- | ----------------------------------- | -------- | ---------------------------------------------------- |
| `Date`    | Choose center of 30-day date range. | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Refer`   | Refer                               | String   | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `PayrollLevelTop` (Text): select d.refer as JE_Reference ,da.AccCoaType ,da.AccAccount as Base_Account ,SUM(d.postingamount) as PostingAmount ,d.companyid ,glh.userid from dms.dbo.gljedetail_cur d left join [COR-BISQL-02\bisql02].Sonic_Dw.dbo.dim_account da on d.cora_acct_id = da.AccCoraAcctId and d.companyid = da.AccCompanyId and d.accountnumb...
2. Dataset `TodayDataSet` (Text): SELECT CAST(GETDATE() AS date) AS Today

## Backend Dependencies

| Object or command hint   | Notes                                     |
| ------------------------ | ----------------------------------------- |
| `dms.dbo.gljedetail_cur` | Referenced by one or more report datasets |
| `COR-BISQL-02`           | Referenced by one or more report datasets |
| `gljeheader`             | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Payroll/PayrollEntry_CoID_UserID`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### PayrollLevelTop

Type: `Text`

```sql
select d.refer as JE_Reference ,da.AccCoaType ,da.AccAccount as Base_Account ,SUM(d.postingamount) as PostingAmount ,d.companyid ,glh.userid from dms.dbo.gljedetail_cur d left join [COR-BISQL-02\bisql02].Sonic_Dw.dbo.dim_account da on d.cora_acct_id = da.AccCoraAcctId and d.companyid = da.AccCompanyId and d.accountnumber = da.AccAccountNumber inner join gljeheader glh on d.ShortHostItemID = glh.hostitemid where d.accountingdate between  dateadd(d,-15,@Date) and  dateadd(d,15,@Date)   --'09/01/2014' and '09/30/2014' --input dates here and d.refer IN (@Refer) --input refer here  group by d.refer ,da.AccCoaType ,da.AccAccount ,d.companyid ,glh.userid
```

#### TodayDataSet

Type: `Text`

```sql
SELECT        CAST(GETDATE() AS date) AS Today
```
