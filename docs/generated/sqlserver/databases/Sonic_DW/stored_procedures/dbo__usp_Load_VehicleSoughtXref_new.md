---
name: usp_Load_VehicleSoughtXref_new
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

-- =================================================   
-- Author:       Umberto Sartori

-- Update : 1/8/2019 - Added [VOIOriginalPrice] and [VOILastNotifiedPrice] column = NULL for new inserts (RAJ)

-- Create date:  4/23/2016    
-- Description:  Inserts/Update DimVehicleSoughtXref
-- ubs - 4/23/2016 - Added a current date for MetaRowEffectiveDate; set MetaRowIsCurrent = 'Y' for new inserts
-- ubs - 12/13/2016 - Added dtStart_NewUsed, dtEnd_NewUsed, bNewUsed and bActiveNewUsed colum
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
