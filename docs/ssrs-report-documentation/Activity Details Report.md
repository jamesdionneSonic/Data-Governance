# Activity Details Report

Generated: 2026-06-15  
SSRS path: `/CMA/Activity Details Report`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report provides transaction-level Cash Management activity details for researching individual cash activity, reconciling questions, and supporting follow-up on specific stores or dates.

## Executive Summary

| Field               | Value                          |
| ------------------- | ------------------------------ |
| Report name         | `Activity Details Report`      |
| SSRS path           | `/CMA/Activity Details Report` |
| Status signal       | Active, high usage             |
| Created             | 2014-08-15 10:37:07            |
| Modified            | 2014-08-20 10:51:34            |
| Modified by         | SONIC\Doug.Morgan              |
| Last 6 months usage | 37919 executions by 228 users  |
| Last execution      | 2026-06-12 13:33:29            |
| Subscriptions       | 0                              |

## Shared Data Sources

| Report datasource | Shared datasource     | Connection                   | Credential mode | Enabled |
| ----------------- | --------------------- | ---------------------------- | --------------- | ------- |
| `CMS`             | `/CMA/DataSource/CMA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter     | Prompt              | Type     | Notes                                                |
| ------------- | ------------------- | -------- | ---------------------------------------------------- |
| `AcctNumber`  | Acct Number         | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `Amount`      | Amount Greater Than | Float    | Nullable: true; Allow blank: NULL; Multi-value: NULL |
| `Amount2`     | Amount Less Than    | Float    | Nullable: true; Allow blank: NULL; Multi-value: NULL |
| `CDString`    | Debit or Credit     | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `CheckNumber` | Check Number        | String   | Nullable: true; Allow blank: NULL; Multi-value: NULL |
| `DateEnd`     | Date End            | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `DateStart`   | Date Start          | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Dealership`  | Dealership          | String   | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Textstring`  | Description Text    | String   | Nullable: true; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): select d.\*, a.Dlr_dealership, a.VE_Desc from cmag.tblDetails (nolock) as d join cmag.vw_DealerAcctType (nolock) as a on a.dlracct_acct_num = d.Det_acctnum where Dlr_Dealership = (@Dealership) and D.Det_AcctNum in (@AcctNumber) and D.Det_TxnType in (@CDString) and Det_Text like isnull('%'+@Textstring+'%',Det_Text) and D...
2. Dataset `DataSet2` (Text): select distinct dlr_dealership from vw_DealerAcctType order by dlr_dealership
3. Dataset `DataSet3` (Text): select \* from vw_DealerAcctType where Dlr_dealership = @Dealership union all select NULL,'All Dealerships',NULL,NULL,'All Account Types',NULL order by dlracct_acct_num
4. Dataset `DataSet4` (StoredProcedure): Calls stored procedure `cmag.usp_dearlerinfo`.

## Backend Dependencies

| Object or command hint   | Notes                                     |
| ------------------------ | ----------------------------------------- |
| `cmag.tblDetails`        | Referenced by one or more report datasets |
| `cmag.vw_DealerAcctType` | Referenced by one or more report datasets |
| `vw_DealerAcctType`      | Referenced by one or more report datasets |
| `cmag.usp_dearlerinfo`   | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/CMA/Activity Details Report`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
select d.*, a.Dlr_dealership, a.VE_Desc from  cmag.tblDetails (nolock) as d  join cmag.vw_DealerAcctType (nolock) as a  on a.dlracct_acct_num = d.Det_acctnum     where   Dlr_Dealership = (@Dealership)  and D.Det_AcctNum in (@AcctNumber)  and D.Det_TxnType in (@CDString)  and Det_Text like isnull('%'+@Textstring+'%',Det_Text)  and Det_TxnDate between @DateStart and @DateEnd  and (Det_Amount >= ISNULL(@Amount,Det_Amount)  and Det_Amount <= ISNULL(@Amount2,Det_Amount))         and Det_CustRef = ISNULL(@CheckNumber,Det_CustRef)
```

#### DataSet2

Type: `Text`

```sql
select distinct dlr_dealership from vw_DealerAcctType   order by dlr_dealership
```

#### DataSet3

Type: `Text`

```sql
select * from vw_DealerAcctType where Dlr_dealership = @Dealership union all select NULL,'All Dealerships',NULL,NULL,'All Account Types',NULL   order by dlracct_acct_num
```

#### DataSet4

Type: `StoredProcedure`

```sql
cmag.usp_dearlerinfo
```
