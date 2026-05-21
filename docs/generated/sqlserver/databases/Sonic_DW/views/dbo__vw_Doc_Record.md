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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
