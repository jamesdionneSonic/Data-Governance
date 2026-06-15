# EP Customers

Generated: 2026-06-15  
SSRS path: `/BI - Retail Strategy/EP Customers`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports legal or compliance follow-up by listing relevant TrueCar email activity or records for review.

## Executive Summary

| Field               | Value                                |
| ------------------- | ------------------------------------ |
| Report name         | `EP Customers`                       |
| SSRS path           | `/BI - Retail Strategy/EP Customers` |
| Status signal       | Active                               |
| Created             | 2016-05-04 10:42:34                  |
| Modified            | 2018-07-20 16:42:36                  |
| Modified by         | SONIC\Mark.Starnes                   |
| Last 6 months usage | 4 executions by 1 users              |
| Last execution      | 2026-06-01 06:00:00                  |
| Subscriptions       | 1                                    |

## Shared Data Sources

| Report datasource | Shared datasource                          | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------------ | ---------------------------- | --------------- | ------- |
| `DMS`             | `/BI - Retail Strategy/DataSource/DMS_DWA` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `EPCustomers` (Text): SELECT c.custorcompanycode,c.firstname, case when c.lastname is null then c.name1 else c.lastname end as lastname , c.address, c.city, c.state, c.ziporpostalcode, c.homephone, c.email ,isdeleted FROM vw_Customer_Active c WHERE (c.accountingaccount = 'ep888-A') --and email = 'kmbest23@gmail.com' --and isdeleted = 'n' GR...

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `vw_Customer_Active`   | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/EP Customers`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### EPCustomers

Type: `Text`

```sql
SELECT     c.custorcompanycode,c.firstname,  case  when c.lastname is null then c.name1 else c.lastname end as lastname ,  c.address, c.city, c.state, c.ziporpostalcode, c.homephone,                        c.email        ,isdeleted FROM         vw_Customer_Active c                         WHERE      (c.accountingaccount = 'ep888-A')  --and email = 'kmbest23@gmail.com' --and isdeleted = 'n' GROUP BY c.custorcompanycode,c.firstname, case  when c.lastname is null then c.name1 else c.lastname end  ,c.address, c.city, c.state, c.ziporpostalcode, c.homephone,                        c.email ,isdeleted
```
