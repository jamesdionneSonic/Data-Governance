---
name: vw_Doc_Record
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Date
  - Dim_Entity
  - Doc_Record
dependency_count: 3
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Doc_Record** (U )

## Columns

| Name                  | Type     | Nullable | Description |
| --------------------- | -------- | -------- | ----------- |
| `DocID`               | int      |          |             |
| `EntityKey`           | int      | ✓        |             |
| `DocStartDate`        | datetime | ✓        |             |
| `ControllerName`      | varchar  | ✓        |             |
| `DocReviewDate`       | datetime |          |             |
| `DocReviewBy`         | varchar  | ✓        |             |
| `DocStatusID`         | int      | ✓        |             |
| `DocDateKey`          | int      | ✓        |             |
| `DocReviewSubmitDate` | datetime | ✓        |             |
| `EntDealerLvl2`       | varchar  | ✓        |             |
| `DocRolloverDate`     | int      | ✓        |             |
| `DocCounter`          | bigint   | ✓        |             |
| `DocCounterAsc`       | bigint   | ✓        |             |
| `DocCounterSelector`  | varchar  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Doc_Record
AS
SELECT  DocID, EntityKey, DocStartDate, ControllerName, DocReviewDate, DocReviewBy, DocStatusID, DocDateKey, DocReviewSubmitDate, EntDealerLvl2, DocRolloverDate, DocCounter, DocCounterAsc, CASE DocCounter WHEN 1 THEN 'Current' WHEN 2 THEN 'Prior' ELSE CAST(DocCounterAsc AS Varchar(2)) END AS DocCounterSelector
FROM
(SELECT        r.DocID, r.EntityKey, r.DocStartDate, r.ControllerName, r.DocReviewDate, r.DocReviewBy, r.DocStatusID, r.DocDateKey, r.DocReviewSubmitDate, e.EntDealerLvl2, d.DocRolloverDate, ROW_NUMBER() OVER (PARTITION BY
                         r.EntityKey, d .DocRolloverDate
ORDER BY r.DocDateKey DESC) AS DocCounter, ROW_NUMBER() OVER (PARTITION BY r.EntityKey, d .DocRolloverDate
ORDER BY r.DocDateKey ASC) AS DocCounterAsc
FROM            dbo.Doc_Record AS r INNER JOIN
                         dbo.Dim_Entity AS e ON r.EntityKey = e.EntityKey INNER JOIN
                         dbo.Dim_Date AS d ON r.DocDateKey = d .DateKey) DocR

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
