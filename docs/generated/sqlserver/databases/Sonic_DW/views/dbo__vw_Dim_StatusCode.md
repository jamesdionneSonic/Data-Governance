---
name: vw_Dim_StatusCode
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql


create view [dbo].[vw_Dim_StatusCode] as
SELECT     DISTINCT
    fiwipstatuscode,
    case fiwipstatuscode when 'F' then 'Fin' when 'D' then 'Dlvd' else 'Bkd' end DealStatus
FROM         dbo.factFIRE_A



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
