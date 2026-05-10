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
extracted_at: 2026-05-09T12:34:14.349Z
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
FROM     
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
