---
name: MarketPerformanceIndicatorType
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




CREATE VIEW [darpts].[MarketPerformanceIndicatorType]
AS
SELECT [TypeId]
      ,[TypeName]
      ,[CreatedBy]
      ,[CreatedOn]
      ,[ModifiedBy]
      ,[ModifiedOn]
  FROM [L2-RTSIMSSQL-04 ,12011].[CBS].[dbo].[MarketPerformanceIndicatorType]









```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
