# OpportunityPkgs

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Retail Strategy/SCORES/OpportunityPkgs`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports retail strategy scorecard review by presenting operational performance measures for the selected store, market, or reporting period. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                                                                                                                          |
| Asset type            | Report                                                                                                                                                                                                                                                                                                                                                        |
| Native path           | `/BI - Retail Strategy/SCORES/OpportunityPkgs`                                                                                                                                                                                                                                                                                                                |
| Support role          | Review candidate report                                                                                                                                                                                                                                                                                                                                       |
| Business process      | Use this report for BI - Retail Strategy / SCORES business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by dm code, gm code. It reads or calls ScoresMi, ScoresMigration.dbo.MDMCustDetail, Scores, so support should validate those sources when results look wrong. |
| Primary source        | NULL                                                                                                                                                                                                                                                                                                                                                          |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                                                                                                                            |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                                                                                                                                     |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                                                                                                                                                                  |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                                                                                                                                                              |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                                                                                                              |
| Report name           | `OpportunityPkgs`                                                                                                                                                                                                                                                                                                                                             |
| Created               | 2014-10-27 09:06:00                                                                                                                                                                                                                                                                                                                                           |
| Modified              | 2014-10-27 09:06:00                                                                                                                                                                                                                                                                                                                                           |
| Modified by           | robab.fayazi                                                                                                                                                                                                                                                                                                                                                  |

## Business Use

Use this report for BI - Retail Strategy / SCORES business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by dm code, gm code. It reads or calls ScoresMi, ScoresMigration.dbo.MDMCustDetail, Scores, so support should validate those sources when results look wrong.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/SCORES/OpportunityPkgs`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------- | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `NULL`            | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt  | Type   | Notes                                                |
| --------- | ------- | ------ | ---------------------------------------------------- |
| `dm_code` | dm code | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `gm_code` | gm code | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DealData` (Text): select dd.\*, CASE WHEN dd.IsComplete = 1 AND dd.IsError = 0 THEN 'Completed' WHEN dd.IsError = 1 THEN 'Errors' WHEN dd.IsComplete IS NULL THEN 'GoLive' WHEN dd.IsComplete =2 THEN 'History' when dd.IsComplete = 9 then 'Orphans' else 'Unknown' End as
2. Dataset `Delivery` (Text): select DA.\*,o.szfirstname +' '+o.szlastname As Owner, CASE WHEN da.IsComplete = 1 AND DA.IsError = 0 THEN 'Completed' WHEN DA.IsError = 1 THEN 'Errors' WHEN DA.IsComplete IS NULL THEN 'GoLive' WHEN DA.IsComplete =2 THEN 'History' when DA.IsComplete =
3. Dataset `EasyCare` (Text): select \*, CASE WHEN IsComplete = 1 AND IsError = 0 THEN 'Completed' WHEN IsError = 1 THEN 'Errors' WHEN IsComplete IS NULL THEN 'GoLive' WHEN IsComplete =2 THEN 'History' when IsComplete = 9 then 'Orphans' else 'Unknown' End as Status from ScoresMi
4. Dataset `EmailActivities` (Text): select ea.\*, CASE WHEN ea.IsComplete = 1 AND ea.IsError = 0 THEN 'Completed' WHEN ea.IsError = 1 THEN 'Errors' WHEN ea.IsComplete IS NULL THEN 'GoLive' WHEN ea.IsComplete =2 THEN 'History' when ea.IsComplete = 9 then 'Orphans' else 'Unknown' End as
5. Dataset `InterestedInVeh` (Text): select IIV.\*, CASE WHEN iiv.IsComplete = 1 AND iiv.IsError = 0 THEN 'Completed' WHEN iiv.IsError = 1 THEN 'Errors' WHEN iiv.IsComplete IS NULL THEN 'GoLive' WHEN iiv.IsComplete =2 THEN 'History' when iiv.iscomplete = 9 then 'Orphans' else 'Unknown'
6. Dataset `MDMCustDetail` (Text): select \* from ScoresMigration.dbo.MDMCustDetail where GlobalMaster_code=@gm_code
7. Dataset `Notes` (Text): select notes.\*, CASE WHEN notes.IsComplete = 1 AND notes.IsError = 0 THEN 'Completed' WHEN notes.IsError = 1 THEN 'Errors' WHEN notes.IsComplete IS NULL THEN 'GoLive' WHEN notes.IsComplete =2 THEN 'History' when notes.IsComplete = 9 then 'Orphans' e
8. Dataset `Opportunities` (Text): select op.\*, CASE WHEN op.IsComplete = 1 AND op.IsError = 0 THEN 'Completed' WHEN op.IsError = 1 THEN 'Errors' WHEN op.IsComplete IS NULL THEN 'GoLive' WHEN op.IsComplete =2 THEN 'History' when op.IsComplete = 9 then 'Orphans' else 'Unknown' End as
9. Dataset `Owned` (Text): select ov.\*, CASE WHEN ov.IsComplete = 1 AND ov.IsError = 0 THEN 'Completed' WHEN ov.IsError = 1 THEN 'Errors' WHEN ov.IsComplete IS NULL THEN 'GoLive' WHEN ov.IsComplete =2 THEN 'History' when ov.IsComplete = 9 then 'Orphans' else 'Unknown' End as
10. Dataset `PhoneActivities` (Text): select ph.\*, CASE WHEN ph.IsComplete = 1 AND ph.IsError = 0 THEN 'Completed' WHEN ph.IsError = 1 THEN 'Errors' WHEN ph.IsComplete IS NULL THEN 'GoLive' WHEN ph.IsComplete =2 THEN 'History' when ph.IsComplete = 9 then 'Orphans' else 'Unknown' End as S
11. Dataset `ServiceVisits` (Text): select sv.\*, CASE WHEN Iscomplete = 1 AND IsError = 0 THEN 'Completed' WHEN IsError = 1 THEN 'Errors' WHEN IsComplete IS NULL THEN 'GoLive' WHEN IsComplete =2 THEN 'History' when iscomplete = 9 then 'Orphans' else 'Unknown' End as Status from Scores
12. Dataset `ShowRoomAppointments` (Text): select sa.\*, CASE WHEN sa.IsComplete = 1 AND sa.IsError = 0 THEN 'Completed' WHEN sa.IsError = 1 THEN 'Errors' WHEN sa.IsComplete IS NULL THEN 'GoLive' WHEN sa.IsComplete =2 THEN 'History' when sa.IsComplete = 9 then 'Orphans' else 'Unknown' End as
13. Dataset `ShowRoomVisits` (Text): select sv.\*, CASE WHEN Iscomplete = 1 AND IsError = 0 THEN 'Completed' WHEN IsError = 1 THEN 'Errors' WHEN IsComplete IS NULL THEN 'GoLive' WHEN IsComplete =2 THEN 'History' when iscomplete = 9 then 'Orphans' else 'Unknown' End as Status from Scores
14. Dataset `Survey` (Text): select s.\*, CASE WHEN s.IsComplete = 1 AND s.IsError = 0 THEN 'Completed' WHEN s.IsError = 1 THEN 'Errors' WHEN s.IsComplete IS NULL THEN 'GoLive' WHEN s.IsComplete =2 THEN 'History' when s.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status,
15. Dataset `TradedIn` (Text): select TI.\*, CASE WHEN ti.IsComplete = 1 AND ti.IsError = 0 THEN 'Completed' WHEN ti.IsError = 1 THEN 'Errors' WHEN ti.IsComplete IS NULL THEN 'GoLive' WHEN ti.IsComplete =2 THEN 'History' when ti.IsComplete = 9 then 'Orphans' else 'Unknown' End as

## Backend Dependencies

| Object or command hint              | Notes                                     |
| ----------------------------------- | ----------------------------------------- |
| `ScoresMi`                          | Referenced by one or more report datasets |
| `ScoresMigration.dbo.MDMCustDetail` | Referenced by one or more report datasets |
| `Scores`                            | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DealData

Type: `Text`

```sql
select dd.*,  CASE WHEN dd.IsComplete = 1 AND dd.IsError = 0 THEN 'Completed'   WHEN dd.IsError = 1 THEN 'Errors'   WHEN dd.IsComplete IS NULL THEN 'GoLive'  WHEN dd.IsComplete =2 THEN 'History'  when dd.IsComplete = 9 then 'Orphans' else 'Unknown' End as
```

#### Delivery

Type: `Text`

```sql
select DA.*,o.szfirstname +' '+o.szlastname As Owner, CASE WHEN da.IsComplete = 1 AND DA.IsError = 0 THEN 'Completed'   WHEN DA.IsError = 1 THEN 'Errors'   WHEN DA.IsComplete IS NULL THEN 'GoLive'  WHEN DA.IsComplete =2 THEN 'History'  when DA.IsComplete =
```

#### EasyCare

Type: `Text`

```sql
select *,  CASE WHEN IsComplete = 1 AND IsError = 0 THEN 'Completed'   WHEN IsError = 1 THEN 'Errors'   WHEN IsComplete IS NULL THEN 'GoLive'  WHEN IsComplete =2 THEN 'History'  when IsComplete = 9 then 'Orphans' else 'Unknown' End as Status  from ScoresMi
```

#### EmailActivities

Type: `Text`

```sql
select ea.*,   CASE WHEN ea.IsComplete = 1 AND ea.IsError = 0 THEN 'Completed'   WHEN ea.IsError = 1 THEN 'Errors'   WHEN ea.IsComplete IS NULL THEN 'GoLive'  WHEN ea.IsComplete =2 THEN 'History'  when ea.IsComplete = 9 then 'Orphans' else 'Unknown' End as
```

#### InterestedInVeh

Type: `Text`

```sql
select IIV.*,  CASE WHEN iiv.IsComplete = 1 AND iiv.IsError = 0 THEN 'Completed'   WHEN iiv.IsError = 1 THEN 'Errors'   WHEN iiv.IsComplete IS NULL THEN 'GoLive'  WHEN iiv.IsComplete =2 THEN 'History'  when iiv.iscomplete = 9 then 'Orphans' else 'Unknown'
```

#### MDMCustDetail

Type: `Text`

```sql
select * from ScoresMigration.dbo.MDMCustDetail  where GlobalMaster_code=@gm_code
```

#### Notes

Type: `Text`

```sql
select notes.*,  CASE WHEN notes.IsComplete = 1 AND notes.IsError = 0 THEN 'Completed'   WHEN notes.IsError = 1 THEN 'Errors'   WHEN notes.IsComplete IS NULL THEN 'GoLive'  WHEN notes.IsComplete =2 THEN 'History'  when notes.IsComplete = 9 then 'Orphans' e
```

#### Opportunities

Type: `Text`

```sql
select  op.*,  CASE WHEN op.IsComplete = 1 AND op.IsError = 0 THEN 'Completed'   WHEN op.IsError = 1 THEN 'Errors'   WHEN op.IsComplete IS NULL THEN 'GoLive'  WHEN op.IsComplete =2 THEN 'History'  when op.IsComplete = 9 then 'Orphans' else 'Unknown' End as
```

#### Owned

Type: `Text`

```sql
select ov.*,  CASE WHEN ov.IsComplete = 1 AND ov.IsError = 0 THEN 'Completed'   WHEN ov.IsError = 1 THEN 'Errors'   WHEN ov.IsComplete IS NULL THEN 'GoLive'  WHEN ov.IsComplete =2 THEN 'History'  when ov.IsComplete = 9 then 'Orphans' else 'Unknown' End as
```

#### PhoneActivities

Type: `Text`

```sql
select ph.*, CASE WHEN ph.IsComplete = 1 AND ph.IsError = 0 THEN 'Completed'   WHEN ph.IsError = 1 THEN 'Errors'   WHEN ph.IsComplete IS NULL THEN 'GoLive'  WHEN ph.IsComplete =2 THEN 'History'  when ph.IsComplete = 9 then 'Orphans' else 'Unknown' End as S
```

#### ServiceVisits

Type: `Text`

```sql
select sv.*,  CASE WHEN Iscomplete = 1 AND IsError = 0 THEN 'Completed'   WHEN IsError = 1 THEN 'Errors'   WHEN IsComplete IS NULL THEN 'GoLive'  WHEN IsComplete =2 THEN 'History'  when iscomplete = 9 then 'Orphans' else 'Unknown' End as Status from Scores
```

#### ShowRoomAppointments

Type: `Text`

```sql
select sa.*,  CASE WHEN sa.IsComplete = 1 AND sa.IsError = 0 THEN 'Completed'   WHEN sa.IsError = 1 THEN 'Errors'   WHEN sa.IsComplete IS NULL THEN 'GoLive'  WHEN sa.IsComplete =2 THEN 'History'  when sa.IsComplete = 9 then 'Orphans' else 'Unknown' End as
```

#### ShowRoomVisits

Type: `Text`

```sql
select sv.*,  CASE WHEN Iscomplete = 1 AND IsError = 0 THEN 'Completed'   WHEN IsError = 1 THEN 'Errors'   WHEN IsComplete IS NULL THEN 'GoLive'  WHEN IsComplete =2 THEN 'History'  when iscomplete = 9 then 'Orphans' else 'Unknown' End as Status from Scores
```

#### Survey

Type: `Text`

```sql
select s.*,  CASE WHEN s.IsComplete = 1 AND s.IsError = 0 THEN 'Completed'   WHEN s.IsError = 1 THEN 'Errors'   WHEN s.IsComplete IS NULL THEN 'GoLive'  WHEN s.IsComplete =2 THEN 'History'  when s.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status,
```

#### TradedIn

Type: `Text`

```sql
select TI.*,  CASE WHEN ti.IsComplete = 1 AND ti.IsError = 0 THEN 'Completed'   WHEN ti.IsError = 1 THEN 'Errors'   WHEN ti.IsComplete IS NULL THEN 'GoLive'  WHEN ti.IsComplete =2 THEN 'History'  when ti.IsComplete = 9 then 'Orphans' else 'Unknown' End as
```
