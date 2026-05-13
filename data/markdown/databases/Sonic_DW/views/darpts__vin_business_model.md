---
name: vin_business_model
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




CREATE VIEW [darpts].[vin_business_model]
AS
SELECT  [vin]
      ,[business_model_type_id]
      ,[meta_load_date]
      ,[purchase_date]
  FROM [D1-DASQL-01,11010].[DA_Group].[src].[vin_business_model]



```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
