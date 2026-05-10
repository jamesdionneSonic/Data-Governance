---
name: usp_LoadSameDayAppointments_MetricDataModel
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
-- Author:       DMD
-- Create date:  09/25/2025    
-- 
-- =================================================    
CREATE   PROCEDURE [dbo].[usp_LoadSameDayAppointments_MetricDataModel] 
(
	@ReadRowCnts INT OUTPUT,
	@InsertedRowCnts INT OUTPUT,
	@UpdatedRowCnts INT OUTPUT
)

AS


/* variables */
DECLARE @RowCounts TABLE (MergeAction VARCHAR(20));

---CREATE TEMP TBL FOR RAW DATA
create table #TEMP_RAW_DATA_TBL (DATE date
    ,DATE_TIME date
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
