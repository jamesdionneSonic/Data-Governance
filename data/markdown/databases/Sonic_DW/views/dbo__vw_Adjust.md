---
name: vw_Adjust
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_AccountMgmt
  - Dim_Date
  - Dim_DMSEmployee
  - Dim_Entity
  - dim_FIGLAccounts
  - Dim_GLDetail
  - Fact_AccountingDetail
dependency_count: 7
column_count: 19
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_AccountMgmt** (U )
- **dbo.Dim_Date** (U )
- **dbo.Dim_DMSEmployee** (U )
- **dbo.Dim_Entity** (U )
- **dbo.dim_FIGLAccounts** (U )
- **dbo.Dim_GLDetail** (U )
- **dbo.Fact_AccountingDetail** (U )

## Columns

| Name                   | Type    | Nullable | Description |
| ---------------------- | ------- | -------- | ----------- |
| `EntityKey`            | int     |          |             |
| `Dealership`           | varchar | ✓        |             |
| `EntADPCompanyID`      | varchar | ✓        |             |
| `EntEssCode`           | varchar | ✓        |             |
| `CalendarYearMonth`    | char    |          |             |
| `AccountingDate`       | date    |          |             |
| `Level8`               | varchar | ✓        |             |
| `Level8_Description`   | varchar | ✓        |             |
| `OverUnder90Days`      | varchar |          |             |
| `FIGLProductCategory`  | varchar | ✓        |             |
| `EmployeeName`         | varchar | ✓        |             |
| `Control`              | varchar | ✓        |             |
| `Control2`             | varchar | ✓        |             |
| `Control2DealNo`       | varchar | ✓        |             |
| `Control2Date`         | varchar | ✓        |             |
| `ReferenceNumber`      | varchar | ✓        |             |
| `HeaderDescr`          | varchar | ✓        |             |
| `DetDetailDescription` | varchar | ✓        |             |
| `PostingAmount`        | money   | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Adjust
AS
SELECT        e.EntityKey, e.EntDealerLvl1 AS Dealership, e.EntADPCompanyID, e.EntEssCode, d.CalendarYearMonth, d.FullDate AS AccountingDate, a.Level8, a.Level8_Description,
                         CASE WHEN a.level7 LIKE '%Adjustment%' THEN 'Under 90 Days' WHEN a.level7 LIKE '%Chargeback%' THEN 'Over 90 Days' ELSE 'Unknown' END AS OverUnder90Days, fi.FIGLProductCategory, ee.EmployeeName,
                         g.DetControl AS Control, g.DetControl2 AS Control2, LEFT(g.DetControl2, 5) AS Control2DealNo, CASE WHEN SUBSTRING(g.detcontrol2, 6, 10) = ' ' THEN NULL ELSE CAST(SUBSTRING(g.detcontrol2, 6, 10) AS varchar(6))
                         END AS Control2Date, g.DetReferenceNumber AS ReferenceNumber, g.DetHeaderDescription AS HeaderDescr, g.DetDetailDescription, f.PostingAmount
FROM            dbo.Fact_AccountingDetail AS f INNER JOIN
                         dbo.Dim_AccountMgmt AS a ON f.AccountMgmtKey = a.AccountMgmtKey INNER JOIN
                         dbo.Dim_Entity AS e ON f.EntityKey = e.EntityKey INNER JOIN
                         dbo.Dim_GLDetail AS g ON f.DetailKey = g.DetailKey INNER JOIN
                         dbo.Dim_DMSEmployee AS ee ON g.DetControl = ee.custno AND e.EntCora_Account_ID = ee.cora_acct_id AND ee.EMPNameCode = '7' INNER JOIN
                         dbo.dim_FIGLAccounts AS fi ON a.Level8 = fi.FIAccount INNER JOIN
                         dbo.Dim_Date AS d ON f.AccountingDateKey = d.DateKey
WHERE        (a.Level7 LIKE '%F&I Adjustment%' OR
                         a.Level7 LIKE '%F&I Chargeback%') AND (d.FullDate BETWEEN CONVERT(VARCHAR(10), GETDATE() - 91, 110) AND CONVERT(VARCHAR(10), GETDATE() - 1, 110)) AND (e.EntDealerLvl1 = 'EP Dallas')

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
