# Trade1Stockno to Custno

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/AcctStd/Trade1Stockno to Custno`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report helps support teams find the customer and deal tied to a vehicle stock number. In plain English, it answers: "For this accounting account and stock number, which customer and deal are tied to the vehicle sale?" If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                    |
| Asset type            | Report                                                                                                                                                                                  |
| Native path           | `/AcctStd/Trade1Stockno to Custno`                                                                                                                                                      |
| Support role          | Review candidate report                                                                                                                                                                 |
| Business process      | Use this when support needs to connect customer, stock, trade, accounting date, or deal identifiers across vehicle sale records. The report is filtered by Acctg Acct, Trade1 Stock #s. |
| Primary source        | /AcctStd/DataSource/DMS                                                                                                                                                                 |
| Primary target/output | SSRS report output                                                                                                                                                                      |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                               |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                            |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                        |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                        |
| Report name           | `Trade1Stockno to Custno`                                                                                                                                                               |
| Created               | 2014-09-11 17:15:52                                                                                                                                                                     |
| Modified              | 2014-09-11 17:15:52                                                                                                                                                                     |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                      |

## Business Use

Use this when support needs to connect customer, stock, trade, accounting date, or deal identifiers across vehicle sale records. The report is filtered by Acctg Acct, Trade1 Stock #s.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/AcctStd/Trade1Stockno to Custno`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource         | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------- | ---------------------------- | --------------- | ------- |
| `DMS`             | `/AcctStd/DataSource/DMS` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter        | Prompt          | Type   | Notes                                                |
| ---------------- | --------------- | ------ | ---------------------------------------------------- |
| `AcctgAcct`      | Acctg Acct      | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Trade1Stocknos` | Trade1 Stock #s | String | Nullable: NULL; Allow blank: NULL; Multi-value: true |

## Data Logic

1. Dataset `DataSet1` (Text): select accountingaccount, trade1stock,custno,stockno,accountingdate,fiwipstatuscode [Deal Status],dealno from vehiclesalescurrent where accountingaccount = @AcctgAcct and trade1stock in (@Trade1Stocknos) and fiwipstatuscode in( 'f','u')

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `vehiclesalescurrent`  | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
select accountingaccount, trade1stock,custno,stockno,accountingdate,fiwipstatuscode [Deal Status],dealno from vehiclesalescurrent where accountingaccount = @AcctgAcct and trade1stock in (@Trade1Stocknos) and fiwipstatuscode in( 'f','u')
```
