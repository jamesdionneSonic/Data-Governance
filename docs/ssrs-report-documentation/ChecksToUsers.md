# ChecksToUsers

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/Internal Audit/ChecksToUsers`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the Internal Audit reporting area. It retrieves data through embedded report dataset queries and presents the result as the ChecksToUsers report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                                                                                                      |
| Asset type            | Report                                                                                                                                                                                                                                                                                                                                    |
| Native path           | `/Internal Audit/ChecksToUsers`                                                                                                                                                                                                                                                                                                           |
| Support role          | Review candidate report                                                                                                                                                                                                                                                                                                                   |
| Business process      | Use this report for Internal Audit business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Beg Date, Dealerships, End Date, User Last Name. It reads or calls vw_ChecksToUser, so support should validate those sources when results look wrong. |
| Primary source        | /Internal Audit/DataSource/DMS                                                                                                                                                                                                                                                                                                            |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                                                                                                        |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                                                                                                                 |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                                                                                                                                              |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                                                                                                                                          |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                                                                                          |
| Report name           | `ChecksToUsers`                                                                                                                                                                                                                                                                                                                           |
| Created               | 2014-12-08 15:20:08                                                                                                                                                                                                                                                                                                                       |
| Modified              | 2015-02-10 17:08:46                                                                                                                                                                                                                                                                                                                       |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                                                                                                                                                        |

## Business Use

Use this report for Internal Audit business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Beg Date, Dealerships, End Date, User Last Name. It reads or calls vw_ChecksToUser, so support should validate those sources when results look wrong.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/Internal Audit/ChecksToUsers`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                | Connection                   | Credential mode | Enabled |
| ----------------- | -------------------------------- | ---------------------------- | --------------- | ------- |
| `DMS`             | `/Internal Audit/DataSource/DMS` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter      | Prompt         | Type     | Notes                                                |
| -------------- | -------------- | -------- | ---------------------------------------------------- |
| `BegDate`      | Beg Date       | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Dealerships`  | Dealerships    | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `EndDate`      | End Date       | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `UserLastName` | User Last Name | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |

## Data Logic

1. Dataset `ChecksToUsers` (Text): SELECT Dealership, checkdate, AcctgCheckAmount, checkno, UserFirstName, UserLastName, PayeeName1, PayeeName2, check_address, check_city, check_state, check_zip, vendor_name1, vendor_name2, vendor_address1, vendor_city, vend
2. Dataset `Dealerships` (Text): SELECT DISTINCT Dealership FROM vw_ChecksToUser WHERE (checkdate BETWEEN @BegDate AND @EndDate)
3. Dataset `UserLastName` (Text): select distinct userlastname FROM vw_ChecksToUser where checkdate between @BegDate and @EndDate order by userlastname

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `vw_ChecksToUser`      | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### ChecksToUsers

Type: `Text`

```sql
SELECT        Dealership, checkdate, AcctgCheckAmount, checkno, UserFirstName, UserLastName, PayeeName1, PayeeName2, check_address, check_city, check_state,                           check_zip, vendor_name1, vendor_name2, vendor_address1, vendor_city, vend
```

#### Dealerships

Type: `Text`

```sql
SELECT DISTINCT Dealership FROM            vw_ChecksToUser WHERE        (checkdate BETWEEN @BegDate AND @EndDate)
```

#### UserLastName

Type: `Text`

```sql
select distinct userlastname  FROM            vw_ChecksToUser where checkdate between @BegDate and @EndDate order by userlastname
```
