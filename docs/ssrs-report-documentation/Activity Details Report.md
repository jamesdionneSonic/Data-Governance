# Activity Details Report

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/CMA/Activity Details Report`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report provides transaction-level Cash Management activity details for researching individual cash activity, reconciling questions, and supporting follow-up on specific stores or dates. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                  |
| Asset type            | Report                                                                                                                                                                                                                                                |
| Native path           | `/CMA/Activity Details Report`                                                                                                                                                                                                                        |
| Support role          | User-facing report                                                                                                                                                                                                                                    |
| Business process      | Use this for Cash Management review when accounting users need transaction detail, daily activity, cash summary, or exception follow-up. The report is filtered by Acct Number, Amount Greater Than, Amount Less Than, Debit or Credit, Check Number. |
| Primary source        | /CMA/DataSource/CMA                                                                                                                                                                                                                                   |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                    |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                             |
| Runtime/usage signal  | 36517 executions by 228 users; last used 2026-06-12 13:33:29                                                                                                                                                                                          |
| Status signal         | Active, high usage                                                                                                                                                                                                                                    |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                      |
| Report name           | `Activity Details Report`                                                                                                                                                                                                                             |
| Created               | 2014-08-15 10:37:07                                                                                                                                                                                                                                   |
| Modified              | 2014-08-20 10:51:34                                                                                                                                                                                                                                   |
| Modified by           | SONIC\Doug.Morgan                                                                                                                                                                                                                                     |

## Business Use

Use this for Cash Management review when accounting users need transaction detail, daily activity, cash summary, or exception follow-up. The report is filtered by Acct Number, Amount Greater Than, Amount Less Than, Debit or Credit, Check Number.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/CMA/Activity Details Report`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

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

1. Dataset `DataSet1` (Text): select d.\*, a.Dlr_dealership, a.VE_Desc from cmag.tblDetails (nolock) as d join cmag.vw_DealerAcctType (nolock) as a on a.dlracct_acct_num = d.Det_acctnum where Dlr_Dealership = (@Dealership) and D.Det_AcctNum in (@AcctNumber) and D.Det_TxnType
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

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
select d.*, a.Dlr_dealership, a.VE_Desc from  cmag.tblDetails (nolock) as d  join cmag.vw_DealerAcctType (nolock) as a  on a.dlracct_acct_num = d.Det_acctnum     where   Dlr_Dealership = (@Dealership)  and D.Det_AcctNum in (@AcctNumber)  and D.Det_TxnType
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
