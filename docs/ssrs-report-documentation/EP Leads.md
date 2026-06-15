# EP Leads

Generated: 2026-06-15  
SSRS path: `/BI - Retail Strategy/EP Leads`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports legal or compliance follow-up by listing relevant TrueCar email activity or records for review.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `EP Leads`                                       |
| SSRS path           | `/BI - Retail Strategy/EP Leads`                 |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2018-07-20 16:42:41                              |
| Modified            | 2018-07-20 16:42:41                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

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

1. Dataset `DataSet1` (Text): WITH EleadToCarsCom AS (SELECT DISTINCT EntName, EntCora_Account_ID, EntADPCompanyID, EntAccountingPrefix, EntEleadID, EntEleadDefault, EntCarsID, EntDealerLvl1, EntAddressZipCode FROM [L1-5FSQL-01,12013].sonic_dw.dbo.Dim_Entity AS Dim_Entity_1 WHERE (EntEleadDefault = 1)) SELECT DISTINCT fo.lDealID, fc.szCompany, fcc....

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `L1-5FSQL-01`          | Referenced by one or more report datasets |
| `dwFullOpportunity`    | Referenced by one or more report datasets |
| `dwFullCompany`        | Referenced by one or more report datasets |
| `dwFullVehicleSought`  | Referenced by one or more report datasets |
| `dwFullEmail`          | Referenced by one or more report datasets |
| `EleadToCarsCom`       | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/EP Leads`.
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
WITH EleadToCarsCom AS (SELECT DISTINCT EntName, EntCora_Account_ID, EntADPCompanyID, EntAccountingPrefix, EntEleadID, EntEleadDefault, EntCarsID, EntDealerLvl1, EntAddressZipCode                                                             FROM            [L1-5FSQL-01,12013].sonic_dw.dbo.Dim_Entity AS Dim_Entity_1                                                             WHERE        (EntEleadDefault = 1))     SELECT DISTINCT fo.lDealID, fc.szCompany, fcc.szCompany AS Expr1, fe.szAddress, fo.dtProspectIn, fo.szUpSource, fo.szSubSource, fo.szSourceDetails, fo.szStatus, fo.szDealSubStatus, vs.szSoughtVIN, fo.dtSold, fo.dtClosed      FROM            dwFullOpportunity AS fo INNER JOIN                               dwFullCompany AS fc ON fo.lCompanyID = fc.lCompanyID INNER JOIN                               dwFullCompany AS fcc ON fo.lChildCompanyID = fcc.lCompanyID LEFT OUTER JOIN                               dwFullVehicleSought AS vs ON fo.lDealID = vs.lDealID LEFT OUTER JOIN                               dwFullEmail AS fe ON fo.lPersonID = fe.lPersonID LEFT OUTER JOIN                               EleadToCarsCom AS etcc ON fo.lCompanyID = etcc.EntEleadID      WHERE        (fo.dtProspectIn BETWEEN @BegDate AND @EndDate) AND (fc.szCompany LIKE '%echo%')      ORDER BY fc.szCompany, Expr1, fo.lDealID
```
