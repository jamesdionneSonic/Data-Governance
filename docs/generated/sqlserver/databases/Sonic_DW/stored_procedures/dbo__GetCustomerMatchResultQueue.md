---
name: GetCustomerMatchResultQueue
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

--EXEC GetCustomerMatchResultQueue 10, 368

/****************************** CHANGE LOG ********************************************************************************************************************************************
4/19/2019	DMD	-	Added additional JOIN so that MatchedFields column is populated using only unique MatchField values of each Match person ID per SourcePersonID
6/21/2019	DMD	-	Added Remove exclusions per PBI 3219 and corrected "MAX(PotentialMatchScore) >= @threshold"
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
