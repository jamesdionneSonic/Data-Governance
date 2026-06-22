# Send Floorplan

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Shared Services/Send Floorplan`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports floorplan payoff or floorplan reconciliation work by showing vehicle, lender, or payoff information needed by Shared Services and accounting users. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                     |
| Asset type            | Report                                                                                                                                                                                                   |
| Native path           | `/BI - Shared Services/Send Floorplan`                                                                                                                                                                   |
| Support role          | Review candidate report                                                                                                                                                                                  |
| Business process      | Use this when Shared Services or Accounting needs to review floorplan payoff activity, validate payoff records, or investigate synchronization issues. The report is filtered by Event Data, Event Type. |
| Primary source        | /BI - Shared Services/DataSource/d1-spssrs-01                                                                                                                                                            |
| Primary target/output | SSRS report output                                                                                                                                                                                       |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                             |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                         |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                         |
| Report name           | `Send Floorplan`                                                                                                                                                                                         |
| Created               | 2017-04-18 09:34:57                                                                                                                                                                                      |
| Modified              | 2019-01-02 10:27:55                                                                                                                                                                                      |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                       |

## Business Use

Use this when Shared Services or Accounting needs to review floorplan payoff activity, validate payoff records, or investigate synchronization issues. The report is filtered by Event Data, Event Type.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Shared Services/Send Floorplan`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                               | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------------------------------------- | ---------------------------- | --------------- | ------- |
| `SPSSRS`          | `/BI - Shared Services/DataSource/d1-spssrs-01` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter   | Prompt     | Type   | Notes                                                |
| ----------- | ---------- | ------ | ---------------------------------------------------- |
| `EventData` | Event Data | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `EventType` | Event Type | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `RunSubscription` (StoredProcedure): Calls stored procedure `Exec ReportServer.dbo.AddEvent @EventType,  @EventData`.

## Backend Dependencies

| Object or command hint                                   | Notes                                     |
| -------------------------------------------------------- | ----------------------------------------- |
| `Exec ReportServer.dbo.AddEvent @EventType,  @EventData` | Referenced by one or more report datasets |
| `ReportServer.dbo.AddEvent`                              | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### RunSubscription

Type: `StoredProcedure`

```sql
Exec ReportServer.dbo.AddEvent @EventType,  @EventData
```
