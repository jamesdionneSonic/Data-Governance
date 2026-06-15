# OpportunityPkgs

Generated: 2026-06-15  
SSRS path: `/BI - Retail Strategy/SCORES/OpportunityPkgs`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports legal or compliance follow-up by listing relevant TrueCar email activity or records for review.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `OpportunityPkgs`                                |
| SSRS path           | `/BI - Retail Strategy/SCORES/OpportunityPkgs`   |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-27 09:06:00                              |
| Modified            | 2014-10-27 09:06:00                              |
| Modified by         | robab.fayazi                                     |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

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

1. Dataset `DealData` (Text): select dd.\*, CASE WHEN dd.IsComplete = 1 AND dd.IsError = 0 THEN 'Completed' WHEN dd.IsError = 1 THEN 'Errors' WHEN dd.IsComplete IS NULL THEN 'GoLive' WHEN dd.IsComplete =2 THEN 'History' when dd.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName +' '+o.szLastName as Owner from scoresmigration.d...
2. Dataset `Delivery` (Text): select DA.\*,o.szfirstname +' '+o.szlastname As Owner, CASE WHEN da.IsComplete = 1 AND DA.IsError = 0 THEN 'Completed' WHEN DA.IsError = 1 THEN 'Errors' WHEN DA.IsComplete IS NULL THEN 'GoLive' WHEN DA.IsComplete =2 THEN 'History' when DA.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status from ScoresMigration.db...
3. Dataset `EasyCare` (Text): select \*, CASE WHEN IsComplete = 1 AND IsError = 0 THEN 'Completed' WHEN IsError = 1 THEN 'Errors' WHEN IsComplete IS NULL THEN 'GoLive' WHEN IsComplete =2 THEN 'History' when IsComplete = 9 then 'Orphans' else 'Unknown' End as Status from ScoresMigration.dbo.Scores_easyCare where dm_code=@dm_code
4. Dataset `EmailActivities` (Text): select ea.\*, CASE WHEN ea.IsComplete = 1 AND ea.IsError = 0 THEN 'Completed' WHEN ea.IsError = 1 THEN 'Errors' WHEN ea.IsComplete IS NULL THEN 'GoLive' WHEN ea.IsComplete =2 THEN 'History' when ea.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szfirstname+' '+o.szLastname as Owner from ScoresMigration.db...
5. Dataset `InterestedInVeh` (Text): select IIV.\*, CASE WHEN iiv.IsComplete = 1 AND iiv.IsError = 0 THEN 'Completed' WHEN iiv.IsError = 1 THEN 'Errors' WHEN iiv.IsComplete IS NULL THEN 'GoLive' WHEN iiv.IsComplete =2 THEN 'History' when iiv.iscomplete = 9 then 'Orphans' else 'Unknown' End as MigStatus, o.szFirstName+' '+o.szLastName as Owner from ScoresMi...
6. Dataset `MDMCustDetail` (Text): select \* from ScoresMigration.dbo.MDMCustDetail where GlobalMaster_code=@gm_code
7. Dataset `Notes` (Text): select notes.\*, CASE WHEN notes.IsComplete = 1 AND notes.IsError = 0 THEN 'Completed' WHEN notes.IsError = 1 THEN 'Errors' WHEN notes.IsComplete IS NULL THEN 'GoLive' WHEN notes.IsComplete =2 THEN 'History' when notes.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+o.szLastName as Owner fr...
8. Dataset `Opportunities` (Text): select op.\*, CASE WHEN op.IsComplete = 1 AND op.IsError = 0 THEN 'Completed' WHEN op.IsError = 1 THEN 'Errors' WHEN op.IsComplete IS NULL THEN 'GoLive' WHEN op.IsComplete =2 THEN 'History' when op.IsComplete = 9 then 'Orphans' else 'Unknown' End as OppStatus, o.szfirstname+' '+o.szLastName as [Owner], case when iiv.Veh...
9. Dataset `Owned` (Text): select ov.\*, CASE WHEN ov.IsComplete = 1 AND ov.IsError = 0 THEN 'Completed' WHEN ov.IsError = 1 THEN 'Errors' WHEN ov.IsComplete IS NULL THEN 'GoLive' WHEN ov.IsComplete =2 THEN 'History' when ov.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+szLastName as Owner from ScoresMigration.dbo....
10. Dataset `PhoneActivities` (Text): select ph.\*, CASE WHEN ph.IsComplete = 1 AND ph.IsError = 0 THEN 'Completed' WHEN ph.IsError = 1 THEN 'Errors' WHEN ph.IsComplete IS NULL THEN 'GoLive' WHEN ph.IsComplete =2 THEN 'History' when ph.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+o.szLastName as Owner from ScoresMigration.db...
11. Dataset `ServiceVisits` (Text): select sv.\*, CASE WHEN Iscomplete = 1 AND IsError = 0 THEN 'Completed' WHEN IsError = 1 THEN 'Errors' WHEN IsComplete IS NULL THEN 'GoLive' WHEN IsComplete =2 THEN 'History' when iscomplete = 9 then 'Orphans' else 'Unknown' End as Status from ScoresMigration.dbo.SCORES_ServiceVisit sv where dm_code=@dm_code
12. Dataset `ShowRoomAppointments` (Text): select sa.\*, CASE WHEN sa.IsComplete = 1 AND sa.IsError = 0 THEN 'Completed' WHEN sa.IsError = 1 THEN 'Errors' WHEN sa.IsComplete IS NULL THEN 'GoLive' WHEN sa.IsComplete =2 THEN 'History' when sa.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+o.szLastName as Owner from ScoresMigration.db...
13. Dataset `ShowRoomVisits` (Text): select sv.\*, CASE WHEN Iscomplete = 1 AND IsError = 0 THEN 'Completed' WHEN IsError = 1 THEN 'Errors' WHEN IsComplete IS NULL THEN 'GoLive' WHEN IsComplete =2 THEN 'History' when iscomplete = 9 then 'Orphans' else 'Unknown' End as Status from ScoresMigration.dbo.SCORES_ShowroomVisit sv where dm_code=@dm_code
14. Dataset `Survey` (Text): select s.\*, CASE WHEN s.IsComplete = 1 AND s.IsError = 0 THEN 'Completed' WHEN s.IsError = 1 THEN 'Errors' WHEN s.IsComplete IS NULL THEN 'GoLive' WHEN s.IsComplete =2 THEN 'History' when s.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+o.szLastName as Owner from ScoresMigration.dbo.SCORE...
15. Dataset `TradedIn` (Text): select TI.\*, CASE WHEN ti.IsComplete = 1 AND ti.IsError = 0 THEN 'Completed' WHEN ti.IsError = 1 THEN 'Errors' WHEN ti.IsComplete IS NULL THEN 'GoLive' WHEN ti.IsComplete =2 THEN 'History' when ti.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+o.szLastName as Owner2 from ScoresMigration.d...

