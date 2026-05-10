---
name: vw_DM_MileageMeetsModel
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
CREATE VIEW dbo.vw_DM_MileageMeetsModel
AS
SELECT        ModelMeetsMileage, ServiceKey, Meta_SystemLoadDate
FROM            dbo.DM_MileageMeetsModel WITH (NOLOCK)

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
