---
name: vw_BTChecklistMonthStatus
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
CREATE VIEW dbo.vw_BTChecklistMonthStatus
AS
SELECT        CAST(em.FiscalMonthKey AS char(6)) + '.' + CAST(em.EntityKey AS varchar(4)) AS ChecklistMonthStatusKey, em.FiscalMonthKey, em.EntityKey, dbo.vw_BTChecklistRecord.ChecklistKey, dbo.vw_BTChecklistRecord.Reviewer,
                         dbo.vw_BTChecklistRecord.DateStarted, dbo.vw_BTChecklistRecord.DateFinished, COALESCE (dbo.vw_BTChecklistRecord.StatusKey, 0) AS StatusKey, 1 AS ChecklistCounter
FROM            (SELECT        m.FiscalMonthKey, e.EntityKey
                          FROM            dbo.Dim_Entity AS e CROSS JOIN
                                                        (SELECT        FiscalMonthKey
                                                          FROM            dbo.vw_Dim_Month
                                                          WHERE        (StartDate BETWEEN '2019-05-01' AND GETDATE())) AS m
                          WHERE        (e.EntActive = 'Active') AND (e.EntEntityType = 'Dealership') AND (e.EntDefaultDlrshpLvl1 = 1)) AS em LEFT OUTER JOIN
                         dbo.vw_BTChecklistRecord ON em.FiscalMonthKey = dbo.vw_BTChecklistRecord.FiscalMonthKey AND em.EntityKey = dbo.vw_BTChecklistRecord.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
