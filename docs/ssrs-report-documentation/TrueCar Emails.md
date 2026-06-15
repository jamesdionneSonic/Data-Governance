# TrueCar Emails

Generated: 2026-06-15  
SSRS path: `/Legal/TrueCar Emails`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports legal or compliance follow-up by listing relevant TrueCar email activity or records for review.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `TrueCar Emails`                                 |
| SSRS path           | `/Legal/TrueCar Emails`                          |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2015-03-25 08:47:27                              |
| Modified            | 2015-03-25 08:47:27                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource             | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------------------- | ---------------------------- | --------------- | ------- |
| `BI_Workdb`       | `/Legal/DataSource/BI_Workdb` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `Emails` (Text): SELECT [lPersonID] ,[lcompanyid] ,[ADPCustNO] ,[OpportunityID] ,[lCurrentOwnerID] ,[TaskID] ,[szTo] ,[szFrom] ,[szSubject] ,[DueDate] ,[dtcompleted] ,[dtClosed] ,[dtLastEdit] ,[NextActivityType] ,[NextActivitySubject] ,[NextActivityDueDate] ,[NextActivityComments] ,[attachments] ,[EmailInboundOutbound] ,[WorkflowType] ...

## Backend Dependencies

| Object or command hint                 | Notes                                     |
| -------------------------------------- | ----------------------------------------- |
| `BI_WorkDB.dbo.tbl_LegalTC_Emails_mid` | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/Legal/TrueCar Emails`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### Emails

Type: `Text`

```sql
SELECT [lPersonID]       ,[lcompanyid]       ,[ADPCustNO]       ,[OpportunityID]       ,[lCurrentOwnerID]       ,[TaskID]       ,[szTo]       ,[szFrom]       ,[szSubject]       ,[DueDate]       ,[dtcompleted]       ,[dtClosed]       ,[dtLastEdit]       ,[NextActivityType]       ,[NextActivitySubject]       ,[NextActivityDueDate]       ,[NextActivityComments]       ,[attachments]       ,[EmailInboundOutbound]       ,[WorkflowType]       ,[WorkflowName]       ,[ActivityTask]       ,[EmailNotes]       ,[szSource]       ,[szSubSource]       ,[TemplateName]       ,[IsEmailTemplate]       ,[DEALERSHIP]       ,[xEmailBody]   FROM [BI_WorkDB].[dbo].[tbl_LegalTC_Emails_mid]
```
