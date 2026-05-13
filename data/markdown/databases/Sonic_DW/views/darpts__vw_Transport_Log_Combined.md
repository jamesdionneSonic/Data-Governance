---
name: vw_Transport_Log_Combined
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





CREATE   VIEW [darpts].[vw_Transport_Log_Combined]
AS
SELECT DISTINCT [Vendor]
      ,[VIN]
      ,UPPER(Status)AS Status
      ,[load_log_at]
      ,[origin_name]
      ,[origin_line_1]
      ,[origin_line_2]
      ,[origin_city]
      ,[origin_state]
      ,[origin_zip]
      ,[destorig]
      ,UPPER(destination_name) AS destination_name
      ,[destination_store_id]
      ,[destination_line_1]
      ,[destination_city]
      ,[destination_state]
      ,[year]
      ,[make]
      ,[model]
      ,[pickup_date]
      ,[eta_date]
      ,[Metro_Age]
      ,[SIMS_Age]
      ,[Check]
      ,[Price_Paid]
      ,[Vehicle_Class]
      ,[Move_to_CD]
      ,[Carrier_Name]
      ,[Carrier_Phone_#]
      ,[Issues]
      ,[Run_Date]
  FROM [D1-DASQL-01,11010].[DA_Group].[dbo].[vw_Transport_Log_Combined]







```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
