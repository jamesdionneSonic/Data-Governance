# CustInfo

Generated: 2026-06-15  
SSRS path: `/RptTest/CustInfo`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports legal or compliance follow-up by listing relevant TrueCar email activity or records for review.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `CustInfo`                                       |
| SSRS path           | `/RptTest/CustInfo`                              |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-07-31 14:01:38                              |
| Modified            | 2014-07-31 14:34:26                              |
| Modified by         | SONIC\Doug.Morgan                                |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

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

1. Dataset `DataSet1` (Text): select firstname, lastname,MiddleName,stdprimaryaddressline1,stdprimaryaddressline2,stdprimarycity, stdprimarystate,stdprimaryzipcode,StdMobilePhone,StdHomePhone,StdOtherPhone,Email1,DM_CODE,GM_CODE,SourceDealership,customertype,email2,email3,companyName from SCORESQueues.dbo.ContactToCRMQueue where FirstName=@firstnam...

## Backend Dependencies

| Object or command hint               | Notes                                     |
| ------------------------------------ | ----------------------------------------- |
| `SCORESQueues.dbo.ContactToCRMQueue` | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RptTest/CustInfo`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
select firstname, lastname,MiddleName,stdprimaryaddressline1,stdprimaryaddressline2,stdprimarycity, stdprimarystate,stdprimaryzipcode,StdMobilePhone,StdHomePhone,StdOtherPhone,Email1,DM_CODE,GM_CODE,SourceDealership,customertype,email2,email3,companyName  from SCORESQueues.dbo.ContactToCRMQueue   where FirstName=@firstname  and LastName=@lastname and SourceDealership=@SourceDealership
```
