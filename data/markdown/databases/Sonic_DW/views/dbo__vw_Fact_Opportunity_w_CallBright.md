---
name: vw_Fact_Opportunity_w_CallBright
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_CBNumber
  - Dim_OpportunitySource
  - Fact_CallBright
  - Fact_Opportunity
  - vw_Dim_date
dependency_count: 5
column_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_CBNumber** (U )
- **dbo.Dim_OpportunitySource** (U )
- **dbo.Fact_CallBright** (U )
- **dbo.Fact_Opportunity** (U )
- **dbo.vw_Dim_date** (V )

## Columns

| Name                    | Type     | Nullable | Description |
| ----------------------- | -------- | -------- | ----------- |
| `EntityKey`             | int      |          |             |
| `FiscalMonthD`          | int      | ✓        |             |
| `FiscalYear`            | smallint |          |             |
| `MonthNameAbbreviation` | char     |          |             |
| `MonthProspect`         | varchar  | ✓        |             |
| `FiscalYearMonth`       | char     |          |             |
| `PhoneCallCount`        | int      | ✓        |             |
| `SoldCount`             | int      | ✓        |             |
| `ApptSetCount`          | int      | ✓        |             |
| `ApptShowCount`         | int      | ✓        |             |
| `ApptSoldCount`         | int      | ✓        |             |
| `UniqueCallCount`       | int      | ✓        |             |

## Definition

```sql
CREATE VIEW [dbo].[vw_Fact_Opportunity_w_CallBright]
AS
SELECT     EntityKey, FiscalMonthD, FiscalYear, MonthNameAbbreviation, MonthNameAbbreviation + ' ' + CAST(FiscalYear AS varchar) AS MonthProspect, FiscalYearMonth,
                      SUM(PhoneCallCount) AS PhoneCallCount, SUM(SoldCount) AS SoldCount, SUM(ApptSetCount) AS ApptSetCount, SUM(ApptShowCount) AS ApptShowCount,
                      SUM(ApptSoldCount) AS ApptSoldCount, SUM(UniqueCallCount) AS UniqueCallCount
FROM         (SELECT     FO.EntityKey, DD.FiscalMonthD, DD.FiscalYear, DD.MonthNameAbbreviation, DD.FiscalYearMonth, SUM(FO.LeadCount) AS PhoneCallCount,
                                              SUM(FO.SoldCount) AS SoldCount, SUM(FO.ApptSetCount) AS ApptSetCount, SUM(FO.ApptShowCount) AS ApptShowCount, SUM(FO.ApptSoldCount)
                                              AS ApptSoldCount, 0 AS UniqueCallCount
                       FROM          dbo.Fact_Opportunity AS FO INNER JOIN
                                              dbo.Dim_OpportunitySource AS DOS ON FO.SourceKey = DOS.SourceKey INNER JOIN
                                              dbo.vw_Dim_date AS DD ON FO.DateProspectInKey = DD.DateKey
                       WHERE      (DOS.SrcUpType IN ('Phone UP', 'Tele Link'))
                       GROUP BY FO.EntityKey, DD.FiscalMonthD, DD.FiscalYear, DD.MonthNameAbbreviation, DD.FiscalYearMonth
                       UNION ALL
                       SELECT     FCB.EntityKey, DD2.FiscalMonthD, DD2.FiscalYear, DD2.MonthNameAbbreviation, DD2.FiscalYearMonth, 0 AS PhoneCallCount, 0 AS SoldCount,
                                             0 AS ApptSetCount, 0 AS ApptShowCount, 0 AS ApptSoldCount, ISNULL(SUM(FCB.UniqueCallCount), 0) AS UniqueCallCount
                       FROM         dbo.Fact_CallBright AS FCB INNER JOIN
                                             dbo.vw_Dim_date AS DD2 ON FCB.DateKey = DD2.DateKey INNER JOIN
                                             dbo.Dim_CBNumber AS CBN ON FCB.CBNumberKey = CBN.CBNumberKey
                       WHERE     (CBN.CBSalesDistinction = 'SALES')
                       GROUP BY FCB.EntityKey, DD2.FiscalMonthD, DD2.FiscalYear, DD2.MonthNameAbbreviation, DD2.FiscalYearMonth) AS a
GROUP BY EntityKey, FiscalMonthD, FiscalYear, MonthNameAbbreviation, FiscalYearMonth

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
