# Send Floorplan

Generated: 2026-06-15  
SSRS path: `/BI - Shared Services/Send Floorplan`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports floorplan payoff or floorplan reconciliation work by showing vehicle, lender, or payoff information needed by Shared Services and accounting users.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `Send Floorplan`                                 |
| SSRS path           | `/BI - Shared Services/Send Floorplan`           |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2017-04-18 09:34:57                              |
| Modified            | 2019-01-02 10:27:55                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

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

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Shared Services/Send Floorplan`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### RunSubscription

Type: `StoredProcedure`

```sql
Exec ReportServer.dbo.AddEvent @EventType,  @EventData
```
