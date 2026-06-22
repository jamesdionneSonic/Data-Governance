# EP Leads

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Retail Strategy/EP Leads`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the BI - Retail Strategy reporting area. It retrieves data through embedded report dataset queries and presents the result as the EP Leads report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                          |
| Asset type            | Report                                                                                                                                                                                                        |
| Native path           | `/BI - Retail Strategy/EP Leads`                                                                                                                                                                              |
| Support role          | Review candidate report                                                                                                                                                                                       |
| Business process      | Use this report for BI - Retail Strategy business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Beg Date, End Date. |
| Primary source        | /BI - Retail Strategy/DataSource/eLeadDW_DWA                                                                                                                                                                  |
| Primary target/output | SSRS report output                                                                                                                                                                                            |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                     |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                  |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                              |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                              |
| Report name           | `EP Leads`                                                                                                                                                                                                    |
| Created               | 2018-07-20 16:42:41                                                                                                                                                                                           |
| Modified              | 2018-07-20 16:42:41                                                                                                                                                                                           |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                            |

## Business Use

Use this report for BI - Retail Strategy business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Beg Date, End Date.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/EP Leads`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                              | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------------------- | ---------------------------- | --------------- | ------- |
| `Elead`           | `/BI - Retail Strategy/DataSource/eLeadDW_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt   | Type     | Notes                                                |
| --------- | -------- | -------- | ---------------------------------------------------- |
| `BegDate` | Beg Date | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `EndDate` | End Date | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): WITH EleadToCarsCom AS (SELECT DISTINCT EntName, EntCora_Account_ID, EntADPCompanyID, EntAccountingPrefix, EntEleadID, EntEleadDefault, EntCarsID, EntDealerLvl1, EntAddressZipCode FROM

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
WITH EleadToCarsCom AS (SELECT DISTINCT EntName, EntCora_Account_ID, EntADPCompanyID, EntAccountingPrefix, EntEleadID, EntEleadDefault, EntCarsID, EntDealerLvl1, EntAddressZipCode                                                             FROM
```
