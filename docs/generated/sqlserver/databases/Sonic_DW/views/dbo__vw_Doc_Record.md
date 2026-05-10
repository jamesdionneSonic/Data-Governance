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
extracted_at: 2026-05-09T12:34:14.349Z
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
(SELECT        r.DocID, r.EntityKey, r.DocStartDate, r.ControllerName, r.DocReviewDate, r.DocReviewBy, r.DocStatusID, r.DocDateKey, r.DocReviewSub
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
