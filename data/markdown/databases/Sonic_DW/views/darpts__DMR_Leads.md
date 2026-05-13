---
name: DMR_Leads
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
CREATE VIEW [darpts].[DMR_Leads]
AS
SELECT  [Region]
      ,[Store]
      ,[Cust_Name]
      ,[Lead_Source]
      ,[Lead_Type]
      ,[Lead_Status]
      ,[Lead_Status_Type]
      ,[SP_CDK_Name]
      ,[Lead_Date]
      ,[Cust_Leads_Region]
      ,[Cust_Leads_Store]
      ,[Meta_Load_Date]
  FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[DMR_Leads]
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
