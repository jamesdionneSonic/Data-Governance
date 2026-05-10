---
name: uspLoadIBEXSurveyResponseAudit
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

/**********************************************************************************************************************************
-- CHANGE LOG
-- 07/05/2022:	DMD - Created procedure
-- 11/07/2022:	DMD - Added CASE for BuyerType and TGT.SurveyAuditKey = LTRIM(RTRIM(SRC.SurveyID)), also added UPDATE for matching existing records
-- 11/16/2022:	DMD - Removed INSERT and DimCustomer reference to handle dupes since we're only updating existing records now
************************************
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
