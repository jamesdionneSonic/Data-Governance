# RouteOneSummaryRpt

Generated: 2026-06-15  
SSRS path: `/RouteOne/RouteOneSummaryRpt`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the RouteOne reporting area. It retrieves data through embedded report dataset queries and presents the result as the RouteOneSummaryRpt report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `RouteOneSummaryRpt`                             |
| SSRS path           | `/RouteOne/RouteOneSummaryRpt`                   |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2015-09-14 14:37:34                              |
| Modified            | 2017-05-15 14:46:03                              |
| Modified by         | bedanta.bordoloi                                 |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource     | Shared datasource                              | Connection                   | Credential mode | Enabled |
| --------------------- | ---------------------------------------------- | ---------------------------- | --------------- | ------- |
| `Sonic_DW_DataSource` | `/RouteOne/Data Sources/COR-BISQL-02_Sonic_DW` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter                 | Prompt                | Type     | Notes                                                |
| ------------------------- | --------------------- | -------- | ---------------------------------------------------- |
| `paramFromSubmissionDate` | From SubmissionDate : | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `paramToSubmissionDate`   | To SubmissionDate :   | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `IncomeVarianceChart_DS` (Text): USE Sonic_DW SELECT CASE WHEN MinCoApplicantAlimonyIncome <> MaxCoApplicantAlimonyIncome THEN 'CoApplicant Alimony Income' WHEN MinCoApplicantOtherIncome <> MaxCoApplicantOtherIncome THEN 'CoApplicant Other Income' WHEN MinCoApplicantIncome <> MaxCoApplicantIncome THEN 'CoApplicant Income' WHEN MinApplicantOtherIncome ...
2. Dataset `RouteOneSummary_DS` (Text): NULL

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `RouteOne_Daily_Mart`  | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RouteOne/RouteOneSummaryRpt`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### IncomeVarianceChart_DS

Type: `Text`

```sql
USE Sonic_DW  SELECT CASE    WHEN MinCoApplicantAlimonyIncome <> MaxCoApplicantAlimonyIncome    THEN 'CoApplicant Alimony Income'   WHEN MinCoApplicantOtherIncome <> MaxCoApplicantOtherIncome    THEN 'CoApplicant Other Income'   WHEN MinCoApplicantIncome <> MaxCoApplicantIncome    THEN 'CoApplicant Income'   WHEN MinApplicantOtherIncome <> MaxApplicantOtherIncome    THEN 'Applicant Other Income'   WHEN MinApplicantIncome <> MaxApplicantIncome    THEN 'Applicant Income'   END AS 'Variance'  --,Dealership  ,COUNT(*) Counts FROM (  SELECT *  FROM RouteOne_Daily_Mart  WHERE MinApplicantIncome IS NOT NULL   AND MinSubmissionDate >= @paramFromSubmissionDate    AND MinSubmissionDate <= @paramToSubmissionDate  ) T GROUP BY CASE    WHEN MinCoApplicantAlimonyIncome <> MaxCoApplicantAlimonyIncome    THEN 'CoApplicant Alimony Income'   WHEN MinCoApplicantOtherIncome <> MaxCoApplicantOtherIncome    THEN 'CoApplicant Other Income'   WHEN MinCoApplicantIncome <> MaxCoApplicantIncome    THEN 'CoApplicant Income'   WHEN MinApplicantOtherIncome <> MaxApplicantOtherIncome    THEN 'Applicant Other Income'   WHEN MinApplicantIncome <> MaxApplicantIncome    THEN 'Applicant Income'   END --,Dealership ORDER BY Counts DESC  --ORDER BY MaxSubmissionDate DESC
```

#### RouteOneSummary_DS

Type: `Text`

```sql
NULL
```
