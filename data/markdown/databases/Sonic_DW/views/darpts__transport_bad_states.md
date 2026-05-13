---
name: transport_bad_states
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Definition

```sql





CREATE VIEW [darpts].[transport_bad_states]
AS
SELECT  [store_id]
      ,[state]
      ,[active]
      ,[meta_load_date]
   FROM [D1-DASQL-01,11010].[DA_Group].[src].[transport_bad_states]





```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
