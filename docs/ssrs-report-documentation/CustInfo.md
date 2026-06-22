# CustInfo

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/RptTest/CustInfo`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports legal or compliance follow-up by listing relevant TrueCar email activity or records for review. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                 |
| Asset type            | Report                                                                                                                                                                                                               |
| Native path           | `/RptTest/CustInfo`                                                                                                                                                                                                  |
| Support role          | Review candidate report                                                                                                                                                                                              |
| Business process      | Use this report for RptTest business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by firstname, lastname, Source Dealership. |
| Primary source        | NULL                                                                                                                                                                                                                 |
| Primary target/output | SSRS report output                                                                                                                                                                                                   |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                            |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                         |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                     |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                     |
| Report name           | `CustInfo`                                                                                                                                                                                                           |
| Created               | 2014-07-31 14:01:38                                                                                                                                                                                                  |
| Modified              | 2014-07-31 14:34:26                                                                                                                                                                                                  |
| Modified by           | SONIC\Doug.Morgan                                                                                                                                                                                                    |

## Business Use

Use this report for RptTest business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by firstname, lastname, Source Dealership.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/RptTest/CustInfo`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------- | ---------------------------- | --------------- | ------- |
| `CustInfo`        | `NULL`            | `Not available from catalog` |                 |         |

## User Parameters

| Parameter          | Prompt            | Type   | Notes                                                |
| ------------------ | ----------------- | ------ | ---------------------------------------------------- |
| `firstname`        | firstname         | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `lastname`         | lastname          | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `SourceDealership` | Source Dealership | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): select firstname, lastname,MiddleName,stdprimaryaddressline1,stdprimaryaddressline2,stdprimarycity, stdprimarystate,stdprimaryzipcode,StdMobilePhone,StdHomePhone,StdOtherPhone,Email1,DM_CODE,GM_CODE,SourceDealership,customertype,email2,email3,companyName

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
select firstname, lastname,MiddleName,stdprimaryaddressline1,stdprimaryaddressline2,stdprimarycity, stdprimarystate,stdprimaryzipcode,StdMobilePhone,StdHomePhone,StdOtherPhone,Email1,DM_CODE,GM_CODE,SourceDealership,customertype,email2,email3,companyName
```
