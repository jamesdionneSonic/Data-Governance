---
name: vw_DocDaySelector
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
CREATE VIEW dbo.vw_DocDaySelector
AS
SELECT        DateKey, DocRolloverDate, DocDayDesc, DocDayAsc, CASE DocDayDesc WHEN 1 THEN 'Current' WHEN 2 THEN 'Prior' ELSE CAST(DocDayAsc AS Varchar(2)) END AS DocDaySelector
FROM            (SELECT        d .DateKey, d .DocRolloverDate, ROW_NUMBER() OVER (PARTITION BY d .DocRolloverDate
                          ORDER BY d .DateKey DESC) AS DocDayDesc, ROW_NUMBER() OVER (PARTITION BY d .DocRolloverDate
ORDER BY d .DateKey ASC) AS DocDayAsc
FROM            dbo.Dim_date AS d INNER JOIN
                             (SELECT DISTINCT DocDateKey
                               FROM            dbo.Doc_Record) AS r ON d .DateKey = r.DocDateKey
WHERE        IsWeekEnd = 'N') AS DocDay

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
