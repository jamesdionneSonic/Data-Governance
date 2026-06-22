# EP Customers

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Retail Strategy/EP Customers`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports legal or compliance follow-up by listing relevant TrueCar email activity or records for review. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                             |
| Asset type            | Report                                                                                                                                                                                                                                                           |
| Native path           | `/BI - Retail Strategy/EP Customers`                                                                                                                                                                                                                             |
| Support role          | User-facing report                                                                                                                                                                                                                                               |
| Business process      | Use this report for BI - Retail Strategy business review when users need report output for operational follow-up, reconciliation, audit, or performance review. It reads or calls vw_Customer, so support should validate those sources when results look wrong. |
| Primary source        | /BI - Retail Strategy/DataSource/DMS_DWA                                                                                                                                                                                                                         |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                               |
| Schedule or trigger   | 1 subscription(s)                                                                                                                                                                                                                                                |
| Runtime/usage signal  | 4 executions by 1 users; last used 2026-06-01 06:00:00                                                                                                                                                                                                           |
| Status signal         | Active                                                                                                                                                                                                                                                           |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                 |
| Report name           | `EP Customers`                                                                                                                                                                                                                                                   |
| Created               | 2016-05-04 10:42:34                                                                                                                                                                                                                                              |
| Modified              | 2018-07-20 16:42:36                                                                                                                                                                                                                                              |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                                                                               |

## Business Use

Use this report for BI - Retail Strategy business review when users need report output for operational follow-up, reconciliation, audit, or performance review. It reads or calls vw_Customer, so support should validate those sources when results look wrong.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/EP Customers`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                          | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------------ | ---------------------------- | --------------- | ------- |
| `DMS`             | `/BI - Retail Strategy/DataSource/DMS_DWA` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `EPCustomers` (Text): SELECT c.custorcompanycode,c.firstname, case when c.lastname is null then c.name1 else c.lastname end as lastname , c.address, c.city, c.state, c.ziporpostalcode, c.homephone, c.email ,isdeleted FROM vw_Customer

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `vw_Customer`          | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### EPCustomers

Type: `Text`

```sql
SELECT     c.custorcompanycode,c.firstname,  case  when c.lastname is null then c.name1 else c.lastname end as lastname ,  c.address, c.city, c.state, c.ziporpostalcode, c.homephone,                        c.email        ,isdeleted FROM         vw_Customer
```
