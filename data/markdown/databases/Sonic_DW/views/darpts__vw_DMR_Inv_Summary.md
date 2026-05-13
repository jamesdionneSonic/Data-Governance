---
name: vw_DMR_Inv_Summary
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
CREATE VIEW [darpts].[vw_DMR_Inv_Summary]
AS
SELECT  [Market]
      ,[Store_Name]
      ,[Age_Bucket]
      ,[business_model_type_nm]
      ,[Inv_Count]
      ,[IS_Count]
      ,[IS_Hold_Count]
      ,[Recon_Count]
      ,[Recon_Count_NoTransit]
      ,[IT_Count]
      ,[Demo_Count]
      ,[Whsl_Count]
  FROM [D1-DASQL-01,11010].[DA_Group].[dbo].[vw_DMR_Inv_Summary]
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
