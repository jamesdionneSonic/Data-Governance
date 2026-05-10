---
name: vw_Doc_SubProjection
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
CREATE VIEW dbo.vw_DOC_SubProjection
AS
SELECT        DocSubProjectionID, EntityKey, DateKey, GroupElementSort, GroupElement, GroupSubElement, Amount, StatCount, MetricTypeKey, ControllerUserID, UpdateDate, DocID
FROM            dbo.Doc_SubProjection WITH (NOLOCK)

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