## Backend Dependencies

| Object or command hint                           | Notes                                     |
| ------------------------------------------------ | ----------------------------------------- |
| `scoresmigration.dbo.SCORES_DealDataV2`          | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_Owner`               | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_DeliveryAppointment` | Referenced by one or more report datasets |
| `ScoresMigration.dbo.Scores_easyCare`            | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_EmailActivity`       | Referenced by one or more report datasets |
| `ScoresMigration.dbo.scores_owner`               | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_InterestedInVehicle` | Referenced by one or more report datasets |
| `ScoresMigration.dbo.MDMCustDetail`              | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_Notes`               | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_Opportunity`         | Referenced by one or more report datasets |
| `ScoresMigration.dbo.Scores_owner`               | Referenced by one or more report datasets |
| `SCORES_InterestedInVehicle`                     | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_OwnedVehicle`        | Referenced by one or more report datasets |
| `Scoresmigration.dbo.SCORES_Owner`               | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_PhoneCallActivities` | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_ServiceVisit`        | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_ShowroomAppointment` | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_ShowroomVisit`       | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_Survey`              | Referenced by one or more report datasets |
| `ScoresMigration.dbo.SCORES_TradeInVehicle`      | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/SCORES/OpportunityPkgs`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DealData

Type: `Text`

```sql
select dd.*,  CASE WHEN dd.IsComplete = 1 AND dd.IsError = 0 THEN 'Completed'   WHEN dd.IsError = 1 THEN 'Errors'   WHEN dd.IsComplete IS NULL THEN 'GoLive'  WHEN dd.IsComplete =2 THEN 'History'  when dd.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName +' '+o.szLastName as Owner from scoresmigration.dbo.SCORES_DealDataV2 dd left join ScoresMigration.dbo.SCORES_Owner o on dd.OwnerID=o.lUserID where dm_code=@dm_code
```

#### Delivery

Type: `Text`

```sql
select DA.*,o.szfirstname +' '+o.szlastname As Owner, CASE WHEN da.IsComplete = 1 AND DA.IsError = 0 THEN 'Completed'   WHEN DA.IsError = 1 THEN 'Errors'   WHEN DA.IsComplete IS NULL THEN 'GoLive'  WHEN DA.IsComplete =2 THEN 'History'  when DA.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status from ScoresMigration.dbo.SCORES_DeliveryAppointment da left join ScoresMigration.dbo.SCORES_Owner O on da.Ownerid=o.lUserID where da.dm_code=@dm_code
```

#### EasyCare

Type: `Text`

```sql
select *,  CASE WHEN IsComplete = 1 AND IsError = 0 THEN 'Completed'   WHEN IsError = 1 THEN 'Errors'   WHEN IsComplete IS NULL THEN 'GoLive'  WHEN IsComplete =2 THEN 'History'  when IsComplete = 9 then 'Orphans' else 'Unknown' End as Status  from ScoresMigration.dbo.Scores_easyCare where dm_code=@dm_code
```

#### EmailActivities

Type: `Text`

```sql
select ea.*,   CASE WHEN ea.IsComplete = 1 AND ea.IsError = 0 THEN 'Completed'   WHEN ea.IsError = 1 THEN 'Errors'   WHEN ea.IsComplete IS NULL THEN 'GoLive'  WHEN ea.IsComplete =2 THEN 'History'  when ea.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szfirstname+' '+o.szLastname as Owner from ScoresMigration.dbo.SCORES_EmailActivity Ea left join ScoresMigration.dbo.scores_owner O on ea.Ownerid=o.lUserID where dm_code=@dm_code
```

#### InterestedInVeh

Type: `Text`

```sql
select IIV.*,  CASE WHEN iiv.IsComplete = 1 AND iiv.IsError = 0 THEN 'Completed'   WHEN iiv.IsError = 1 THEN 'Errors'   WHEN iiv.IsComplete IS NULL THEN 'GoLive'  WHEN iiv.IsComplete =2 THEN 'History'  when iiv.iscomplete = 9 then 'Orphans' else 'Unknown' End as MigStatus, o.szFirstName+' '+o.szLastName as Owner from ScoresMigration.dbo.SCORES_InterestedInVehicle IIV left join ScoresMigration.dbo.SCORES_Owner o on iiv.OwnerID=o.lUserID where dm_code=@dm_code
```

#### MDMCustDetail

Type: `Text`

```sql
select * from ScoresMigration.dbo.MDMCustDetail  where GlobalMaster_code=@gm_code
```

#### Notes

Type: `Text`

```sql
select notes.*,  CASE WHEN notes.IsComplete = 1 AND notes.IsError = 0 THEN 'Completed'   WHEN notes.IsError = 1 THEN 'Errors'   WHEN notes.IsComplete IS NULL THEN 'GoLive'  WHEN notes.IsComplete =2 THEN 'History'  when notes.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+o.szLastName as Owner from ScoresMigration.dbo.SCORES_Notes notes left join ScoresMigration.dbo.SCORES_Owner o on notes.OwnerID=o.lUserID where dm_code=@dm_code
```

#### Opportunities

Type: `Text`

```sql
select  op.*,  CASE WHEN op.IsComplete = 1 AND op.IsError = 0 THEN 'Completed'   WHEN op.IsError = 1 THEN 'Errors'   WHEN op.IsComplete IS NULL THEN 'GoLive'  WHEN op.IsComplete =2 THEN 'History'  when op.IsComplete = 9 then 'Orphans' else 'Unknown' End as OppStatus, o.szfirstname+' '+o.szLastName as [Owner], case when iiv.VehicleDescription IS not NULL then iiv.VehicleDescription  Else 'No Vehicle Specified' End as VehicleDescription from ScoresMigration.dbo.SCORES_Opportunity op left join ScoresMigration.dbo.Scores_owner o on op.OwnerId=o.lUserID left join SCORES_InterestedInVehicle iiv on op.OpportunityID=iiv.OpportunityID where op.DM_CODE=@dm_code order by op.dtLastEdit desc
```

#### Owned

Type: `Text`

```sql
select ov.*,  CASE WHEN ov.IsComplete = 1 AND ov.IsError = 0 THEN 'Completed'   WHEN ov.IsError = 1 THEN 'Errors'   WHEN ov.IsComplete IS NULL THEN 'GoLive'  WHEN ov.IsComplete =2 THEN 'History'  when ov.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+szLastName as Owner from ScoresMigration.dbo.SCORES_OwnedVehicle ov left join Scoresmigration.dbo.SCORES_Owner o on ov.OwnerID=o.lUserID where dm_code=@dm_code
```

#### PhoneActivities

Type: `Text`

```sql
select ph.*, CASE WHEN ph.IsComplete = 1 AND ph.IsError = 0 THEN 'Completed'   WHEN ph.IsError = 1 THEN 'Errors'   WHEN ph.IsComplete IS NULL THEN 'GoLive'  WHEN ph.IsComplete =2 THEN 'History'  when ph.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+o.szLastName as Owner   from ScoresMigration.dbo.SCORES_PhoneCallActivities ph   left join ScoresMigration.dbo.SCORES_Owner o   on ph.OwnerID=o.lUserID where dm_code=@dm_code
```

#### ServiceVisits

Type: `Text`

```sql
select sv.*,  CASE WHEN Iscomplete = 1 AND IsError = 0 THEN 'Completed'   WHEN IsError = 1 THEN 'Errors'   WHEN IsComplete IS NULL THEN 'GoLive'  WHEN IsComplete =2 THEN 'History'  when iscomplete = 9 then 'Orphans' else 'Unknown' End as Status from ScoresMigration.dbo.SCORES_ServiceVisit sv where dm_code=@dm_code
```

#### ShowRoomAppointments

Type: `Text`

```sql
select sa.*,  CASE WHEN sa.IsComplete = 1 AND sa.IsError = 0 THEN 'Completed'   WHEN sa.IsError = 1 THEN 'Errors'   WHEN sa.IsComplete IS NULL THEN 'GoLive'  WHEN sa.IsComplete =2 THEN 'History'  when sa.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+o.szLastName as Owner from ScoresMigration.dbo.SCORES_ShowroomAppointment sa left join ScoresMigration.dbo.SCORES_Owner o on sa.ApptOwnerID=o.lUserID where dm_code=@dm_code
```

#### ShowRoomVisits

Type: `Text`

```sql
select sv.*,  CASE WHEN Iscomplete = 1 AND IsError = 0 THEN 'Completed'   WHEN IsError = 1 THEN 'Errors'   WHEN IsComplete IS NULL THEN 'GoLive'  WHEN IsComplete =2 THEN 'History'  when iscomplete = 9 then 'Orphans' else 'Unknown' End as Status from ScoresMigration.dbo.SCORES_ShowroomVisit sv where dm_code=@dm_code
```

#### Survey

Type: `Text`

```sql
select s.*,  CASE WHEN s.IsComplete = 1 AND s.IsError = 0 THEN 'Completed'   WHEN s.IsError = 1 THEN 'Errors'   WHEN s.IsComplete IS NULL THEN 'GoLive'  WHEN s.IsComplete =2 THEN 'History'  when s.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+o.szLastName as Owner from ScoresMigration.dbo.SCORES_Survey s left join ScoresMigration.dbo.SCORES_Owner o on s.OwnerID=o.lUserID where dm_code=@dm_code
```

#### TradedIn

Type: `Text`

```sql
select TI.*,  CASE WHEN ti.IsComplete = 1 AND ti.IsError = 0 THEN 'Completed'   WHEN ti.IsError = 1 THEN 'Errors'   WHEN ti.IsComplete IS NULL THEN 'GoLive'  WHEN ti.IsComplete =2 THEN 'History'  when ti.IsComplete = 9 then 'Orphans' else 'Unknown' End as Status, o.szFirstName+' '+o.szLastName as Owner2 from ScoresMigration.dbo.SCORES_TradeInVehicle Ti left join ScoresMigration.dbo.SCORES_Owner o on ti.Owner=o.lUserID where dm_code=@dm_code
```
